(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

	gio.init_round=function(doreset){
		var game, collection, gm;
		gio.gst(function(g,c,m){ game=g; collection=c; gm=m; });

		var rr=gm.rounds = gm.rounds || [];
		var r=round={};
		r.moves=[];
		r.backs=0;
		r.pos=tp.core.tpaste([],gm.start_pos);
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
	gio.do_record =	function(steps,play_direction){

		var game, collection, gm, round;
		gio.gst(function(g,c,m,r){ game=g; collection=c; gm=m; round=r; });

		var moves=round.moves;
		var steps;
		if(play_direction){
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
				if(gm.multiplayer)gio.virtual_select_colony('left');
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
				//jump to beginning
				round.backs+=round.current_pos_ix;
				gio.set_round_to_beginning(gm,round);
				gio.cons_add('jumped to start of round');
			}
		}else{
			//ordinary move:
			moves[round.current_pos_ix]=steps;
			round.current_pos_ix++;
			//remove obsolete positions beyond current_pos_ix: 
			round.moves=moves.slice(0,round.current_pos_ix);
		}
	};

	gio.set_round_to_beginning=function(gm,round){
		round.pos=$.extend(true,[],gm.start_pos);
		round.current_pos_ix=0;
		gio.skip_inactive_colony(gm,'right');	
	};


	//////////////////////////////////////
	//auxiliary sokoban text converters
	//====================================
	gio.path2text=function(round){
		var text='', count=0;
		tp.core.each(round.moves, function(ix,move){
			var c = move[0].direction.charAt(0);
			if(move.length>1)c=c.toUpperCase();
			text += c;
			count +=1;
			if(count === 40){count=0; text += "\n";} //sugar
		});
		return text;
	};
	gio.path2text_current=function(){
		return gio.gst(function(g,c,gm,r){
			return gio.path2text(r);
		});
	};

	var DIRECTION={d : 'down', u : 'up', l : 'left', r : 'right'}; //TODm rid
	gio.text2round=function(text){
		var w;
		var game, collection, gm, round;
		gio.gst(function(g,c,m,r){	game=g; collection=c; gm=m; round=r; });
		var validator_msg='';

		gio.lock_controls('Validating playpath text ...');
		gio.set_round_to_beginning(gm,round);
		for(var i=0; i<text.length; i++){
			var c=text.charAt(i).toLowerCase();
			if(c==="\n")continue;
			w=DIRECTION[c];
			if(!w){
				validator_msg='cannot recognize symbol "'+c+'" in a map';
				gio.cons_add(validator_msg);
			}else{
				validator_msg=gio.virtual_move(w,true);
			}
			if(validator_msg){
				gio.cons_add('retrieved only '+round.moves.length+' moves');
				break;
			}
		}
		gio.do_record(null,'to beginning');
	};
	//====================================
	//auxiliary sokoban text converters
	//////////////////////////////////////


	//sugar: autoplays current round and draws autoplay on screen:
	gio.autoplay=function(time_interval_between_steps){
		var repeated_autoplay=function(){
			if(gio.play_mode!=='autoplay')return;
	
			var game, collection, gm, round;
			gio.gst(function(g,c,m,r){	game=g; collection=c; gm=m; round=r; });
	
			if(round.current_pos_ix<round.moves.length){
				gio.do_record(null,'forward');
				gio.draw_scene();
				gio.draw_status();
				setTimeout(repeated_autoplay,time_interval_between_steps);
			}else{
				gio.play_mode=''
			}
		};
		repeated_autoplay();
	};

})(jQuery);

