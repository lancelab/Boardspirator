
( function () {		var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
				  	var gio		=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;

					var rman	=  gio.navig.in_session.round;
					var ggp		=  gio.gui.procs;
					var cmd		=  gio.core.def.map_format;


					var dot_regex = /\./g;
					var space_regex = / /g;


	// **	Used:	to return player to start
	//		preserves moves and start_pos
	var do_slide_round_to_beginning=function(round){
		// ** Cosmetics
		round.backs+=round.current_pos_ix;
		round.interacts = 0;
		round.peer_change = 0;

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
		round.peer_change = 0;
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
	// Purpose:		VIRTUAL. Updates round in background
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
			if( play_direction === 'back' )
			{
				if(round.current_pos_ix===0) return;
				var move = moves[ round.current_pos_ix - 1 ];

				gio.navig.process_move_record( gm, pos, move.steps, 'backward' );
				var pix = --round.current_pos_ix;

				/// Updates metrics
				if( move.action.intact )
				{
					round.interacts -= 1;
					/// We have previous position. Was there peer change?
					if( pix > 0 )
					{
						var former_move = moves[ pix - 1 ];
						var former_peer = former_move.action.former_peer;
						if( former_peer && former_peer !== move.action.peer ) round.peer_change -= 1;
					}
				}
				round.backs++;

			}else if(play_direction==='forward'){

				if( round.current_pos_ix === moves.length ) return;
				var move = moves[ round.current_pos_ix ];
				gio.navig.process_move_record( gm, pos, move.steps );
				var pix = ++round.current_pos_ix;
				round.backs--;

				/// Updates metrics
				if( move.action.intact )
				{
					round.interacts += 1;
					/// We have previous position. Was there peer change?
					var former_move = ( pix > 1 ) && moves[ pix - 2 ]; //TODM what is a syntax ... is array[-1] legal operation?
					var former_peer = former_move && former_move.action.former_peer;
					if( former_peer && former_peer !== move.action.peer ) round.peer_change += 1;
				}

			}else if(play_direction === 'to beginning'){
				do_slide_round_to_beginning(round);
			}
		}else{

			// ordinary move: at 1.146, happens only from map.js from do _ manage _ round:
			var move = { steps : steps, action : action };
			var pix = round.current_pos_ix;
			moves[ pix ] = move;


			//: Carries former peer from deep past for metrics
			var former_move		= ( pix > 0 ) && moves[ pix - 1 ];
			var former_peer		= former_move && former_move.action.former_peer;
			action.former_peer	= action.peer || former_peer;

			round.current_pos_ix++;
			//remove obsolete positions beyond current_pos_ix: 
			round.moves = moves.slice( 0, round.current_pos_ix );

			/// Updates metrics
			if( action.intact )
			{
				round.interacts += 1;
				/// We have previous position. Was there peer change?
				if( former_peer && former_peer !== action.peer ) round.peer_change += 1;

			}
		}
	};



	///	Sugar:	autoplays current round and draws autoplay on screen:
	//	Input:	if time_interval_between_steps_ === 0, then only last scene is drawn.
	//			if till_won_callback is supplied, autoplay runs till winning state and
	//				callback is called at the end.
	gio.navig.in_map.autoplay = function ( time_interval_between_steps_, till_won_callback ) //TODO possibly unsafe: does mode blocks user input?
	{
		time_interval_between_steps = time_interval_between_steps_ || 1;
		var till_won = !!till_won_callback;

		var repeated_autoplay = function ()
		{
			if( gio.modes.play !== 'autoplay' ) return;
	
			var gs		= gio.getgs();
			var gm		= gs.gm;
			var game	= gm.game;
			var round	= gs.round;

			round.gm.solver.browser_mode = false;
			var do_continue = round.current_pos_ix < round.moves.length

			if( do_continue )
			{
				gio.gui.procs.do_manage_round( null, 'forward' );

				if( time_interval_between_steps_ || round.current_pos_ix === round.moves.length )
				{
					gio.draw_scene();
					gio.draw_status();
				}

				//.	Stops if won-stop is required.
				if( till_won && game.won_or_not( gm, round.pos ) ||
					round.current_pos_ix >= round.moves.length
				){
					do_continue = false;
				}
			}

			if( do_continue )
			{
				setTimeout( repeated_autoplay, time_interval_between_steps );
			}else{
				gio.modes.play = '';
				if( till_won_callback ) till_won_callback( gm, round );
			}
		};
		repeated_autoplay();
	};


	/// Moves:	game pos till the end of a path in current round.
	//			Stops whichever met first: won-stop or end.
	//	Uses:	see // *
	//	Calls:	callback at the end, even no move is done.	
	gio.navig.in_map.move_till_condition = function ( do_redraw_GUI, till_won_callback )
	{
		var till_won	= !!till_won_callback;
		var gs			= gio.getgs();
		var gm			= gs.gm;
		var game		= gm.game;
		var round		= gs.round;

		var do_continue = round.current_pos_ix < round.moves.length

		while( do_continue )
		{
			//gio.gui.procs.do_manage_round( null, 'forward' ); // *
			rman.do_back_forw_start_record( round, 'forward', null ); // *

			if( till_won && game.won_or_not( gm, round.pos ) ||
				round.current_pos_ix >= round.moves.length
			){
				do_continue = false;
			}
		};

		if( do_redraw_GUI )
		{
			gio.draw_scene();
			gio.draw_status();
		}

		if( till_won_callback ) till_won_callback( gm, round );
	};



	///	Converts round's position to board-script in colorban format.
	//	Applies some sugar to shorten simple maps.
	rman.pos2map_script = function ( round, do_comap ) {

		var table			= cmd.colorban_encoder_table;
		var cotable			= cmd.colorban_encoder_cotable;
		var mapcut			= cmd.sugar_soko_mapcut;
		var TARGET_REGEX	= cmd.map_sugar.TARGET_REGEX;
		var TARGET			= cmd.map_sugar.TARGET;

			
		var gm			= round.gm;

		//:	shortcuts static data
		var units		= gm.units;
		var loc2lid		= gm.loc2lid;
		var x_size		= gm.size[0];
		var y_size		= gm.size[1];
		var xy_exists	= gm.xy_exists;

		//: dynamic data
		var pos			= round.pos;
		var tops		= pos.tops;
		var lid2uid		= pos.lid2uid;

		var single_symbol_cells = true;
		var script = ":::map\n";

		if( do_comap )
		{
			script += ":::comment: MAKE SURE THERE IS A HERO DEFINED ON THIS MAP.\n";
			var co_game = 'co_' + gm.game.gkey;
			var co_game = co_game.replace( /^co_co_/, '' );
			if( gio.def.games[ co_game ] ) {
				script += ":::context_akey=" + co_game + "\n";	
			}else{
				script += ":::comment: there is no co game, " + co_game + ", defined ... \n";
			}		
		}

		var board = '';
		for( var yy = 0; yy < y_size; yy++ ) {

			for( var xx = 0; xx < x_size; xx++ ) {

				var tower	= loc2lid[ xx ][ yy ];
				//. As of today, there is no autofilling empty cells in map.				
				if( !tower ) break;

				var top		= tops[ xx ][ yy ];
				var tower_script = '';
				var short_symbols = true;

				for( var zz_virt = 0; zz_virt <= top; zz_virt++ ) {


					var zz = do_comap ? (top - zz_virt) : zz_virt; 

					var lid = tower[ zz ];
					var uid = lid2uid[ lid ];
					var unit = units[ uid ];
					var symbol =	do_comap ? 
									cotable[ unit.cname ] :
									table[ unit.cname ];
					if( symbol === cmd.map_sugar.GROUND ) {
						if( top > 0 )
						{
							//. Drops separator even after empty symbol to 
							//	protect long symbols.
							if( zz_virt < top ) tower_script += '.';
							continue;
						}
						symbol = cmd.map_sugar.GROUND;
					}
					if( symbol.length > 1 ) short_symbols = false;
					tower_script += symbol;
					if( zz_virt < top || top === 0 ) tower_script += '.';
				}
				//. sugar
				if( short_symbols ) tower_script = tower_script.replace( dot_regex, '' );
				//. shortens 0X -> *
				if( mapcut[ tower_script ] ) tower_script = mapcut[ tower_script ];

				if( tower_script.length > 1 ) single_symbol_cells = false;
				board += tower_script + ' ';
			}
			board += "\n";
		}

		if( single_symbol_cells ) {
			board = board.replace( space_regex, '' ).replace( TARGET_REGEX, TARGET );
		}
		script += board + ":::board_end\n";

		return script;

	}; //rman.pos2map_script






	//////////////////////////////////////
	// auxiliary path text converters
	//====================================

	//=========================================================================
	// Encoding path to text
	// Input:	round. From background or from gui
	//			sugar_do_inverse_path - builds path for inverse pullpush games
	//=========================================================================
	rman.path2texts=function(round, sugar_do_inverse_path){

		var ww					= cmd.playpath;
		var DIRECTION			= ww.DIRECTION;
		var TOKEN_SEPARATOR		= ww.TOKEN_SEPARATOR;
		var SUBTOKEN_SEPARATOR	= ww.SUBTOKEN_SEPARATOR;

		var text='', count=0, c;
		var gm=round.gm;
		var colonies=gm.cols;
		var breed2color = gm.actors>1 && cmd.breed2color;
		//gm.script.breed2color;
		//cmd.breed2color; //colorban_decoder_table


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

		return {	path : text,
					co_path : (copathy && sugar_inverse_path ) || '',
					metrics : '' + round.moves.length + '.' + round.interacts + '.' + round.peer_change
		};
	};


	///	Produces text from current gui round.
	rman.path2texts_current = function()
	{
		return rman.path2texts( gio.getgs().round );
	};



	///		Decodes:	text to path,
	//					apparently assigns this path to the round
	//					Does nothing to gm.playpaths "heap".
	//		Input:		round	-	optional. 
	//								if provided, used as context,
	//								otherwise, picked up from gs,
	// 		Returns:	"" if no errors Otherwise - validator_err.
	rman.text2round = function( text_, round )
	{

		var ww					= cmd.playpath;
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
		var color2breed	= gm.actors > 1 && cmd.color2breed; //gm.script.color2breed;
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

