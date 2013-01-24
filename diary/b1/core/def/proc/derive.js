(function( ){	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var tpaste	=  core.tpaste;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var exp_url	=  core.expand_to_parent;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var ggp		=  gio.gui.procs;
					var dotify	=  core.dotify;

					var sess	=  gio.session; 
					var do_deb	=  gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;

					//:	We do sacrify speed by wrapping consoles into following functions, but
					//	we gain adding a markerer "Derive", and do not sacrify performance because
					//	deriving is a rare operation.
					var dodeb	=  function ( string ) { if( do_deb )		gio.cons_add( "Derive: " + string ); };
					var deb		=  function ( string ) { if( gio.debug )	gio.cons_add( "Derive: " + string ); };			
					var conadd	=  function ( string ) { 					gio.cons_add( "Derive: " + string ); };			




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
	gdp.derive_game = function( gkey, overdefine ) {


		///	Verifies if job already done.
		if( !overdefine ) {
			var idef = gdef.inherited_games[gkey];
			if(idef) return clonem( idef );
		}


		///	Verifies if own definition exists.
		var gdg = gdef.games[ gkey ];
		if( !gdg ) {
			deb(	'Missed seed definition  for gkey "'+ gkey + '". Base ' +
					gdef.base_game.basekey + ' used instead.'
			);
			//.	resorting to last resort: base
			gkey = gdef.base_game.basekey;
			var idef = gdef.inherited_games[ gkey ];
			if( idef ) return clonem( idef );
			var gdg = gdef.games[ gkey ];
		}


		// //\\ Does the recursive inheritance job
		gdg.basekey = gdg.basekey || gdef.base_game.basekey;
		

		if( gdg.basekey === gkey ){ //TODM this does not protect from deeper level loop

			//.	no post-defs for self-referenced games  
			//	this is just a funny way to protect mistakenly infinite-loop references
			//	this also applies for gkey = whirly
			//	bug?: idef = gdg;
			idef = clonem( gdg );


		}else{

			idef=gdp.derive_game( gdg.basekey, overdefine );

			//	//\\	runs post-defs if any,
			//			runs it BEFORE gdg is applied
			//			changes idef
			//	runs it BEFORE seed-definition is applied
			var ww = gdg.post_definition;
			if(ww && gio.def.post_definitions[ww]){
				gio.def.post_definitions[ww](idef);
				//.	cannot delete because reflection is used in friend rails project and
				//	all properties are needed
				//delete gdg.post_definition;
			}
			//	\\// runs post-defs if any. changes idef


			idef = clonem( idef, gdg );
		}

		//. removes garbage leaked from definition
		if( idef.post_definition ) delete idef.post_definition;

		//. copathy leaks from ancestors if not explicitly killed in definition
		var ww = idef.post_definition_copathy;
		// c onsole.log( idef.nam + ' idef.post_definition_copathy='+idef.post_definition_copathy);
		//. redefine property only if it is not already defined: TODM poor programming:
		if( ww && (typeof ww === 'string') ) idef.post_definition_copathy = ww && gio.def.sugar[ww];

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








	///	Dresses game with dresses and credits from game,
	//	parent_album, and own_definition.
	gdp.dressi_gami_fy_album = function ( akey, overdefine ) {

		if( !overdefine ) {
			//: vital: returns copy, to protect template intact
			var dgame = gdef.dressed_gamed_albums[ akey ];
			if( dgame ) return clonem( dgame );
		}		

		var album_def = gdef.albums[ akey ];
		//.	First, tries to use co-named album to benefit from its dress
		if( album_def ) {
			var gkey = album_def.gkey || akey;
		}else{
			deb( 'No def for akey "' + akey + '". Using game.');
			var gkey = akey;
		}

		//:	derives the game
		dgame = gdp.derive_game( gkey, overdefine );


		//	//.\\	collects 4 dresses from 
		//			game, parent-album, album-definition, and default-dress
		//: takes dressed parent album if any
		var dress_akey = album_def && album_def.ref.env.dress_akey;
		var env_dgame = null;
		//. dress_akey !== akey protects from infinite loop,
		//	BUT does not protect from deeper levels of looping. TODM
		if( dress_akey && dress_akey !== akey ) {
			env_dgame = gdp.dressi_gami_fy_album( dress_akey, overdefine );
			if( !env_dgame ) return false;
		}

		/// inherites dresses from definitions
		dgame.dresses = clonem( dgame.dresses, env_dgame && env_dgame.dresses, album_def && album_def.dresses );

		/// injects default dress
		ceach( dgame.dresses, function( dkey, dress ) {
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
				dress.credits.license =	"All rights reserved. Free when used as part of " +
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
		gdef.dressed_gamed_albums[ akey ] = dgame;

		return clonem( dgame );
	}; /// Dresses album ...











	/// Spawns album from its definition and parents
	gdp.derive_album = function ( akey, cseed_to_add, preserve_gui_state, overdefine ) {

		var gs			= gio.getgs();
		var overdefined	= false;
		var album		= sess.stemmed_albums[ akey ];

		if( album && !overdefine ) {

			//. returns album if already derived
			if( !cseed_to_add ) return album;
			dodeb( 'Merges cseed into akey = "' + akey + '" ... ' );
			// c onsole.log( "State snap = ", sess.get_state_snap() );

		}else{


			dodeb( '(Over)Derives akey "' + akey + '" ... ' );

			//. gets definition
			var album_def = gdef.albums[ akey ] || {};

			//. templifies album
			album = clonem( gio.def.templates.play.album, album_def );

			//: does dressing
			var dgame = gdp.dressi_gami_fy_album( akey, overdefine );

			if( !dgame ) return false;
			album.dgame = dgame;

			try{


				for( var cix=0, wlen = album.collections.length; cix < wlen; cix++ ) {
					gdp.externify_and_hostify( album.collections[ cix ], album )
				};


				/// removes external collections
				if( !gio.config.feeder.exists ) {
					dodeb( 'Removes external colls from album: ' + akey );
					var w_purged = [];
					ceach( album.collections, function( i, coll ) {
						if( coll.ref.link.ownhost ) {
							dodeb(	'Preserved ownhosted cix, coll.list_title = ' + i +
									' ' + coll.list_title 
							);
						w_purged.push( coll );
						}
					});
					album.collections = w_purged
				}

				overdefined = overdefine && !!sess.stemmed_albums[ akey ];

				if( overdefined )
				{
					///	Hides board and kills GUI state because it maybe lost after state change.
					//.	Possibly too weak: if( gs.board && akey === gs.akey ) {
					if( akey === gs.akey ) {
						ggp.do_display_curr_board ( false );
						sess.state.akey__bf = '';
					}
				}


				//: templifies collections,
				//	we have firmly established collection array, so can bound coll to ist index
				for( var cix=0, wlen = album.collections.length; cix < wlen; cix++ ) {
					var coll =  album.collections[ cix ];
					cpaste( coll, gio.def.templates.play.coll );
					if( cix === 0 || coll.ref.list.chosen ) album.collections.ix = cix;
					if( !gdp.spawn_coll_up_down_links( album, cix, 'externified' ) ) return false;
				}



				//:	enables album for references from application
				sess.stemmed_albums[ akey ] = album;


			}catch(error){

				conadd(	"Error deriving akey " + akey + ".\n" +
								( typeof error === 'object' && error !== null ? error.message : '' + error )
				);
				gio.debtp( error );
				return false;
			}
		}/// first time



		/// adds additional collection
		if( cseed_to_add ) {
			var coll_to_add = clonem( cseed_to_add, gio.def.templates.play.coll );
			var ww = cseed_to_add.script.metag.cix_to_insert1;
			if( ww ) {
				var cix = ww - 1;
				if( akey === gs.akey && gs.cix === cix ) {
					gio.gui.procs.do_display_curr_board ( false );
					sess.state.akey__bf = '';
				}
				album.collections[ cix ] = coll_to_add;
				dodeb( 'Coll replaced cix = ' + cix );
			}else{
				album.collections.push( coll_to_add );
				var cix = album.collections.length - 1;
				dodeb( 'Coll added to cix = ' + cix );
			}

			/// preserves state ... is vital if middle-play-custom-landing-collection is non-validated yet
			if( !preserve_gui_state || overdefined ) {
				if( !album.collections.ix || album.collections.ix !== 0 ) album.collections.ix = 0;
				if( coll_to_add.chosen || coll_to_add.ref.list.chosen )
				{
					//:: TODM sugar. rid
					if( akey === gs.akey ) {
						ggp.do_display_curr_board ( false );
						sess.state.akey__bf = '';
					}
					dodeb( 'Album pointed to  stated-cix = ' + cix );
					album.collections.ix = cix;
				}
			}
			// do this: if( coll_to_add.ref.list.chosen ) album.collections.ix = cix;
			if( !gdp.spawn_coll_up_down_links( album, cix ) ) return false;
		}


		/// enables album in GUI
		if(		( !sess.alist_by_key[ akey ] ||  overdefined )	&& 
				album.collections.length > 0					&&

				(	!gio.config.query.asingle || album.ref.list.listify_on_top ||
					album.ref.list.penetrate_asingle
				)
		){


				if( overdefined )
				{
					///	Hides board and kills GUI state because it maybe lost after state change.
					var gs = gio.getgs();
					//.	Possibly too weak: if( gs.board && akey === gs.akey ) {
					if( akey === gs.akey ) {
						ggp.do_display_curr_board ( false );
						sess.state.akey__bf = '';
					}

					var target_album = sess.alist_by_key[ akey ];
					var target_aix = target_album.ix;
					sess.alist[ target_aix ] = album;					
					sess.alist_by_key[ akey ] = album;
					album.ix = target_aix;
					dodeb( 'Album replaced in list: akey, axi = "' + akey + '", ' + target_aix + '.' );

				}else{

					album.ix = sess.alist.length;
					sess.alist[ sess.alist.length ] = album;
					sess.alist_by_key[ akey ] = album;
					dodeb( 'Album added to list: akey, axi = "' + akey + '", ' + target_aix + '.' );

				}
		}
		// c onsole.log( 'sess.alist=', sess.alist );


		if( album.collections.length > 0 ) {
			//: sugar: establishes title till when gui-status-routine establishes this title
			var coll = album.collections[ album.collections.ix ];
			album.title = gio.gui.procs.calculate_game_titile_from_names( coll.dgame.nam, album.album_name );
		}

		dodeb( ( cseed_to_add ? "Finished cseeding" : "Derived" ) + " akey " + akey );
		// c onsole.log( "At the ''derive'' subr. end. State snap = ", sess.get_state_snap() );




		return album;



	}; /// Spawns album from its definition and parents




})();


