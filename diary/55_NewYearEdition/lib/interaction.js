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
		// unit loop
		//------------------------------------------------------------------
		//Check all units interacting with accol.nam inside new cell.
		var msg='';

		var do_block=false;
		ceach(newpos,function(prcol_ix, prpos_units){ //unit loop
			ceach(prpos_units,function(pr_ix,prun){ //unit loop2
				do_block=false;


				//skip other cells:
				if(prun.x !== xnew || prun.y !== ynew) return true;
				//now ... blocker is on the way

				//skip already checked units:
				if(new_skipped[prcol_ix+' '+pr_ix])return true;

				var prcol=cols[prcol_ix];
				var prnam=prcol.nam;

				if(game.interact[accol.nam]){
					var interaction=game.interact[accol.nam][prnam];
					if(interaction==='block'){
						do_block=true;
					}else if(interaction==='push'){

						//c onsole.log('We found pushee '+prnam+' '+pr_ix+ ' at ('+xnew+','+ynew+ ') ... trying to push it ... hopefully ...');
						msg=	gio.human_name(accol,ac_ix)+' is blocked by '+ gio.human_name(prcol,pr_ix) + '. On position '+ xnew+','+ynew+'...';
						if(deepness>=game.DEEPNESS_LIMIT){
							if(!game.inside_deepnes_ring)return false;
							if(!game.inside_deepnes_ring(prcol_ix,pr_ix))	return false; //stop iterations
						}
						msg=gio.check_collision(
							newpos,prcol_ix,pr_ix,direction,
							newpos_wrap,deepness+1,new_skipped);
						if(!msg)return false;  //stop iterations
						return true;
					}
				}

				//check policy for undefined interaction value:
				w=game.interact_rules;
				do_block =	do_block ||
							(	w && w.blocking_policy &&
								w.non_blocks && 
								!w.non_blocks[prnam]
							);
				if(do_block){
					msg=gio.human_name(accol,ac_ix)+ ' is blocked by '+  gio.human_name(prcol,pr_ix) + '. Block is inside pos '+xnew+','+ynew+'...';
					return false;
				}
			});//unit loop2
			if(msg)return false;
		});//unit loop
		//------------------------------------------------------------------
		// unit loop
		//==================================================================


		return msg;
	};

})(jQuery);
