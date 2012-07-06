(function( $ ){ 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;




	gio.init_navigation=function()
	{
		//moving unit
		tp.bindEvents('keydown', function(arg){

			//brute solution: forbid everything ... good and bad if in transit: ...
			if(gio.initiating_a_game_flag)return true;

			//no controlling and playing when common popups are on:
			if(gio.common_popup.isVisible())return true;

			if(	arg.event.ctrlKey || arg.event.shitKey ||
				arg.event.altKey )return true;
			var mkey=arg.keyName;
			if(!arg.arrow){
				switch(arg.keyName){
					case 'i':	mkey=-2;
								break;
					case 'j':	mkey=-1;
								break;
					case 'k':	mkey=1;
								break;
					case 'm':	mkey=2;
								break;
					default	:	return true;
				}
			}else{
				switch(arg.keyName){
					case 'up':		mkey=-2;
									break;
					case 'left':	mkey=-1;
									break;
					case 'right':	mkey=1;
									break;
					case 'down':	mkey=2;
									break;
					default	:	return true;
				}
			}
			return gio.move_unit(mkey);
		});
	}; //init_navigation




	gio.move_unit=function(direction){
		var msg=gio.virtual_move(direction);
		if(msg) return false;
		gio.draw_scene();
		gio.draw_status();	
		return false;
	};



	//=========================================================
	// Purpose:	recognize user's action
	// Used:	in mouse-click on cell in flat skin
	//=========================================================
	gio.handle_click_on_flat_cell=function(
					colony_ix, unit_ix, //rid
					uid
		){
		
		gio.gst(function(game,collection,gm,round,pos,colonies){

			var pointed_unit	= gm.units[uid];
			var pointed_human	= pointed_unit.hname;
			var pointed_colony	= gm.colonies[pointed_unit.cid];

			//rid
			var pointed_units	= pos[colony_ix];
			pointed_unit	= pointed_units[unit_ix];
			pointed_human	= gio.human_name(colonies[colony_ix],unit_ix);


			var fpos=round.fpos;
			var acting_cid = gm.acting.cid;
			// need?:
			var acting_col = gm.colonies[acting_cid];
			var acting_uid = gm.acting.cols[acting_cid].uid;
			var active_unit	= acting_uid > -1 ? null : gm.units[acting_uid];
			var active_ix = acting_uid > -1 ? gm.units[acting_uid].ix : -1;


			var punits			= pos[pos.colony_ix];
			active_ix			= punits.selected;  //rid
			active_unit			= (active_ix > - 1) && punits[active_ix];

			var try_to_move_active_unit = false;

			if(active_ix > -1 ){ //... is any unit of active colony selected?
				var active_human=gio.human_name(colonies[pos.colony_ix],active_ix);

				if(active_unit.x == pointed_unit.x && active_unit.y == pointed_unit.y){
					if(	gm.number_of_active_colonies > 1 || gm.multiplayer){
						// unselect unit and leave
						punits.former_selected_unit_ix = punits.selected;
						punits.selected = -1;
						gio.cons('Unselected '+ active_human);
						gio.draw_scene();
						gio.draw_status('hide_won_status');
					}
				}else{
					// try to act in direction to this cell
					if(is_active_unit_in_pusher_position( active_unit.x, active_unit.y, pointed_unit.x, pointed_unit.y )){
						var direction='';
						if(active_unit.x === pointed_unit.x ){
							direction = active_unit.y > pointed_unit.y  ? -2 : 2;
						}else{
							direction = active_unit.x > pointed_unit.x  ? -1 : 1;
						}
						return gio.move_unit(direction);
					}else{
						if(!is_there_an_actor(
							pointed_unit.x,pointed_unit.y,game,colonies,pos,'do_select'
						)){
							gio.cons(	
								"There is nothing "+active_human+"\ncan do at this cell on " + pointed_human
							);
						}	
					}
				}
				return true; //respect elements nearby
			}else{
				// "Dead map". Nothing is selected.
				// Well, if there is an actor unit in this cell, do select it:
				if(!is_there_an_actor(
					pointed_unit.x,pointed_unit.y,game,colonies,pos,'do_select'
				)){
					gio.cons("Actor must be selected first\n"+ "to do something at this cell on" + pointed_human);
				}
				return true; //respect elements nearby
			}//... is any unit of active colony selected?
		});
	};


	// Acts:	selects actor if found
	// Returns: [actot_colony_ix, actot_unit_ix] if if found
	//			null overwise
	var is_there_an_actor=function(x,y,game,cols,pos,do_select_if_found){
				// Well, if there is an active unit in this cell, 
				// return it:
				// The slow ugly way is to loop: ... TODm fix
				var activity_role=game.activity_role;
				var actot_colony_ix=-1;
				var actot_unit_ix=-1;
				ceach(pos, function(test_col_ix, test_units){
					var nam=cols[test_col_ix].nam;
					ceach(test_units, function(test_unit_ix, test_unit){
						if(	test_unit.x === x && test_unit.y === y  && 
							activity_role[nam] === 'active'){
							//gio.cons_add( test_unit_ix, test_unit);
							//this is what perhaps user wants:
							actot_colony_ix=test_col_ix;
							actot_unit_ix=test_unit_ix;
							return false;
						}
					});
					if(actot_colony_ix>-1) return false;
				});

				if(do_select_if_found && actot_colony_ix > -1){
					pos.colony_ix=actot_colony_ix;
					

					pos[pos.colony_ix].selected=actot_unit_ix;
					gio.cons('Selected '+ gio.human_name(cols[actot_colony_ix],actot_unit_ix));
					gio.draw_scene();
					gio.draw_status('hide_won_status');
					return [actot_colony_ix, actot_unit_ix];
				}
				return null;
	};

	//auxiliary:
	var is_active_unit_in_pusher_position=function(xcenter, ycenter, x, y){ 
		return 	(	Math.abs(xcenter-x) === 1 && ycenter === y ||
					Math.abs(ycenter-y) === 1 && xcenter === x    );
	};
})(jQuery);
