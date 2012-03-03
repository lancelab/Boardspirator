
(function( $ ){			//jQuery plugin

	//Name				$.fn.tp$.game
	//Purpose			to play
	//Version			0.0.10
	//Date				November 13, 2011
	//License			jQuery license
	//Copyright			(c) 2011 Konstantin Kirillov 

	//Diary				0.0.10 -	one lib to build all tiles;
	//								editing walls mode added;
	//					0.0.4 - wall, hero selection; hero move; help;


	//secure names:
	$.fn.tp$ = $.fn.tp$ || {};	
	var game=$.fn.tp$.game = $.fn.tp$.game || {};


	var help =
		"Ctrl+Tab               - flip modes: wall/hero \n"+
		"Ctrl+Left/Rigth-Arrows - select a tile\n"+
		"Arrows                 - move a tile\n";					


		game.master_board={};
		game.ttype_modes = ['hero','wall'];
		game.ttype_mode_index = 0;
		game.ttype_mode = game.ttype_modes[game.ttype_mode_index];

		game.tile	={ width : 20, height: 20 };

		game.master_board.xsize=5;
		game.master_board.ysize=5;

		game.init =	function()
		{
			var board = game.board=document.createElement('div');
			board.style.position = 'relative';
			document.body.appendChild(board);

			game.initWallTiles();
			game.initHeroTiles();

			var w=game.tile.width;
			var h=game.tile.height;

			//Append status:
			var w=game.status_div=document.createElement('div');
			w.style.position='absolute';
			w.style.height=(3*h) + 'px';
			w.style.left='0px';
			w.style.top=(h*game.master_board.ysize)+'px';
			board.appendChild(w);

			//Append help:
			var w=document.createElement('div');
			w.innerHTML='<pre>'+help+'</pre>';
			w.style.position='absolute';
			w.style.left='0px';
			w.style.top=((h+3)*game.master_board.ysize +3)+'px';
			board.appendChild(w);

			game.show_status();

			//should be last?:
			game.init_navigation();

		};//init

})(jQuery);

$('document').ready( $.fn.tp$.game.init );

