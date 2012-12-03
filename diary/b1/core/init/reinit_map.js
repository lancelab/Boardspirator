(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	// Purpose:		builds wall boundaries: if missed are -1 or row.length
	//				fills	inverse array loc2lid for all z range till map roof.
	//						and synchronizes direct array locs
	//			
	// 				builds flat cells map.xy_exists which are
	//				available to place dynamic units.
	// Returns:		true in success case,
	//				false if failed. Sets map.load='invalid' in this case.	
	var normalize_map=function(map){

		var game = map.game;
		var roof = game.rule_helpers.map_roof;
		var rhelper_dyn = game.rule_helpers.one_dynamic_unit_on_top;

		// * shortcuts primary dynamic indices
		var pos = map.pos;
		var lid2uid=pos.lid2uid;
		var lu=map.pos.lid2uid;
		var tops=pos.tops;	

		// ** shortcuts static indices
		var units = map.units;
		var locs = map.locs;
		var loc2lid = map.loc2lid;

		// ** shortcuts flat indices
		var exists=map.xy_exists = [];
		map.digest = {};
		var hid2lid = map.digest.hid2lid = [];
		var hid2loc = map.digest.hid2loc = [];
		var lid2hid = map.digest.lid2hid = [];


		// =========================================
		// Wall boundary.
		// Before building "holes" and "exists",
		// calculate wall boundaries for each y-row:
		// -----------------------------------------
		var map_boundary = game.rule_helpers.map_boundary;
		var left_wall = [];
		var right_wall = [];
		for(var yy=0; yy<map.size[1]; yy++){
			var left = -1;
			var right = map.size[0];

			if( map_boundary ){
				for(var xx=0; xx<map.size[0]; xx++){
					var top = tops[xx][yy];
					var tower = loc2lid[xx][yy];
					for(var zz=1; zz<=top; zz++){
						var unit = units[lid2uid[tower[zz]]];
						if( unit.cname === map_boundary ){
							if(left < 0) left = xx;
							right = xx;
						}
					}
				}
			}
			left_wall[yy] = left;
			right_wall[yy] = right;
		}
		// Good debug:
		// c onsole.log('Left/right walls:', left_wall, right_wall); 	
		// -----------------------------------------
		// Wall boundary end
		// =========================================





		for(var xx=0; xx<map.size[0]; xx++){

			var ex = exists[xx] = [];
			//var hidx = hol2hid[xx] = [];

			var lx = loc2lid[xx] = loc2lid[xx] || [];
			for(var yy=0; yy<map.size[1]; yy++){
				if(!lx[yy]){
					// Forbidden position:
					ex[yy]=false;
				}else{
					ex[yy]=true;
					var ly=lx[yy];
					for(var zz=0; zz<roof; zz++){
						if(!ly[zz] && ly[zz] !== 0){
							// New location is discovered
							var nlid=locs.length;
							ly[zz] = nlid;
							locs[nlid]=[ xx,yy,zz ];
							// No units there:
							lu[nlid]=-1; 
						}else{

							var lid = ly[zz];
							var uid = lu[lid];
							var unit = map.units[uid];
							//. absorbs unconditionally blocking units like wall_x
							if( unit.block ) ex[yy]=false;


							// ** makes sure dynamic units are on top
							if(rhelper_dyn && zz > 0){
								var lid_below = ly[zz-1];
								var uid_below = lu[lid_below];
								var unit_below = map.units[uid_below];
								var activity_below = unit_below.activity; 
								if( activity_below.active || activity_below.passive ){
									var activity = unit.activity; 
									if( activity.active || activity.passive ){

										map.load = 'invalid';
										gio.cons_add(	"Broken map. Two dynamic units in one cell.\n" +
														"Map: " +  map.title +
														" Unit below: " + unit_below.id + ", " +
														"Unit above: " + unit.id + ", " +
														"Cell: x,y,z: " + xx + ", " + yy + ", " + zz
										); //TODm Map validation must be separate from normilizer.
										return false;

									}else{
										// **	moves active to top by swapping with top unit,
										//		looks like too much work to fix the map ... TODm redesign?
										lu[lid_below] = uid;
										lu[lid] = uid_below;
										map.pos.uid2lid[uid] = lid_below;
										map.pos.uid2loc[uid] = map.locs[lid_below];
										map.pos.uid2lid[uid_below] = lid;
										map.pos.uid2loc[uid_below] = map.locs[lid];
									}
								}								
							}
						}
					}
					if(ex[yy]){
						if( xx <= left_wall[yy] || xx >= right_wall[yy] ){
							ex[yy] = false;
						}else{
							// Add new hid ("hole id")
							var hid=hid2lid.length;
							hid2lid[hid]=ly[0];
							hid2loc[hid]=locs[ly[0]];
							for(var zz=0; zz<roof; zz++){
								var lid = ly[zz];
								lid2hid[lid]=hid;
								//c onsole.log(map.locs[lid]+' lid='+lid+' hid='+hid);
							}
						}
					}
				}
			}
		}
		/*
		c onsole.log('map.locs=',map.locs);
		c onsole.log('map.loc2lid=',map.loc2lid);
		c onsole.log('loc2lid=',map.pos.loc2lid);
		*/
		// Good debug:
		// c onsole.log('constructed: hid2loc=',hid2loc);

		var corners = gio.solver.bays_builder(map); 
		map.load = 'valid';
		return true;
	};



	// ***	finalizes:	map after successful parsing
	//		returns:	false if validation failed
	gio.session.reinit.finalize_map = function(gm){

		if(gio.debug){
			gio.cons_add('Finalizing map. ' + gm.ix + ' game.basekey=' + gm.game.basekey);
		}


		if(!normalize_map(gm)) return false;
		gm.solver = gio.solver.create_solver(gm);
		// * creates a flag, gm.rounds
		gio.navig.in_session.round.init_round(gm);

		// ** GUI
		gio.gui.create.board(gm);
		gio.gui.create.map_focuser(gm);
		gio.gui.create.tiles(gm);

		if(gm.playpaths){
			// Preserve initial pos for supplied paths:
			tp.core.each(gm.playpaths,function(ii,pp){
				pp.pos = tp.core.tclone(gm.pos); //TODm why clone?
			});
		}
		gm.load = 'finalized';
		if(gio.debug) gio.cons_add('Finalized map ' + gm.ix + ' on gkey=' + gm.game.gkey);
		return true;
	};



	///	reinitializes current map
	//	validates and created rounds if not yet done
	gio.session.reinit.rounds = function(){

		var gm = gio.getUnfinishedState().gm;
		var game = gm.game;

		if(gm.load === 'invalid') {
			gio.session.reinit.messages =
				"Invalid gm.load\n" +
				(gm.invalid_map_message || '') +
				"\nMap board = \n" +
				tp.core.dotify( gm.script.raw_board, 1000, "", "", "\n(....)" ) +
				"\n";
			return false;

		}
		if(gm.load === 'parsed'){
			var finalized = gio.session.reinit.finalize_map(gm);
			if(!finalized) return false;
		}

		gio.gui.procs.unhide_current_dom_board();

		gio.gui.reset_playpaths(gm);
		gio.gui.reset_rounds_select_el(gm);
		gio.gui.reskinnify_board();
		gio.gui.procs.refresh();
		return true;
	};


})(jQuery);
