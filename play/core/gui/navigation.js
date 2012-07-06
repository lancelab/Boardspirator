(function( $ ){ 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach  	=  tp.core.each;
					var navigm	=  gio.navig.in_map;


	// ================================
	// Acts:	selects actor if found
	// Returns: actor unit if found
	// ================================
	var is_there_an_actor=function(x, y, gm, pos){

		var tower = gm.loc2lid[x][y];

		// Well, if there is an active unit in this cell, return it:
		for(var zz=0; zz<tower.length; zz++){
			var lid = tower[zz];
			var uid = pos.lid2uid[lid];
			if(uid<0) continue;
			var unit = gm.units[uid];
			if( unit.activity.active ){
				navigm.toggle_unit_selection(unit);
				gio.draw_scene();
				gio.draw_status('hide_won_status'); //TODm meaning?
				return unit;
			}
		}
		return null;
	};



	//auxiliary:
	var is_active_unit_in_pusher_position=function(xcenter, ycenter, x, y){ 
		return 	(	Math.abs(xcenter-x) === 1 && ycenter === y ||
					Math.abs(ycenter-y) === 1 && xcenter === x    );
	};





	gio.gui.procs.move_acting_unit = function(direction){
		var gs=gio.getgs();
		if(gio.solver.browser_mode){
			gs.gm.solver.browser.do_move(direction);
		}else{
			// Clear up console:
			gio.cons('');
			var result = gio.do_move_steps(direction, gs.gm, gs.pos, gs.unit, 'do in gui' );
			if(!result) return false;
		}
		gio.draw_scene();
		gio.draw_status();
		return true;
	};



	// TODm make it: back_forward_start_reset_nothing
	navigm.back_forward_start = function(direction){
		gio.cons('');
		var gm=gio.getgs().gm;
		gio.solver.set_browser_mode(false);
		if( direction === 'do reset' ){
			gio.navig.in_session.round.init_round(gm, 'do reset');
		}else if(direction !== ''){
			gio.gui.procs.do_manage_round(null,direction);
		}
		gio.draw_scene();
		gio.draw_status();
	}





	// Input:	nothing -	drops off gs.col.focused flag, but 
	//						does not change acting_col and acting_unit
	//			unit -		drops off gs.col.focused flag and
	//						moves background focus to supplied unit
	navigm.toggle_unit_selection=function(unit){
		var gs=gio.getgs();
		if(unit){
			navigm.toggle_unit_selection();
			var col = gs.gm.acting_col = unit.col;
			col.acting_unit = unit;
			col.focused = true;
			if(gio.debug) gio.cons('Selected '+ unit.hname);
		}else{
			gs.col.focused=false;
			if(gio.debug) gio.cons('Unselected '+ gs.unit.hname);
		}
	};



	//=========================================================
	// Purpose:	recognize user's action
	// Used:	in mouse-click on cell in flat skin
	//=========================================================
	navigm.handle_click_on_flat_cell=function(unit){

		var gs=gio.getgs();

		if(!gs.col){
			gio.cons("No actors exist on this map.\n");
			return true; //respect other elements
		}

		var gm=gs.gm;
		var pos=gs.pos;
		var loc=pos.uid2loc[unit.id];

		if(gs.unit){
			// .. something is selected in background
			var acting_loc=pos.uid2loc[gs.unit.id];

			if(acting_loc[0] === loc[0] && acting_loc[1] === loc[1]){
				// .. somthing in background is the same that clicked on
				// * toggle it
				gs.col.focused = !gs.col.focused;
				// navigm.toggle_unit_selection( (gs.col.focused ? null : gs.unit)  );
				gio.draw_scene();
				gio.draw_status('no_won_redraw');
			}else{
				// try to act in direction to this cell
				if(gs.col.focused){
					if(is_active_unit_in_pusher_position(
						acting_loc[0], acting_loc[1],
						loc[0], loc[1] )
					){
						// User clicked on empty cell near an actor ... 
						// do move actor:
						var direction='';
						if(acting_loc[0] === loc[0] ){
							direction = acting_loc[1] > loc[1]  ? -2 : 2;
						}else{
							direction = acting_loc[0] > loc[0]  ? -1 : 1;
						}
						if(!gio.gui.procs.move_acting_unit(direction)){
							// Move failed. Perhaps there is an actor in the 
							// target position. Check and select it:
							is_there_an_actor(loc[0],loc[1],gm, pos);
						};
						return true;
					}else if(!is_there_an_actor(loc[0],loc[1],gm, pos)){
						gio.cons(	
								unit.hname + " is out of immediate reach\n" +
								"of "+ gs.unit.hname + "\nTry to do more steps\n"
						);
					}	
				}else{
					// .. focused only in background but pointed to different one
					if(gm.game.active_units_do_interact){
						var ww = false;
					}else{
						var ww = is_there_an_actor(loc[0],loc[1],gm, pos);
					}
					if(!ww && gio.debug) gio.cons("No unit selected.\n");
				}
			}
		}else{
				// "Dead map". Nothing is selected.
				// Well, if there is an actor unit in this cell, do select it:
				if(!is_there_an_actor(loc[0],loc[1],gm, pos)){
					gio.cons("Actor must be selected first\n"+ "to do something at this cell on" + unit.hname);
				}
		}//... is any unit of active colony selected?
		return true; //respect elements nearby
	};//handle_click_on_flat_cell





	navigm.scroll_colony=function(pointer){
		gio.do_one_scroll_of_colony();
		gio.draw_scene();
		gio.draw_status();
		return false;				
	};

	gio.navig.do_land_to_map=function(coll, map_ix){
		if(coll.maps.length === 1 && coll.map_ix === 0) return true;
		if(0 > map_ix || map_ix >= coll.maps.length) return false;
		gio.gui.procs.hide_current_board();
		coll.map_ix = map_ix;
		gio.session.reinit.rounds();
		gio.domwrap.headers.map_select_el.reset_choice(coll.map_ix);
		return true;
	};


})(jQuery);
