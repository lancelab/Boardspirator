(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;
					var rman	=  gio.navig.in_session.round;


	// For sokoban text converters:
	var DIRECTION={d : 2, u : -2, l : -1, r : 1}; //TODm rid
	var TOKEN_SEPARATOR = '|';
	var SUBTOKEN_SEPARATOR = '.';



	//====================================
	// Shortcut 
	//====================================
	var set_round_to_beginning=function(round){
		// ** Cosmetics
		round.backs+=round.current_pos_ix;
		round.interacts = 0;

		delete round.pos;  //TODm memory leak
		round.pos=tclone(round.start_pos);
		round.current_pos_ix=0;
	};




	rman.create=function(gm, pos, round_ix){
		var round = {};
		round.gm = gm;
		round.moves = [];
		round.pos = pos || tclone(gm.pos);
		round.start_pos = tclone(round.pos);	
		round.current_pos_ix=0;
		// Cosmetics:
		round.backs = 0;
		round.interacts = 0;
		return round;
	};


	rman.set_gui_title=function(round, round_ix){
		if( !round_ix && round_ix !== 0) round_ix = round.gm.rounds.ix;
		round.title = 'Round '+ round_ix;
		round.tooltip = 'Pickup the round';
	};
	

	// Action:	manages rounds at supplied gm
	//			gm and pos are not bound to current gameplay
	//
	// Input:	if doreset, cleans up current round,
	//			if not, adds a new round.
	//			if "pos" is supplied, then
	//			starting point of the path it is set to it.
	rman.init_round=function(gm, doreset, pos)
	{
		var game	= gm.game;
		var round	= rman.create(gm, pos);
		var rr		= gm.rounds = gm.rounds || [];

		if(doreset && (rr.ix || rr.ix === 0)){
			//delete rr[rr.ix];  //TODm memory leak
			rr[rr.ix]=round;
			if(!pos){
				//Pos is from gm, usually from gui:
				gio.cons("Round "+rr.ix+" cleaned up in map\n"+ gm.title);
			}else{
				gio.cons("Round "+rr.ix+" start pos is set to given position in map\n"+ gm.title);
			}
		}else{
			rr.ix=rr.length;
			rr.push(round);
			if(gio.debug) gio.cons(	"Round "+rr.ix+ " is created for map:\n" + gm.title);
		}
		rman.set_gui_title(round);
		return round;
	};



	// Gui-version of do_back_forw_start_record
	gio.gui.procs.do_manage_round = function(steps,play_direction){
		var round=gio.getgs().round;

		if(play_direction==='back'){
			if(round.current_pos_ix===0){
				gio.cons('Know nothing about past game ...');
			}
		}else if(play_direction==='forward'){
			if(round.current_pos_ix===round.moves.length){
				gio.cons('Cannot predict the future step ...');
			}
		}

		rman.do_back_forw_start_record(round, play_direction, steps);

		if(play_direction==='back'){
			if(round.gm.multiplayer)gio.do_one_scroll_of_colony('left');
			if(gio.debug) gio.cons('Back to the beginning ...');
		}else if(play_direction==='forward'){
			if( gio.modes.play !== 'autoplay') gio.cons('Forward to the end ...');
		}else if(play_direction==='to beginning'){
			if(gio.debug) gio.cons_add('jumped to start of round');
		}
	};


	// ====================================================
	// Purpose:	updates round in background
	// Actions:	depending on value of "direction" argument,
	//			does single-step-play-back,
	//			single-step-play-forward,
	//			jumps to beginning, 
	//			or records ordinary move.
	// ====================================================
	rman.do_back_forw_start_record = function(round, play_direction, steps){

		var gm=round.gm;
		var moves=round.moves;

		if(play_direction){
			var pos=round.pos;
			if(play_direction==='back'){
				if(round.current_pos_ix===0) return;
				var steps = moves[round.current_pos_ix-1];
				gio.navig.process_move_record(gm, pos, steps, 'backward');
				round.current_pos_ix--;
				if(steps.length > 1) round.interacts -= 1;
				round.backs++;
			}else if(play_direction==='forward'){
				if(round.current_pos_ix===moves.length) return;
				var steps = moves[round.current_pos_ix];
				gio.navig.process_move_record(gm, pos, steps);
				round.current_pos_ix++;
				round.backs--;
				if(steps.length > 1) round.interacts += 1;
			}else if(play_direction==='to beginning'){
				set_round_to_beginning(round);
			}
		}else{
			//ordinary move:
			moves[round.current_pos_ix]=steps;
			round.current_pos_ix++;
			//remove obsolete positions beyond current_pos_ix: 
			round.moves=moves.slice(0,round.current_pos_ix);
			if(steps.length > 1) round.interacts += 1;
		}
	};


	//////////////////////////////////////
	//auxiliary sokoban text converters
	//====================================

	//====================================
	// Encoding path to text
	// Input:	round. From background or
	//			from gui.
	//====================================
	rman.path2text=function(round){
		var text='', count=0, c;
		var gm=round.gm;
		var collection = gm.collection;
		var colonies=gm.cols;
		var breed2symbol = gm.actors>1 && gm.script.breed2symbol;
		tp.core.each(round.moves, function(ix,steps){

			var step=steps[0];
			switch(step.direction){
				case -1:	c='l';
							break;
				case  1:	c='r';
							break;
				case -2:	c='u';
							break;
				case  2:	c='d';
							break;
			}
			//var c = step[0].direction.charAt(0);

			if(breed2symbol){
				// Colorban generalization:
				// If active breeds more than 1:

				var unit=gm.units[step.uid];
				var symbol=breed2symbol[unit.cname];
				text += TOKEN_SEPARATOR+symbol+SUBTOKEN_SEPARATOR+unit.ix+'.'
			}

			// Mark push with upper case:
			if(steps.length>1)c=c.toUpperCase();

			text += c;
			count +=1;
			if((count === 15 && breed2symbol) || count === 40 ){
				count=0; text += "\n";
			} //sugar
		});
		return text;
	};

	// Version for GUI-round
	rman.path2text_current=function(){
		return rman.path2text(gio.getgs().round);
	};

	//=========================================================
	// Decodes text to path
	// Input:	If round is provided, converts in its context.
	//			Otherwise, picks up from gs.
	// Returns: "" if no errors Otherwise - validator_err.
	//=========================================================
	rman.text2round=function(text_, round){
		var w;

		if(round){
			gm = round.gm;
		}else{
			var gs=gio.getgs();
			gm = gs.gm;
			round = gs.round; 
		}
		var game=gm.game;
		var collection=gm.collection;

		// Defaults for monoactor:
		var colony=gio.getgs().col;
		var unit_ix=0;

		var text=text_.replace(/\n|\r|\t| /g,'');
		var validator_err='';
		var move_validator;
		var colonies=gm.cols;

		set_round_to_beginning(round);

		var symbol2breed = gm.actors > 1 && gm.script.symbol2breed;
		var multiactor = (symbol2breed && text.indexOf(TOKEN_SEPARATOR) > -1);
		var splitter = multiactor ? TOKEN_SEPARATOR : ''
		var textArray = text.split(splitter);

		// Steps loop:
		for(var i=0; i<textArray.length; i++){
			var token=textArray[i];
			if(token === '' )continue;
			
			var detoken;
			var direction='missed';
			var directionSymbol='missed';
			if(multiactor){
				detoken=token.split(SUBTOKEN_SEPARATOR);
				var colonyName = symbol2breed[detoken[0]];
				if(!colonyName){
					validator_err=	'No active breed exists for map symbol '+detoken[0] + "\n";
				}else if(!colonies[colonyName]){
					validator_err=	'No such breed found in this map: '+colonyName + "\n";
				}else{
					colony=colonies[colonyName];
					if(isNaN(detoken[1])){
						validator_err=	'Cannot interpret unit number.'+
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

			if(!validator_err){
				direction=DIRECTION[directionSymbol.toLowerCase()];
				if(!direction){
					validator_err += 'Cannot recognize symbol(s) "'+directionSymbol+'" in a map';
				}else{
					move_validator=gio.do_move_steps(direction, gm, round.pos, colony.units[unit_ix], round )
					if(!move_validator){
						validator_err += gio.info.log.move + "\n" +
						"Move on "+colony.units[unit_ix].hname+" is failed\n";
					}
				}
			}
			if(validator_err){
				validator_err += "Retrieved only "+round.moves.length+" moves";
				break;
			}
		}// Steps loop
		return validator_err;
	};//rman.text2round...
	//====================================
	//auxiliary sokoban text converters
	//////////////////////////////////////


	// Sugar: autoplays current round and draws autoplay on screen:
	gio.navig.in_map.autoplay=function(time_interval_between_steps){
		var repeated_autoplay=function(){
			if(gio.modes.play!=='autoplay')return;
	
			var gs=gio.getgs();
			var game=gs.game;
			var round=gs.round;

			gio.solver.set_browser_mode(false);

			if(round.current_pos_ix<round.moves.length){
				gio.gui.procs.do_manage_round(null,'forward');
				gio.draw_scene();
				gio.draw_status();
				setTimeout(repeated_autoplay,time_interval_between_steps);
			}else{
				gio.modes.play=''
			}
		};
		repeated_autoplay();
	};



})(jQuery);

