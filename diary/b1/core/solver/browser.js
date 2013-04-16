
( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var solver			= gio.solver;
					var config			= solver.config;
					var NODES_LIMIT		= config.NODES_LIMIT;





	/// creates spoints browser
	solver.create_browser = function ( map_solver, gm_ ) {

		var msol			= map_solver;

		//: localizes indices
		var ww				= solver.POSPOINT;
		var PARENT_SPHERE	= ww.PARENT_SPHERE;
		var PARENT_ANGLE	= ww.PARENT_ANGLE;
		var DIRECTION		= ww.DIRECTION;
		var HID				= ww.HID;
		var UNIT_HID		= ww.UNIT_HID;

		//: localizes shortcuts:
		var gm				= gm_;
		var units			= gm.units;
		var	loc2lid			= gm.loc2lid;
		var	lid2hid			= gm.digest.lid2hid;
		var	hid2lid			= gm.digest.hid2lid;
		var	hid2loc			= gm.digest.hid2loc;
		var spheres			= msol.spheres;


		msol.browser		= { position : {} };





		/// Moves through accomulated po-states and exports resulted path
		//	to GUI and possibly to gm.playpaths.
		//
		//  If no move is caused by args, then current path is exported.
		//
		//	Input:	all args are opt,
		// 			add_title_to_gm_playpaths - adds path to map-paths-array
		msol.browser.do_move = function( 
											direction,
											sphere_spot,
											add_title_to_gm_playpaths,
											do_metrify_optimal
		){


			//. sets position to browser's current position
			var bp			= msol.browser.position;
			var new_angle	= bp.angle;
			var new_sphere	= bp.sphere;


			// Move through sphere:
			if(sphere_spot === 'forward' || direction === -2){
				if(	bp.sphere + 1 < spheres.length &&
					0 < spheres[bp.sphere+1].length){
						new_angle = 0;
						bp.sphere += 1;
				}

			}else if(sphere_spot === 'back' || direction === 2){
				if(bp.sphere > 0){
						bp.sphere -= 1;
						new_angle = spheres[bp.sphere].length-1;
				}

			}else if(sphere_spot ==='to beginning'){
				bp.sphere = 0;
				new_angle = 0;

			}else if(sphere_spot ==='to end'){
				bp.sphere = spheres.length - 1;
				if( !spheres[bp.sphere].length && bp.sphere > 0 ) bp.sphere -= 1; //TODMQ&D
				if( !spheres[bp.sphere].length && bp.sphere > 0 ) bp.sphere -= 1; //TODMQ&D
				new_angle = spheres[bp.sphere].length-1;
				if( new_angle < 0 ) { //TODMQ&D
					bp.sphere = 0;
					new_angle = 0;
				}

			// //\\ moves through angles
			}else if(direction === 1){
				new_angle = bp.angle + 1;
				if(	new_angle >= spheres[bp.sphere].length){
					if(	bp.sphere + 1 < spheres.length &&
						0 < spheres[bp.sphere+1].length){
						new_angle = 0;
						bp.sphere += 1;
					}else{
						new_angle= bp.angle;
					}
				}

			}else if(direction === -1){
				new_angle = bp.angle - 1;
				if(new_angle < 0 ){
					if(bp.sphere > 0){
						bp.sphere -= 1;
						new_angle = spheres[bp.sphere].length-1;
					}else{
						new_angle= bp.angle;
					}
				}
			}
			// \\// moves through angles
			bp.angle = new_angle;


			//. sets new position
			var spoint = spheres[bp.sphere][bp.angle];

			//.	If we want to go right to the chosen pstate, do this:
			//	var pos=adapter.doReStorePosition(spoint[STATE]);
			//	....init_round(gm, 'doreset', pos);
			//	But, we set start pos and expand the path to the chosen pstate:
			gio.navig.in_session.round.init_round( gm, 'doreset', msol.startPos );
			var paths = msol.do_expand_path( 
							spoint,
							[bp.sphere, bp.angle],
							( do_metrify_optimal ? 'do_metrify_optimal' : 'only inject_into_session' ),
							add_title_to_gm_playpaths
			);

			gio.solver_cons_add(
					' p-point = '	+ bp.sphere + '.' + bp.angle + ' l-index='+spoint[UNIT_HID] +
					' parent = '	+ spoint[PARENT_SPHERE] + '.' + spoint[PARENT_ANGLE] +
					' dir='			+ spoint[DIRECTION] + "\n" +
					":::playpath=from solver\n" + paths.path + "\n\n" +
					(paths.co_path && (":::co-playpath=from solver\n" + paths.co_path ))

			);

		};



		/// Expands:	path from startPos till spoint
		//	
		//	Input:		slocation = [sphere, angle]
		//				spoint = po-state on the same slocation	
		//				inject_into_session - opt, modifies round's path,
		//				add_title_to_gm_playpaths - opt,
		//						adds path to gm.playpaths with this title
		msol.do_expand_path = function( spoint, slocation, inject_into_session, add_title_to_gm_playpaths )
		{

			var pos		= tp.core.tclone( msol.startPos ); //TODm waste of pos: make one pos per solver
			var len		= slocation[0]; //spoint[OWN_SPHERE];
			var moves	= [];

			// c ccc( 'new spoint=', spoint );

			for( var ss = 0; ss < len; ss++ ) {

				// Good debug:
				
				// c ccc(	(len-ss-1)+' '+spoint[UNIT_HID]+'-'+ ' dir='+spoint[DIRECTION] +
				//		', sphere.angle='+spoint[PARENT_SPHERE] + '.'+ spoint[PARENT_ANGLE] +
				//		' top? sphere.angle='+slocation[0]+'.'+slocation[1]);

				//. seems crashes in linked-list:
				//, spoint);
				
				moves[len-ss-1]= { hid : spoint[UNIT_HID], action : { direction : spoint[DIRECTION] } } ;

				spoint = spheres[ spoint[ PARENT_SPHERE ] ][ spoint[ PARENT_ANGLE ] ];
				if( !spoint ) break;
			}


			// c ccc( 'do_expand_path: moves=' , moves );
			var uid_moves = [];


			for(var ss=0; ss<len; ss++) {

				var hid		= moves[ss].hid;
				var loc0	= hid2loc[hid];
				var xx		= loc0[0];
				var yy		= loc0[1];
				var zz		= pos.tops[xx][yy];
				var lid		= loc2lid[xx][yy][zz];
				var uid		= pos.lid2uid[lid];

		
				// c ccc(	'Browser: Moving unit=' + units[uid].hname + ' uid=' + uid +
				//			' from? hid=' + hid + ' from lid=' + lid +
				//			' from xx,yy,zz' + xx + ', ' + yy + ', ' + zz
				//);


				moves[ss].action.uid = uid;

				var new_move = gio.do_process_move(
						moves[ss].action.direction,
						gm,
						pos,
						units[uid]
				);
				// c onsole.log('reconstructed move: new_move.steps=', new_move.steps);
				if(!new_move){
					gio.solver_cons_add("Path reconstruction failed: \n"+gio.info.log.move);
					return;
				}
				uid_moves[ss] = new_move;
				pos = new_move.pos;
			}


			var pseudo_round = { gm : gm, moves : uid_moves }
			// c onsole.log('pseudo_round=',pseudo_round);
			var path_texts = gio.navig.in_session.round.path2texts( pseudo_round, 'sugar_do_co_path' );

			var path_text	= path_texts.path;
			var co_path		= path_texts.co_path;

			if( inject_into_session )
			{
				var w_gs = gio.getgs();
				var round = gm.rounds[ gm.rounds.ix ];
				if( w_gs.gm === gm )
				{
					gio.gui.procs.inject_path_from_text( path_text, null, 'stay_at_the_end' ); //TODM do validation
				}else{

					var w_validator_msg = gio.navig.in_session.round.text2round( path_text, round ); //TODM do validation
				}

				if( 'do_metrify_optimal' === inject_into_session )
				{
					gm.metrics.optpath		= gm.metrics.optpath || {};
					gm.metrics.optpath.p	= round.moves.length;
					gm.metrics.optpath.i	= round.interacts;
					gm.metrics.optpath.r	= round.peer_change;
					gio.session.reinit.metrify( gm );
				}
			}



			// //\\ adds path to gm.playpaths
			if( add_title_to_gm_playpaths ) {

				if( 'do_metrify_optimal' === inject_into_session )
				{
					var ww = gm.metrics.optpath;
					var directive = 'optpath=' + ww.p + '.' + ww.i + '.' + ww.r + "\n";
				}else{
					var directive = "playpath=" + add_title_to_gm_playpaths + "\n";
				}
				var ww = directive;

				gio.solver_cons_add( ":::" + ww + path_text + (co_path && ("\n:::co_" + ww + co_path )) );
				gm.playpaths = gm.playpaths || [];
				gm.playpaths.push({	title : add_title_to_gm_playpaths,
									value : path_text,
									pos : tp.core.tclone(msol.startPos)
				});

				// Reflect solution on playpaths dom-element if
				// user is on the same map:
				if( gio.getgs().gm === gm ) gio.gui.reset_playpaths_select_el();

			} // \\// adds path to gm.playpaths


			return path_texts;

		};/// Expands:	path from startPos till spoint

			
	};/// creates spoints browser
	

})();

