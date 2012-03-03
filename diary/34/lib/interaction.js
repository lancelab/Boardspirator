
(function( $ ){
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};


	//collision rules
	gio.check_collision=function(
				current_pos,colony_ix,unit_ix,direction,
				new_position_wrap,deepness,skipped,break_iterations)
	{
			var gm=gio.games[gio.game_ix];

			var adv=gio.advance(current_pos[colony_ix],unit_ix,direction,new_position_wrap);
			if(!adv)  return 'Out of board attempt ...';

			var x=adv.x;
			var y=adv.y;
			var xnew=adv.xnew;
			var ynew=adv.ynew;
			var actor = gm.colonies[colony_ix].nam;
			var new_skipped=$.extend({},skipped);
			new_skipped[colony_ix+' '+unit_ix]=true;
			break_iterations=break_iterations || {dobreak:false}

			var new_position=$.extend(true,[],current_pos); //NOTE: jQ converts [] to {}?
			new_position_wrap.pos=new_position;
			var	punits=new_position[colony_ix];
			var u=punits[unit_ix];

			//update:
			u.x=xnew;
			u.y=ynew;

			if(ynew >= gm.master_board.ysize )					return 'This area is for masters ... ';
			if(gio.modes[gm.mode_ix]==='edit')					return ''; //everything is allowed
			if(gio.modes[gm.mode_ix]!=='play')					return 'Our heros can only play ... Other activities are still undeveloped ...';
			if(gm.colonies[colony_ix].frozen)					return 'Only gods can move walls ...';
			if(gm.colonies[colony_ix].passive && deepness===0)	return 'This unit cannot walk ...';
			if(xnew >= gm.master_board.xsize)					return 'Cannot penetrate to outside world ...';


			var msg='';
			tp.core.each(gm.interact[actor], function(peer_nam,val)
			{

				if(!gm.colonies[peer_nam]) return true;

				var col_ix=gm.colonies[peer_nam].ix;
				var peer_ix=gm.colonies[peer_nam].ix;
				var punits=new_position[peer_ix];


				//======================================
				if(val==='block')
				//--------------------------------------
				{
					//find blocker if any:
					tp.core.each(punits, function(peer_ix,val)
					{
						//skip already checked units:
						if(new_skipped[col_ix+' '+peer_ix]){
							//console.log('did skip this: '+col_ix+' '+peer_ix);
							return true;
						};
						if(val.x === xnew && val.y === ynew)
						{
							msg=	'Blocking '+peer_nam+' '+peer_ix+ ' on the way ... in pos = '+ 	xnew+','+ynew+'...';
							return false;
						}
					});
					if(msg)return false;


				//======================================
				}else if(val==='push'){
				//--------------------------------------
					//find blocker if any:
					tp.core.each(punits, function(peer_ix,val)
					{
						if(val.x === xnew && val.y === ynew)
						{
							//skip already checked units:
							var skip_key=col_ix+' '+peer_ix;
							if(new_skipped[skip_key]) return true;

							//console.log('We found pushee '+peer_nam+' '+peer_ix+ ' at ('+xnew+','+ynew+ ') ... try to push it ... hopefully ...');
							break_iterations.dobreak=true;

							msg=	'Blocking '+deepness + 'th ' + peer_nam+ ' on the way ... in pos = '+ xnew+','+ynew+'...';
							if(deepness>=gm.DEEPNESS_LIMIT)	return false; //stop iterations
							msg=gio.check_collision(
										new_position,col_ix,peer_ix,direction,
										new_position_wrap,deepness+1,new_skipped,
										break_iterations);
							return false;
						}
					});
					//TODO move outside of if ... clean up:
					if(break_iterations.dobreak)return false;
				//--------------------------------------
				} //}else if(val==='push'){
				//======================================

		});//tp.core.each(gm.interact[actor], function(peer_nam,val)
		return msg;
	};

})(jQuery);
