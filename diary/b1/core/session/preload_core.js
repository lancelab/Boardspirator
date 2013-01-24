
(function(){		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ceach	= core.each;

					var dio		= gio.data_io;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var gdp		= gdef.procs;
					var smode	= gio.modes.sta_tic;
					var gconf	= gio.config;
					var feeder	= gconf.feeder;
					var session	= gio.session;

					var deb		= function ( string ) { gio.debly( "Preload: " + string ); };			
					var conadd	= function ( string ) { gio.cons_add( "Preload: " + string ); };			






	///	//\\//	Preloads:	gamions and other objects
	//						to be done before GUI init.
	//			Returns:	'' if success. Otherwise, returns error message.
	session.init.load_core_gamions = function () {

		if( session.state.halted ) return 'Skipped "load_core_gamions".';

		//. gets query from URL
		var query 		= gconf.query;

		//. finalizes base definitions
		gdp.spawn_base_game_and_dress();



		// //\\ LOADS GAME DEFINITIONS /////////////////////
		var success = dio.download_defion ( 
			{ url :	core.app_webpath_noindex + '/' +
					gconf.defpaths.GAMES_DEF_PATH +
					'/games.jwon.txt'
			}
		);
		var ww = "Core folder-games load " + ( success ? 'success.' : 'failure.' );
		if( !success ) return ww;
		deb( ww );


		/// pastes all available defs to gdef.games from database at once
		if( smode.db ) {	
			core.download_object(
					smode.db + '/games',
					gdef, 'games',
					'do paste'
			);
			deb( "Core db-games load finished." );
		}
		// \\// LOADS GAME DEFINITIONS /////////////////////





		// //\\ LOADS ALBUM DEFINITIONS /////////////////////

		gdp.normalize_album_defs( gdef.albums );

		//. comment
		deb( "Derives scode-bundled albums ..." );
		ceach( gdef.albums, function( akey, dummy ) { gdp.derive_album( akey );	});
		deb( "Finished deriving scode-bundled albums ... " );


		//. comment
		deb( "Downloads standalone-albums if any ..." );
		//	all albums included via <script tag are already inserted
		dio.add_defions();
		gdp.normalize_album_defs( gdef.albums ); // TODM extra junk job
		deb( "Finished standalone-albums if any ... " );



		if( smode.db ) {	
				///	loads all available album_defs from database at once and 
				var db_albums = {};
				/// this call returns albums in form { "akey1" : <album>, "akey2" : ... }
				var ww = core.download_object(	
						smode.db + '/albums',
						db_albums, 'albums'
				);
				// c ccc( "object-albums from db =", ww );
				gdp.normalize_album_defs( db_albums.albums );
				ceach( db_albums.albums, function( xx, album ) { album.ref.db = true; });

				//.	overrides folder-based album definitions
				//	core.rpaste( gdef.albums, db_albums.albums );

				//. pastes preventively TODM slow
				core.rpaste ( gdef.albums, crpaste( {}, db_albums.albums, gdef.albums ) );

				deb( "Db-albums, if any, load finished." );
		}


		//: derives the newly loaded albums which missed derivation at load
		ceach( gdef.albums, function( akey, adummy ) { gdp.derive_album( akey ); });


		if( query.aurl ) {
			deb( "Preloading album " + query.aurl );
			var downed_alb = dio.download_defion ( 
				{ url : query.aurl, query : query, listify_on_top : true, penetrate_asingle : true }
			);
			var ww = "Album preload " + query.aurl + ( downed_alb ? ' success.' : ' failure.' );
			if( !downed_alb ) return ww;
			deb( ww );
		}

		var pakey = gdp.get_preferred_album_def().key;
		if( !pakey ) return "No album definitions are loaded.";

		// \\// LOADS ALBUM DEFINITIONS /////////////////////







		/// Attaches external collection if any
		var downed_coll = false;
		if( query.curl ) {
			var metag =
			{ 	//"coll" : true,
				env	:
				{	akey_master : query.akey,
					akey_advice : pakey,
					passive		: query.cpassive,
					query		: query
				},
				link :
				{	link : query.curl
				},
				list :
				{	chosen : true  //TODM appar. overkill, aways chosen
				}
			};
			var downed_coll = dio.download_gamion ( metag );
			if( !downed_coll ) return 'Failed download coll from query.url = ' + query.curl;
			deb( "Coll download success." );
		}


		if( session.alist.length === 0 ) return( 'GUI album list is empty.' );

		session.init.downed_coll = downed_coll;

		return '';
		// c cc( "Preloader: gio=", gio );
	};




})();


