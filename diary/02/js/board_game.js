
(function( $ ){			//jQuery plugin

	//Name:				$.fn.tp$.boardGame
	//Purpose:			to play
	//Version:			0.0.2
	//Date:				November 11, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 



	//Attach plugin to jQuery:
	$.fn.tp$ = $.fn.tp$ || {};
	$.fn.tp$.boardGame=(function()
	{
		var self	={};
		var wall	='img/wall_674c.gif';
		self.tile	={ width : 20, height: 20 };
		self.tiles	=	
		[
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ],
			[ {src:wall}, {src:wall}, {src:wall}, {src:wall}, {src:wall} ]
		];

		self.initGame =	function()
		{
			var w=self.tile.width;
			var h=self.tile.height;
			var board = document.createElement('div');
			board.style.position = 'relative';
			document.body.appendChild(board);

			$.each(self.tiles, function(y,row)
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

			//Position:
			var selected_tile = {x:0, y:0};


			//Assets are done ... attaching events: ...
			//Usage example:
			$.fn.tp$.bindEvents('keydown', function(arg)
			{
				if(arg.event.ctrlKey)
				{
					var x=selected_tile.x;
					var y=selected_tile.y;
					switch(arg.keyName)
					{
						case 'up':		if( y>0 ) selected_tile.y=y-1;
										break;
						case 'down':	if( y<self.tiles.length-1 ) selected_tile.y=y+1;
										break;
						case 'left':	if( x>0 ) selected_tile.x=x-1;
										break;
						case 'right':	if( x<self.tiles[0].length-1 ) selected_tile.x=x+1;
										break;
						default:		console.log('ctrl+keyName='+arg.keyName);		
					}
					self.tiles[y][x].img.style.visibility='visible';
					x=selected_tile.x;
					y=selected_tile.y;
					self.tiles[y][x].img.style.visibility='hidden';
					return false;
				}
				
			});
		};//initGame

	return self;
	})(); // boardGame

})(jQuery);

$('document').ready( $.fn.tp$.boardGame.initGame );

