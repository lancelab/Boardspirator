(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;
					
					var bC				= 'backgroundColor';
					var iH				= 'innerHTML';
					var tL				= 'title';
					var tT				= 'tooltip';

					var ANNOYANCE_MOVES	= gio.config.style.annoyances.MOVES_AFTER_START_LIMIT;
					var ANNOYANCE_DURATION = gio.config.style.annoyances.DURATION_AFTER_START_LIMIT;
					var annoyance_count = 0;
					var annoyance_stop_time = -1;







	/// Displays game status 
	gio.draw_status = function( dont_redraw_won_status ) { 


		var gs		= gio.getgs();
		var gm		= gs.gm;
		if( !gm || gm.load !== 'finalized') {
			//. hides chaser
			gde.chaser.style.display = 'none'; //TODm allow help. Redesign GUI scenarios.
			gio.debly( "No GUI status. Malformed gm.");
			return;
		}
		gio.debly( "Drawing GUI status ... ");


		/// sets up limit only once
		if( annoyance_stop_time < 0 ) {
			annoyance_stop_time = ANNOYANCE_DURATION + (new Date()).getTime();
		} 

		//. visualizes dcenter for the first time after start up:
		gdr.dcenter.style.display = 'block';


		//: resets GUI and non-GUI album's title
		var album__cur	= gs.playalb;
		album__cur[tL]	= gio.gui.procs.get_master_title_from_session_state();
		gio.domwrap.headers.title_select_el[iH] = album__cur[tL];
		//.	TODm We need light-weight reset of dom-select-element-in-tp-package.
		//	Don't waste time resetting all the items. do we need to shake options?:
		//gio.domwrap.headers[tL]_select_el.reset(); 


		gio.core.procs.update_top_links();


		//.	visualizes ad if enabled,
		//	the only reason it is annoyingly here is
		//	that startup reset not able to fire add because ad wrapper is yet null
		gio.config.google_apps.reset_ad_visibility();




		//:	gets more info about map because it is loaded
		var gs		= gio.getgs();
		var round	= gs.round;
		var pos		= round.pos;


		//. unhides chaser
		gde.chaser.style.display = 'block';


		//: writes down who is a hero if acting-colonies are more than 1
		var ww = ( gm.actor_cols.length > 1 && gs.unit.col.focused && gs.unit.hname ) || ''; 
		gio.domwrap.status.unit_div[iH] = '<pre>' + ww + '</pre>';


		var dress = gm.dresses_wrap.chosen_dress;
		var dress_features = dress.features;

		/// shows statistics
		if( !dress_features || dress_features.statistics ) {
		
			//: shows statistics
			gde.interactionsNumber[iH]	= '' + round.interacts;
			gde.movesCount[iH]			= '' + round.current_pos_ix;
			gde.backsCount[iH]			= '' + round.backs;
			gde.pathCount[iH]			= '' + round.moves.length;

			gio.domwrap.status.main_status_div.style.display = "block";

		}else{

			gio.domwrap.status.main_status_div.style.display = "none";
		}


		// //\\ Solver ////
		//		Manages select-element lists and
		//		manages available events by setting titles
		var solo = gio.domwrap.cpanel.cont_rols.solver_control.arg.r.options;
		var msol = gm.solver;
		solo[1][tL] = "---";
		solo[2][tL] = "---";
		solo[3][tL] = "---";
		solo[4][tL] = "---";
		var mess_stub1 =	"Discards previous search data and releases its memory. " +
							"Searches on other maps are preserved and not affected.";

		if( msol.inactive_bf ) {
			solo[0][tL] = "Search First";
			solo[0][tT] = 'Searches and stops when first solution is found, ' + mess_stub1;
			solo[1][tL] = "Search All";
			solo[1][tT] = 'Does not stop when first solution is found, ' + mess_stub1;
			if( msol.stat && msol.stat.total_states > 1 ) {
				if( msol.space_exhausted() ) {
					solo[2][tL] = "Exhausted";
					solo[2][tT] = 'All positions reachable from start position are collected.';
				}else{
					solo[2][tL] = "Resume";
					solo[2][tT] = 'Resumes suspended search';
				}
			}
			if( msol.browser_mode ) {
				solo[3][tL] = "Go to Play";
				solo[3][tT] = 'Leaves solver browser and returns to palying game';
			}else if( msol.stat && msol.stat.total_states > 1 ) {
				solo[3][tL] = "Browse";
				solo[3][tT] = 'Browses collected positions space';
				solo[4][tL] = "Release Memory";
				solo[4][tT] =	'Deletes collected positions only for given map.' +
									'Does not release memory for searches made in other maps.';
			}
			gio.debsol( "Inactive solver statuses set for display" );
		}else if( msol.stopped_bf ) {
			solo[0][tL] = "Suspending ...";
			solo[1][tL] = "Suspending ...";
			solo[2][tL] = "Suspending ...";
		}else {
			//:: solver is active
			solo[0][tL] = "Suspend";
			solo[0][tT] = "Suspends search. Can be resumed later.";
			solo[1][tL] = "Suspend";
			solo[1][tT] = "Suspends search. Can be resumed later.";
			solo[2][tL] = "Suspend";
			solo[2][tT] = "Suspends search. Can be resumed later.";
		}
		gio.domwrap.cpanel.cont_rols.solver_control.reset();

		/// possibly fails when this sub. is inside of event-handler
		var ww = gio.domwrap.cpanel.cont_rols.solver_control.display;
		if( msol.inactive_bf && msol.solutions.length > 0 ) {
			ww[iH] = 'Solved';
		}else if( msol.inactive_bf && msol.stat && msol.stat.total_states > 1 ) {
			//. cleans up master title ... q&d?
			ww[iH] = 'Finished';
		}else{
			ww[iH] = 'Solver';
		}	


		//. reveals solver console
		gde.solver_cons.style.display =		msol.never_ran  ? 'none' : 'block';
		//.	amended
		//	gde.solver_cons.style.display =		msol.inactive_bf && !msol.browser_mode ? 
		//										'none' : 'block';

		if( !msol.never_ran ) gio.debsol( "Solver controls redrawn" );

		// \\// Solver ////





		// //\\ status color
		var ww_won = !dont_redraw_won_status ?  draw_decorations() : false;

		//. TODM why not use smaller box for indication ... 
		//	no need for 4 colors ... no box dimension? 
		//var ww_s = gio.domwrap.elems.chaser.style;

		var ww_s = document.body.style;
		var ww_c = gstyle.solver_color;
		if( msol.browser_mode ) {
			ww_s[bC] = ww_won ? ww_c.BROWSER_WON : ww_c.BROWSER;
		}else if( msol.inactive_bf ) {
			if( !ww_won ) ww_s[bC] = gstyle.rootColor;
		}else{
			ww_s[bC] = ww_won ? ww_c.SEARCHING_WON : ww_c.SEARCHING;
		}
		// \\// status color


		//. Manages Control panel buttons
		do_filter_features_display( gm, round );


		
		/// shows consoles
		if( !dress_features || dress_features.consoles ) {
			gde.con_div.style.display = "block";
		}else{
			gde.con_div.style.display = "none";
		}

	};// draw_status





	/// Blocks controls which are forbidden by dress or by playphase.
	//
	var do_filter_features_display = function ( gm, round ) {

		var dress = gm.dresses_wrap.chosen_dress;
		var dress_features = dress.features;
		var w_config = false;
		if( dress_features ) {
			var w_config = gio.config.style.features[ dress_features ];
		}
		var w_controls = gio.domwrap.cpanel.cont_rols;

		tp.core.each( w_controls, function ( name, vv ) {
			var do_display = "block";
			if( w_config ) {
				do_display = w_config.indexOf( '.' + name + '.' ) > -1 ? "block" : "none";
				// c onsole.log( name + ' ' + do_display );
			}


			// //\\		setting play-phase-depending visibility
			if( name === "forward" || name === "autoplay" ) {
				do_display = round.current_pos_ix < round.moves.length ? do_display : 'none';
			}

			if( name === "back" || name === "restart" ) {
				do_display = round.current_pos_ix > 0 ?		do_display : 'none'
			}

			if( name === "playpaths" ) {
				do_display = gm.playpaths ?	do_display : 'none';
			}

			// \\//		setting play-phase-depending visibility


			// c onsole.log( 'final: ' + name + ' ' + do_display );
			do_display = {c:{gui:{style :{wrapper:{ display : do_display }}}}};
			w_controls[name].reset( do_display );
		});
	}; /// Blocks controls which are forbidden by dress or by






	///	Purpose:	Predisplays winning/unwinning status and sugar caption-message,
	//				Blocks annoyances.
	//	Returns:	true for won, false for not or for "no objective defined"
	var draw_decorations = function () { 

		var gs			= gio.getgs();
		var gm			= gs.gm;
		var won_or_not	= gm.game.won_or_not;
		var pos			= gs.pos;
		var WCOLOR		= gstyle.WINNING_COLOR;
		var mcap		= gio.domwrap.headers.map_caption_div;


		//: stops show annoyances
		annoyance_count	+= 1;
		var show_annoynaces =	annoyance_count < ANNOYANCE_MOVES &&
								(new Date()).getTime() < annoyance_stop_time;
		//. stops show map caption
		mcap[iH]			=	show_annoynaces ? 'Map Level' : '';
		if( !show_annoynaces ) {
			gdr.dtopcenter.style.display = "none";
		}


		//. leaves if no objective defined:
		if( !won_or_not ) return false;
		var report = won_or_not();


		if(report){

			//: excites user by indicating winning state
			mcap[iH]				= 'Won';
			gde.con_div.style[bC]	= WCOLOR;
			gdr.dcenter.style[bC]	= WCOLOR;
			document.body.style[bC]	= WCOLOR;

		}else{

			//: restores colors broken by winning state
			gde.con_div.style[bC]				= gstyle.console[bC];
			gdr.dcenter.style[bC]				= gstyle.controls[bC];
			document.body.style[bC]				= gstyle.rootColor;

			/// sugarifies ... useless? // TODm annoying. Show in status table?:
			if( gio.debug ) {
				if(	pos.filled_units>0 &&
					pos.filled_units < gm.objective.necessary &&
					gio.modes.play !== 'autoplay'){
						gio.plcons_add(		'Completed '+ pos.filled_units +' goal(s) ... remains '+
											(gm.objective.necessary - pos.filled_units) + ' ...');
				}
			}
		}

		return report;
	};	///	Predisplays winning/unwinning status ...






	/// updates top links to related sites depending on login status
	gio.core.procs.update_top_links = function(){

		var gcl		= gio.config.links;
		var gsm		= gio.session.server.message;
		var mtit	= gio.session.server.top_menu_titles;
		var anchor	= '<a ' + gstyle.top_navig.link_style + ' href="';
		var target	= '" target="_blank" ';
		var w_p		= anchor + '#" onclick="jQuery.fn.tp$.gio.map_editors.';		
		
		if(gsm.loggedin){
			var logio	=	w_p + 'send_logout_request(); return false;" ' +
							mtit.logout_url;
		}else if( gio.modes.sta_tic.db ){
			var logio	=	w_p + 'invoke_login(); return false;" ' +
							mtit.login_url;
		}else{
			// .. in plain site .. point to remote db-login
			var logio	= anchor + gsm.login_url + target + mtit.login_url;
		}

		var craft		= gsm.craft_zone_url ? 
								anchor + gsm.craft_zone_url	+ target + mtit.craft_zone_url :
								'';

		if(gsm.hide_db_site_links) logio = '';
		if(gsm.hide_db_site_links) craft = '';

		var home = '';
		if(	(	!gio.config.feeder.exists || gio.config.query.aurl ) && 
				gsm.homehost && gsm.homepath
		) {
			//TODM will be faulty if feeder scenario changes in the future
			var home		=	anchor + 'http://' + gsm.homehost + '/' + gsm.homepath +
								target + mtit.home;
		}		

		/* //TODM do detect iframe and exclude_alubms and add home:
		if( window.location.hostname.toLowerCase() === gsm.homehost &&
			){
			home = '';
		}
		*/


		var howto		= anchor + gsm.howto		+ target + mtit.howto;

		var terms		= '';
		if( gio.config.feeder.exists ) {
			terms		= anchor + gio.config.feeder.url + '/' + gsm.terms + target + mtit.terms;
		}

		var dev			= anchor + gcl.dev_zone		+ target + mtit.dev
		var more		= anchor + gcl.more_zone	+ target + mtit.more;
		var credits		= anchor + 'javascript:jQuery.fn.tp$.gio.gui.procs.toggle_about_pane(); "' + mtit.credits;
	
		//gdr.dtopcenter[iH] = howto + home + logio + craft + dev + more + terms + credits;
		gdr.dtopcenter[iH] = howto + home + logio + craft + more + terms + credits;
	};/// updates top links to related sites ...




})();
