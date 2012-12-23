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
	var are_positions_next_to_each_other=function(xcenter, ycenter, x, y){ 
		return 	(	Math.abs(xcenter-x) === 1 && ycenter === y ||
					Math.abs(ycenter-y) === 1 && xcenter === x    );
	};





	gio.gui.procs.move_acting_unit = function(direction, extra_key){
		var gs = gio.getgs();
		var gm = gs.gm;
		if(gm.solver.browser_mode){
			gm.solver.browser.do_move(direction, extra_key);
		}else{
			// Clear up c o n s o l e:
			gio.plcons('');
			var result = gio.do_process_move(direction, gm, gs.pos, gs.unit, 'do in gui' );
			if(!result) return false;
		}

		if(gm.game.won_or_not) {
			if(gm.game.won_or_not()){
				gio.config.google_apps.track.play_event('Playsession', 'Won');
			}
		}

		gio.draw_scene();
		gio.draw_status();
		return true;
	};



	// TODm make it: back_forward_start_reset_nothing
	navigm.back_forward_start = function(direction){
		gio.plcons('');
		var gm = gio.getgs().gm;
		gm.solver.browser_mode = false;
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
			gio.plcons('Selected '+ unit.hname);
		}else{
			gs.col.focused=false;
			gio.plcons('Unselected '+ gs.unit.hname);
		}
	};



	//=========================================================
	// Purpose:	recognize user's action
	// Used:	in mouse-click on cell in flat skin
	//=========================================================
	navigm.handle_click_on_flat_cell=function(unit){ //TODm overall scenario is still dim. Do make clear.

		var gs=gio.getgs();

		if(!gs.col){
			gio.plcons("No actors exist on this map.\n");
			return true; //respect other elements
		}

		var gm=gs.gm;
		var pos=gs.pos;

		//. shortcuts location which is selecter by user:
		var loc=pos.uid2loc[unit.id];

		if(gs.unit){
			// selected unit exists
			//. defines location of unit currently acting in active game
			var acting_loc=pos.uid2loc[gs.unit.id];

			if(acting_loc[0] === loc[0] && acting_loc[1] === loc[1]){
				// .. user clicked on "acting location"
				if(!gm.dresses_wrap.chosen_dress.playvigation.UNIT_IS_UNSELECTABLE){
					// .. somthing in background is the same that clicked on
					// * toggles it
					gs.col.focused = !gs.col.focused;
					gio.draw_scene();
					gio.draw_status('no_won_redraw');
				}
			}else{
				// try to act in direction to this cell
				if(gs.col.focused){
					if(are_positions_next_to_each_other(
						acting_loc[0], acting_loc[1],
						loc[0], loc[1] )
					){
						// User clicked on cell near an actor ... 
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

						// no actor on location pointed by user and location is far from acting actor
						//: apparently ... time to make loose "salvo" ...


						var virtual_pos = tp.core.clone_many( gs.pos );
						var virtual_move = gio.do_process_move(
								0, gm, virtual_pos, gs.unit, 
								'',				 //round_or_play_flag
								null, 			 //dont_change_pos_and_leave,
								true, 			 //forbid_contacts,
								loc[0],loc[1], 0 //dropx, dropy, dropz	// landed-cell coordinates
						);
						//var new_move=gio.prepare_step(0, gs.unit, move, 'dynamic_units_do_block');
						if(virtual_move) {
							// c onsole.log('virtual_move=',virtual_move);
							var virtual_pos = virtual_move.pos;

							var salvor = gio.solver.create_solver(gm);
							//salvor = gm.solver;
							var canon = salvor.adapter.createdNode( virtual_pos );
							// c onsole.log( canon );
							// now run the salvor and compare canons
							// salvor.fire_up(gs.round.pos, null, true, true);

						}else{
							gio.plcons(	
								unit.hname + " is out of immediate reach\n" +
								"of "+ gs.unit.hname + "\nTry to do more steps\n"
							);
						}
					}	
				}else{
					// .. focused only in background but pointed to different one
					if(gm.game.active_units_do_interact){
						var ww = false;
					}else{
						var ww = is_there_an_actor(loc[0],loc[1],gm, pos);
					}
					if(!ww && gio.debug) gio.plcons("No unit selected.\n");
				}
			}
		}else{
				// "Dead map". Nothing is selected.
				// Well, if there is an actor unit in this cell, do select it:
				if(!is_there_an_actor(loc[0],loc[1],gm, pos)){
					gio.plcons(	"Actor must be selected first\n" +
								"to do something at this cell on" + unit.hname);
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
		var stashed_map_ix = coll.map_ix;
		coll.map_ix = map_ix;
		if(!gio.session.reinit.rounds()){
			// ** reverts setting back
			coll.map_ix = stashed_map_ix;
			gio.cons_add( "Cannot land to invalid map " + map_ix + "."  );
			gio.gui.procs.unhide_current_dom_board();
		}
		gio.domwrap.headers.map_select_el.reset_choice(coll.map_ix);
		return true;
	};


})(jQuery);
