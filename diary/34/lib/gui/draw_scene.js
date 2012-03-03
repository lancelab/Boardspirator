
(function( $ ){
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};

	gio.draw_scene=function()
	{
		var gm=gio.games[gio.game_ix];
		var round=gm.rounds[gm.rounds.ix];
		var w;

		//GUI: set width accorging play mode:
		var wgs=gio.style;
		w = gio.modes[gm.mode_ix]==='edit' ? wgs.ad_column_width : wgs.edit_column_width;
		w=gm.dim_max_width + w;	
		gio.root_div.style.width = w+'px';

		tp.core.each(round.pos, function(group,punits)
		{

			var colony=gm.colonies[group];
			var units=colony.units;
			tp.core.each(punits, function(ix,punit)
			{
				var u=units[ix];
				u.div.style.top=(punit.y+1)*gm.tile.height+'px';
				u.div.style.left=(punit.x+1)*gm.tile.width+'px';

				if(punits.selected===ix)
				{
					if(	gio.modes[gm.mode_ix]==='edit' || 
						(!colony.frozen && !colony.passive)
					){

						if(group === round.pos.colony_ix )
						{
							//u.img.style.border='2px solid blue';
							gio.blinker.dosetup_and_start(u.img, {opacity:0.5},{opacity:1.0},500);
						}
					}
				}
			});	
		});
	}


})(jQuery);
