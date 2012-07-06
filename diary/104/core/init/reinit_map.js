(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	// Purpose:	builds flat cells map.xy_exists which are
	//			available to place dynamic units.
	var normalize_map=function(map){
		var plgam = map.game;
		var roof = map.game.map_roof;
		var pos = map.pos;
		var lu=map.pos.lid2uid;
		var units=map.units;
		var tops=pos.tops;	

		// To index flat location:
		var exists=map.xy_exists = [];
		map.digest = {};
		var hid2lid = map.digest.hid2lid = [];
		var hid2loc = map.digest.hid2loc = [];
		var lid2hid = map.digest.lid2hid = [];

		var loc2lid=map.loc2lid;
		var lid2uid=pos.lid2uid;
		var locs=map.locs;


		// =========================================
		// Wall boundary.
		// Before building "holes" and "exists",
		// calculate wall boundaries for each y-row:
		// -----------------------------------------
		var mboundary = plgam.map_boundary;
		var left_wall = [];
		var right_wall = [];
		for(var yy=0; yy<map.size[1]; yy++){
			var left = -1;
			var right = map.size[0];

			if( mboundary ){
				for(var xx=0; xx<map.size[0]; xx++){
					var top = tops[xx][yy];
					var tower = loc2lid[xx][yy];
					for(var zz=1; zz<=top; zz++){
						var unit = units[lid2uid[tower[zz]]];
						if( unit.cname === mboundary ){
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

							// This "else" takes black walls into account:
							var unit=units[ly[zz]];
							if( unit.block ){
								//solid wall, xy is forbidden
								ex[yy]=false;
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
// c onsole.log(corners);	
	};



	gio.session.reinit.rounds = function(){

		var gs=gio.getgs();
		var gm = gs.gm;
		var plgam = gm.game;

		if(!gm.rounds){
			normalize_map(gm);
			gm.solver = gio.solver.Processor(gm);
			gio.navig.in_session.round.init_round(gm);

			// ** GUI
			gio.gui.create.board(gm);
			gio.gui.create.map_focuser(gm);
			gio.gui.create.tiles(gm);
		}
		gio.gui.procs.unhide_current_dom_board();

		if(gm.playpaths){
			// Preserve initial pos for supplied paths:
			tp.core.each(gm.playpaths,function(ii,pp){
				pp.pos = tp.core.tclone(gm.pos);				
			});
		}
		gio.gui.reset_playpaths(gm);
		gio.gui.reset_rounds_select_el(gm);

		gio.gui.reskinnify_board();
		gio.gui.procs.refresh();

		//tp$.deb('finish map finished');

		return true;
	};//gio.session.reinit.rounds


})(jQuery);
