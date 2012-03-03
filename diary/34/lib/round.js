(function( $ ){			
	var tp	=$.fn.tp$	= $.fn.tp$	|| {};	
	var gio	=tp.gio		= tp.gio 	|| {};

	gio.init_round=function(doreset)
	{
		var gm=gio.games[gio.game_ix];
		var rr=gm.rounds = gm.rounds || [];
		var r=round={};
		r.moves=[];
		r.backs=0;
		r.pos=$.extend(true,[],gm.start_pos); //NOTE: jQ converts [] to {}?
		if(doreset && rr.length>0){
			rr[rr.length-1]=r;
		}else{
			rr.push(r);
		}			
		rr.ix=rr.length-1;
	};

	
	gio.do_record =	function(steps,goback)
	{
		var gm=gio.games[gio.game_ix];
		var round=gm.rounds[gm.rounds.ix];
		var moves=round.moves;
		if(goback)
		{
			if(moves.length===0){
				gio.console('Who can tell me, where was I before my birthday? ...');
				return;
			}
			var steps=moves[moves.length-1];
			//revert position:
			var pos=round.pos;
			tp.core.each(steps,function(dummy,move){
				var pu=move.punit;
				var colony_ix=pu.colony_ix;
				var unit_ix=pu.ix;
				var pos_unit=pos[colony_ix][unit_ix];
				pos_unit.x=pu.x;
				pos_unit.y=pu.y;
			});
			moves.pop();
			round.backs++;	
		}else{
			moves.push(steps);
		}
	};

	//TODO stub:
	gio.do_replay =	function(round_ix,direction)
	{
				

	};

})(jQuery);

