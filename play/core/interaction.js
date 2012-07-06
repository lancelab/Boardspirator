(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var ceach=tp.core.each;




	gio.do_process_step=function(direction, unit, move, effective_recursion_deepness)
	{

		// * Store virtual move messages here:
		var log = gio.info.log;
		var steps = move.steps;
		if(!steps.length) log.move = '';


		var new_move=gio.prepare_step(direction, unit, move);
		if(!new_move) return;
		var pos=move.pos;

		var new_steps=new_move.steps;
		var movers_number = new_steps.length;
		if(!effective_recursion_deepness && effective_recursion_deepness !== 0){
			effective_recursion_deepness = movers_number;
		}
		var new_loc=new_steps[movers_number-1].new_loc;
		var xx = new_loc[0];
		var yy = new_loc[1];

		var gm=unit.gm;
		var plgam=gm.game;

		var imatrix=plgam.interact;	

		var tower = gm.loc2lid[xx][yy];
		zloop: for(var zz=0; zz<tower.length; zz++){

			var lid = tower[zz];
			var peer_uid=pos.lid2uid[lid];

			// Top is reached:
			if(peer_uid < 0) break;

			// Perhaps peer is already in the list of steps ...
			// Check this:
			for(var ss=0; ss<steps.length; ss++){
				if(steps[ss].uid === peer_uid){
					already_moving=true;
					// Hard-coded: only one pushee can be on cell:
					break zloop;
				}
			}


			var peer=gm.units[peer_uid];
			if(peer.pass) continue;

			var MSG_XY = 'In cell '+ xx+','+yy+','+zz+".\n";
			var MSG_PEERS = unit.hname +' is blocked by '+ peer.hname +".\n";

			if(peer.block){
				log.move += MSG_PEERS + MSG_XY;
				return null;
			}

			if(imatrix[unit.cname] && imatrix[unit.cname][peer.cname]){
				var interaction=imatrix[unit.cname][peer.cname];
				if(interaction==='push'){
					if(effective_recursion_deepness>plgam.DEEPNESS_LIMIT){
						log.move +=	MSG_PEERS + MSG_XY + "Cannot push more than " +
									plgam.DEEPNESS_LIMIT+"\n";
						return null;
					}
					new_move=gio.do_process_step(
							direction, peer, new_move,
							effective_recursion_deepness+1
					);
					if(!new_move) return null;
				//}else if( interaction==='block' ){
				//	log.move +=	MSG_PEERS + MSG_XY;
				//	return null;
				}else if(interaction==='swap'){
					// TODm later. swap
				}else if(interaction !== 'pass'){
					log.move +=	MSG_PEERS + MSG_XY;
					return null;
				}

			}else{
					log.move +=	MSG_PEERS + MSG_XY;
					return null;
			}//	if(imatrix[accol.nam])

		}//if(imatrix[unit.cname]

		//c onsole.log('step success. unit='+unit.id+' '+ unit.cname  +
		//			' eff. deepness='+ effective_recursion_deepness + 'steps=',new_move.steps
		//);

		return new_move;
	}; //process_move



	// ===================================================================
	// Action:	clones move.steps and adds step to it
	//			makes preliminary checks and returns null if failed.
	// Input:	direction =	-1,1 for x, -2,2 for y, (will: -3,3 for z)
	// ===================================================================
	gio.prepare_step=function(direction, unit, move)
	{
		var dimension = Math.abs(direction)-1;
		if(dimension<0) return null;

		var gm=unit.gm;
		var uid=unit.id;
		var loc=gm.locs[move.pos.uid2lid[uid]];
		var dir = direction > 0 ? 1 : -1;
		var locd=loc[dimension];
		var new_locd=locd + dir;

		// Preliminary checks:
		if(new_locd<0 || new_locd >= gm.size[dimension]){
			return null;
		}

		var new_loc=[loc[0],loc[1],loc[2]];
		new_loc[dimension] = new_locd;


		// Does planar location exist?
		var xx=new_loc[0];
		var yy=new_loc[1];
		var zz=new_loc[3];
		if(!gm.xy_exists[xx][yy]){
			//c onsole.log('Forbidden cell', xx, ', ', yy);
			return null;
		}

		var lid = gm.loc2lid[loc[0]][loc[1]][loc[2]];
		var new_lid = gm.loc2lid[xx][yy][zz];


		var step={	uid : uid,
					loc : loc,
					lid : lid,
					direction : direction,
					new_loc : new_loc,
					new_lid : new_lid
				 };

		var new_move = {
					pos : move.pos,
					steps : tp.core.tpaste([],move.steps)
		};
		new_move.steps.push(step);
		return new_move;
	};



	var inside_plain_square=function(center_loc, test_loc, radius)
	{
		return 	Math.abs(test_loc[0]-center_loc[0])<=radius &&
				Math.abs(test_loc[1]-center_loc[1])<=radius;
	};



})(jQuery);
