
(function( $ ){			//jQuery plugin

	//Name:				$.fn.tp$.boardGame
	//Purpose:			to play
	//Version:			0.0.4
	//Date:				November 11, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 

	//Change log:		0.0.4 - wall, hero selection; hero move; help;



	var help =
		"Arrows                 - move a hero.\n"+
		"Ctrl+Left/Rigth-Arrows - select a hero.\n"+
		"Ctrl+Shift+Arrows      - select a ground.\n";					


	$.fn.tp$ = $.fn.tp$ || {};			//secure a plugin $.fn.tp$
	$.fn.tp$.boardGame=(function()		//attach subplugin
	{
		var self	={master_board:{}};
		var wall	='img/wall_674c.gif';
		self.tile	={ width : 20, height: 20 };
		self.map_tiles	=	
		[
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ]
		];

		self.master_board.xsize=self.map_tiles[0].length;
		self.master_board.ysize=self.map_tiles.length;

		self.initGame =	function()
		{
			var w=self.tile.width;
			var h=self.tile.height;
			var board = self.board=document.createElement('div');
			board.style.position = 'relative';
			document.body.appendChild(board);

			$.each(self.map_tiles, function(y,row)
			{
				$.each(row, function(x, tile)
				{
					
					//make tile:
					var t = document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;
					s.left = (w * x) + 'px';
					s.top = (h * y) + 'px';
					//t.setAttribute('class','tile');
					s.width=w+'px';
					s.height=h+'px';
					s.overflow='hidden';
					s.zorder='1';
					board.appendChild(t);
					tile.div=t;
								
					//make image:
					var img = document.createElement('img');
					img.src=tile.src;
					img.width=w;
					img.height=h;
					//some problems:
					//img.src.style = '{ width:' + w + 'px;  height:'+h+'px; }';
					t.appendChild(img);
					tile.img=img;
				});
			});

			//Append help:
			var w=document.createElement('div');
			w.innerHTML='<pre>'+help+'</pre>';
			w.style.position='absolute';
			w.style.left='0px';
			w.style.top=(h*self.master_board.ysize)+'px';
			board.appendChild(w);

			//Position:
			var selected_tile = {x:0, y:0};


			//Assets are done ... attaching events: ...
			//Usage example:
			$.fn.tp$.bindEvents('keydown', function(arg)
			{
				if(arg.event.ctrlKey && arg.event.shiftKey)
				{ 
					var x=selected_tile.x;
					var y=selected_tile.y;
					switch(arg.keyName)
					{
						case 'up':		if( y>0 ) selected_tile.y=y-1;
										break;
						case 'down':	if( y<self.map_tiles.length-1 ) selected_tile.y=y+1;
										break;
						case 'left':	if( x>0 ) selected_tile.x=x-1;
										break;
						case 'right':	if( x<self.map_tiles[0].length-1 ) selected_tile.x=x+1;
										break;
						default:		console.log('ctrl+keyName='+arg.keyName);		
					}
					self.map_tiles[y][x].img.style.visibility='visible';
					x=selected_tile.x;
					y=selected_tile.y;
					self.map_tiles[y][x].img.style.visibility='hidden';
					return false;
				}
				
			});
		};//initGame

	return self;
	})(); // boardGame

})(jQuery);

$('document').ready( $.fn.tp$.boardGame.initGame );

