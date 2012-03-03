(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.init_navigation=function()
	{
		//moving unit
		tp.bindEvents('keydown', function(arg){
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


		gio.move_unit=function(direction)
		{
			var game=gio.games[gio.game_ix];
			var gm=game.maps[game.map_ix] ;

			var round=gm.rounds[gm.rounds.ix];
			var colony_ix=round.pos.colony_ix;
			var pos=round.pos;
			var punits=pos[colony_ix];
			var ulen=punits.length;

				var new_position={pos:null,moves:[]} //TODm waste
				var skipped={};
				//skipped[colony_ix+' '+punits.selected]=true;
				gio.cons('moving '+gm.colonies[colony_ix].nam+' '+punits.selected+' ... ');
				var msg=gio.check_collision(
					pos,colony_ix,punits.selected,
					direction,new_position,0,skipped);
				if(msg){
					gio.cons_add(msg);
					return false; //true; //skip event, but can annoy by window shift
				}
				if(game.extra_rules){
					new_position=game.extra_rules(new_position.moves, new_position.pos);
				}
				delete round.pos; //TODm help collect garbage better
				round.pos=new_position.pos;
				////c onsole.log('new moves=',new_position.moves);
				gio.do_record(new_position.moves);
				gio.draw_scene();
				gio.draw_report();	
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
