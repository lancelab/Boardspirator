(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;



	// Input:	if "mode" is supplied, then move is
	//			interpreted in context fo currently running gui-game:
	gio.do_move_steps=function(direction, gm, pos, unit, mode, freeze_pos)
	{
			//c onsole.log('before move done. pos=', pos);
			var move={ pos:pos, steps:[], }
			var new_move=gio.do_process_step( direction, unit, move  );
			if( !new_move ){
				//gio.cons(gio.info.log.move);
				return null;
			}

			// ... if there are passive units:
			if(gm.game.herd_sense>0 && new_move.steps.length > 1){
				new_move=gm.game.herd_rules(new_move,gm);
			}

			if(freeze_pos) return new_move;

			// Localizers:
			var steps=new_move.steps;
			var locs = gm.locs;
			var tops = pos.tops;
			var lid2uid = pos.lid2uid;
			var uid2lid = pos.uid2lid;
			var uid2loc = pos.uid2loc;


			// Remove units:
			for(var s=0; s<new_move.steps.length; s++){
				var lid = steps[s].lid;
				lid2uid[lid]=-1;
				var xx = locs[lid][0];
				var yy = locs[lid][1];
				tops[xx][yy] -= 1;
				//c onsole.log('Removed '+steps[s].uid+' from lid '+steps[s].lid);
			}

			// Insert units
			for(var s=0; s<new_move.steps.length; s++){
				var step=steps[s];
				var suid=step.uid;
				var xx=step.new_loc[0];
				var yy=step.new_loc[1];
				var zz = tops[xx][yy]+1;
				tops[xx][yy]=zz;

				var zlid=gm.loc2lid[xx][yy][zz];

				lid2uid[zlid]=suid;
				//c onsole.log('Moved '+suid+' to '+xx+','+yy+','+zz+'. lid='+zlid);

				//complete inverse maps:
				uid2lid[suid]=zlid;
				uid2loc[suid]=locs[zlid];

				// make verticall correction in step:
				step.new_lid=zlid;
			}





			if(mode){
				if(typeof mode === 'string'){
					// Working in gui mode
					gio.gui.procs.do_manage_round(new_move.steps);
					if(gm.multiplayer){
						gio.do_one_scroll_of_colony('right');
						gs = gio.getgs();
						gio.cons_add('Hero ' + gs.unit.hname + ' selected');
					}
				}else{
					// Working in virtual round mode
					var round = mode;
					gio.navig.in_session.round.do_back_forw_start_record(round, '', new_move.steps);
				}
				//c onsole.log('move completed. round.pos=',round.pos, ' move=',new_move);
			}
			//if(solver)

			return new_move;
	};




	gio.navig.process_move_record=function(gm, pos, steps, backward){
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


	// Actions:	some colonies are disabled in play mode ... do skip them:
	// 			loop through all and find active index:
	gio.skip_inactive_colony=function(gm,direction)
	{
			if(gm.actor_cols.length < 1) return;
			var len=gm.cols.length;
			var cid=gm.acting_col.id;

			for(var i=0; i<len; i++)
			{
				if(gm.cols[cid].activity.active)
				{
					gm.acting_col = gm.cols[cid];
					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					cid=(cid+len-1)%len;
				}else{
					cid=(cid+1)%len;
				}
			}
	};

	gio.do_one_scroll_of_colony=function(pointer)
	{
		var gs=gio.getgs();
		if(!gs.col) return; //TODm rid
		var gm=gs.gm;
		var cid=gs.cid;

		var len=gm.cols.length;

		if(  pointer === 'left' || pointer === 'up'   ){
			cid=(cid+len-1)%len;
		}else{
			cid=(cid+1)%len;
		}

		gm.acting_col = gm.cols[cid];
		gio.skip_inactive_colony(gm,pointer);
	};


	// Action:	does one scrol of unit in acting colony
	gio.do_one_scroll_of_unit_in_colony=function(pointer)
	{
			var gs = gio.getgs();
			var units = gs.col.units;
			var ulen = units.length;

			var direction = isNaN(pointer) ? pointer : 'down';
			var uix=gs.unit.ix;	

			if(direction==='left' || direction==='up'){
				uix=(ulen*2+uix-1)%ulen;
			}else{
				uix=(ulen*2+uix+1)%ulen;
			}
			gs.col.acting_unit = units[uix];
			gio.gui.procs.refresh();
			return false;
	};



})(jQuery);
