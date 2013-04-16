(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var ggp		=  gio.gui.procs;
					var gsp		=  gio.session.procs;





	// Actions:	some colonies are disabled in play mode ... do skip them:
	// 			loop through all and find active index:
	var skip_inactive_colony = function( gm, direction )
	{
			if(gm.actor_cols.length < 1) return;
			var len=gm.cols.length;
			var cid=gm.acting_col.id;

			for(var i=0; i<len; i++)
			{
				if(gm.cols[cid].activity.active)
				{
					gm.acting_col = gm.cols[cid];
					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					cid=(cid+len-1)%len;
				}else{
					cid=(cid+1)%len;
				}
			}
	};

	ggp.do_one_scroll_of_colony = function( pointer )
	{
		var gs=gio.getgs();
		if(!gs.col) return; //TODm rid
		var gm=gs.gm;
		var cid=gs.cid;

		var len=gm.cols.length;

		if(  pointer === 'left' || pointer === 'up'   ){
			cid=(cid+len-1)%len;
		}else{
			cid=(cid+1)%len;
		}

		gm.acting_col = gm.cols[cid];
		skip_inactive_colony( gm, pointer );
	};


	// Action:	does one scrol of unit in acting colony
	ggp.do_one_scroll_of_unit_in_colony = function( pointer )
	{
			var gs = gio.getgs();
			var units = gs.col.units;
			var ulen = units.length;

			var direction = isNaN(pointer) ? pointer : 'down';
			var uix=gs.unit.ix;	

			if(direction==='left' || direction==='up'){
				uix=(ulen*2+uix-1)%ulen;
			}else{
				uix=(ulen*2+uix+1)%ulen;
			}
			gs.col.acting_unit = units[uix];
			ggp.draw_status_and_scene();
			return false;
	};


	// Behaviour:	same as child subroutine, but wrapped in GUI-lockers
	ggp.scroll_till_valid_album = function(  aix, do_land  ) {
		ggp.lock_controls( 'Scrolling to landable album ... ' );
		var success = gsp.scroll_till_landable_album( aix, do_land );
		ggp.unlock_controls();
		return success;
	};
	

	// Behaviour:	same as child subroutine, but wrapped in GUI-lockers
	ggp.scroll_till_valid_coll = function( start_cix, collections, download_external_if_first, do_land ) {
		ggp.lock_controls( 'Scrolling to landable coll ... ' );
		var success = gsp.scroll_till_landable_coll( start_cix, collections, download_external_if_first, do_land );
		ggp.unlock_controls();
		return success;
	};
	


})();
