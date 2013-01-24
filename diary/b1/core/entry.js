
( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var halted	= gio.description.title + ' is halted.';

					var gdef	= gio.def;
					var gdp		= gdef.procs;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;
					var session	= gio.session;
					var conadd	= function ( string ) { gio.cons_add( "Entry: " + string ); };			
					var deb		= function ( string ) { gio.debly( "Entry: " + string ); };			
	



					//	//\\// Master Entry into application ////////////////////////





	/// Finalizes:	application ... visualizes play-GUI ... lands on map ...
	//
	session.init.entry = function () {

		if( leave_if_user_declined_browser() )		return "User declined browser";
		deb( "Going to finalize app." );		

		//. Visualizes playzone GUI areas
		gio.domwrap.regions.droot.style.display		= 'block';
		ggi.create_controls_and_game_list();


		// //\\ Prepares landing and lands to requested map.
		//. Gets query from URL.
		var query 			= gio.config.query;
		var pakey			= gdp.get_preferred_album_def( 'from listed albums' ).key;
		var akey			= query.akey || pakey;
		var collection_ix	= query.collection_ix || 0;
		var map_ix			= query.map_ix || 0;
		//.	Recalls previously downloaded collection if any.
		var downed_coll		= session.init.downed_coll;

		if( downed_coll ) {
			if( downed_coll.ref.list.akey && downed_coll.maps_loaded === 'success' ) {
				var akey			= downed_coll.ref.list.akey;
				var collection_ix	= downed_coll.ref.list.ix;
			}
		}
		var ww_land = 	" akey, cix, mix = \""	+
						akey					+ "\", \"" + 
						collection_ix			+ "\"" + "\", \"" +
						map_ix					+ "\". ";
		deb( "Going to land to " + ww_land );
		if( !gio.navig.validate_coll_map( akey, collection_ix, map_ix, 'do_land' ) ) {
				conadd(	"Failed to land on " + ww_land + "\nAttempting pakey." );
				if( !gio.navig.validate_coll_map( pakey, 0, 0, 'do_land' ) )
				{
					if( !gio.gui.procs.scroll_till_valid_album( 0, 'do_land' ) ) {
						return( "No valid albums." );
					}
				}
		}
		// \\// Prepares landing and lands to requested map.



		//: Gets ears to listen to user.
		ggi.control_events();
		ggi.step_events();
		session.state.start_time = (new Date()).getTime(); 
		gio.modes.app_loaded = true;

		// Doc: Good way to see app tree:
		// c cc('application object tree',gio);

		return '';

	};// session.init.entry





	/// Warns and gets user's agreement to run app on specific browser.
	var leave_if_user_declined_browser = function() {

		var getout=false;
		var question = "Would you still like to continue on your own risk?";
		var immature_project = gio.description.title + " project and its games\nare incomplete draft and immature.\n\n";
		var message = question;

		//.. testing string = core.browser.IE = [ "8", "8" ];
		if( core.browser.IE ) {

			var version_barrier = 8;

			var IEVersion = parseInt( core.browser.IE[1] );

			if( IEVersion <= version_barrier ) {
				var message =
								"Your Internet Explorer version " + IEVersion +
								" is too low.\n\n" + 
								gio.description.title + " is designed for " +
								"Fire Fox, Chrome, or Mobile browsers or\npossibly " +
								"Internet Explorer version " + version_barrier + " or higher.\n\n" +
								question;


			}else{

				var message =	gio.description.title + " is not tested in this browser.\n" +
								"Fire Fox, Chrome, or Mobile browsers are recommended.\n\n" +
								question;
			}


		}else if( tp.core.browser.Opera ) {
				//alert( recommendation_standard + '. Opera will run with simple laoyout.');
				var message = 	gio.description.title + ' was not tested and not developed in Opera.\n' + 
								"Fire Fox, Chrome, or WebKit browsers are recommended\n"
		}

		getout = !confirm( immature_project + message );

		return getout;
	};




	//. Initiates "Playzone". To be overridden in "Other zone" like "Document zone".
	session.init.wrap =	function() { return session.init.entry(); };


	/// Shortcuts halting.
	var halt_if_failed = function ( message, area ) {
		if( !message ) return;
		if( area ) message = area + ": " + message;
		gio.cons_add( message );
		session.state.halted = true;
		alert( message + "\n" + halted );
	};



	/// Fires up:	application. Master entry.
	//	Displays:	message and halts if failure.
	jQuery( 'document' ).ready( 

		function () {

			var init = session.init;
			var state = session.state;
									halt_if_failed( gio.gui.init.entry(),		"GUI Entry" );
			if( !state.halted ) 	halt_if_failed( init.load_core_gamions(),	"Preload" );
			if( !state.halted ) 	halt_if_failed( session.init.wrap(),		"Init.wrap" );
		}
	);




}) ();


