(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	var solver = gio.solver = gio.solver || {};



	gio.solver.Processor = function( gm_){

		var self={};

		var gm = gm_;
		var plgam = gm.game;
		var startPos;
		var units = gm.units;

		// Index of this array is a radius:
		var spheres = [];
		var nodes = [];


		self.stopped = true;
		// State. Where to start next spawning after timeout.
		var phase={ sphere : 0, angle : 0 };	

		var solutions;
		var spawned_states_number;
		var stop_when_solution_found;

		// Meaning of indices in spoint:
		var STATE=0;
		var PARENT_SPHERE=1;
		var PARENT_ANGLE=2;
		var DIRECTION=3;
		var HID=4;

		var stopTime;


		// Shortcuts
		var loc2lid;
		var lid2hid;
		var hid2lid;
		var hid2loc;

		// Statistics
		var stat = self.stat = {};
		var LOOP_MIN_LENGTH = 3;

		var msg = '';


		var adapter = self.adapter = solver.Adapter(self, gm, nodes, spheres);


		// ==========================================
		// Fires up solving beginning from startPos
		// ==========================================
		self.fire_up = function( startPos_, stop_when_solution_found_ ){

			self.stopped = false;
			// Forbid this gui control:
			gio.solver.set_browser_mode(false);
			if( !(	phase.sphere === 0 && phase.angle === 0 ) ){
				self.do_searches();
				return;
			}

			// If thread is here, then search begins for the first time.

			stop_when_solution_found = stop_when_solution_found_;

			startPos = tp.core.tclone(startPos_);

			// TODm Checks solution
			// Is startState a solution?

			spheres[0]=[[]];
			// First state. Cannot be a solution.
			spheres[0][0][STATE] = adapter.createdNode(startPos, 0, 0);
			spheres[0][0][PARENT_SPHERE] = -1;
			spheres[0][0][PARENT_ANGLE] = -1;
			spheres[0][0][DIRECTION] = 0;
			spheres[0][0][HID] = -1;

			// Filling sphere:
			spheres[1]=[];

			solutions=[];
			self.browser.position = { sphere : 0, angle : 0 };

			// Shortcuts:
			loc2lid = gm.loc2lid;
			lid2hid = gm.digest.lid2hid;
			hid2lid = gm.digest.hid2lid;
			hid2loc = gm.digest.hid2loc;

			// Statistics
			stat.total_states = 1
			stat.completed_ball_size = 1;
			//stat.loops = 0;
			//stat.max_loop = -1;
			stat.total_milliseconds = 0;

			self.do_searches();

		};


		// ======================================
		// Messages and statistics
		// ======================================
		var print_messages = function(){

			var res = msg + "\n";

			res +=	(spheres.length-1) + '.'+spheres[spheres.length-1].length + 
					" = pstates = sphere.angles\n";
			res +=	stat.total_states + '.' +
					stat.completed_ball_size + '.' +
					spheres[spheres.length-2].length  + 
					" = total.ball.layer"+ "\n";
			res += stat.flat_dynamics_top_nodes_estimation+" = pstates ix upper bound\n";

			res += stat.node_dimension+" = pstate dimension\n";
			res += stat.hids_number+" = hids, ";
			
			res += "ms="+stat.total_milliseconds+", ";
			res += "ms/step="+stat.ms_per_step+", ";
			res += "mks/pstate="+stat.mks_per_state+"\n";

			//res += "max_loop="+stat.max_loop+"\n";
				
			res += "spheres:\n";
			for(var ss=0; ss<spheres.length; ss++){
				res += ss + '.' + spheres[ss].length +
				"\n";
			} 

			gio.cons_add(res);
		};




		// ======================================
		// Main time loop.
		// Gives slices for search and for user.
		// ======================================
		self.do_searches = function(){

			if(self.do_search()){
				var do_stop_searches = true;
				if(solutions.length > 0){
					gio.cons('Solution is found');
					if(stop_when_solution_found){
						var sloc = solutions[0];
						var ssphere=sloc[0];
						var sangle=sloc[1];
						var sol=spheres[ssphere][sangle];
						self.do_expand_path(sol, sloc);
					}else{
						do_stop_searches = false;
					}
				}else if(!self.stopped && spheres[phase.sphere + 1].length === 0 ){
					gio.cons('Solution does not exist');
				}else if(self.stopped){
					gio.cons('Solver stopped');
				}else{
					gio.cons('Solver stopped by internal signal.');
				}
				print_messages();
				if(do_stop_searches){
					gio.gui.procs.refresh(gm);
					self.stopped = true;
					return;
				}
			}
			gio.cons('...solving map ' + gm.title);
			gio.cons_add('...phase=' + phase.sphere + '.' + phase.angle);
			print_messages();
			setTimeout(self.do_searches, solver.config.TIME_TO_WAIT_MS);
		};



		// ==============================================
		// Makes search and blocks JS while searching
		// ==============================================
		self.do_search = function(){

			var start_time = (new Date()).getTime(); 
			var stopTime = start_time + solver.config.TIME_TO_WORK_MS;
			var terminate_iterations = false;

			msg = '';

			infsearch: while(true){

				sp=phase.sphere;
				var sphere = spheres[sp];

				// But, if this is an empty sphere, there are no solutions:
				// SOLUTION DOES NOT EXIST
				if(sphere.length === 0 ){
					terminate_iterations = true;
					break infsearch;
				}

				var do_stop = false;
				for( var an=phase.angle; an < sphere.length; an++ ){
					phase.angle = an;

					// Not checking the time while cycling via units and space:
					if((new Date()).getTime() > stopTime){
						//gio.cons_add('... time elapsed. memorized search point'+sp+'.'+an);
						break infsearch;
					}


					if(		self.stopped  ||
							stop_when_solution_found && solutions.length > 0
					){
						terminate_iterations = true;
						break infsearch;
					}

					if(stat.total_states>gio.solver.config.NODES_LIMIT){
						msg=	'Pstates memory limit, '+
								gio.solver.config.NODES_LIMIT+", is exceeded.\n";
						terminate_iterations = true;
						break infsearch;
					}

					var spoint = sphere[an];
					var canon=spoint[STATE];
					spawned_states_number = 0;
					unitsIterator(canon);
					stat.total_states += spawned_states_number;

				}// for( var an=phase.angle

				phase.angle = 0;
				phase.sphere += 1;
				stat.completed_ball_size += spheres[phase.sphere].length;
				// Reserve memory for fillee-sphere:
				if(!spheres[phase.sphere+1]) spheres[phase.sphere+1]=[];

			}//while(true)
			
			stat.total_milliseconds += (new Date()).getTime() - start_time;
			stat.ms_per_step = Math.ceil(stat.total_milliseconds / phase.sphere);
			stat.mks_per_state = Math.ceil(stat.total_milliseconds * 1000 / stat.total_states);

			return terminate_iterations;
		};
	

		// ==============================================
		// Spawns four planar directions for search
		// ==============================================
		var spaceIterator=function(unit, pos, unit_hid){
			for(var x=-1; x<2; x++){
				for(var y=-1; y<2; y++){
					if( x !== 0 && y !== 0 ) continue;
					if( x === 0 && y === 0 ) continue;
					var direction = y !==0 ? 2*y : x;
					var new_move = doHandleMove(  direction, pos, unit, unit_hid  );
					if(new_move) gio.navig.process_move_record(gm, pos, new_move.steps, 'backward');

					// This breaks completeness of angle iteration:
					//if(self.stopped) return true;
					//if(stop_when_solution_found && solutions.length > 0) return true;
				}
			}
			return false;
		};



		// ==============================================
		// Loops via actors, one in a time and
		// fires space search for each actor
		// ==============================================
		var unitsIterator=function(canon){

			// Unwrap canon
			var pos=adapter.doReStorePosition(canon);

			for(var ii=0; ii<gm.actor_cols.length; ii++){
				var col = gm.actor_cols[ii];
				var did = col.did;
				var cunits=col.units;
				for(var uix=0; uix<cunits.length; uix++){
					spaceIterator(  cunits[uix], pos, canon[did][uix]  );
					// This breaks completeness of angle iteration:
					// if(spaceIterator(cunits[uix], pos, canon[did][uix])) return true;	
				}
			}
		};






		// ==============================================
		// Converts canon to pos, fires: move, former
		// pos check, adding to sphere, and won-check.
		// ==============================================
		var doHandleMove=function (direction, pos, unit, unit_hid){

			// This breaks completeness of angle iteration:
			//if(self.stopped) return false;

			//c onsole.log('core: making move. unit.id='+unit.id+' '+unit.hname+' pos=',pos);

			// Validates move
			var new_move = gio.do_move_steps(direction, gm, pos, unit);
			//c onsole.log('core: after move: new_move=',new_move);

			// Failed direction:
			if( !new_move ) return false;

			var growing = spheres[phase.sphere+1];
			var growing_angle = growing.length;

			var new_canon = adapter.createdNode(new_move.pos, phase.sphere+1,  growing_angle);
			if( !new_canon ) {
				/* abandoned:
				var distance = 0; //phase.sphere + 1 - collider[OWN_SPHERE];
				if(LOOP_MIN_LENGTH <= distance){
					stat.loops += 1;
					if(distance>stat.max_loop) stat.max_loop = distance;
				}
				*/
				return new_move;
			}


			spawned_states_number += 1;

			// Does state bookeeping
			growing[ growing_angle ]=[
					new_canon,
					phase.sphere,
					phase.angle,
					direction,
					unit_hid
			];


			// Checks solution
			if( plgam.won_or_not(gm, new_move.pos) ){
				solutions.push([phase.sphere+1, growing_angle]);
			}
			return new_move;
		};//doHandleMove=function






		// =============================
		// Auxiliary: pos-space browser
		// -----------------------------
		self.browser = {};
		gio.solver.set_browser_mode = function(value){
			gio.solver.browser_mode=value;
			return value;
		};
		self.browser.do_move = function(direction, sphere_direction){
			var p=self.browser.position;
			var new_angle = p.angle;
			var new_sphere = p.sphere;

			// Move through sphere:
			if(sphere_direction === 'forward' || direction === -2){
				if(	p.sphere + 1 < spheres.length &&
					0 < spheres[p.sphere+1].length){
						new_angle = 0;
						p.sphere += 1;
				}
			}else if(sphere_direction === 'back' || direction === 2){
				if(p.sphere > 0){
						p.sphere -= 1;
						new_angle = spheres[p.sphere].length-1;
				}
			}else if(sphere_direction ==='to beginning'){
				p.sphere = 0;
				new_angle = 0;

			// Move through angles:
			}else if(direction === 1){
				new_angle = p.angle + 1;
				if(	new_angle >= spheres[p.sphere].length){
					if(	p.sphere + 1 < spheres.length &&
						0 < spheres[p.sphere+1].length){
						new_angle = 0;
						p.sphere += 1;
					}else{
						new_angle= p.angle;
					}
				}
			}else if(direction === -1){
				new_angle = p.angle - 1;
				if(new_angle < 0 ){
					if(p.sphere > 0){
						p.sphere -= 1;
						new_angle = spheres[p.sphere].length-1;
					}else{
						new_angle= p.angle;
					}
				}
			}
			p.angle = new_angle;

			// Now, we set new positions. 
			var spoint=spheres[p.sphere][p.angle];

			// If we want to go right to the chosen pstate, do this:
			// var pos=adapter.doReStorePosition(spoint[STATE]);
			// ....init_round(gm, 'doreset', pos);
			// But, we set start pos and expand the path to the chosen pstate:
			gio.navig.in_session.round.init_round(gm, 'doreset', startPos);
			var path = self.do_expand_path(spoint, [p.sphere, p.angle], 'inject_into_session');

			gio.cons_add(	' p-point = '+p.sphere+'.'+p.angle+' l-index='+spoint[HID]+
							' parent = '+spoint[PARENT_SPHERE]+'.'+spoint[PARENT_ANGLE]+
							' dir='+spoint[DIRECTION] + "\n" +
							'path='+path
						);

			//c onsole.log('sbrowser: spoint=',spoint);
			//c onsole.log('sbrowser: pos=',spoint);
		};
		// -----------------------------
		// Auxiliary: pos-space browser
		// =============================


		self.do_expand_path=function(spoint, slocation, inject_into_session){

			var w;
			var pos = tp.core.tclone(startPos); //TODm waste of pos: make one pos per solver
			var len = slocation[0]; //spoint[OWN_SPHERE];
			var moves = [];
			for(var ss=0; ss<len; ss++){

				// Good debug:
				/*
				c onsole.log( (len-ss-1)+' '+spoint[HID]+'-'+
							' dir='+spoint[DIRECTION]+': '+spoint[PARENT_SPHERE] + '.'+ spoint[PARENT_ANGLE] +
							'->'+slocation[0]+'.'+slocation[1], spoint);
				*/

				moves[len-ss-1]= { hid : spoint[HID], direction : spoint[DIRECTION] } ;
				spoint = spheres[spoint[PARENT_SPHERE]][spoint[PARENT_ANGLE]];
			}
			//c onsole.log('hid moves=',moves);
			var uid_moves = [];

			for(var ss=0; ss<len; ss++){

				var loc0 = hid2loc[moves[ss].hid];
				var xx = loc0[0];
				var yy = loc0[1];
				var zz = pos.tops[xx][yy];
				//c onsole.log(' moving. loc0=',loc0, ' topsx=',pos.tops[xx]);
				var lid = loc2lid[xx][yy][zz];
				var uid = pos.lid2uid[lid];

				w = moves[ss];
				// Add only one step: it is enought for path2text:
				// This design is redundant: moves -> text should be done with
				// placing unit_ix directly into a text:
				uid_moves[ss] = [{ direction : w.direction, uid : uid }];
				// c onsole.log(' Moving unit='+units[uid].hname+' uid='+uid );
				var new_move = gio.do_move_steps(w.direction, gm, pos, units[uid]);
				// c onsole.log('reconstructed move: new_move.steps=', new_move.steps);
				if(!new_move){
					gio.cons_add("Path reconstruction failed: \n"+gio.info.log.move);
					return;
				}
				pos = new_move.pos;
			}


			var pseudo_round = { gm : gm, moves : uid_moves }
			// c onsole.log('pseudo_round=',pseudo_round);
			var path_text = gio.navig.in_session.round.path2text(pseudo_round);

			if( inject_into_session ){
				gio.gui.procs.inject_path_from_text(path_text, null, 'stay_at_the_end');
			}else{
				gio.cons_add('path='+path_text);
				gm.playpaths = gm.playpaths || [];
				gm.playpaths.push({title : 'Autosolved', value : path_text, pos : tp.core.tclone(startPos)});

				// Reflect solution on playpaths dom-element if
				// user is on the same map:
				if(gio.getgs().gm === gm) gio.gui.reset_playpaths(gm);
			}
			return path_text;
		};

		return self;
	};
	

})( jQuery );

