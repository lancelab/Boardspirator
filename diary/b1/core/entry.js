
(function(){		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;



					//	//\\// Master Entry into application ////////////////////////




	///	Behaviour:	halts application and returns if startup problems
	gio.session.init.entry = function () {

		var halted = gio.description.title +' is halted.';

		//. gets query from URL
		var query 		= gio.config.query;
		if(gio.debug)	tp$.deb(query);

		if( !JSON || !JSON.parse || !JSON.stringify ) {
			alert( 'No JSON features detected. Appliction halted.' );
			return;
		}

		//. does initial gui tasks
		if( !ggi.entry() ){ alert(halted); return; }

		//. informs		
		if( !feeder.exists ) gio.cons_add( "No feeder exists at URL = " + feeder.url );

		//. finalizes base definitions
		gdef.procs.spawn_base_game_and_dress();



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

		var first_album = core.get_first_or_null( gdef.albums );
		if( !first_album ) {
			var ww = "No album definitions are loaded\n";
			gio.cons_add( ww );
			alert( ww + halted );
			return;
		}
		// \\// LOADS ALBUM DEFINITIONS



		var akey = query.akey || first_album.key;


		/// Attaches external collection if any
		if( query.aurl ) query.curl = query.aurl;
		var new_collection = null;
		if( query.curl ) {
			var new_collection = gdef.procs.attach_external_collection ( query.curl, akey, query );
			if( !new_collection ) {
				gio.cons_add( 'Failed download coll from query.url = ' + query.curl );
				alert( halted );
				return;
			}
		}



		//: finally, instantiates remains of albums
		core.each( gdef.albums, function( albkey, adummy ) {
			gdef.procs.derive_album( albkey );
		});
		if( gio.session.alist.length === 0 ) {
			gio.cons_add( 'No album definitions are found.' );
			alert( halted );
			return;
		}

		ggi.create_controls_and_game_list();


		//. releases messages stashed in debug before <body> created
		if( gio.debug ) tp$.deb( 'Albums instantiated. gio.gui.init.create_controls_and_game_list is done.' );



		// //\\ prepares landing to requested map
		var collection_ix	= query.collection_ix || 0;
		var map_ix			= query.map_ix || 0;

		if( new_collection ) {
			if( new_collection.lkey ) {
				var akey			= new_collection.lkey;
				var collection_ix	= new_collection.coll_ix;
			}
		}
		if( !gio.navig.select_album_and_collection( akey, collection_ix, map_ix ) ) {
				alert( "Failed to land on album " + akey + " collection index " + collection_ix ); //TODO no alert
				if( !gio.navig.select_album_and_collection( first_album.key, 0, 0 ) )
				{
					gio.session.state.album_ix = 0;
					if( !gio.scroll_till_valid_albumion() ) {
						alert(halted);
						return;
					}
				}
		}
		// \\// prepares landing to requested map



		//: gets ears to listen to user
		ggi.control_events();
		ggi.step_events();
		gio.modes.app_loaded = true;

		// Doc: Good way to see app tree:
		// c onsole.log('application object tree',gio);

	};// gio.session.init.entry

	gio.session.init.wrap =	function(){	gio.session.init.entry(); };


})();

jQuery('document').ready( jQuery.fn.tp$.gio.session.init.wrap );

