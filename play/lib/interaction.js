(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var ceach=tp.core.each;

	//collision rules
	gio.check_collision=function(
			curpos,
			accol_ix,
			ac_ix,
			direction,
			newpos_wrap,
			deepness,
			skipped	){

		var w,game,gm,cols;
		gio.gst(function(g,c,m,r,p,cs){game=g; gm=m; cols=cs;});
		var accol=cols[accol_ix];
		var acting_unit_x=curpos[accol_ix][ac_ix].x
		var acting_unit_y=curpos[accol_ix][ac_ix].y

			
		//vital ... keep:
		//c onsole.log('actor= '+accol.nam+' '+ac_ix+' interactions in deepness '+deepness);

		var adv=gio.advance(curpos[accol_ix],ac_ix,direction,newpos_wrap);
		if(!adv)  return 'Out of board attempt ...';

		var xnew=adv.xnew;
		var ynew=adv.ynew;

		var new_skipped=tp.core.rclone(skipped);
		new_skipped[accol_ix+' '+ac_ix]=true;

		var newpos=tp.core.tpaste([],curpos);
		newpos_wrap.pos=newpos;

		var	w=newpos[accol_ix][ac_ix];

		//update:
		w.x=xnew;
		w.y=ynew;



		/////////////////// gatekeepers //////////////////////////////////////
		if(ynew >= gm.mboard.ysize )			return 'This area is for masters ... ';
		if(gio.modes[gm.mode_ix]==='edit')		return ''; //everything is allowed
		if(gio.modes[gm.mode_ix]!=='play')		return 'Our heros can only play ... Other activities are still undeveloped ...';
		if(accol.frozen)						return 'Cannot move walls ...';
		if(accol.passive && deepness===0)		return 'This unit cannot walk ...';
		if(xnew >= gm.mboard.xsize)				return 'Cannot penetrate to outside world ...';
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
					msg=gio.human_name(accol,ac_ix)+ ' is always blocked by '+  gio.human_name(prcol,pr_ix) + '. Block is at position '+xnew+','+ynew+'...';
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

						gio.cons('We are going to push '+prnam+' '+pr_ix+ ' at ('+xnew+','+ynew+ ') ... hopefully ...');

						msg=	gio.human_name(accol,ac_ix)+' is stopped by '+ gio.human_name(prcol,pr_ix) + '. On position '+ xnew+','+ynew+'...';
						if(deepness>=game.DEEPNESS_LIMIT){
							if(!game.inside_deepnes_ring)return false;
							if(!game.inside_deepnes_ring(prcol_ix,pr_ix))	return false; //stop iterations
						}
						var wrap=gio.check_collision(
							newpos,prcol_ix,pr_ix,direction,
							newpos_wrap,deepness+1,new_skipped);
						msg = wrap.msg;
						
						if(msg)return false;  //stop iterations and cancel the move
						newpos = newpos_wrap.pos; //wrap.newpos; //advance position
						new_skipped=wrap.skipped;
					}else if( interaction==='block' ){
						msg=gio.human_name(accol,ac_ix)+' is blocked by '+ gio.human_name(prcol,pr_ix) + '. On position '+ xnew+','+ynew+'...';
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
							msg=gio.human_name(accol,ac_ix)+ ' is blocked by '+  gio.human_name(prcol,pr_ix) + '. Block is inside pos '+xnew+','+ynew+'...';
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
				msg=gio.human_name(accol,ac_ix)+ ' cannot go out of its areal to position '+xnew+','+ynew+'...';
			}
		}
		//- - - - - - - - - - - - - - - - - - -
		// Check areal
		//-------------------------------------


		//return {msg:msg, newpos:newpos, skipped:new_skipped};
		return {msg:msg, skipped:new_skipped};
	};

})(jQuery);
