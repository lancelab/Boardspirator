(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	//Purpose:	handle keyboard navigation events
	//Note:		click navigation handlers are set in init.js and auxiliary.js



	var move_direction = { 'left' : -1, 'right' : 1, 'up' : -2, 'down' : 2,  'zup' : 3, 'zdown' : -3 };

	gio.virtual_move=function(direction,dovirtual,colony, unit_ix){
			var game, collection, gm, round, pos;
			gio.gst(function(g,c,m,r,p){	game=g; collection=c; gm=m; round=r; pos=p;   });

			var colony_ix=pos.colony_ix;
			if(colony)colony_ix=colony.ix;

			var punits=pos[colony_ix];
			var punit_selected= (unit_ix || unit_ix===0) ? unit_ix : punits.selected;

			var ulen=punits.length;

				var new_position={pos:null,moves:[]} //TODm waste
				var skipped={};
				//skipped[colony_ix+' '+punits.selected]=true;
				if(!dovirtual)gio.cons('moving '+gio.human_name(gm.colonies[colony_ix], punit_selected)+' ... ');

				var wrap=gio.check_collision(
					pos,colony_ix,punit_selected,
					direction,new_position,0,skipped,dovirtual
				);
				var msg=wrap.msg;
				if(msg){
					gio.cons_add(msg);
					return msg;
				}
				if(game.herd_size>0){
					new_position=game.herd_rules(new_position.moves, new_position.pos);
				}

				delete round.pos; //TODm help collect garbage better
				round.pos=new_position.pos;
				gio.do_record(new_position.moves); //,null,dovirtual);
				if(gm.multiplayer)gio.virtual_scroll_colony('right');
				return '';
	};


	gio.advance=function(punits,unit_ix,direction,new_position_wrap)
	{
				var u=punits[unit_ix];
				var xnew=x=u.x;
				var ynew=y=u.y;
				switch(direction)
				{
					case -1:	if( x>0 ) xnew=x-1;
									break;
					case 1:		xnew=x+1;
									break;
					case -2	:	if( y>0 ) ynew=y-1;
									break;
					case 2:		ynew=y+1;
									break;
				}
				if(xnew === x && ynew === y) return null;
				var move={	x:x, y:y, direction:direction, xnew : xnew, ynew : ynew, 
							punit:u };
				new_position_wrap.moves.push(move);
				return {x : x, y : y, xnew : xnew, ynew : ynew, u : u };
	};



	// New is below:


	gio.do_move_steps=function(direction, gm, pos, uid ){
			var move={ pos:pos, steps:[]}
			var new_move=gio.do_move_step( direction, gm.units[uid], move  );
			if( !new_move ){
				gio.cons(gio.msg.move_log);
				return null;
			}

			// Update loc objects
			for(var s=0; s<new_move.steps; s++){
				var loc=new_move.steps[s].new_loc;
				var x=loc[0];
				var y=loc[1];
				var z=loc[2];

				if(gm.unbound){
					throw( 'Unbound board is not yet implemented' );
				}else{
					var ll = gm.loc2lid[x][y];
					var lid= ll[x][y][z];
					if( !lid || lid !== 0) {
						// New location is discovered. Adding it:
						var lid = gm.locs.length;
						gm.locs[lid]	= [ x,y,z ];
						ll[x][y][z]		= lid;
					}
				}
			}

			// TODO later
			//if(game.herd_size>0){
			//	new_wrap=game.herd_rules(new_wrap);
			//}
			return new_move;
	};

	

	// Action:	creates move and adds it to steps
	//			makes boundary check
	//	-1,1 for x, -2,2 for y, (will: -3,3 for z)
	gio.do_step=function(direction, loc, unit, move, round)
	{
		var dimension = Math.abs(direction)-1;
		if(dimension<0) return null;
		var dir = (direction > 0 ? 1 : -1);

		var locd=loc[dimension];
		var new_locd=loc[dimension] + dir;


		// Preliminary checks:
		var gm=unit.gm;
		var col=gm.cols[unit.cid];
		if(col.frozen)										return null; //do msg
		if(col.passive && move.steps.length === 0)		return null; //{msg:'This unit cannot walk ...'};

		// Checks boundaries:
		if(gm.unbound){
			throw( 'Unbound board is not yet implemented' );
		}else{
			if(new_locd<0 || newlocd >= gm.size[dir]){
				return null;
			}
			// Does planar location exist?
			var ll = gm.loc2lid;
			if(!ll[x] || !ll[x][y]){
				return null;
			}
		} 

		var new_loc=[loc[0],loc[1],loc[3]];
		new_loc[dimension] = new_locd;
		var step={	uid : uid,
					loc : loc,
					new_loc : new_loc,
					direction : direction
				 };

		var new_move = tp.core.tpaste([],move);
		new_move.steps.push(step);

		if(round){
			delete round.pos; //TODm help collect garbage better
			round.pos=new_move.pos;
			gio.do_record(new_move.steps);
			if(gm.multiplayer)gio.virtual_scroll_colony('right');
			return '';
		}
		return new_move;
	};



	//some colonies are disabled in play mode ... weed them out:
	//loop through all and find active index:
	gio.skip_inactive_colony=function(gm,direction){

			var len=gm.colonies.length;
			var pos=gm.rounds[gm.rounds.ix].pos; //rid

			var ix=gm.acting.cid;

			ix=pos.colony_ix;

			for(var i=0; i<len; i++)
			{
				if(!gm.colonies[ix].frozen && !gm.colonies[ix].passive)
				{
					pos.colony_ix=ix; //rid

					gm.acting.cid = ix;

					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					ix=(ix+len-1)%len;
				}else{
					ix=(ix+1)%len;
				}
			}
	};

	gio.virtual_scroll_colony=function(pointer){
		var game, collection, gm, round, pos;
		gio.gst(function(g,c,m,r,p){	game=g; collection=c; gm=m; round=r; pos=p;   });

		var len=gm.colonies.length;
		var ix=gm.acting.cid;

		ix=pos.colony_ix; //rid

		if(  pointer === 'left' || pointer === 'up'   ){
			ix=(ix+len-1)%len;
		}else{
			ix=(ix+1)%len;
		}
		pos.colony_ix=ix; //rid
		gm.acting.cid = ix;

		gio.skip_inactive_colony(gm,pointer);
	};


	// Action:	selecting by making jump from acting unit to
	//			in direction of the pointer.
	//			If pointer evaluates to a number, then no jump performed.
	// Input:	works on acting colony
	gio.scrolling_units=function(pointer){
			var direction = isNaN(pointer) ? pointer : '';

			var game=gio.games[gio.game_ix];
			var collection=game.collections[game.collections.ix];
			var gm=collection.maps[collection.map_ix];

			var round=gm.rounds[gm.rounds.ix];
			var pos=round.pos;

			var colony_ix=gm.acting.cid;
			colony_ix=pos.colony_ix; //rid


			var punits=pos[colony_ix]; //rid
			var ulen=gm.colonies.uids.length;
			ulen=punits.length;

			// ix - base to count start:
			// if no base, then base taken from the past:
			w=gm.acting.cols[colony_ix].uid;
			var ix=gm.units[w].ix;
			ix=punits.selected; //rid



			if(ix < 0 ) ix=puinits.former_selected_unit_ix;

			if(direction==='left' || direction==='up')
			{
				ix=(ulen*2+ix-1)%ulen;
			}else{
				ix=(ulen*2+ix+1)%ulen;
			}

			gm.acting.cols[colony_ix].uid=gm.colonies[colony_ix].uids[ix];

			punits.selected=ix; //rid
			gio.draw_scene();
			gio.draw_status();
			return false;
	};

	gio.select_colony=function(pointer){
		gio.virtual_select_colony();
		gio.draw_scene();
		gio.draw_status();
		return false;				
	};



})(jQuery);
