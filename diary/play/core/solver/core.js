
( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var solver			= gio.solver;
					var config			= solver.config;
					var NODES_LIMIT		= config.NODES_LIMIT;

					/// Sets indices in spoint,
					//	perhaps should be in gio.solver.config.
					solver.POSPOINT = {
							STATE			: 0,
							HID				: 1,
							PARENT_SPHERE	: 2,
							PARENT_ANGLE	: 3,
							DIRECTION		: 4, // action.direction at Aug 8, 2012 app. version
							UNIT_HID		: 5,
							UPLINKS			: -1 // defined dynamically
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
		var UNIT_HID		= ww.UNIT_HID;

		//: canon representation
		var CANON_REPRESENTED_AS	= config.CANON_REPRESENTED_AS;
		var wCON					= gio.solver.CONSTANTS;
		var CANON__STRING			= CANON_REPRESENTED_AS	=== wCON.CANON_STRING;
		var CANON__ARRAY			= CANON_REPRESENTED_AS	=== wCON.CANON_ARRAY;
		var CANON__LINKED_LIST		= CANON_REPRESENTED_AS	=== wCON.CANON_LINKED_LIST;
		solver.POSPOINT.UPLINKS		= CANON__LINKED_LIST ? 2 : 0;
		

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
		var createdNode = adapter.createdNode;




		/// Fires up solving beginning from startPos
		self.fire_up = function(
									startPos_,					// where to start, used ONLY at first fire
									stop_when_solution_found_,	
									forbid_contacts_,			// traverse only interactionless moves
									dont_slice_time_			// search without interruptions
		){

			if(	gm.game.gkey !== 'sokoban' && gm.game.gkey !== 'colorban' && gm.game.gkey !== 'co_sokoban' && 
				gm.game.gkey !== 'boximaze' && gm.game.gkey !== 'co_colorban' &&
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

				if( CANON__LINKED_LIST )
				{
					spheres[0][0] = createdNode( startPos, 0, 0, alive_nodes );
				}else{
					spheres[0][0][STATE] = createdNode( startPos, 0, 0, alive_nodes );
					spheres[0][0][UNIT_HID] = -1;			// sane?: 32 bits
				}

			}catch (error) {
				gio.cons_add(	"setting zero position: " + 
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
			//. null indicates absense of parent node.
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
					self.browser.do_move( null, null, 'Just Solved', 'do_metrify_optimal' );
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
						// TODF iteratesPushlessZone(canon);
						unitsIterator( spoint );
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
		var spaceIterator=function(unit, pos, unit_hid ) {
			for(var x=-1; x<2; x++){
				for(var y=-1; y<2; y++){
					if( x !== 0 && y !== 0 ) continue;
					if( x === 0 && y === 0 ) continue;
					var direction = y !==0 ? 2*y : x;
					var new_move = doHandleMove(  direction, pos, unit, unit_hid );
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
		var unitsIterator = function( spoint ) {

			if( CANON__LINKED_LIST )
			{
				var pos	= adapter.canode2pos( spoint );
			}else{
				var canpos	= spoint[STATE];
				canpos		= CANON__STRING && adapter.str2canon( canpos );
				var pos		= adapter.doReStorePosition( canpos );
			}

			for( var ii=0; ii<gm.actor_cols.length; ii++ ) {
				var col = gm.actor_cols[ii];
				var cunits=col.units;
				for( var uix=0; uix < cunits.length; uix++ ) {
					var unit = cunits[ uix ];
					var lid = pos.uid2lid[ unit.id ];
					var unit_hid = lid2hid[ lid ];
					spaceIterator( unit, pos, unit_hid );
				}
			}
		};






		// ==============================================
		// Converts canon to pos, fires: move, former
		// pos check, adding to sphere, and won-check.
		// ==============================================
		var doHandleMove = function ( direction, pos, unit, unit_hid ) {


			//c onsole.log('core: making move. unit.id='+unit.id+' '+unit.hname+' pos=',pos);


			// Validates move
			var new_move = gio.do_process_move(direction, gm, pos, unit, null, null, forbid_contacts);
			//c onsole.log('core: after move: new_move=',new_move);

			// Failed direction:
			if( !new_move ) return false;

			var growing = spheres[phase.sphere+1];
			var growing_angle = growing.length;


			try {
					var new_canon = createdNode( new_move.pos, phase.sphere+1,  growing_angle,  alive_nodes );
			}catch (error) {
					gio.cons_add(	"Solver: Error: In doHandleMove: sphere ix, angle ix= " +
									phase.sphere + ' ' + phase.angle + ' ' + 
									( typeof error === 'object' && error !== null ? error.message : '' + error )
					);
					throw "Solver failed";
					//tp$.deb(error);
			}




			if( !new_canon ) return new_move;


			/// Does state bookeeping
			if( CANON__LINKED_LIST )
			{
				var new_canode = new_canon;
			}else{
				var new_canode = [];
				new_canode[ STATE ] = new_canon;
			}
			//.. * do assess required space for future development: fits ? one double-precision float 51 bits
			new_canode[ PARENT_SPHERE ]	= phase.sphere;	// * 1000 moves is enough ... 2^10
			new_canode[ PARENT_ANGLE ]	= phase.angle;	// * This is unpredictable ... max = 10 000 000 is good ... 2^23

			new_canode[ UNIT_HID ]		= unit_hid;		// * 1000 gives enough difficult games ... 2^10
			new_canode[ DIRECTION ]		= direction;	// * 4 bits

			growing[ growing_angle ] = new_canode;
			spawned_states_number += 1;


			// Checks solution
			if( game.won_or_not( gm, new_move.pos ) ) {
				solutions.push( [ phase.sphere + 1, growing_angle ] );
			}
			return new_move;
		};//doHandleMove=function


		self.space_exhausted = function () {
			return self.spheres[phase.sphere].length === 0;
		};


		/// Prints messages and statistics ///
		var print_messages = function () {

			var res	= msg + "\n";


			var ww	= spheres.length-2 >= 0 ? spheres[spheres.length-2].length : 0;

			res		+=	'DEPARTURE:  ' +
						phase.sphere + '.' +
						stat.completed_ball_size + '.' +
						ww + '.' +
						phase.angle +
						" = move.ball.sphere.sphere_departed \n";

			var 	last_move_count = spheres.length-1;
			if(		!spheres[last_move_count].length  ) last_move_count -= 1;

			res		+=	'ARRIVAL:    '
			res		+=	last_move_count ? last_move_count : '  ' ;
			res		+=	'.' + stat.total_states + '.' +
						//stat.completed_ball_size + '.' +
						spheres[spheres.length-1].length  + 
						" = move.total.sphere"+ "\n";
			res 	+=	'Boundary =      '	+ stat.flat_dynamics_top_nodes_estimation + "\n";
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



	///	Fires:	Solver Utilities.
	//	Used:	as callback from solver-select-element-buttons,
	//			as direct call by URL-query.solve command.
	gio.solver.fire_button_callback = function( dummy, item_option, select_el_dummy )
	{
									gio.debly( "Ordered: " + item_option.title );
									var gs = gio.getgs();
									var gm = gs.gm;
									var msol = gm.solver;
									//var options = select_el.arg.r.options;

									var do_search = '';									
									switch ( item_option.title ) {
									case 'Search First':
											do_search = 'first';
											break;
									case 'Search All':
											do_search = 'all';
											break;
									case 'Resume':
											do_search = 'resume';
											break;
									case 'Suspend':
											msol.stopped_bf = true;
											break;
									case 'Browse':
											msol.browser_mode = true;
											//. does empty move
											msol.browser.do_move();
											break;
									case 'Go to Play':
											msol.browser_mode = false;
											break;
									case 'Release Memory':
											msol.resume_memory();
											break;
									}

									gio.draw_status();

									if( do_search && msol.inactive_bf ) {
											gm.solver.fire_up(
												do_search !== 'resume' && gs.round.pos,
												do_search !== 'all'
											);
									}
									gio.draw_status();
			

	};



})();

