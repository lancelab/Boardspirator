(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;

					var rman	=  gio.navig.in_session.round;
					var ggp		=  gio.gui.procs;



	// **	Used:	to return player to start
	//		preserves moves and start_pos
	var do_slide_round_to_beginning=function(round){
		// ** Cosmetics
		round.backs+=round.current_pos_ix;
		round.interacts = 0;

		delete round.pos;  //TODm memory leak
		round.pos=tclone(round.start_pos);
		round.current_pos_ix=0;
	};




	// **	creates new empty round
	//		if !pos, it is cloned from gm.pos	
	rman.create=function(gm, pos){
		var round = {};
		round.gm = gm;
		round.moves = [];
		round.pos = pos || tclone(gm.pos);
		round.start_pos = tclone(round.pos);	
		// * position in playpath //TODm rename
		round.current_pos_ix = 0;
		// Cosmetics:
		round.backs = 0;
		round.interacts = 0;
		return round;
	};




	// ** only creates GUI cosmetics
	rman.set_gui_title=function(round, round_ix){
		if( !round_ix && round_ix !== 0) round_ix = round.gm.rounds.ix;
		round.title = 'Round '+ round_ix;
		round.tooltip = 'Pickup the round';
	};
	



	// Action:	creates and resets or appends a round.
	//			gm and pos are not bound to current gameplay.
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



	// Gui-wrapper around do_back_forw_start_record
	gio.gui.procs.do_manage_round = function(steps,play_direction,action){
		var round=gio.getgs().round;

		if(play_direction==='back'){
			if(round.current_pos_ix===0){
				gio.plcons('Know nothing about past game ...');
			}
		}else if(play_direction==='forward'){
			if(round.current_pos_ix===round.moves.length){
				gio.plcons('Cannot predict the future step ...');
			}
		}

		rman.do_back_forw_start_record(round, play_direction, steps, action);

		if(play_direction==='back'){

			if( round.gm.multiplayer ) {
				/// scrolls to next actor-colony
				ggp.do_one_scroll_of_colony('left');
			}

			if(gio.debug) gio.plcons('Back to the beginning ...');
		}else if(play_direction==='forward'){
			if( gio.modes.play !== 'autoplay') gio.cons('Forward to the end ...');
		}else if(play_direction==='to beginning'){
			if(gio.debug) gio.plcons_add('jumped to start of round');
		}
	};


	// =============================================================
	// Purpose:		updates round in background
	// Actions:		depending on value of "play_direction" argument,
	//				does single-step-play-back,
	//				single-step-play-forward,
	//				jumps to beginning, 
	//				or records ordinary move.
	// Behaviour:	verboseless
	// =============================================================
	rman.do_back_forw_start_record = function(round, play_direction, steps, action){

		var gm=round.gm;
		var moves=round.moves;

		if(play_direction){
			var pos=round.pos;
			if(play_direction==='back'){
				if(round.current_pos_ix===0) return;
				var move = moves[round.current_pos_ix-1];
				gio.navig.process_move_record(gm, pos, move.steps, 'backward');
				round.current_pos_ix--;
				if( move.action.intact ) round.interacts -= 1;
				round.backs++;
			}else if(play_direction==='forward'){
				if(round.current_pos_ix===moves.length) return;
				var move = moves[round.current_pos_ix];
				gio.navig.process_move_record(gm, pos, move.steps);
				round.current_pos_ix++;
				round.backs--;
				if( move.action.intact ) round.interacts += 1;
			}else if(play_direction === 'to beginning'){
				do_slide_round_to_beginning(round);
			}
		}else{
			// ordinary move: at 1.146, happens only from map.js from do_manage_round:
			moves[round.current_pos_ix]={steps : steps, action : action};
			round.current_pos_ix++;
			//remove obsolete positions beyond current_pos_ix: 
			round.moves=moves.slice(0,round.current_pos_ix);
			if( action.intact ) round.interacts += 1;
		}
	};



	// Sugar: autoplays current round and draws autoplay on screen:
	gio.navig.in_map.autoplay=function(time_interval_between_steps){
		var repeated_autoplay=function(){
			if(gio.modes.play!=='autoplay')return;
	
			var gs=gio.getgs();
			var game=gs.game;
			var round=gs.round;

			round.gm.solver.browser_mode = false;

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





	//////////////////////////////////////
	// auxiliary path text converters
	//====================================

	//=========================================================================
	// Encoding path to text
	// Input:	round. From background or from gui
	//			sugar_do_inverse_path - builds path for inverse pullpush games
	//=========================================================================
	rman.path2texts=function(round, sugar_do_inverse_path){

		var ww					= gio.core.def.map_format.playpath;
		var DIRECTION			= ww.DIRECTION;
		var TOKEN_SEPARATOR		= ww.TOKEN_SEPARATOR;
		var SUBTOKEN_SEPARATOR	= ww.SUBTOKEN_SEPARATOR;

		var text='', count=0, c;
		var gm=round.gm;
		var colonies=gm.cols;
		var breed2color = gm.actors>1 && gio.core.def.map_format.breed2color;
		//gm.script.breed2color;
		//gio.core.def.map_format.breed2color; //colorban_decoder_table


		var sugar_inverse_path = '';
		var copathy = gm.game.post_definition_copathy;

		var move_token;
		tp.core.each(round.moves, function(ix,move){

			var direction=move.action.direction; //steps[0];
			switch(direction){
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

			move_token = '';
			if(breed2color){
				// Colorban generalization:
				// If active breeds more than 1:

				var unit=gm.units[move.action.uid];
				var symbol=breed2color[unit.cname];
				move_token = TOKEN_SEPARATOR+symbol+SUBTOKEN_SEPARATOR+unit.ix+'.';
			}

			// Mark push with upper case:
			if(move.steps.length>1)	c=c.toUpperCase();

			text += move_token + c;

			if( copathy ) {
				sugar_inverse_path = move_token + copathy( gm, move, sugar_inverse_path, c );
			}


			/// sugarifies by adding "\n"
			count +=1;
			if((count === 15 && breed2color) || count === 40 ){
				count=0;
				text += "\n";
				if( copathy ) sugar_inverse_path = "\n" + sugar_inverse_path;
			}
		});

		return { path : text, co_path : (copathy && sugar_inverse_path ) || '' };
	};

	///	Produces text from gui round
	rman.path2texts_current=function(){
		return rman.path2texts(gio.getgs().round);
	};




	///		Decodes:	text to path,
	//					apparently assigns this path to the round
	//					Does nothing to gm.playpaths "heap".
	//		Input:		round	-	optional. 
	//								if provided, used as context,
	//								otherwise, picked up from gs,
	// 		Returns:	"" if no errors Otherwise - validator_err.
	rman.text2round = function(text_, round){

		var ww					= gio.core.def.map_format.playpath;
		var DIRECTION			= ww.DIRECTION;
		var TOKEN_SEPARATOR		= ww.TOKEN_SEPARATOR;
		var SUBTOKEN_SEPARATOR	= ww.SUBTOKEN_SEPARATOR;

		var verbose				= gio.modes.dynamic.verbose || gio.debug;
		var gs					= gio.getgs();
		round					= round || gs.round;
		var	gm					= round.gm;
		var game				= gm.game;

		// ** sets defaults for monoactor mode
		var colony				= gm.acting_col;
		var unit_ix				= 0;

		var text				= text_.replace(/\n|\r|\t| /g,'');
		var colonies			= gm.cols;
		var validator_err		= '';
		var move_validator;

		do_slide_round_to_beginning(round);

		//	**	current version reminder:
		//		gm.actors = number of colonies with activity.active == true
		//		multiactor is truing if
		//			!!gm.actors
		//			TOKEN_SEPARATOR is detected 
		var color2breed	= gm.actors > 1 && gio.core.def.map_format.color2breed; //gm.script.color2breed;
		var multiactor		= (color2breed && text.indexOf(TOKEN_SEPARATOR) > -1);
		var splitter		= multiactor ? TOKEN_SEPARATOR : ''
		var textArray		= text.split(splitter);

		if(gio.debug){
			gio.cons_add('Converting text to path. ');
			gio.cons_add(	'Multiactor='+multiactor+' actors='+gm.actors+
							' gkey='+gm.game.gkey);
		}

		// Steps loop:
		var debugText = '';
		for(var i=0; i<textArray.length; i++){

			var token=textArray[i];
			debugText += token;
			if(token === '' )continue;
			
			var detoken;
			var direction='missed';
			var directionSymbol='missed';
			if(multiactor){

				detoken=token.split(SUBTOKEN_SEPARATOR);
				var colonyName = color2breed[detoken[0]];
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
					try{ // TODm inconsistent design .... why error can happen here at all?
						move_validator=gio.do_process_move(direction, gm, round.pos, colony.units[unit_ix], round )
					}catch( error ){
						validator_err +=  
								"Error decoding token " + token + "\n" +
								"Direction symbol = " + directionSymbol + "\n" +
								"Error = " + error.message;
						move_validator = false;
					}	
					if(!move_validator){
						validator_err += gio.info.log.move + "\n" +
						"Move of "+colony.units[unit_ix].hname+" is failed\n";
					}else if(verbose){
						debugText += ' ' + gio.info.log.move;
					}
				}
			}
			if(validator_err){
				validator_err += "Retrieved only " + round.moves.length + " moves\n" + 
								 "Parsed text is = " + debugText + "\n";
				break;
			}
		}// Steps loop

		if(verbose) gio.cons_add('Parsed path = '+debugText);

		return validator_err;
	};//rman.text2round...
	//====================================
	// auxiliary path text converters
	//////////////////////////////////////



})();

