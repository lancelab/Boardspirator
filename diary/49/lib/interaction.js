(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	//collision rules
	gio.check_collision=function(
				current_pos,colony_ix,unit_ix,direction,
				new_position_wrap,deepness,skipped)
	{
			var game=gio.games[gio.game_ix];
			var collection=game.collections[game.collections.ix];
			var gm=collection.maps[collection.map_ix];

			var actor_colony = gm.colonies[colony_ix];
			var actor_colony_nam = gm.colonies[colony_ix].nam;
			
			//vital ... keep:
			////c onsole.log('finding '+actor_colony_nam+' '+unit_ix+' interactions in deepness '+deepness);

			var adv=gio.advance(current_pos[colony_ix],unit_ix,direction,new_position_wrap);
			if(!adv)  return 'Out of board attempt ...';

			var x=adv.x;
			var y=adv.y;
			var xnew=adv.xnew;
			var ynew=adv.ynew;

			var new_skipped=$.extend({},skipped);
			new_skipped[colony_ix+' '+unit_ix]=true;

			var new_position=$.extend(true,[],current_pos); //NOTE: jQ converts [] to {}?
			new_position_wrap.pos=new_position;

			var	punits=new_position[colony_ix];
			var u=punits[unit_ix];

			//update:
			u.x=xnew;
			u.y=ynew;

			if(ynew >= gm.mboard.ysize )						return 'This area is for masters ... ';
			if(gio.modes[gm.mode_ix]==='edit')					return ''; //everything is allowed
			if(gio.modes[gm.mode_ix]!=='play')					return 'Our heros can only play ... Other activities are still undeveloped ...';
			if(gm.colonies[colony_ix].frozen)					return 'Cannot move walls ...';
			if(gm.colonies[colony_ix].passive && deepness===0)	return 'This unit cannot walk ...';
			if(xnew >= gm.mboard.xsize)							return 'Cannot penetrate to outside world ...';


			var msg='';
			//"Huge" loop over all interacting names:
			tp.core.each(game.interact[actor_colony_nam], function(peer_nam,val)
			{

				if(!gm.colonies[peer_nam]) return true;
				
				var peer_col=gm.colonies[peer_nam];
				var col_ix=peer_col.ix;
				var peer_ix=col_ix;
				var punits=new_position[peer_ix];


				//==============================================
				if(val==='block') //interacting type is 'block'
				//----------------------------------------------
				{
					//find blocker if any:
					tp.core.each(punits, function(peer_ix,val)
					{
						//skip already checked units:
						if(new_skipped[col_ix+' '+peer_ix]){
							////c onsole.log('did skip this unit: '+col_ix+' '+peer_ix+' ... cannot be blocker ');
							return true;
						};
						if(val.x === xnew && val.y === ynew)
						{
							//TODO began to mess with ix and names: human and internal
							//		do all consistently ... starth
							msg=	gio.human_name(actor_colony,unit_ix)+
									' is blocked by '+
									gio.human_name(peer_col,peer_ix)
									'. Block is inside pos '+xnew+','+ynew+'...';
							return false;
						}
					});
					if(msg)return false;


				//==================================================
				}else if(val==='push'){ //interacting type is 'push'
				//--------------------------------------------------
					//find blocker if any:
					tp.core.each(punits, function(peer_ix,val)
					{
						//At the moment, col_ix-peer_ix is a potential blocker:
						if(val.x === xnew && val.y === ynew) //blocker is on the way
						{
							//skip already checked units:
							if(new_skipped[col_ix+' '+peer_ix])return true;

							////c onsole.log('We found pushee '+peer_nam+' '+peer_ix+ ' at ('+xnew+','+ynew+ ') ... trying to push it ... hopefully ...');
							msg=	gio.human_name(actor_colony,unit_ix)+' is blocked by '+
									gio.human_name(peer_col,peer_ix) +
									//'. Deepness=' + deepness +  //debug
									'. On position '+ xnew+','+ynew+'...';
							if(deepness>=game.DEEPNESS_LIMIT){
								if(!game.inside_deepnes_ring)return false;
								if(!game.inside_deepnes_ring(col_ix,peer_ix))	return false; //stop iterations
							}
							////c onsole.log('...going to deeper interaction of '+peer_nam+' '+peer_ix);
							msg=gio.check_collision(
										new_position,col_ix,peer_ix,direction,
										new_position_wrap,deepness+1,new_skipped);
							if(!msg)return false;  //stop iterations
						}
					});
					if(msg)return false;
				//--------------------------------------
				} //}else if(val==='push'){
				//======================================

		});//tp.core.each(gm.interact[actor_colony_nam], function(peer_nam,val)
		return msg;
	};

})(jQuery);
