(function( $ ){			
	var tp	=$.fn.tp$	= $.fn.tp$	|| {};	
	var gio	=tp.gio		= tp.gio 	|| {};

	gio.init_round=function(doreset)
	{
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix] ;

		var rr=gm.rounds = gm.rounds || [];
		var r=round={};
		r.moves=[];
		r.backs=0;
		r.pos=$.extend(true,[],gm.start_pos); //NOTE: jQ converts [] to {}?
		r.current_pos_ix=0;
		if(doreset && rr.length>0){
			rr[rr.length-1]=r;
			gio.cons('Current round cleaned up');
		}else{
			rr.push(r);
			gio.cons('Round '+(rr.length-1)+ ' created');
		}			
		rr.ix=rr.length-1;
		gio.skip_inactive_colony(gm,'right');
	};

	
	//Input     play_direction back,forward,''. '' for real step
	gio.do_record =	function(steps,play_direction)
	{
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix] ;


		var round=gm.rounds[gm.rounds.ix];
		var moves=round.moves;
		var steps;
		if(play_direction)
		{
			var pos=round.pos;
			if(play_direction==='back'){
				if(round.current_pos_ix===0){
					gio.cons('Know nothing aobut past game ...');
					return;
				}
				steps=moves[round.current_pos_ix-1];
				tp.core.each(steps,function(dummy,move){
					//c onsole.log('reverting',dummy,move);
					var pu=move.punit;
					var colony_ix=pu.colony_ix;
					var unit_ix=pu.ix;
					var pos_unit=pos[colony_ix][unit_ix];
					pos_unit.x=pu.x;
					pos_unit.y=pu.y;
				});
				round.current_pos_ix--;
				round.backs++;	
				gio.cons('Back to the beginning ...');
			}else if(play_direction==='forward'){
				if(round.current_pos_ix===moves.length){
					gio.cons('Cannot predict the future step ...');
					return;
				}
				steps=moves[round.current_pos_ix];
				tp.core.each(steps,function(dummy,move){
					//c onsole.log('reverting',dummy,move);
					var pu=move.punit;
					var colony_ix=pu.colony_ix;
					var unit_ix=pu.ix;
					var pos_unit=pos[colony_ix][unit_ix];
					pos_unit.x=move.xnew;
					pos_unit.y=move.ynew;
				});
				round.current_pos_ix++;
				round.backs--;	
				gio.cons('Forward to the end ...');
			}else if(play_direction==='to beginning'){
				round.backs+=round.current_pos_ix;
				round.pos=$.extend(true,[],gm.start_pos);
				round.current_pos_ix=0;
				gio.skip_inactive_colony(gm,'right');	
				gio.cons('returned to start of round');
			}
		}else{
			moves[round.current_pos_ix]=steps;
			round.current_pos_ix++;
			//remove obsolete positions:
			round.moves=moves.slice(0,round.current_pos_ix);
		}
	};


})(jQuery);

