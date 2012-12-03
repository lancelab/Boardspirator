(function( ){	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var tpaste	=  core.tpaste;
					var clonem	=  core.clone_many;
					var giodf	=  gio.def;
					var defp	=  giodf.procs;
					var dotify	=  core.dotify;
					var do_debug = gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;




	///	Derives game definition.
	//	Derives	dress,
	//			post_definition, and
	//			sugar.
	defp.inherit_game=function(gkey){


		//: verifies if job already done
		var idef = giodf.inherited_games[gkey];
		if(idef) return clonem(idef);


		//: verifies if own definition exists
		var gdef = giodf.games[gkey];
		if(!gdef){
			gio.cons_add('Missed seed definition  for gkey "'+ gkey +'".');
			return false;
		}


		// //\\ does the recursive inheritance job
		gdef.basekey = gdef.basekey || giodf.base_game.basekey;


		if( gdef.basekey === gkey ){

			//.	no post-defs for self-referenced games  
			//	this is just a funny way to protect mistakenly infinite-loop references
			//	this also applies for gkey = mazy
			//	bug?: idef = gdef;
			idef = clonem(gdef);


		}else{
			idef=defp.inherit_game(gdef.basekey);
			if(!idef)return false;


			//	//\\ runs post-defs if any. changes idef
			//	runs it BEFORE seed-definition is applied
			var ww = gdef.post_definition;
			if(ww && gio.def.post_definitions[ww]){
				gio.def.post_definitions[ww](idef);
				//.	cannot delete because reflection is used in friend rails project and
				//	all properties are needed
				//delete gdef.post_definition;
			}
			//	\\// runs post-defs if any. changes idef


			idef = clonem(idef,gdef);
		}


		var ww = idef.post_definition_copathy;
		// c onsole.log( idef.nam + ' idef.post_definition_copathy='+idef.post_definition_copathy);
		//. redefine property only if it is not already defined: TODM poor programming:
		if( ww && (typeof ww === 'string') ) idef.post_definition_copathy = ww && gio.def.sugar[ww];
		// c onsole.log( idef.nam + ' idef=', idef );

		//. puts game's name into credits.title for consistency
		idef.credits.title = idef.nam;
		core.tooltipify(idef, "Game");
		idef.gkey = gkey;
		// \\// does the recursive inheritance job


		//. saves the job
		giodf.inherited_games[gkey]=idef;

		//. returns the job
		return clonem(idef);
	};






	/// Dresses album with dresses and credits from game, parent_album, and own_definition.
	defp.dress_album = function(akey){

		//: vital: returns copy, to protect template intact
		var dgame = giodf.dressed_albums[akey];
		if( dgame ) return clonem(dgame);

		/// verifies if own definition exists
		var album_def = giodf.albums[akey];
		if(!album_def){
			gio.cons_add('Missed definition for album key "'+ akey +'".');
			return false;
		}

		/// derives the game
		var gkey = album_def.gkey || akey;
		dgame=defp.inherit_game(gkey);
		if( !dgame ) return false;


		//	//.\\	collects 4 dresses from 
		//			game, parent-album, album-definition, and default-dress
		//: takes dressed parent album if any
		var p_akey = album_def.dress_parent_akey;
		var p_dgame = null;
		if( p_akey ) {
			p_dgame = defp.dress_album( p_akey );
			if( !p_dgame ) return false;
		}


		/// inherites dresses from definitions
		dgame.dresses = clonem( dgame.dresses, p_dgame && p_dgame.dresses, album_def.dresses );


		/// injects default dress
		ceach(dgame.dresses, function(dkey, dress){
			var ww = clonem(gio.def.default_dress, dress);
			core.paste_non_arrays(dress, ww);
		});
		//	\\.//	collects 4 dresses from 


		// //\\ establishes chosen_key or as first if none
		var chosen_dkey = '';
		var first_dkey = '';
		ceach(dgame.dresses, function(dkey, dress){
			if(!first_dkey) first_dkey = dkey;
			if(dress.skip) return true;
			if(dress.chosen) chosen_dkey = dkey;


			//TODM Q&D license "host-based" results in following definition:
			if( dress.credits.license === "host-based" ) {
				dress.credits.license = "All rights reserved. Free when used as part of " +
					gio.config.links.service_host + " service. ";
			}

		});
		//. establishes chosen key
		dgame.dresses_chosen_key = chosen_dkey || first_dkey;
		// \\// establishes chosen_key or as first if none




		/// finalizes dresses
		ceach(dgame.dresses, function(dkey,dress){
				//. knows ownself
				dress.key = dkey;
				//: sets GUI-tooltips for each link option
				var ww =	'Follow links to find maps. Paste maps only in text format.' +
							'Text and markup surrounding map is usually successfully ignored.';
				ceach(dress.links,  function(ix,link){link.tooltip=ww;});
		});


		//: finalizes
		dgame.akey = akey;
		giodf.dressed_albums[akey] = dgame;

		return clonem(dgame);
	};//defp.dress_album




	/// Mixes dressed album with collections
	defp.derive_album=function(akey){

		//. returns album if already derived
		if(gio.playzone.albums[akey]) return gio.playzone.albums[akey];


		try{

			//: does dressing
			var dgame = defp.dress_album(akey);
			if( !dgame ) return false;
			// c onsole.log('returned dressed album, but no colls=',dgame);

			//: bundlifies
			var album_def = giodf.albums[akey];
			var collections = album_def.collections; 
			collections = collections && clonem([], collections);

			var album = {};

			album.collections		= collections;
			album.key				= akey;
			//: TODM must be pasted, not assigned
			album.album_name		= album_def.album_name || '';
			//.	arrives from query like this: album.from_external_url = query.aurl;
			album.from_external_url	= album_def.from_external_url;
			album.game				= dgame;


			/// takes references
			var mess = pull_references( album.collections );
			if( mess ) {
					gio.cons_add(mess);
					return false;
			}



			if(!gio.config.feeder.exists){
				//// removes external collections
				if(do_debug) {
					gio.cons_add('Removing external collections from album: ' + akey);
				}
				var purged_collections = [];
				ceach(album.collections,function(i,coll){
					if(!coll.external) purged_collections.push(coll);
				});
				album.collections = purged_collections;
			}




			if( !album.collections || album.collections.length === 0){

				album.collections = null;
				if(do_debug) gio.cons_add('Collectionless album: ' + akey);

			}else{

				/// collectionifies
				for( var cix=0; cix < album.collections.length; cix++ ) {

					var coll = album.collections[cix];
					var cgame = dgame;

					if(coll.chosen || cix === 0) album.collections.ix = cix;
					coll.coll_ix = cix;

					//coll.owner_akey = akey;
					coll.context_akey = coll.context_akey || akey;
					if(coll.context_akey !== akey){
						// We have reference to peer-album			

						cgame = defp.dress_album(coll.context_akey);
						if( !cgame ){
							gio.cons_add(	'Missed game context for key ' + coll.context_akey +
											' for collection ' + coll.coll_ix);
							return false;
						}
					}

					//: contextifies
					coll.game = cgame;
					coll.album = album;

					//.. /// collectionifies

					//. normalizes
					coll.credits = coll.credits || {};



					// //\\	referencifies collection
					//		non-external collections set relative to albums tree on player server
					//		external collection referenced more complex way: see externify function.
					if(coll.external){

						//: prepares external collection
						defp.externify(coll);
						coll.credits.source = coll.external.link;
					}else{
						normalize_coll_address(coll, akey);
					}
					// \\//	referencifies collection

					//. makes tooltip and credit html-table
					core.tooltipify(coll, "Collection");
					coll.title = coll.title || coll.title_compiled_from_credits;

					album.title = gio.gui.procs.calculate_game_titile_from_names(dgame.nam, album.album_name)

					if(do_debug) {
						gio.cons_add( 'Collection assembled: ' + dotify( coll.title, 50 ) + ' akey=' + album.key + '.');
					}

				} /// collectionifies

			}


			//. GUIfies to show credits ...
			//	Is too annoying. Credits are already in top menu link. 
			//	Don't do this for now
			//	album.tooltip = album.game.tooltip;


			if(	album.collections && 
				(!gio.config.query.asingle || album.from_external_url)
			){
				album.ix = gio.playalbs.length;
				//. puts album to selection list in the game web-page header
				gio.playalbs[gio.playalbs.length]=album;
			}
			// * makes album available for game reference in maps
			gio.playzone.albums[akey]=album;
			return album;



		}catch(error){
			gio.cons_add(	"Error deriving akey " + akey + ".\n" +
							( typeof error === 'object' && error !== null ? error.message : '' + error )
			);
			if( gio.debug ) tp$.deb(error);
			return false;
		}

	};//...derive_album





	///	Expands:	own_url to external_url if leading "//" are met in own_url.
	//				If no "//", returns own_url back unchanged.
	//				if !external_url, then binds to tp.webpath_to_app_land.
	defp.expand_to_parent = function(
				own_url,	 // can be crafter-specified relative path
				external_url // can be web-path to album in remote server
	){
			if( !own_url ) return '';
			if(own_url.indexOf('//') === 0 ) {
						own_url = own_url.substr(2);

						// c onsole.log( 'window.location.host='+ window.location.host + ' window.location.pathname='+ window.location.pathname + ' own_url='+own_url + ' external_url=' + external_url + ' ww='+ww);

						//:: rerelativizes images in respect to collection
						if( external_url ) {

							//: removes tailing file name
							var www = /(.*\/)[^\/]+$/;
							var ww = external_url.match(www);
							own_url = ww[1] + own_url; 
							if(do_debug) {
								gio.cons_add(	'From parent, own url is set to ' + own_url);
							}

						}else{

							//..	there is no parent ...  do expand to albums folder on app's site

							//:		crafter must make sure own_url extends the path to valid file
							own_url =	core.app_webpath_noindex + '/' +

										//. this is not good ... parent can be a skin either, not albums, so discart this line:
										//	gio.config.defpaths.ALBUMS_DEF_PATH+'/' +

										own_url;
							if(do_debug) {
								gio.cons_add(	'No parent ... own url is set to ' + own_url);
							}
						}
			}
			return own_url;
	};




	///	expands definition of external collection
	defp.externify = function (external_collection) {

		var coll	= external_collection;
		var ext		= coll.external;
		var cred	= coll.credits;

		ext.link		= defp.expand_to_parent(ext.link, coll.album.from_external_url);
		cred.web_site	= defp.expand_to_parent(cred.web_site, coll.album.from_external_url);


		// //\\ retitlifies
		//TODm how to do both: set a location and open new tag by js
		var astub				= '<a target="_blank" style="text-decoration:none;" href="';
		var title	= dotify( cred.title, 30 );
		title		= title || dotify( cred.author, 30 );
		title		= title || dotify( cred.web_site, 30 );
		title		= core.htmlencode(title);

		var ext_cred =	//:		This class enables a scenario employed to detect user's intent
						// 		to load external map.
						// 		class="dontload_external"
						astub + cred.web_site + '"><span class="dontload_external" style="color:#00FF00">Site: ' +
						title + "</span></a>\n" +
						astub + ext.link +'"><span class="dontload_external" style="color:#00FFFF">Text</span></a> ';

						// TODm why external link works without urlencoding? fix this:
		coll.title	=	'<span class="dontload_external">External: </span>'+ 
							ext_cred +
						'<span style="color:#FF8888; cursor:pointer;" >Try to load</span>';
		// \\// retitlifies
	};




	/// Attaches (to album definition) external collection from coll_url.
	//	Makes it chosen.
	//	Must be called before album definition is used.
	defp.attach_external_collection = function ( coll_url, akey ) {
			var album_def = giodf.albums[akey];
			var collections = album_def.collections = album_def.collections || [];
			var new_collection =	{	
					external		:{	web_site : coll_url,
										link : coll_url,
										title : 'Custom'
									},
					map_title_source	: 'title',
					chosen			: true
				};
			collections.push(new_collection);
			// c onsole.log(' new_collection=', new_collection,' akey=' + akey + ' giodf.albums[akey]=', giodf.albums[akey]);
	};


	var normalize_coll_address =  function ( coll, akey ) {
			var adr			=	coll.address = coll.address || {};
			//if( adr.full ) return;
			adr.akey		=	adr.akey	|| akey;
			adr.ckey		=	adr.ckey	|| 'default';
			adr.fkey		=	adr.fkey	|| 'maps.txt';
			//. is a flag:
			adr.full		=	gio.config.defpaths.ALBUMS_DEF_PATH+'/' + adr.akey +
								'/collections/'+adr.ckey +
								'/'+ adr.fkey;
	};



	/// gets references
	var pull_references = function ( collections ) {

		if( !collections ) return '';
		for( var cix=0; cix < collections.length; cix++ ) {

				var coll = collections[cix];
				if( coll.ref ) {
						if( !coll.ref.akey || (!coll.ref.ix && coll.ref.ix !== 0) ) {
							return	'Missed akey coll. ix for reffered collection. ' +
									'coll_ix=' + coll.coll_ix;
						}
						var ref_album_def = giodf.albums[coll.ref.akey];
						if( !ref_album_def.collections ) {
							return	'No collections exist for reffered collection ' +  coll.ref.akey;
						}
						var ref_coll_def  = ref_album_def.collections[coll.ref.ix]; 
						if( !ref_coll_def ) {
							return	'Missed reffered collection: akey, ix, coll_ix=' + 
									coll.ref.akey + ', ' + coll.ref.ix + ', ' + coll.coll_ix;
						}
						//. preserves original collection from destruction
						var ref_coll = collections[cix] = clonem(ref_coll_def, coll);
						//. cleans up
						delete ref_coll.ref;

						//. fixes settings:
						if( !ref_coll.external ) normalize_coll_address( ref_coll, coll.ref.akey );
						//ref_coll.chosen = coll.chosen;
						//ref_coll.context_akey = coll.context_akey;
				}
		}
		return '';
	};/// gets references


})();


