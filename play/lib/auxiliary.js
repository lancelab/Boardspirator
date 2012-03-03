(function( $ ){ 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;


	//aux
	gio.aux = gio.aux || {};

	//TODm design event model better to remove this:
	//popup protection against closing by own click:
	gio.aux.common_popup_shown=true;
	var unlock_popup=function(){gio.aux.common_popup_shown=true;};
	gio.prolong_common_popup=function(){
		if(gio.common_popup.isVisible()){
			gio.aux.common_popup_shown=false;
			setTimeout(unlock_popup,1000);
		}
	};

	//gio game state - shortcut to get current framework-state
	gio.gst=function(callback){
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];
		var colonies=gm.colonies;
		var round=gm.rounds && gm.rounds[gm.rounds.ix];
		var pos=round && round.pos;
		return callback(game,collection,gm,round,pos,colonies);
	};

	gio.toggle_help=function(){
		var game=gio.games[gio.game_ix];
		gio.common_popup.dotoggle({
				owner:'help',
				innerHTML:	'<pre>'+gio.help+
							"\n\nRules: \n"+game.rules+
							"\n\nObjective: \n"+game.objective+
							"\n"+'</pre>'
		});
		gio.prolong_common_popup();
	};


	//some colonies are disabled in play mode ... weed them out:
	//loop through all and find active index:
	gio.skip_inactive_colony=function(gm,direction)
	{
			if(gio.modes[gm.mode_ix]==='edit')return;

			var len=gm.colonies.length;
			var pos=gm.rounds[gm.rounds.ix].pos;
			var ix=pos.colony_ix;

			for(var i=0; i<len; i++)
			{
				if(!gm.colonies[ix].frozen && !gm.colonies[ix].passive)
				{
					pos.colony_ix=ix;					
					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					ix=(ix+len-1)%len;
				}else{
					ix=(ix+1)%len;
				}
			}
	};

	gio.virtual_select_colony=function(pointer){
		var game, collection, gm, round, pos;
		gio.gst(function(g,c,m,r,p){	game=g; collection=c; gm=m; round=r; pos=p;   });

		var len=gm.colonies.length;

		var ix=pos.colony_ix;
		if(  pointer === 'left' || pointer === 'up'   ){
			ix=(ix+len-1)%len;
		}else{
			ix=(ix+1)%len;
		}
		pos.colony_ix=ix;
		gio.skip_inactive_colony(gm,pointer);
	};


	////////////////////////////////////
	//lock and unlock controls
	//==================================
	//lock and show message:
	gio.lock_controls=function(msg){
		//gio.cons_add('locking ...');
		if(!gio.initiating_a_game_flag){
			gio.modal_message_popup.show({innerHTML: (msg || '')});
			gio.initiating_a_game_flag=true;
		}
	};
	gio.unlock_controls=function(){
		//gio.cons_add('unlocking ...');
		gio.initiating_a_game_flag=false;
		gio.modal_message_popup.hide();
	};
	////////////////////////////////////


	//Purpose:	select active unit and redraw scene and status
	//Used:		in mouse-dblclick on unit
	gio.select_active_unit=function(colony_ix, unit_ix){
		var pos;
		gio.gst(function(g,c,m,r,p){pos=p;});
		pos.colony_ix=colony_ix;
		pos[pos.colony_ix].selected=unit_ix;
		gio.draw_scene();
		gio.draw_status('hide_won_status');
		return true;
	};

	//Purpose:	recognize user's action
	//Used:		in mouse-click on unit
	gio.handle_click_on_unit=function(colony_ix, unit_ix){
		gio.gst(function(game,collection,gm,round,pos,colonies){
			var pointed_units	= pos[colony_ix];
			var pointed_unit	= pointed_units[unit_ix];

			// First, check is there active unit nearby:
			var punits		= pos[pos.colony_ix];
			var active_ix	= punits.selected;
			var active_unit	= punits[active_ix];
			
			if(is_in_pusher_position( active_unit.x, active_unit.y, pointed_unit.x, pointed_unit.y )){
				var direction='';
				if(active_unit.x === pointed_unit.x ){
					direction = active_unit.y > pointed_unit.y  ? 'up' : 'down';
				}else{
					direction = active_unit.x > pointed_unit.x  ? 'left' : 'right';
				}
				return gio.move_unit(direction);
			}

			// Well, if there is an active unit in this cell, do select it:
			// The slow ugly way is to loop: ... TODm fix
			var activity_role=game.activity_role;
			var new_selected_colony_ix=-1;
			var new_selected_unit_ix=-1;
			var x=pointed_unit.x;
			var y=pointed_unit.y;
			ceach(pos, function(test_col_ix, test_units){
				var nam=colonies[test_col_ix].nam;
				ceach(test_units, function(test_unit_ix, test_unit){
					if(	test_unit.x === x && test_unit.y === y  && 
						activity_role[nam] === 'active'){
						//gio.cons_add( test_unit_ix, test_unit);
						//this is what perhaps user wants:
						new_selected_colony_ix=test_col_ix;
						new_selected_unit_ix=test_unit_ix;
						return false;
					}
				});
				if(new_selected_colony_ix>-1) return false;
			});

			if(new_selected_colony_ix>-1){
				//gio.cons_add(	new_selected_colony_ix, new_selected_unit_ix);
				//do select unit:
				pos.colony_ix=new_selected_colony_ix;
				pos[pos.colony_ix].selected=new_selected_unit_ix;
				gio.cons('Selected '+ gio.human_name(colonies[pos.colony_ix],new_selected_unit_ix));
				gio.draw_scene();
				gio.draw_status('hide_won_status');
			}
			return true;
		});
	};


	//auxiliary:
	var is_in_pusher_position=function(xcenter, ycenter, x, y){ 
		return 	(	Math.abs(xcenter-x) === 1 && ycenter === y ||
					Math.abs(ycenter-y) === 1 && xcenter === x    );
	};



})(jQuery);
