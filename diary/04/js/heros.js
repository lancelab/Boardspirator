
(function( $ ){					//additon to $.fn.tp$.boardGame

	$.fn.tp$ = $.fn.tp$ || {};	//secure a name
	if(!$.fn.tp$.boardGame)		//check prerequisite
	{
		var msg='Missed core of $.fn.tp$.boardGame';
		throw msg;
		alert(msg);
		return;		
	}
	$.fn.tp$.boardGame=(function(self)	//expand the plugin
	{
		self = self || {};
		var hero ='img/hero.png';
		var heros = self.heros = [];
		hero_tiles_map =
		[
			[ {}, {}, {src:hero}, {}, {} ],
			[ {}, {}, {}, {src:hero}, {} ],
			[ {}, {}, {}, {}, {} ],
			[ {}, {}, {}, {}, {} ],
		];

		self.initHeroTiles = function()
		{
			var w=self.tile.width;
			var h=self.tile.height;
			var board = self.board;
			
			$.each(hero_tiles_map, function(y,row)
			{
				$.each(row, function(x, tile_from_map)
				{
					if( !tile_from_map.src ) return true;
					
					//make tile:
					var tile={};
					tile.x=x;
					tile.y=y;
					var t = document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;
					s.left = (w * x) + 'px';
					s.top = (h * y) + 'px';
					s.width=w+'px';
					s.height=h+'px';
					s.overflow='hidden';
					s.zorder='10';
					board.appendChild(t);
		
					tile.div=t;
								
					//make image:
					var img = document.createElement('img');
					img.src=tile_from_map.src;
					img.width=w;
					img.height=h;
					//some problems:
					//img.src.style = '{ width:' + w + 'px;  height:'+h+'px; }';
					t.appendChild(img);
					tile.img=img;
					heros.push(tile);
				});						
			});

			//Position:
			var selected_hero = 0;

			//Navigation scenario
			$.fn.tp$.bindEvents('keydown', function(arg)
			{
				if(arg.event.ctrlKey) //selecting a hero
				{
					if(!arg.event.shiftKey)
					{
						var ix=selected_hero;
						switch(arg.keyName)
						{
							case 'left':	if( ix>0 ) ix=ix-1;
											break;
							case 'right':	if( ix<heros.length-1 ) ix=ix+1;
											break;
							default:		return true; //skip event
						}
						heros[selected_hero].img.style.border='none';
						selected_hero=ix;
						heros[selected_hero].img.style.border='2px solid blue';
						return false;
					}
					return true;
				}else{	//moving a hero
					var h=heros[selected_hero];
					var x=h.x;
					var y=h.y;
					switch(arg.keyName)
					{
						case 'left':	if( x>0 ) x=x-1;
										break;
						case 'right':	if( x<self.master_board.xsize-1 ) x=x+1;
										break;
						case 'up'	:	if( y>0 ) y=y-1;
										break;
						case 'down':	if( y<self.master_board.ysize-1 ) y=y+1;
										break;
						default:		return true; //skip event
					}
					h.x=x;
					h.y=y;
					h.div.style.top=(y*self.tile.height)+'px';
					h.div.style.left=(x*self.tile.width)+'px';
					return false;
				}
			});
		};//initGame

	return self;
	})($.fn.tp$.boardGame); // boardGame

})(jQuery);

$('document').ready( $.fn.tp$.boardGame.initHeroTiles );

