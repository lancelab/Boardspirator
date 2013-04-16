(function(){		var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;

					var procs	=  gio.core.procs;
					var ggp		=  gio.gui.procs;

	
	///	Purpose:	Master Virtual Move
	//				validates input and creates new_move object from supplied:
	//				direction, unit, move
	// 				Further processes new_move depending on input
	//
	//	Usage:	called from GUI-event-keystroke-handler in this chain:
	//
	//			gio.gui.procs.move_acting_unit() ->
	//			gio.do_process_move() ->
	//				if !!round_or_play_flag, then
	//					-> gio.gui.procs.do_manage_round(...) or 
	//					-> rman.do_back_forw_start_record.round.js
	//
	//			called from text2path converter from round.js
	//			in this case, mode = round
	//
	//	Input:	if "round_or_play_flag" is supplied as a string, then move is
	//			interpreted in context of currently running gui-game
	gio.do_process_move = function(
			direction,
			gm,
			pos,
			unit,
			round_or_play_flag,
			dont_change_pos_and_leave,
			forbid_contacts,
			dropx, dropy, dropz	// landed-cell coordinates
	){


			/// does debugs
			if(gio.debug){
				gio.cons_add(	'Firing move. gkey=' + gm.game.gkey +
								' uname=' + unit.uname +
								' hname=' + unit.hname +
								' direction=' + direction);
				if( !isNaN(gio.debug) &&  gio.debug % 3 === 0 ){
					// var ww = procs.check_lid2uid_tops_integrity( gm, pos.lid2uid, pos.tops );  //TODm slow
					var ww = gio.core.procs.check_uid2lid_and_lid2uid( gm, pos.lid2uid, pos.tops, pos.uid2lid );
					if(ww){
						gio.cons_add( ww.message );
						return null; //TODO must crash app, but not let it working in broken state
					}
				}
			}



			//: validates and creates new_move
			var move		= { pos:pos, steps:[], action : { direction : direction, uid : unit.id } }
			var new_move	= gio.core.procs.do_interaction( direction, unit, move, null, forbid_contacts, null, dropx, dropy, dropz  );
			var new_move	= gio.core.procs.do_interaction( direction, unit, move, 1, forbid_contacts, null, dropx, dropy, dropz  );

			gio.modes.dynamic.verbose = (typeof round_or_play_flag === 'string');
			var verbose = gio.modes.dynamic.verbose || gio.debug;
			if( !new_move ){
				if( verbose ) gio.plcons_add(gio.info.log.move + "Move failed");
				return null;
			}
			if(gm.game.herd_sense>0 && new_move.steps.length > 1){
				new_move = gm.game.herd_rules(new_move,gm);
			}

			/// avoids changing position and leaves
			if(dont_change_pos_and_leave){
				if( verbose ) gio.plcons_add(gio.info.log.move + "Position preserved");
				return new_move;
			}

			// ** makes shortcuts
			var steps	= new_move.steps;
			var locs	= gm.locs;
			var tops	= pos.tops;
			var lid2uid = pos.lid2uid;
			var uid2lid = pos.uid2lid;
			var uid2loc = pos.uid2loc;




			/*
			if(steps[0].lid === 27 ){
				var xx = locs[28][0];
				var yy = locs[28][1];
				var tower = ' tower=';
				for(var ii=0; ii<gm.loc2lid[xx][yy].length; ii++){
					var lid = gm.loc2lid[xx][yy][ii];
					var uid = lid2uid[lid];
					var name = uid > -1 && gm.units[uid] ? ' ' + gm.units[uid].hname : ' uid='+uid;
					tower += ' z='+ii+ name; 
				}
				c onsole.log('Before units removal. step departure = 27  tops='+ tops[xx][yy] + tower + ' loc=',locs[27]);
			}				
			*/





			// ** removes units from lid2uid and from tops
			if( verbose && steps.length > 1){
				gio.info.log.move += "There are "+ new_move.steps.length + " steps in new move\n";
			}
			for(var s=0; s<steps.length; s++){
				var lid = steps[s].lid;

				//. for debug, memorizes uid before removing it:
				var ww_uid = lid2uid[lid];

				lid2uid[lid]=-1;
				var xx = locs[lid][0];
				var yy = locs[lid][1];
				tops[xx][yy] -= 1;
				//c onsole.log('Removed '+steps[s].uid+' from lid '+steps[s].lid);


				/// does a vital debug:
				if( gio.debug && !isNaN(gio.debug) &&  gio.debug % 3 === 0 ) {
					gio.cons_add(	'Unit ' + ww_uid + ' "' + ( gm.units[ww_uid] && gm.units[ww_uid].hname ) + '" ' +
									'removed from lid, xx,yy=' + lid + ', ' + xx + ',' + yy +
									' on step=' + s + ' of ' + steps.length
					);
				}
			}


			// ** valuable debug:
			/*
			if(steps[0].lid === 27 ){
				var tower = ' tower=';
				for(var ii=0; ii<gm.loc2lid[xx][yy].length; ii++){
					var lid = gm.loc2lid[xx][yy][ii];
					var uid = lid2uid[lid];
					var name = uid > -1 && gm.units[uid] ? ' ' + gm.units[uid].hname : ' uid='+uid;
					tower += ' z='+ii+ name; 
				}
				c onsole.log('step departure = 27  tops='+ tops[xx][yy] + tower + ' loc=',locs[lid]);
			}				
			*/


			///	insert units to lid2uid and tops,
			// 	finalizes inverse maps
			var roof = gm.game.rule_helpers.map_roof;
			for(var s=0; s<steps.length; s++){

				var step		= steps[s];
				var suid		= step.uid;
				var xx			= step.new_loc[0];
				var yy			= step.new_loc[1];
				var zz			= tops[xx][yy]+1;

				/// checks boundaries ... TODM redundant in well-defined app. Remove
				if( zz >= roof ) {
					throw	{ message :	'Trying to put unit '+suid+ ' "' + gm.units[suid].hname + //TODO there is no cather ... bad
										'" higher than roof. Step=' + s + ', x,y,z=' + xx + ', ' + yy + ', ' + zz
							};
				}

				// * insert units to tops
				tops[xx][yy]	= zz;

				// * finds lid of new top-location
				var zlid=gm.loc2lid[xx][yy][zz];

				// * insert units to lid2uid
				lid2uid[zlid] = suid;

				/// does a vital debug:
				if(gio.debug && !isNaN(gio.debug) &&  gio.debug % 3 === 0 ) {
					//c onsole.log();
					gio.cons_add( 'Moved unit '+suid+ ' "' + gm.units[suid].hname + '" to '+xx+','+yy+','+zz+'. lid='+zlid 	);
				}


				// ** completes inverse maps:
				uid2lid[suid] = zlid;
				uid2loc[suid] = locs[zlid];

				// * makes verticall correction in step
				step.new_lid = zlid;
			}



			/// does a valuable debug
			if( gio.debug && !isNaN(gio.debug) &&  gio.debug % 3 === 0 ){
					// var ww = procs.check_lid2uid_tops_integrity( gm, pos.lid2uid, pos.tops );  //TODm slow
					var ww = gio.core.procs.check_uid2lid_and_lid2uid( gm, pos.lid2uid, pos.tops, pos.uid2lid );
					if(ww){
						gio.cons_add( ww.message );
						return null; //TODO must crash app, but not let it working in broken state
					}
			}



			if(round_or_play_flag){
				if(typeof round_or_play_flag === 'string'){
					// Working in gui mode
					gio.gui.procs.do_manage_round(new_move.steps, false, new_move.action);
					if(gm.multiplayer){
						/// scrolls to next actor-colony
						ggp.do_one_scroll_of_colony( 'right' );
						gio.plcons_add('Hero ' + gio.getgs().unit.hname + ' selected');
					}
					if(verbose) gio.plcons_add(gio.info.log.move);
				}else{
					// Working in virtual round mode
					var round = round_or_play_flag;
					gio.navig.in_session.round.do_back_forw_start_record(
							round,
							'',
							new_move.steps,
							new_move.action);
				}
				//c onsole.log('move completed. round.pos=',round.pos, ' move=',new_move);
			}
			return new_move;
	};



	///	At the moment, used 2-times in round.js and 1 in solver.
	//	This is a "light-weight" mover: no interaction check.
	gio.navig.process_move_record = function ( gm, pos, steps, backward )
	{
			var locs = gm.locs;
			var tops = pos.tops;
			var lid2uid = pos.lid2uid;
			var uid2lid = pos.uid2lid;
			var uid2loc= pos.uid2loc;

			// Remove units:
			for(var s=0; s<steps.length; s++){
				var former_lid = backward ? steps[s].new_lid : steps[s].lid;
				lid2uid[former_lid]=-1;
				var loc = locs[former_lid];
				tops[loc[0]][loc[1]] -= 1;
				//c onsole.log('Removed '+steps[s].uid+' from lid '+steps[s].lid);
			}

			// Insert units
			for(var s=0; s<steps.length; s++){
				var step=steps[s];
				var suid=step.uid;
				var former_lid	= backward ? step.new_lid : step.lid;
				var new_lid		= backward ? step.lid : step.new_lid;
				lid2uid[new_lid]=suid;
				//c onsole.log('Moved '+step.uid+' to lid='+new_lid);
				uid2lid[suid]=new_lid;
				uid2loc[suid]=gm.locs[new_lid];

				var loc = locs[new_lid];
				var xx=loc[0];
				var yy=loc[1];
				var zz = tops[xx][yy]+1;
				tops[xx][yy]=zz;
			}
	};



	///	Verifies:	synchronization of lid2uid and gm.units
	//	Note:		perhaps not exhaustive or redundant check. TODM fix.
	//	Returns:	null if all is OK,
	//				{ message : ..., } if test failed
	//	Usage:		gio.core.procs.check_uid2lid_and_lid2uid( gm, pos.lid2uid, pos.tops, pos.uid2lid );
	procs.check_uid2lid_and_lid2uid = function( gm, lid2uid, tops, uid2lid ) {
		var failed = procs.check_uid2lid_units_integrity( gm, uid2lid );
		if( failed ) return failed;
		return procs.check_lid2uid_tops_integrity( gm, lid2uid, tops );
	};


	///	Verifies:	synchronization of lid2uid and gm.units
	//	Returns:	null if all is OK,
	//				{ message : ..., } if test failed
	procs.check_uid2lid_units_integrity = function( gm, uid2lid ) {
		for(var uid=0, len=gm.units.length; uid < len; uid++ ) {
			var lid = uid2lid[uid];	
			if( !lid && lid !== 0 ) return { message : "Unit " + uid + " " + gm.units[uid].hname + " is no longer on the map." };
		}
		return null;
	};


	///	Verifies:	synchronization of lid2uid and tops,
	//				additionally checks synchr. map_roof and tops.length.
	//	Returns:	null if all is OK,
	//				{ message : ..., } if test failed
	procs.check_lid2uid_tops_integrity = function( gm, lid2uid, tops )
	{
		var locs = gm.locs;
		var roof = gm.game.rule_helpers.map_roof;


		/// walks via 3D area but considers only planar points (x,y)
		for( var lid=0; lid<locs.length; lid++){

			var loc = locs[lid];

			//. TODM remove this. It cannot happen in stable app.
			if( (!loc && loc !== 0) ) return { message : "sparce loc. array. No loc. for lid = "+lid }; //was "throw"

			//. TODM how can this happen?: loc[3] < 0.  remove this. It cannot happen in stable app.
			if( loc[3] < 0 || loc[3] > 0 ) continue;

			//: pulls xx,yy for z = 0, ground location.
			var xx = loc[0];
			var yy = loc[1];			

			//. shortcuts static array gm.loc2lid
			var tower = gm.loc2lid[xx][yy];
			var calculated_top = -1;

			if(tower.length !== roof ){
				return {	xx : xx, yy : yy, tower : tower, 
							message :	"tower.length !== roof:" +
										tower.length + ", " + roof
						}
			}

			for( var zz=0; zz<tower.length; zz++){
				var tlid = tower[zz];	
				var uid = lid2uid[tlid];
				if( uid < 0 ) break;
				calculated_top = zz;	
			}


			if( calculated_top !== tops[xx][yy] ){
				return {	xx : xx, yy : yy, tower : tower, 
							message :	"calculated_top = " +
										calculated_top + " != tops[xx][yy] = " + tops[xx][yy]
						}
			}


		}// lid
		return null;

	};




})();
