(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

	gio.init_round=function(gm, doreset){
		var game=gm.game;
		var collection=gm.collection;

		var rr=gm.rounds = gm.rounds || [];
		var r=round={};
		r.game_map=gm;
		r.moves=[];
		r.backs=0;
		r.pos=tp.core.tpaste([],gm.start_pos);
		r.fpos=tp.core.tclone(gm.pos);
	
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
					gio.cons('Know nothing about past game ...');
					return;
				}
				steps=moves[round.current_pos_ix-1];
				tp.core.each(steps,function(dummy,move){
					//c onsole.log('reverting',dummy,move);
					var pu=move.punit;

					//var pu=gm.units[step.uid];

					var colony_ix=pu.colony_ix;
					var unit_ix=pu.ix;
					var pos_unit=pos[colony_ix][unit_ix];
					pos_unit.x=pu.x;
					pos_unit.y=pu.y;
				});
				round.current_pos_ix--;
				round.backs++;
				if(gm.multiplayer)gio.virtual_scroll_colony('left');
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

	//====================================
	// Encoding path to text
	//====================================
	gio.set_round_to_beginning=function(gm,round){
		round.pos=$.extend(true,[],gm.start_pos);
		round.current_pos_ix=0;
		gio.skip_inactive_colony(gm,'right');	
	};


	//////////////////////////////////////
	//auxiliary sokoban text converters
	//====================================

	var DIRECTION={d : 2, u : -2, l : -1, r : 1}; //TODm rid
	var TOKEN_SEPARATOR = '|';
	var SUBTOKEN_SEPARATOR = '.';

	//====================================
	// Encoding path to text
	//====================================
	gio.path2text=function(round){
		var text='', count=0;
		var gm=round.game_map;
		var collection = gm.collection;
		var colonies=gm.colonies;
		var breed2symbol = gm.number_of_active_colonies>1 && collection.breed2symbol;
		tp.core.each(round.moves, function(ix,move){

			switch(move[0].direction){
				case -1:	c=l;
							break;
				case  1:	c=r;
							break;
				case -2:	c=u;
							break;
				case  2:	c=d;
							break;
			}
			//var c = move[0].direction.charAt(0);

			if(breed2symbol){
				// Colorban generalization:
				// If active breeds more than 1:

				var pu=move[0].punit;
				var colony_ix=pu.colony_ix;
				var name=colonies[colony_ix].nam;
				var symbol=breed2symbol[name];
				var unit_ix=pu.ix;
				text += TOKEN_SEPARATOR+symbol+SUBTOKEN_SEPARATOR+pu.ix+'.'
			}

			if(move.length>1)c=c.toUpperCase();
			text += c;
			count +=1;
			if((count === 15 && breed2symbol) || count === 40 ){
				count=0; text += "\n";
			} //sugar
		});
		return text;
	};
	gio.path2text_current=function(){
		return gio.gst(function(g,c,gm,r){
			return gio.path2text(r);
		});
	};

	//====================================
	// Decoding text to path
	//====================================
	gio.text2round=function(text_){
		var w;
		var game, collection, gm, round;
		gio.gst(function(g,c,m,r){	game=g; collection=c; gm=m; round=r; });

		var text=text_.replace(/\n|\r|\t| /g,'');
		var validator_msg='';
		var colonies=gm.colonies;


		gio.lock_controls('Validating playpath text ...'); //TODOnon-critical is this enouth? needs redesign
		gio.set_round_to_beginning(gm,round);

		var symbol2breed = gm.number_of_active_colonies>1 && collection.symbol2breed;
		var multiactor = (symbol2breed && text.indexOf(TOKEN_SEPARATOR) > -1);
		var splitter = multiactor ? TOKEN_SEPARATOR : ''
		var textArray = text.split(splitter);
		for(var i=0; i<textArray.length; i++){
			var token=textArray[i];
			if(token === '' )continue;
			
			var detoken;
			var colony;
			var unit_ix;
			var direction='missed';
			var directionSymbol='missed';
			if(multiactor){
				detoken=token.split(SUBTOKEN_SEPARATOR);
				var colonyName = symbol2breed[detoken[0]];
				if(!colonyName){
					validator_msg=	'No active breed exists for map symbol '+detoken[0] + "\n";
				}else if(!colonies[colonyName]){
					validator_msg=	'No such breed found in this map: '+colonyName + "\n";
				}else{
					colony=colonies[colonyName];
					if(isNaN(detoken[1])){
						validator_msg=	'Cannot interpret unit number.'+
										'Token in path='+token+'.' + "\n";
					}else{
						unit_ix=parseInt(detoken[1]);
						directionSymbol=detoken[2];
					}
				}
			}else{
				//c onsole.log('parsing monoactor');
				directionSymbol=token;
			}
			if(validator_msg){
				gio.cons_add(validator_msg);
			}else{
				direction=DIRECTION[directionSymbol.toLowerCase()];
				if(!direction){
					validator_msg += 'Cannot recognize symbol(s) "'+directionSymbol+'" in a map';
					gio.cons_add(validator_msg);
				}else{
					if(multiactor){
						validator_msg=gio.virtual_move(direction, true, colony, unit_ix);
					}else{
						validator_msg=gio.virtual_move(direction, true);
					}
				}
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

