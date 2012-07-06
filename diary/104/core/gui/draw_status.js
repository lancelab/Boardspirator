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
		var gs=gio.getgs();
		var gm=gs.gm;

		var round=gs.round;
		var pos=round.pos;

		var unit=gm.unit;

		// ** Main header
		var bundle = gm.collection.plalb;
		bundle.title = gio.gui.procs.calculate_game_titile_from_names(gm.game.nam, bundle.album_name);
		gio.domwrap.headers.title_select_el.reset(); // TODO do we need to shake options?:

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



		// ** Solver
		var gmtitle = '"'+gm.title+'"';
		var disp = gio.gui.solver_select_el.display;
		w = 'none';
		if(gm.solver.stopped){
			disp.title='starts Solver at map '+gmtitle;
			disp.innerHTML='Start Solver';
			if( gm.solver.stat.total_states > 1 ) w = 'block';
		}else{
			disp.title='stops Solver at map '+gmtitle;
			disp.innerHTML='Stop Solver';
		}
		ww = gio.solver.browser_mode ? 'Go to Play' : 'Browse Solver';
		w = { c:{gui:{style :{wrapper:{display:w}}}},  r : { options : [ {	title : ww } ] } };
		gio.controls.browse_solver.reset(w);




		w = round.current_pos_ix < round.moves.length ? 'block' : 'none';
		w = {c:{gui:{style :{wrapper:{display:w}}}}};
		gio.controls.move_forward.reset(w);
		gio.controls.autoplay.reset(w);

		w = round.current_pos_ix > 0 ? 'block' : 'none';
		w = {c:{gui:{style :{wrapper:{display:w}}}}};
		gio.controls.move_back.reset(w);
		gio.controls.restart.reset(w);


		// Visualize div for the first time after start up:
		gdr.dcenter.style.display = 'block';

	};




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
				pos.filled_units !== gm.necessary_to_fill &&
				gio.modes.play !== 'autoplay'){

				// TODm annoying. Show in status table?:
				gio.cons(	'Completed '+ pos.filled_units +' goal(s) ... remains '+
							(gm.necessary_to_fill - pos.filled_units) + ' ...');
			}
		}
	};

})(jQuery);
