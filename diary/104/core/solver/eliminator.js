(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	gio.solver = gio.solver || {};

	gio.solver.bays_builder=function(gm){ 

		var hid2lid = gm.digest.hid2lid;
		var hid2loc = gm.digest.hid2loc;
		var lid2hid = gm.digest.lid2hid;
		var xy_exists = gm.xy_exists;
		var loc2lid = gm.loc2lid;
		//var locs = gm.locs;



		// Aux:
		var shifts = [ [-1,0],[0,-1],[1,0],[0,1]  ];

		// Result:
		var corners=[];

		for(var hid=0; hid<hid2lid.length; hid++){
			var loc = hid2loc[hid];
			var lid = hid2lid[hid];
			var xx = loc[0];
			var yy = loc[1];

			// Look around the loc, are there any block corners?
			for(var dir=0; dir<4; dir++){
				var ss = shifts[dir];
				var xx1 = xx + ss[0];
				var yy1 = yy + ss[1];
				if( xy_exists[xx1] && xy_exists[xx1][yy1] ) continue;
				var dir2 = (dir+1)%4;
				var ss = shifts[dir2];
				var xx2 = xx + ss[0];
				var yy2 = yy + ss[1];
				if( xy_exists[xx2] && xy_exists[xx2][yy2]  ) continue;
// c onsole.log('dir='+dir+' not free='+ xx1+' '+yy1+' not free='+ xx2+' '+yy2+' loc=',loc);
				var corner = { hid : hid, lid : lid, loc : loc, dir : dir, dir2 : dir2 }
				corners.push(corner);
			}
		}
		return corners;


		// Corners found. It's harder to find bays. Let's try ...
		var bays = [];

		for(var cc=0; cc<corners.length; cc++){
			var corner = corners[cc];
			// Bays can lie along either side of corner ... do loop in two directions


		}


	};

})(jQuery);
