(function(){	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var solver			= gio.solver;
					var config			= solver.config;
					var CANON_IS_STRING	= config.CANON_IS_STRING;
					var NODES_LIMIT		= config.NODES_LIMIT;

					/// sets indices in spoint
					solver.POSPOINT = {
							STATE			: 0,
							PARENT_SPHERE	: 1,
							PARENT_ANGLE	: 2,
							DIRECTION		: 3, //spatial dir in map?
							HID				: 4
					};



	//TODO canon and solver body lacks try-catch or rigit guard



	///	Creates core solver subroutines
	//	wrapped in returned object.
	gio.solver.create_solver = function( gm_ ) {

		var self={};

		//: localizes indices
		var ww				= gio.solver.POSPOINT;
		var STATE			= ww.STATE;
		var PARENT_SPHERE	= ww.PARENT_SPHERE;
		var PARENT_ANGLE	= ww.PARENT_ANGLE;
		var DIRECTION		= ww.DIRECTION;
		var HID				= ww.HID;

		//: flags
		var forbid_contacts;
		var dont_slice_time;

		var gm		= gm_;
		var game	= gm.game;
		var units	= gm.units;


		//.	Repository of pstates. It is exposed to access contactless paths in navigator.
		//	Index of this array is a radius
		var spheres;
		var alive_nodes;
		var startPos;
		//. state. Where to start next spawning after timeout.
		var phase;
		var solutions = self.solutions = [];
		//. statistics
		var stat;
		var spawned_states_number;
		var stop_when_solution_found;
		var stopTime;
		var msg;
		//. protects from breeding solutions in gm.playpaths "heap"
		var one_solution_is_added;

		//. dynamically adjusting
		var wait_TIME = config.TIME_TO_WAIT_MS;


		//: sets shortcuts:
		var	loc2lid = gm.loc2lid;
		var	lid2hid = gm.digest.lid2hid;
		var	hid2lid = gm.digest.hid2lid;
		var	hid2loc = gm.digest.hid2loc;


		self.inactive_bf = true;
		self.stopped_bf = false;
		self.browser_mode = false;
		self.never_ran = true;
		var adapter = self.adapter = solver.Adapter( self, gm );





		/// Fires up solving beginning from startPos
		self.fire_up = function(
									startPos_,					// where to start, used ONLY at first fire
									stop_when_solution_found_,	
									forbid_contacts_,			// traverse only interactionless moves
									dont_slice_time_			// search without interruptions
		){

			if(	gm.game.gkey !== 'sokoban' && gm.game.gkey !== 'colorban' &&
				!gio.config.query.luckedin ) {
				NODES_LIMIT = 300000;
			}

			//: can be changed from fire to fire
			dont_slice_time				= dont_slice_time_;
			forbid_contacts				= forbid_contacts_;
			stop_when_solution_found	= stop_when_solution_found_;


			//: reestablishes modes ... TODM redundant at good design. callers are responsible for fsm.
			self.inactive_bf	= false;
			self.stopped_bf		= false;
			self.browser_mode	= false;
			self.never_ran		= false;

			if( !startPos_ && !( phase.sphere === 0 && phase.angle === 0 ) ) {
				self.do_searches();
				return;
			}

			//. comment
			// c onsole.log('.. search begins for the first time ... arguments = ', arguments);

			self.resume_memory();
			
			startPos = self.startPos = tp.core.tclone(startPos_);
			one_solution_is_added = false;

			//: establishes first departure sphere
			spheres[0]=[[]];
			//: sets first state ... cannot be a solution.

			//.	we implement this "try" because lock of time to make proper //TODM
			//	validations in code ... especially for correctnes of 
			//	generated hid array and parsed map-board
			try {
				spheres[0][0][STATE] = adapter.createdNode( startPos, 0, 0, alive_nodes );
			}catch (err) {
				gio.cons_add(	"zeor pos. " + 
								( typeof error === 'object' && error !== null ? error.message : '' + error )
				);
				//.	we can return here because nothing is yet done, and
				//	all flags are set to beginning
				return;
			}

												// time limits estimations for sane maps:
			spheres[0][0][PARENT_SPHERE] = -1;	// max = 16 bits
			spheres[0][0][PARENT_ANGLE] = -1;	// 32 bits
			spheres[0][0][DIRECTION] = 0;		// 3 bits
			spheres[0][0][HID] = -1;			// 32 bits

			//. establishes filling sphere
			//spheres[1]=[];

			//: establishes browser's initial state
			self.browser.position.sphere = 0;
			self.browser.position.angle = 0;


			//: establishes statistics initial state
			stat.total_states			= 1
			stat.completed_ball_size	= 1;
			stat.total_milliseconds		= 0;
			adapter.get_stat_info( self );


			/// skips calculations if winning initial state is not allowed
			if( game.won_or_not( gm, startPos ) ) {
				if( stop_when_solution_found ) {
					gio.solver_cons( 'Already on solution' );
					self.inactive_bf = true;
					return;
				}
			}

			//. sets sail
			//	fires up after event-handler done its job,
			//	it seems not good to fire this inside GUI event
			setTimeout( self.do_searches, wait_TIME ); 

		};/// Fires up solving beginning from startPos


		/// initiate garbage collector to "wipe out" shperes, alive_nodes, and
		//	browser's stuff
		self.resume_memory = function () {

			spheres = self.spheres = [];
			alive_nodes = [];
			gio.solver.create_browser( self, gm );
			phase = { sphere : 0, angle : 0 };	
			solutions = self.solutions = [];
			stat = self.stat = {};
			gio.debsol( "Memory resumed" );
		}



		///	Main time loop.
		//	Gives slices for do_search() and for user
		self.do_searches = function () {

			var return_bf = self.do_search();

			if( solutions.length > 0 ) {
				if(stop_when_solution_found){
						gio.solver_cons('Solution is found');
				}else{
						gio.solver_cons('First found solution');
				}

				if( !one_solution_is_added ) {
					one_solution_is_added = true;
					//. positions browser
					self.browser.position.sphere = solutions[0][0];
					self.browser.position.angle = solutions[0][1];
					//. adds to the heap and modifies round's path:
					self.browser.do_move(null, null, 'Just Solved');
				}
			}

			if( return_bf ) {

				switch (return_bf) {
				case 's': 
					gio.solver_cons('Solver suspended');
					break;
				case 'm': 
					gio.solver_cons('Solver stopped by memory restriction');
					break;
				case 'f': 
					gio.solver_cons('Solver stopped at first found solution');
					break;
				case 'e': 
					gio.solver_cons('Solver stopped by exhausting search space');
					break;
				case 'b':
					gio.solver_cons('Solver stopped because of internal crash');
				}

				//. does not affect gm.palypaths
				if( solutions.length === 0 ) self.browser.do_move( null, 'to end' );
				print_messages();
				self.stopped_bf		= false;
				self.inactive_bf	= true;
				gio.gui.procs.draw_status_and_scene();
				return;
			}

			var ww
			if( stop_when_solution_found ) {
				var ww = '... searching first solution ';
			}else{
				var ww = '... collecting all paths ';
			}
			gio.solver_cons( ww + 'on map "' + gm.title + '"');
			gio.solver_cons_add(	phase.sphere + '.' + phase.angle +
									' = move.positions of depature');
			print_messages();
			if( !dont_slice_time ) setTimeout( self.do_searches, wait_TIME ); 
		};





		///	Makes search and blocks JS while searching
		//	Returns: true if termination is needed
		self.do_search = function(){

			msg 						= '';
			var start_time				= (new Date()).getTime(); 
			var stopTime				= start_time + solver.config.TIME_TO_WORK_MS;
			var terminate_iterations	= '';

			/// loops via po-spheres in po-ball
			infsearch: while(true){

				//. sets sphere to begin with
				var sphere = spheres[phase.sphere];

				///	blocks further count because of empty departure-sphere
				if( self.space_exhausted() ) {
					terminate_iterations = 'e';
					return terminate_iterations;
				}

				//. reserves memory for arrival-sphere:
				if( !spheres[phase.sphere+1] ) spheres[phase.sphere+1] = [];


				/// loops via angles in departure-sphere
				for( var an=phase.angle; an < sphere.length; an++ ){

					phase.angle				= an;
					var cycle_is_done_bf	= false;				

					/// checks time slice,
					//	does not check while cycling via units and board-space
					if( !dont_slice_time && (new Date()).getTime() > stopTime ) {
						//gio.solver_cons_add('... time elapsed. memorized search point'+phase.sphere+'.'+an);
						break infsearch;
					}


					if( self.stopped_bf ) {
						terminate_iterations = 's';
						break infsearch;
					}else if( stop_when_solution_found && solutions.length > 0 ) {
						terminate_iterations = 'f';
						break infsearch;
					}

					if( stat.total_states > NODES_LIMIT ) {
						msg=	'po-states memory limit, '+ NODES_LIMIT+", is exceeded.\n";
						terminate_iterations = 'm';
						break infsearch;
					}

					var spoint	= sphere[an];
					spawned_states_number = 0;


					//.	we implement this "try" because lock of time to make proper //TODM
					//	validations in code ... especially for correctnes of 
					//	generated hid array and parsed map-board
//					try {

						var canon	= CANON_IS_STRING ? adapter.str2canon( spoint[STATE] ) : spoint[STATE];
						// TODF iteratesPushlessZone(canon);
						unitsIterator( canon );
/*
					}catch (error) {

							gio.cons_add(	"Internal error at sphere ix, angle ix = " + 
											phase.sphere + ' ' + phase.angle + ' ' + 
											( typeof error === 'object' && error !== null ? error.message : '' + error )
							);
							terminate_iterations = 'b';
							break infsearch;
					}	
*/
					stat.total_states += spawned_states_number;

					cycle_is_done_bf = true;

				} /// loops via angles in departure-sphere
				
				//.. /// loops via po-spheres in po-ball


				if( !cycle_is_done_bf ) return terminate_iterations;



				//. canons number in just constructed sphere
				var volume	= spheres[ phase.sphere+1 ].length;
				wait_TIME	= volume > config.CRITICAL_VOLUME ? 
								config.CRITICAL_WAIT_TIME :
								config.TIME_TO_WAIT_MS;
				stat.completed_ball_size += volume;


				//: advances to next sphere if departure-sphere is not void
				//	volume can be 0. We could check this now, but for consistency,
				//	let to check it at the top of next loop.
				//. renames arrival-sphere to departure-sphere which is possibly empty
				phase.sphere	+= 1;
				phase.angle		= 0;



			} /// loops via po-spheres in po-ball
			

			stat.total_milliseconds	+=	(new Date()).getTime() - start_time;
			stat.ms_per_last_step	=	Math.ceil(stat.total_milliseconds / spheres.length);
			stat.mks_per_state		=	Math.ceil(stat.total_milliseconds * 1000 / stat.total_states);

			return terminate_iterations;
		};
	


//		var iteratesPushlessZone = function(pos){
//		};


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
					//if(self.inactive_bf) return true;
					//if(stop_when_solution_found && solutions.length > 0) return true;
				}
			}
			return false;
		};



		// ==============================================
		// Loops via actors, one in a time and
		// fires space search for each actor
		// ==============================================
		var unitsIterator = function(canon){

			// Unwrap canon
			var pos = adapter.doReStorePosition(canon);

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
		var doHandleMove = function ( direction, pos, unit, unit_hid ) {

			// This breaks completeness of angle iteration:
			//if(self.inactive_bf) return false;

			//c onsole.log('core: making move. unit.id='+unit.id+' '+unit.hname+' pos=',pos);

			// Validates move
			var new_move = gio.do_process_move(direction, gm, pos, unit, null, null, forbid_contacts);
			//c onsole.log('core: after move: new_move=',new_move);

			// Failed direction:
			if( !new_move ) return false;

			var growing = spheres[phase.sphere+1];
			var growing_angle = growing.length;
				try {
			var new_canon = adapter.createdNode(new_move.pos, phase.sphere+1,  growing_angle,  alive_nodes);
				}catch (err) {
					gio.cons_add(	"Handling move. sphere ix, angle ix= " + phase.sphere + ' ' + phase.angle + ' ' + 
									( typeof error === 'object' && error !== null ? error.message : '' + error )
					);
					//tp$.deb(error);
				}




			if( !new_canon ) return new_move;

			spawned_states_number += 1;

			// Does state bookeeping
			growing[ growing_angle ]=[
					new_canon,
					phase.sphere,
					phase.angle,
					// * is an action.direction at Aug 8, 2012 app. version:
					direction,
					unit_hid
			];


			// Checks solution
			if( game.won_or_not(gm, new_move.pos) ){
				solutions.push([phase.sphere+1, growing_angle]);
			}
			return new_move;
		};//doHandleMove=function


		self.space_exhausted = function () {
			return self.spheres[phase.sphere].length === 0;
		};


		/// Prints messages and statistics ///
		var print_messages = function () {

			var res	= msg + "\n";

			var 	last_move_count = spheres.length-1;
			if(		!spheres[last_move_count].length  ) last_move_count -= 1;
			if(		last_move_count > 0 ) {
					res += last_move_count + " = arrival_move.\n";
			}

			res		+=	stat.total_states + '.' +
						stat.completed_ball_size + '.' +
						spheres[spheres.length-1].length  + 
						" = total.departure ball.arrival_sphere"+ "\n";
			res 	+=	stat.flat_dynamics_top_nodes_estimation + " = boundary\n";
			res 	+=	stat.node_dimension	+ " = canon_dimension\n";
			res 	+=	stat.hids_number	+ " = hids, ";
			res 	+=	"ms="				+ stat.total_milliseconds + ", ";
			res 	+=	"ms/total_moves="	+ stat.ms_per_last_step + ", ";
			res 	+=	"mks/total_pos="	+ stat.mks_per_state + "\n";
			res		+=	"moves:\n";
			for( var ss = 1; ss < spheres.length; ss++ ) {
				res += ss + '.' + spheres[ss].length + "\n";
			} 
			gio.solver_cons_add(res);
		}; /// Prints messages and statistics ///


		return self;

	};///	Creates core solver subroutines


})();

