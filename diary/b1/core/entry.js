
(function(){		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;

					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var gdp		= gdef.procs;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;
					var session	= gio.session;


					//	//\\// Master Entry into application ////////////////////////



	/// Enters:		master entry of the application.
	//				This method is usually overridden in different *.htm landing pages:
	//					whirly.htm, 
	//					~appliction_readme.htm
	//				All these pages use
	//					gio.session.init.wrap,
	//					see below.	
	//	Behaviour:	halts application and returns if startup problems
	//
	session.init.entry = function () {

		if( session.state.halted ) return;
		var halted = gio.description.title +' is halted.';

		//. gets query from URL
		var query 		= gio.config.query;
		gio.debtp( query );


		//. does initial gui tasks
		if( !ggi.entry() ){ alert(halted); return; }

		//. informs		
		if( !feeder.exists ) gio.cons_add( "No feeder exists at URL = " + feeder.url );

		//. finalizes base definitions
		gdp.spawn_base_game_and_dress();



		// //\\ LOADS GAME DEFINITIONS
		if( smode.db ){	
			/// loads all available game defs from database at once
			gio.data_io.core.load.object(
					smode.db + '/games',
					gdef, 'games',
					'do paste'
			);
		}else{
			gio.data_io.core.load.object( 
					gio.config.defpaths.GAMES_DEF_PATH + '/games.json.txt',
					gdef,
					'games',
					'do paste'
			);
		}
		// \\// LOADS GAME DEFINITIONS




		// //\\ LOADS ALBUM DEFINITIONS
		if( smode.db ) {	
				///	loads all available album_defs from database at once and 
				//	overrides loaded by <script> from index-page header
				gio.data_io.core.load.object(	
						smode.db + '/albums', //?json=yes',
						gdef, 'albums'
				);
		}
		gdp.normalize_album_defs( gdef.albums );
		var pakey = gdp.get_preferred_album_def().key;
		if( !pakey ) {
			var ww = "No album definitions are loaded\n";
			gio.cons_add( ww );
			alert( ww + halted );
			return;
		}

		if( query.aurl ) {
			var presc =
			{ 	"album" : true,
				env	:
				{	akey_master : query.akey,
					akey_advice : pakey,
					query		: query
				},
				link :
				{	link : query.aurl
				},
				list :
				{		chosen : true,
						title : "External"
				}
			};
			var downed_alb = gdp.download_scriptio ( presc );
			if( !downed_alb ) {
				gio.cons_add( 'Failed download cscript from ' + query.aurl );
				alert( halted );
				return;
			}
		}
		// \\// LOADS ALBUM DEFINITIONS




		/// Attaches external collection if any
		var downed_coll = false;
		if( query.curl ) {
			var presc =
			{ 	"coll" : true,
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
				{		chosen : true  //TODM appar. overkill, aways chosen
				}
			};
			var downed_coll = gdp.download_scriptio ( presc );
			if( !downed_coll ) {
				gio.cons_add( 'Failed download coll from query.url = ' + query.curl );
				alert( halted );
				return;
			}
		}


		//: finally, instantiates remains of albums
		core.each( gdef.albums, function( albkey, adummy ) {
			gdp.derive_album( albkey );
		});
		if( session.alist.length === 0 ) {
			gio.cons_add( 'GUI album list is empty.' );
			alert( halted );
			return;
		}

		ggi.create_controls_and_game_list();


		//. releases messages stashed in debug before <body> created
		gio.debtp( 'Albums instantiated. gio.gui.init.create_controls_and_game_list is done.' );



		// //\\ prepares landing to requested map
		var pakey			= gdp.get_preferred_album_def().key;
		var akey			= query.akey || pakey;
		var collection_ix	= query.collection_ix || 0;
		var map_ix			= query.map_ix || 0;

		if( downed_coll ) {
			if( downed_coll.ref.list.akey && downed_coll.maps_loaded === 'success' ) {
				var akey			= downed_coll.ref.list.akey;
				var collection_ix	= downed_coll.ref.list.ix;
			}
		}
		if( !gio.navig.validate_coll_map( akey, collection_ix, map_ix, 'do_land' ) ) {
				gio.cons_add( "Failed to land on album, coll " + akey + ", " + collection_ix );
				if( !gio.navig.validate_coll_map( pakey, 0, 0, 'do_land' ) )
				{
					if( !gio.gui.procs.scroll_till_valid_album( 0, 'do_land' ) ) {
						alert(halted);
						return;
					}
				}
		}
		// \\// prepares landing to requested map



		//: gets ears to listen to user
		ggi.control_events();
		ggi.step_events();
		session.state.start_time = (new Date()).getTime(); 
		gio.modes.app_loaded = true;

		// Doc: Good way to see app tree:
		// c onsole.log('application object tree',gio);

	};// session.init.entry

	session.init.wrap =	function(){	session.init.entry(); };


})();

jQuery('document').ready( jQuery.fn.tp$.gio.session.init.wrap );

