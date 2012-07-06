(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var ceach=tp.core.each;

	//collision rules

	// Store virtual move messages here:
	gio.msg = gio.msg || {};


	gio.do_move_step=function(direction, unit, move){

		// Prepare logging:
		var steps = move.steps;
		var movers_number = steps.length;
		var msg = gio.msg;
		if(!movers_number) msg.move_log = '';


		var new_move=gio.do_step(direction, loc, unit, move)
		if(!new_move) return;
		var new_pos=new_move.pos;


		var new_loc=steps[movers_number-1].new_loc;
		var xx = new_loc[0];
		var yy = new_loc[1];

		var gm=unit.gm;
		var game=gm.game;
		var imatrix=game.interact;	
		var irules=game.interact_rules;
		var neutral=irules.neutral;
		var blocks=irules.blocks;

		var tower = gm.loc2id[xx][yy];
		for(var zz=0; zz<tower.length; zz++){
			var lid = tower[zz];
			var peer=gm.units[pos.lid2uid[lid]];
			if(neutral[peer.cname]) continue;
			if(blocks[peer.cname]){
				msg.move_log += unit.hname + ' is always blocked by ' + peer.hname +
							  "\n. Block in cell "+xx+','+yy+','+zz;
				return null;
			}

			if(imatrix[unit.cname] && imatrix[unit.cname][peer.cname]){ // Do this couple of units interact at all?
					var interaction=imatrix[unit.cname][peer.cname];
					if(interaction==='push'){
						if(movers_number>game.DEEPNESS_LIMIT){
							msg.move_log +=	unit.hname +' is stopped by '+ peer.hname + 
											".\n On cell "+ xx+','+yy+','+zz+
											".\n Cannot push more than " + game.DEEPNESS_LIMIT+"\n";
							// TODO Do later
							//if(!game.inside_deepnes_ring)return false;
							//if(!game.inside_deepnes_ring(prcol_ix,pr_ix))	return false; //stop iterations
						}
						var pos_result=gio.do_move_step(direction, peer, new_move);
						if(!pos_result) return null;
						new_move = pos_result;
					}else if( interaction==='block' ){
						msg.move_log +=	unit.hname + ' is blocked by ' + peer.hname +
										'. On cell '+ xx+','+yy+','+zz+"\n";
						return null;
					}else if(interaction==='swap'){
						//TODm unconditional yet:
						//In new position, put partner to place of acting unit:
						// TODO later. swap
					}
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				// Interaction matrix was not specified for acting unit
				// Check interaction policy
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				}else if( !areal[accol.nam] || areal[accol.nam]!==prnam) { 	
					if(	irules && irules.blocking_policy && !irules.non_blocks[prnam] ){
						msg.move_log +=	unit.hname + ' is blocked by ' + peer.hname +
										'. Block in cell '+ xx+','+yy+','+zz+"\n";
						return false;
					}
				}//	if(imatrix[accol.nam]){ // Does acting unit interacts at all?
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				// End of interaction checks
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		}//for(var zz=0; zz<tower.length; zz++){
		return new_move;
	}; //process_move











	//collision rules
	gio.check_collision=function(
			curpos,
			accol_ix,
			ac_ix,
			direction,
			newpos_wrap,
			deepness,
			skipped,
			dovirtual	){

		var w,game,gm,cols;
		gio.gst(function(g,c,m,r,p,cs){game=g; gm=m; cols=cs;});
		var accol=cols[accol_ix];
		var acting_unit_x=curpos[accol_ix][ac_ix].x
		var acting_unit_y=curpos[accol_ix][ac_ix].y

			
		//vital ... keep:
		//c onsole.log('interaction: actor= '+accol.nam+' '+ac_ix+' interactions in deepness '+deepness);

		var adv=gio.advance(curpos[accol_ix],ac_ix,direction,newpos_wrap);
		var new_skipped=tp.core.rclone(skipped);
		if(!adv)  return {msg:'Out of board attempt or undefined direction', skipped:new_skipped};


		var xnew=adv.xnew;
		var ynew=adv.ynew;

		new_skipped[accol_ix+' '+ac_ix]=true;

		var newpos=tp.core.tpaste([],curpos);
		newpos_wrap.pos=newpos;

		var	w=newpos[accol_ix][ac_ix];

		//update:
		w.x=xnew;
		w.y=ynew;



		/////////////////// gatekeepers //////////////////////////////////////
		if(ynew >= gm.mboard.ysize )			return {msg:'This area is for masters ... '};
		if(accol.frozen)						return {msg:'Cannot move walls ...'};
		if(accol.passive && deepness===0)		return {msg:'This unit cannot walk ...'};
		if(xnew >= gm.mboard.xsize)				return {msg:'Cannot penetrate to outside world ...'};
		/////////////////// gatekeepers //////////////////////////////////////


		//==================================================================
		// loop via partner unit
		//------------------------------------------------------------------
		//Check all units interacting with accol.nam inside new cell.
		var msg='';
		var prcol;
		var prnam;
		var irules=game.interact_rules;
		var neutral=irules.neutral;
		var blocks=irules.blocks;
		var areal=game.areal;
		var imatrix=game.interact;	

		//var do_block=false;
		ceach(newpos,function(prcol_ix, prpos_units){ //unit loop
			prcol=cols[prcol_ix];
			prnam=prcol.nam;
			if(neutral[prnam]) return true;
			ceach(prpos_units,function(pr_ix,prun){ //unit loop2
				if(prun.x !== xnew || prun.y !== ynew) return true; //skip other cells
				if(blocks[prnam]){
					msg=gio.human_name(accol,ac_ix)+ ' is always blocked by '+  gio.human_name(prcol,pr_ix) +
							 "\n. Block in cell "+xnew+','+ynew+'...';
					return false;
				}

				//skip already checked units:
				//gio.cons('partner col,ix,x,y='+prcol_ix+' '+pr_ix+', '+prun.x+', '+prun.y);
				if(new_skipped[prcol_ix+' '+pr_ix])return true;


				//Following "if... else" is a core of unit interaction:
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				// Interaction checks.
				// Interaction matrix takes precedence over interaction policy
				// Check interaction matrix first:
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				if(imatrix[accol.nam] && imatrix[accol.nam][prnam]){ // Do this couple of units interact at all?
					var interaction=imatrix[accol.nam][prnam];
					if(interaction==='push'){

						//if(!dovirtual)gio.cons(	'We are going to push '+prnam+' '+pr_ix+
						//						"\n at ("+xnew+','+ynew+ ') ... hopefully ...');

						msg=	gio.human_name(accol,ac_ix)+' is stopped by '+ gio.human_name(prcol,pr_ix) + '. On cell '+ xnew+','+ynew+'...';
						if(deepness>=game.DEEPNESS_LIMIT){
							return false;
							// TODO later:
							// inside_plain_square
							//if(!game.inside_deepnes_ring)return false;
							//if(!game.inside_deepnes_ring(prcol_ix,pr_ix))	return false; //stop iterations
						}

						var wrap=gio.check_collision(
							newpos,prcol_ix,pr_ix,direction,
							newpos_wrap,deepness+1,new_skipped);
						msg = wrap.msg;
						
						if(msg)return false;  //stop iterations and cancel the move
						newpos = newpos_wrap.pos; //wrap.newpos; //advance position
						new_skipped=wrap.skipped;
					}else if( interaction==='block' ){
						msg=gio.human_name(accol,ac_ix)+' is blocked by '+ gio.human_name(prcol,pr_ix) + ".\n On cell "+ xnew+','+ynew+'...';
						return false;
					}if(interaction==='swap'){
						//TODm unconditional yet:
						//In new position, put partner to place of acting unit:
						prun.x = acting_unit_x;
						prun.y = acting_unit_y;
					}



				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				// Interaction matrix was not specified for acting unit
				// Check interaction policy
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				}else if( !areal[accol.nam] || areal[accol.nam]!==prnam) { 	
					if(	irules && irules.blocking_policy && !irules.non_blocks[prnam] ){
							msg=	gio.human_name(accol,ac_ix)+ ' is blocked by '+  gio.human_name(prcol,pr_ix) +
									".\nBlock in cell "+xnew+','+ynew+'.';
							return false;
					}
				}//	if(imatrix[accol.nam]){ // Does acting unit interacts at all?
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
				// End of interaction checks
				//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::








			});//unit loop2
			if(msg)return false;
		});//unit loop


		//-------------------------------------
		// Check areal
		//- - - - - - - - - - - - - - - - - - -
		if(deepness===0 && game.areal[accol.nam]){
			var passed=false;
			var accol_areal=game.areal[accol.nam];
			ceach(newpos,function(prcol_ix, prpos_units){ //unit loop
				ceach(prpos_units,function(pr_ix,prun){ //unit loop2
					if(prun.x !== xnew || prun.y !== ynew) return true;
					if(accol_areal===cols[prcol_ix].nam) passed=true;
					//gio.cons('partner col,ix,x,y='+passed+' '+accol_areal+' '+cols[prcol_ix].nam+prcol_ix+' '+pr_ix+', '+prun.x+', '+prun.y);
					if(passed)return false;
				});
				if(passed)return false;
			});
			if(!passed){
				msg=gio.human_name(accol,ac_ix)+ ' cannot go out of its areal to cell '+xnew+','+ynew+'...';
			}
		}
		//- - - - - - - - - - - - - - - - - - -
		// Check areal
		//-------------------------------------


		//return {msg:msg, newpos:newpos, skipped:new_skipped};
		return {msg:msg, skipped:new_skipped};
	};


	var inside_plain_square=function(center_loc, test_loc, radius)
	{
		return 	Math.abs(test_loc[0]-center_loc[0])<=radius &&
				Math.abs(test_loc[1]-center_loc[1])<=radius;
	};



})(jQuery);
