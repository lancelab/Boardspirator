
(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var procs	=  gio.core.procs;
					var ceach	=  tp.core.each;


	///		does a vital debug
	//		usage: c onsole.log('deb='+ procs.debug_tower(new_loc[0],new_loc[1],gm,pos));
	procs.debug_tower = function(xx,yy,gm,pos){
		var tower = gm.loc2lid[xx][yy];
		var top = pos.tops[xx][yy];
		var result = 'Tower in ('+xx+','+yy+') ';
		for(var zz=0; zz<=top; zz++){
			var lid = tower[zz];
			var peer_uid = pos.lid2uid[lid];
			var unit = gm.units[peer_uid];
			result += unit.id + ' ' + unit.hname + ', ';
		}
		return result;
	};


	///	helps to run pull-interactions
	var is_dynamic_unit_climbed = function(xx,yy,gm,pos,verbose){
			var tower = gm.loc2lid[xx][yy];
			var top = pos.tops[xx][yy];
			for(var zz=0; zz<=top; zz++){
				var lid = tower[zz];
				var peer_uid = pos.lid2uid[lid];
				var activity = gm.units[peer_uid].activity;
				if(activity && (activity.active || activity.passive)){
					if(verbose) gio.info.log.move += 'Cannot climb on '+
								gm.units[peer_uid].hname + "\n";
					return true;
				}
			}
			return false;
	};



	///	Returns:		valid new_move or
	//					evaluatable to false if move is forbidden
	procs.do_interaction = function (
			direction, unit, move, recursion_depth, forbid_contacts, step_length,
			dropx, dropy, dropz
	){
		// ** prepares to store virtual move messages
		var log = gio.info.log;
		var steps = move.steps;
		if(!steps.length) log.move = '';
		var verbose = gio.modes.dynamic.verbose || gio.debug;
		var do_debug = gio.debug && !isNaN(gio.debug) &&  gio.debug % 5 === 0;


		// ** prepares steps
		var new_move=gio.prepare_step(direction, unit, move, '', step_length, dropx, dropy, dropz);
		if(!new_move) return null;
		var pos = move.pos;
		var new_steps = new_move.steps;
		var movers_number = new_steps.length;

		//if(!recursion_depth && recursion_depth !== 0){
		if(!recursion_depth){
			//.	Initially, steps.length = 0. 
			//	At first call to interaction, movers_number = 1;
			recursion_depth = movers_number;
		}

		// ** memorizes location of last step in sequence
		var new_loc=new_steps[movers_number-1].new_loc;
		var xx = new_loc[0];
		var yy = new_loc[1];

		// ** makes shortcuts
		var gm = unit.gm;
		var game = gm.game;
		var imatrix = game.interact;	
		var tower = gm.loc2lid[xx][yy];
		var top = pos.tops[xx][yy];

		if(do_debug) {
			gio.cons_add(	'Interacting ... game.gkey=' + game.gkey + 
							' Proposed new_move: direction ' + direction 

			);
		}


		// ** executes master loop through tower
		tower_loop: for(var zz=0; zz<=top; zz++){
		//tower_loop: for(var zz=0; zz<tower.length; zz++){

			var lid = tower[zz];
			// * memorizes id of the peer to interact with in this tower:
			var peer_uid = pos.lid2uid[lid];



			///	if one of the schedulees for move is in this cell,
			//	ignores interaction check completely
			for(var ss=0; ss<steps.length; ss++){
				if(steps[ss].uid === peer_uid){
					break tower_loop;
				}
			}


			var peer=gm.units[peer_uid];


			///	Begins debug reporting for given peer
			if(do_debug) {
					gio.cons_add(	'Interacting with ' + peer_uid + ' "' + peer.hname +
									'" peer.pass=' + peer.pass );
			}


			//. checks unconditional interaction rule "pass"
			if(peer.pass) continue;


			//: makes message stubs
			var MSG_XY = 'In cell '+ xx+','+yy+','+zz+".\n";
			// TODM Apparently, inconsistent: interaction is virtual subroutine, but uses human names of dress:
			var MSG_PEERS = unit.hname +' is blocked by '+ peer.hname +".\n";


			/// checks unconditional interaction rule "block"
			if(peer.block){
				if(verbose) log.move += MSG_PEERS + MSG_XY;
				return null;
			}

			//.. in tower_loop


			if( !imatrix[unit.cname] || !imatrix[unit.cname][peer.cname] ) {

					//::	no entry in interaction matrix is specified
					//		following default policies					
					if( peer.race === 'wall' ) {

						if( unit.color_ix === peer.color_ix || unit.color === 0 ) {
							//. matched wall do block
							if(verbose) log.move +=	MSG_PEERS + MSG_XY;
							return null;
						}else {
							//. non-matched wall do pass
							continue;
						}
					}else if( peer.race === 'ground' ) {

						if( unit.color_ix === peer.color_ix || unit.color === 0 ) {
							//. matched ground do pass
							continue;
						}else {
							//. non-matched ground do block
							if(verbose) log.move +=	MSG_PEERS + MSG_XY;
							return null;
						}
					}

					//::	follows default policy "block"
					if(verbose) log.move +=	MSG_PEERS + MSG_XY;
					return null;


			}else{

				//:: checks interaction matrix rules

				var int_act = imatrix[unit.cname][peer.cname];

				/// prepares message stub
				if(verbose) {
						var mess_stub =
							MSG_PEERS + MSG_XY + "Cannot " + int_act +
							" more than " +
							game.DEEPNESS_LIMIT+"\n";
				}




				if(int_act === 'pass') {
					if(do_debug) gio.cons_add( 'Continue bs 	int_act = pass' );
					//return new_move;
					continue;
				}
				if( forbid_contacts ) return false;



				/// collects statistics
				if( int_act && recursion_depth === 1) {
					new_move.action.intact = int_act;
					move.action.intact = int_act;
				}



				// ///\\\ push
				if(int_act === 'push'){
					if(recursion_depth > game.DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					new_move=procs.do_interaction(
							direction, peer, new_move,
							recursion_depth+1
					);
					return new_move;
				// \\\/// push




				// ///\\\ pull
				}else if(int_act === 'pull') {

					if(recursion_depth > game.DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}

					//.	moves actor in opposite direction   
					new_move=gio.prepare_step(-direction, unit, move, 'dynamic_units_do_block');
					if(!new_move) return null;

					///	pulls the peer
					new_move = procs.do_interaction(
							-direction, peer, new_move,
							recursion_depth+1
					);
					return new_move;
				// \\\/// pull






				// ///\\\ swap
				}else if(int_act === 'swap'){
					if(recursion_depth > game.DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					///	pulls the peer
					new_move = procs.do_interaction(
							-direction, peer, new_move,
							recursion_depth+1
					);
					return new_move;
				// \\\/// swap





				//	///\\\ leap
				}else if(int_act === 'leap'){

					if(recursion_depth > game.DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}

					//:: leaps the peeer
					new_move = procs.do_interaction( -direction, peer, new_move, recursion_depth + 1, undefined, 2 );
					if(!new_move) return null;

					//.	makes actor staying on own place by removing its initial-move
					new_move.steps.splice( new_move.steps.length - 2, 1 );

					if(do_debug && new_move ) gio.cons_add(	'Leap is valid.'	);
					return new_move;
				// \\\/// leap




				// ///\\\ jump
				}else if(int_act === 'jump') {
					if(recursion_depth > game.DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					//.	moves actor two steps ahead
					new_move = procs.do_interaction( direction, unit, move, recursion_depth+1, undefined, 2 );
					return new_move;
				// \\\/// jump





				}else{

					if(verbose) log.move +=	MSG_PEERS + MSG_XY;
					return null;
				}

			}//	if(imatrix[accol.nam])

			// .. in tower_loop
		}

		return new_move;
	};//do_interaction()



	// ===================================================================
	// Action:	clones move.steps and adds step to it
	//			makes preliminary checks and returns null if failed.
	// Input:	direction =	-1,1 for x, -2,2 for y, (will: -3,3 for z)
	// Concept:	as of 1.146, z-dimension is simply ignored
	// ===================================================================
	gio.prepare_step=function(
		direction, unit, move, dynamic_units_do_block, step_length,
		dropx, dropy, dropz
	){

		var verbose = gio.modes.dynamic.verbose || gio.debug;
		var gm = unit.gm;
		var uid = unit.id;
		var pos = move.pos;
		// * finds current location
		var loc = gm.locs[pos.uid2lid[uid]];

		if(gio.debug){
			gio.cons_add(	'Preparing step ... game.gkey='+gm.game.gkey+
							' u/h name=' + unit.uname + '/'+unit.hname +
							' direction=' + direction + ' shift=' + shift +
							' dropx, dropy, dropz='+dropx + ', ' + dropy + ', ' + dropz);
		}


		var dimension = Math.abs(direction)-1;

		// //\\ creates new location
		if( dropx || dropx === 0 ) {

			//:: assumed: drop is given
			var new_loc=[dropx, dropy, dropz]; //TODO not tested solution
		}else{


			if(dimension < 0) return null;
			var dir = direction > 0 ? 1 : -1;
			var shift = dir * ( step_length || 1 );

			var new_loc=[loc[0],loc[1],loc[2]];

			//: sets new location in dimension "dimension"
			var locd = loc[dimension];
			var new_locd = locd + shift;

			// ** checks range legality for new location
			if(new_locd<0 || new_locd >= gm.size[dimension]){
				if(verbose){
					 gio.info.log.move += "Step from " +
						// was a bug: gm.game.dress.DIMENSION_NAMES[dimension] +
						gm.dresses_wrap.chosen_dress.DIMENSION_NAMES[dimension] +
						"=" + locd + " to " +
						new_locd + " is outside of map.\n";
				}
				return null;
			}
			new_loc[dimension] = new_locd;
		}
		// \\// creates new location



		/// checks does planar location exist?
		var xx=new_loc[0];
		var yy=new_loc[1];
		var zz=new_loc[2];
		if(!gm.xy_exists[xx][yy]){
			if(verbose) gio.info.log.move += 'Unreachable cell '+xx+', '+yy+"\n";
			return null;
		}

		var lid = gm.loc2lid[loc[0]][loc[1]][loc[2]];
		var new_lid = gm.loc2lid[xx][yy][zz];


		/// refuses to climb on dynamic unit
		if(dynamic_units_do_block){
			if(is_dynamic_unit_climbed(xx,yy,gm,pos,verbose)) return null;
		}


		var step={	uid : uid,
					direction : direction,
					// ** "redundant" properties
					loc : loc,
					lid : lid,
					new_loc : new_loc,
					new_lid : new_lid
				 };

		var new_move = {
					pos : pos,
					action : move.action,
					steps : tp.core.tpaste([],move.steps)
		};
		new_move.steps.push(step);
		return new_move;
	};



	var inside_plain_square=function(center_loc, test_loc, radius)
	{
		return 	Math.abs(test_loc[0]-center_loc[0])<=radius &&
				Math.abs(test_loc[1]-center_loc[1])<=radius;
	};



})(jQuery);
