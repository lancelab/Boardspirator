(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gdr		=  gio.domwrap.regions;






	gio.draw_scene=function(){

		var gs		= gio.getUnfinishedState();
		var gm		= gs.gm;
		if(gm.load !== 'finalized') return;

		var gs		= gio.getgs();
		var game	= gs.gm.game;
		var gm		= gs.gm;
		var dtile	= gm.dresses_wrap.chosen_dress.tile;
		var uid2lid	= gs.pos.uid2lid;
		var locs	= gm.locs;

		gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		//c onsole.log('drawing scene beginning. pos=',gs.pos);

		// ** Loops via ALL units and places each to own location //TODm do only for dynamic units
		tp.core.each(gm.units, function(uid,unit){
			var style = unit.tile.div.style;
			//var colony=unit.col;
			var loc=locs[uid2lid[uid]];
			style.left=(loc[0]+1)*dtile.width+'px';
			style.top =(loc[1]+1)*dtile.height+'px';
		});


		// ================================
		// Sets/unsets focus
		// --------------------------------
		var acting_unit = gs.unit;
		var do_set_focuser = gm.actors > 1;
			
		if(acting_unit && gs.col.focused ){
			//units[punit.ix].div.appendChild(game.focuser_img);
			// TODm is ....tile.img faster?
			gio.domwrap.wraps.blinker.dosetup_and_start(acting_unit.tile.div, {opacity:0.5},{opacity:1.0},500);

			//...rumors... doesnot detach from former parent?:			
			//acting_unit.tile.div.appendChild(gm.focuser_img);
			acting_unit.tile.div.insertBefore(gm.focuser_img, acting_unit.tile.img);

		}else{
			do_set_focuser=false;
			gio.domwrap.wraps.blinker.dostop();
		}
		if(do_set_focuser){
			gm.focuser_img.style.display='inline';
		}else{
			gm.focuser_img.style.display='none';
		}
		// --------------------------------
		// Sets/unsets focus
		// ================================


	};// gio.draw_scene




})(jQuery);
