(function( ){	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var tpaste	=  core.tpaste;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var dotify	=  core.dotify;
					var exp_url	= tp.core.expand_to_parent;
					var do_debug = gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;







	/// Templifies definition
	gdp.normalize_album_defs = function ( album_defs ) {
		ceach( album_defs, function( akey, ad ) {
			cpaste( ad, gio.def.templates.def.album ); 
			//. up-link
			ad.key = akey;
			//. "body-link"
			ad.album_name = ad.album_name || '';
		});
	};





	///	Derives game definition.
	//	Gets own key, gekey from own index.
	//	Derives	dress,
	//			post_definition, and
	//			sugar.
	gdp.derive_game = function( gkey ) {

		//: verifies if job already done
		var idef = gdef.inherited_games[gkey];
		if(idef) return clonem(idef);


		//: verifies if own definition exists
		var gdg = gdef.games[gkey];
		if(!gdg){
			gio.cons_add('Missed seed definition  for gkey "'+ gkey +'".');
			return false;
		}


		// //\\ does the recursive inheritance job
		gdg.basekey = gdg.basekey || gdef.base_game.basekey;
		

		if( gdg.basekey === gkey ){

			//.	no post-defs for self-referenced games  
			//	this is just a funny way to protect mistakenly infinite-loop references
			//	this also applies for gkey = whirly
			//	bug?: idef = gdg;
			idef = clonem(gdg);


		}else{
			idef=gdp.derive_game(gdg.basekey);
			if(!idef)return false;


			//	//\\ runs post-defs if any. changes idef
			//	runs it BEFORE seed-definition is applied
			var ww = gdg.post_definition;
			if(ww && gio.def.post_definitions[ww]){
				gio.def.post_definitions[ww](idef);
				//.	cannot delete because reflection is used in friend rails project and
				//	all properties are needed
				//delete gdg.post_definition;
			}
			//	\\// runs post-defs if any. changes idef


			idef = clonem(idef,gdg);
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
		gdef.inherited_games[gkey]=idef;

		//. returns the job
		return clonem(idef);
	};








	/// Dresses game with dresses and credits from game, parent_album, and own_definition.
	gdp.dress_game = function ( akey ) {

		//: vital: returns copy, to protect template intact
		var dgame = gdef.dressed_games[ akey ];
		if( dgame ) return clonem( dgame );

		/// verifies if own definition exists
		var album_def = gdef.albums[ akey ];
		if( !album_def ) {
			gio.cons_add( 'Missed definition for album key "' + akey + '".');
			return false;
		}


		/// derives the game
		var gkey = album_def.gkey || akey;
		dgame = gdp.derive_game( gkey );
		if( !dgame ) return false;


		//	//.\\	collects 4 dresses from 
		//			game, parent-album, album-definition, and default-dress
		//: takes dressed parent album if any
		var dgkey = album_def.ref.env.dgkey;
		var w_dgame = null;
		if( dgkey ) {
			w_dgame = gdp.dress_game( dgkey );
			if( !w_dgame ) return false;
		}

		/// inherites dresses from definitions
		dgame.dresses = clonem( dgame.dresses, w_dgame && w_dgame.dresses, album_def.dresses );

		/// injects default dress
		ceach(dgame.dresses, function(dkey, dress){
			var ww = clonem(gio.def.default_dress, dress);
			cpaste( dress, ww );
		});
		//	\\.//	collects 4 dresses from 


		// //\\ establishes chosen_key or as first if none
		var chosen_dkey = '';
		var first_dkey = '';
		ceach(dgame.dresses, function( dkey, dress ) {

			if( !first_dkey ) first_dkey = dkey;
			if( dress.skip ) return true;
			if( dress.chosen ) chosen_dkey = dkey;

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
		gdef.dressed_games[ akey ] = dgame;

		return clonem(dgame);
	}; /// Dresses album ...











	/// Spawns album from its definition and parents
	gdp.derive_album = function ( akey, cseed_to_add, preserve_gui_state ) {

		var album = gio.session.stemmed_albums[ akey ];
		if( album ) {

			//. returns album if already derived
			if( !cseed_to_add ) return album;
			if( do_debug ) gio.cons_add( 'Begins adding cseed to akey = "' + akey + '" ... ' );
			// c onsole.log( "State snap = ", gio.session.get_state_snap() );

		}else{


			if( do_debug ) gio.cons_add( 'Begins deriving akey "' + akey + '". First time ... ' );

			//. gets definition
			var album_def = gdef.albums[ akey ];
			if( !album_def ) return false;

			//. templifies album
			album = clonem( gio.def.templates.play.album, album_def );

			//: does dressing
			var dgame = gdp.dress_game( akey );
			if( !dgame ) return false;
			album.dgame = dgame;

			try{


				for( var cix=0, wlen = album.collections.length; cix < wlen; cix++ ) {
					gdp.externify_and_hostify( album.collections[ cix ], album )
				};


				/// removes external collections
				if( !gio.config.feeder.exists ) {
					if( do_debug ) gio.cons_add( 'Removing external colls from album: ' + akey );
					var w_purged = [];
					ceach( album.collections, function( i, coll ) {
						if( coll.ref.link.ownhost ) w_purged.push( coll );
					});
					album.collections = w_purged
				}



				//: templifies collections,
				//	we have firmly established collection array, so can bound coll to ist index
				for( var cix=0, wlen = album.collections.length; cix < wlen; cix++ ) {
					var coll =  album.collections[ cix ];
					cpaste( coll, gio.def.templates.play.coll );
					if( cix === 0 || coll.ref.list.chosen ) album.collections.ix = cix;
					if( !gdp.spawn_coll_up_down_links( album, cix, 'externified' ) ) return false;
				}



				//.	enables album for references from application
				gio.session.stemmed_albums[ akey ] = album;

			}catch(error){
				gio.cons_add(	"Error deriving akey " + akey + ".\n" +
								( typeof error === 'object' && error !== null ? error.message : '' + error )
				);
				gio.debtp( error );
				return false;
			}
		}/// first time



		/// adds additional collection
		if( cseed_to_add ) {
			var coll_to_add = clonem( cseed_to_add, gio.def.templates.play.coll );
			album.collections.push( coll_to_add );
			var cix = album.collections.length - 1;
			/// preserves state ... is vital if middle-play-custom-landing-collection is non-validated yet
			if( !preserve_gui_state ) {
				if( !album.collections.ix || album.collections.ix !== 0 ) album.collections.ix = 0;
				if( coll_to_add.chosen || coll_to_add.ref.list.chosen ) album.collections.ix = cix; //TODM sugar. rid
			}
			// do this: if( coll_to_add.ref.list.chosen ) album.collections.ix = cix;
			if( !gdp.spawn_coll_up_down_links( album, cix ) ) return false;
		}


		/// enables album in GUI
		if(		!gio.session.alist_by_key[ akey ]		&& 
				album.collections.length > 0			&&
				( !gio.config.query.asingle || album.ref.list.display_preordered ||
				akey === gio.config.query.akey )
		){
				album.ix = gio.session.alist.length;
				//. puts album to selection list in the game web-page header
				gio.session.alist[ gio.session.alist.length ] = album;
				gio.session.alist_by_key[ akey ] = album;
		}
		// c onsole.log( 'gio.session.alist=', gio.session.alist );


		if( album.collections.length > 0 ) {
			//: sugar: establishes title till when gui-status-routine establishes this title
			var coll = album.collections[ album.collections.ix ];
			album.title = gio.gui.procs.calculate_game_titile_from_names( coll.dgame.nam, album.album_name );
		}

		if( do_debug ) tp$.deb( (cseed_to_add ? "Added cseed to" : "Derived") + " akey " + akey );
		// c onsole.log( "At the ''derive'' subr. end. State snap = ", gio.session.get_state_snap() );

		return album;



	}; /// Spawns album from its definition and parents




})();


