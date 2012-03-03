
(function( $ ){					//addition to $.fn.tp$.game

	//secure names:
	$.fn.tp$ = $.fn.tp$ || {};	
	var game=$.fn.tp$.game = $.fn.tp$.game || {};


		//=================================================
		//modes
		//-------------------------------------------------
		//flipping modes:
		$.fn.tp$.bindEvents('keydown', function(arg)
		{
			if(arg.event.ctrlKey && !arg.event.shiftKey && arg.keyName == 'tab')
			{ 
				var m=game.ttype_modes;
				var ix=game.ttype_mode_index;
				ix=(ix+1)%m.length;
				game.ttype_mode=m[ix];
				game.ttype_mode_index=ix;
				game.show_status();
				return false;				
			}
			return true;
		});

		game.show_status=function(){ game.status_div.innerHTML='<pre>Status: '+game.ttype_mode+'</pre>'; };
		//-------------------------------------------------
		//modes
		//=================================================


		game.initTiles = function(zorder,tiles_map,ttype)
		{
			var w=game.tile.width;
			var h=game.tile.height;
			var board = game.board;
			var ttypes = ttype + 's';
			var types = [];
			var selected_type=0;

			var count=1;			
			$.each(tiles_map, function(y,row)
			{
				$.each(row, function(x, tile_from_map)
				{
					if( !tile_from_map.src ) return true;
					
					//make tile:
					var tile={};
					tile.x=x;
					tile.y=y;
					if(tile.selected) selected_type = count; //position

					var t = document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;
					s.left = (w * x) + 'px';
					s.top = (h * y) + 'px';
					s.width=w+'px';
					s.height=h+'px';
					s.overflow='hidden';
					s.zorder=''+zorder;
					board.appendChild(t);
		
					tile.div=t;

								
					//make image:
					var img = document.createElement('img');
					img.src=tile_from_map.src;
					img.width=w;
					img.height=h;
					t.appendChild(img);
					tile.img=img;
					types.push(tile);

					count++;
				});						
			});
			types.selected = selected_type;
			game[ttypes]=types;
		}; //game.initTiles

		//Tile navigation
		game.init_navigation=function()
		{
			$.fn.tp$.bindEvents('keydown', function(arg)
			{
				var types=game[game.ttype_mode+'s'];
				if(!types) return true;

				if(arg.event.ctrlKey) //selecting a tile
				{
					if(!arg.event.shiftKey)
					{
						var ix=types.selected;
						switch(arg.keyName)
						{
							case 'left':	if( ix>0 ) ix=ix-1;
											break;
							case 'right':	if( ix<types.length-1 ) ix=ix+1;
											break;
							default:		return true; //skip event
						}
						types[types.selected].img.style.border='none';
						types.selected=ix;
						types[types.selected].img.style.border='2px solid blue';
						return false;
					}
					return true;
				}else{	//moving a tyle
					var h=types[types.selected];
					var x=h.x;
					var y=h.y;
					switch(arg.keyName)
					{
						case 'left':	if( x>0 ) x=x-1;
										break;
						case 'right':	if( x<game.master_board.xsize-1 ) x=x+1;
										break;
						case 'up'	:	if( y>0 ) y=y-1;
										break;
						case 'down':	if( y<game.master_board.ysize-1 ) y=y+1;
										break;
						default:		return true; //skip event
					}
					h.x=x;
					h.y=y;
					h.div.style.top=(y*game.tile.height)+'px';
					h.div.style.left=(x*game.tile.width)+'px';
					return false;
				}
			});
		}; //init_navigation


})(jQuery);
