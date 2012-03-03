
(function( $ ){					//addition to $.fn.tp$.game

	//secure names:
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};

	//TODm mix: gui and start position:
	gio.compile_colony = function(colony_ix,colony)
	{
			colony.ix=colony_ix;

			var gm=gio.games[gio.game_ix];
			gm.colonies[colony.nam]=colony;

			var zorder=colony.zorder;
			var tiles_map=colony.tiles_map;
			var nam=colony.nam;

			var units = colony.units=[];
			var pos = gm.start_pos;
			var punits = pos[colony.ix]=[];
			
			var twidth=gm.tile.width;
			var theight=gm.tile.height;
			var board = gm.board;

			var selected_unit=0;
			var count=0;

			gm.dim_max_width= gm.dim_max_width || 0;
			gm.dim_max_height= gm.dim_max_height || 0;
			$.each(tiles_map, function(y,row)
			{
				$.each(row, function(x, tile_from_map)
				{
					if( !tile_from_map.src ) return true;
					
					//make tile:
					var tile={};
					var punit={};
					punit.x=x;
					punit.y=y;
					punit.ix=count; //TODm dry?
					punit.colony_ix=colony_ix; //TODm dry?
					tile.ix=count;
					tile.colony_ix=colony_ix; //TODm dry?

					if(tile.selected) selected_unit = count; //position

					var t = document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;

					var w=(twidth * x);
					if(gm.dim_max_width<w+twidth) gm.dim_max_width=w+twidth;
					s.left = w + 'px';

					w=theight * y;
					if(gm.dim_max_height<w+theight) gm.dim_max_height=w+theight;

					s.top = w + 'px';
					s.width=twidth+'px';
					s.height=theight+'px';
					s.overflow='hidden';
					s.zIndex=''+zorder;


					board.appendChild(t);
					tile.div=t;
								
					//make image:
					var img = document.createElement('img');
					img.src=tile_from_map.src;
					img.width=twidth;
					img.height=theight;
					t.appendChild(img);
					tile.img=img;

					units.push(tile);
					punits.push(punit);
					count++;
				});						
			});
			punits.selected = selected_unit;
	};


	gio.init_start_position = function()
	{
		var gm=gio.games[gio.game_ix];
		gm.init_help();
		gm.start_pos=[]; 
		gm.start_pos.colony_ix=gm.colony_ix || 0;
		tp.core.each(gm.colonies, function(ix,colony)
		{
			gio.compile_colony(ix,colony);
		});
	};

	gio.init_game =	function()
	{
		var gm=gio.games[gio.game_ix];
		var board = gm.board;

		if(!gm.start_pos)
		{	
			//do for game:
			gm.mode_ix=0;
			board = gm.board=document.createElement('div');
			board.style.position = 'absolute';
			gio.init_start_position();
			gio.board.appendChild(board);
			gio.init_round();
		}else{
			board.style.display='block';
		}
		gio.skip_inactive_colony(gm,'right');

		gio.init_game_style();
		gio.draw_scene();
		gio.draw_status();
	};

})(jQuery);
