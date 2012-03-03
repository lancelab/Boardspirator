(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


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
					case 'i':	mkey='up';
								break;
					case 'j':	mkey='left';
								break;
					case 'k':	mkey='right';
								break;
					case 'm':	mkey='down';
								break;
					default	:	return true;
				}
			}
			return gio.move_unit(mkey);
		});
	}; //init_navigation


	gio.virtual_move=function(direction,virtual){
			var game, collection, gm, round, pos;
			gio.gst(function(g,c,m,r,p){	game=g; collection=c; gm=m; round=r; pos=p;   });

			var colony_ix=round.pos.colony_ix;
			var punits=pos[colony_ix];
			var ulen=punits.length;

				var new_position={pos:null,moves:[]} //TODm waste
				var skipped={};
				//skipped[colony_ix+' '+punits.selected]=true;
				if(!virtual)gio.cons('moving '+gio.human_name(gm.colonies[colony_ix], punits.selected)+' ... ');
				var msg=gio.check_collision(
					pos,colony_ix,punits.selected,
					direction,new_position,0,skipped);
				if(msg){
					gio.cons_add(msg);
					return msg;
				}
				if(game.herd_size>0){
					new_position=game.herd_rules(new_position.moves, new_position.pos);
				}
				delete round.pos; //TODm help collect garbage better
				round.pos=new_position.pos;
				////c onsole.log('new moves=',new_position.moves);
				gio.do_record(new_position.moves);
				if(gm.multiplayer)gio.virtual_select_colony('right');
				return '';
	};



	gio.move_unit=function(direction){
		var msg=gio.virtual_move(direction);
		if(msg) return false;
		gio.draw_scene();
		gio.draw_status();	
		return false;
	};


	gio.advance=function(punits,unit_ix,direction,new_position_wrap)
	{
				var u=punits[unit_ix];
				var xnew=x=u.x;
				var ynew=y=u.y;
				switch(direction)
				{
					case 'left':	if( x>0 ) xnew=x-1;
									break;
					case 'right':	xnew=x+1;
									break;
					case 'up'	:	if( y>0 ) ynew=y-1;
									break;
					case 'down':	ynew=y+1;
									break;
				}
				if(xnew === x && ynew === y) return null;
				var move={	x:x, y:y, direction:direction, xnew : xnew, ynew : ynew, 
							punit:u };
				new_position_wrap.moves.push(move);
				return {x : x, y : y, xnew : xnew, ynew : ynew, u : u };
	};


})(jQuery);
