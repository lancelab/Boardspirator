(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.draw_scene=function()
	{
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix];


		var round=gm.rounds[gm.rounds.ix];
		var w;



		//==============================================
		// root div
		//----------------------------------------------
		//GUI: set width accorging play mode:
		var wgs=gio.style;
		w = gio.modes[gm.mode_ix]==='edit' ? wgs.ad_column_width : wgs.edit_column_width;
		w=gm.dim_max_width + w;	
		gio.root_div.style.width = w+gio.style.CONTROL_BOARD_WIDTH +'px';
		//==============================================



		tp.core.each(round.pos, function(group,punits)
		{

			var colony=gm.colonies[group];
			var units=colony.units;
			tp.core.each(punits, function(ix,punit)
			{
				var u=units[ix];
				u.div.style.top=(punit.y+1)*game.tile.height+'px';
				u.div.style.left=(punit.x+1)*game.tile.width+'px';


				// set tooltip
				if(gio.modes[gm.mode_ix]==='edit' || !colony.frozen){
					u.div.title=colony.nam;
					if(units.length>1)u.div.title += ' '+ix;
				}else{
					u.div.removeAttribute('title');
				}


				if(punits.selected===ix)
				{
					if(	gio.modes[gm.mode_ix]==='edit' || 
						(!colony.frozen && !colony.passive)
					){

						if(group === round.pos.colony_ix )
						{
							//u.img.style.border='2px solid blue';
							if(units.length>1)units[punit.ix].div.appendChild(game.focuser_img);
							gio.blinker.dosetup_and_start(u.img, {opacity:0.5},{opacity:1.0},500);
						}
					}
				}
			});	
		});
	}


})(jQuery);
