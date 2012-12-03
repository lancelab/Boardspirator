(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;

					
					var STOP_ANNOYANCE = 15; // Stops showing map caption after this number
					var annoyance_count = 0;




	// =================================
	// Displays game status 
	// =================================
	gio.draw_status=function(dont_redraw_won_status){ 

		var w,ww;

		var gs		= gio.getUnfinishedState();
		var gm		= gs.gm;

		// * visualizes dcenter for the first time after start up:
		gdr.dcenter.style.display = 'block';

		// ** ? resets headers
		var bundle = gm.collection.album;
		bundle.title = gio.gui.procs.calculate_game_titile_from_names(gm.game.nam, bundle.album_name);
		gio.domwrap.headers.title_select_el.reset(); // TODm do we need to shake options?:

		gio.core.procs.update_top_links();

		// *	visualizes ad if enabled,
		//		the only reason it is annoyingly here is
		//		that startup reset not able to fire add because ad wrapper is yet null
		gio.config.google_apps.reset_ad_visibility();



		if(gm.load !== 'finalized'){
			// * hides chaser
			gde.chaser.style.display = 'none'; //TODm allow help. Redesign GUI scenarios.
			return;
		}
		// * unhides chaser
		gde.chaser.style.display = 'block';


		var gs		= gio.getgs();
		var round	= gs.round;
		var pos		= round.pos;
		var unit	= gm.unit;


		// Interacts info
		gde.interactionsNumber.innerHTML=''+round.interacts;

		if(gm.actor_cols.length > 1){
			w= unit ? 'Hero: ' +unit.hname : '';
		}else{
			w='';
		}
		gio.domwrap.status.unit_div.innerHTML='<pre>'+w+'</pre>';
		
		
		//===== stat ============================
		// TODm?:
		//w= gm.multiplayer ? ' Players' : '';
		//ww= gm.multiplayer ? '  '+gm.multiplayer : '';

		gde.movesCount.innerHTML=''+round.current_pos_ix;
		gde.backsCount.innerHTML=''+round.backs;
		gde.pathCount.innerHTML=''+round.moves.length;
		//===== stat end ============================


		if(!dont_redraw_won_status)gio.draw_won_or_not();



		// ////////////////////////////////////
		// Control panel buttons manager
		// ////////////////////////////////////



		// //\\ solver ////

		var solo = gio.gui.solver_select_el.arg.r.options;
		var msol = gm.solver;
		solo[1].title = "---";
		solo[2].title = "---";
		solo[3].title = "---";
		solo[4].title = "---";
		var mess_stub1 =  "Discards previous search data and releases its memory. Searches on other maps are preserved and not affected.";

		if( msol.inactive_bf ) {
			solo[0].title = "Search First";
			solo[0].tooltip = 'Searches and stops when first solution is found, ' + mess_stub1;
			solo[1].title = "Search All";
			solo[1].tooltip = 'Does not stop when first solution is found, ' + mess_stub1;
			if( msol.stat && msol.stat.total_states > 1 ) {
				if( msol.space_exhausted() ) {
					solo[2].title = "Exhausted";
					solo[2].tooltip = 'All positions reachable from start position are collected.';
				}else{
					solo[2].title = "Resume";
					solo[2].tooltip = 'Resumes suspended search';
				}
			}
			if( msol.browser_mode ) {
				solo[3].title = "Go to Play";
				solo[3].tooltip = 'Leaves solver browser and returns to palying game';
			}else if( msol.stat && msol.stat.total_states > 1 ) {
				solo[3].title = "Browse";
				solo[3].tooltip = 'Browses collected positions space';
				solo[4].title = "Release Memory";
				solo[4].tooltip = 'Deletes collected positions only for given map. Does not release memory for searches made in other maps.';
			}
		}else if( msol.stopped_bf ) {
			solo[0].title = "Suspending ...";
			solo[1].title = "Suspending ...";
			solo[2].title = "Suspending ...";
		}else {
			//:: solver is active
			solo[0].title = "Suspend";
			solo[0].tooltip = "Suspends search. Can be resumed later.";
		}
		gio.gui.solver_select_el.reset();
		//. reveals solver console
		gde.solver_cons.style.display =		msol.inactive_bf && !msol.browser_mode ? 
											'none' : 'block';

		/// possibly fails when this sub. is inside of event-handler
		var ww = gio.gui.solver_select_el.display;
		if( msol.inactive_bf && msol.solutions && msol.solutions.length > 0 ) {
			ww.innerHTML = 'Solved';
		}else if( msol.inactive_bf && msol.stat && msol.stat.total_states > 1 ) {
			//. cleans up master title ... q&d?
			ww.innerHTML = 'Finished';
		}else{
			ww.innerHTML = 'Solver';
		}	

		// \\// solver ////




		w = round.current_pos_ix < round.moves.length ? 'block' : 'none';
		w = {c:{gui:{style :{wrapper:{display:w}}}}};
		gio.controls.move_forward.reset(w);
		gio.controls.autoplay.reset(w);

		w = round.current_pos_ix > 0 ? 'block' : 'none';
		w = {c:{gui:{style :{wrapper:{display:w}}}}};
		gio.controls.move_back.reset(w);
		gio.controls.restart.reset(w);

	};// draw_status




	// =================================
	// Displays winning/unwinning status 
	// =================================
	gio.draw_won_or_not=function(){ 

		var w;
		var gs = gio.getgs();
		var game = gs.gm.game;
		var gm = gs.gm;
		var pos = gs.pos;

		var WCOLOR = gstyle.WINNING_COLOR;

		//do nothing if "no rules":
		if(!game.won_or_not)return;

		var report=game.won_or_not();

		if(report){
			gio.domwrap.headers.map_caption_div.innerHTML		= 'Won';
			gde.con_div.style.backgroundColor	= WCOLOR;
			gdr.dcenter.style.backgroundColor	= WCOLOR;
			document.body.style.backgroundColor	= WCOLOR;
		}else{
			annoyance_count += 1;
			var ww = annoyance_count < STOP_ANNOYANCE ? 'Map Level' : '';
			gio.domwrap.headers.map_caption_div.innerHTML	= ww;
			gde.con_div.style.backgroundColor				= gstyle.console.backgroundColor;
			gdr.dcenter.style.backgroundColor				= gstyle.controls.backgroundColor;
			document.body.style.backgroundColor				= gstyle.rootColor;

			//sugar:
			if(	pos.filled_units>0 &&
				pos.filled_units !== gm.objective.necessary &&
				gio.modes.play !== 'autoplay'){

				// TODm annoying. Show in status table?:
				if( gio.debug ) {
						gio.plcons_add(	'Completed '+ pos.filled_units +' goal(s) ... remains '+
								(gm.objective.necessary - pos.filled_units) + ' ...');
				}
			}
		}
	};





	// ** updates top links to related sites depending on login status
	gio.core.procs.update_top_links = function(){

		var gcl		= gio.config.links;
		var gsm		= gio.session.server.message;
		var mtit	= gio.session.server.top_menu_titles;
		var anchor	= '<a ' + gstyle.top_navig.link_style + ' href="';
		var target	= '" target="_blank" ';
		
		if(gsm.loggedin){
			var logio	=	anchor + '#' +
							'" onclick="jQuery.fn.tp$.gio.map_editors.send_logout_request(); return false;" ' +
							mtit.logout_url;
		}else if( gio.modes.sta_tic.db ){
			var logio	=	anchor + '#' +
							'" onclick="jQuery.fn.tp$.gio.map_editors.invoke_login(); return false;" ' +
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
		if( !gio.config.feeder.exists || gio.config.query.aurl ) {
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
	
		//gdr.dtopcenter.innerHTML = howto + home + logio + craft + dev + more + terms + credits;
		gdr.dtopcenter.innerHTML = howto + home + logio + craft + more + terms + credits;
	};



})(jQuery);
