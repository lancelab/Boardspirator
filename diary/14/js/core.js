
(function( $ ){			//jQuery plugin

	//Name				$.fn.tp$.game
	//Purpose			to play
	//Version			0.0.14
	//Date				November 14, 2011
	//License			jQuery license
	//Copyright			(c) 2011 Konstantin Kirillov 

	//Diary
	//					0.0.14 -	primitive collision detector and rules: interact ... with wall
	//								previous code is redesigned
	//					0.0.10 -	one lib to build all tiles;
	//								editing walls mode added;
	//					0.0.4 -		wall, hero selection; hero move; help;


	//secure names:
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gm=tp.game = tp.game || {};


	var help =
		"Ctrl+Shift+Left/Rigth-Arrows 	- flip modes: wall/hero \n"+
		"Ctrl+Left/Rigth-Arrows			- select a unit\n"+
		"Arrows                 		- move a unit\n";					


	gm.master_board={xsize : 14, ysize : 7};
	gm.interact=
	{
		hero	: { box : 'push', wall : 'block' },
		box		: { wall : 'block' }	//idle
	} 	 
	gm.tile	={ width : 20, height: 20 };

	gm.init =	function()
	{
			var board = gm.board=document.createElement('div');
			board.style.position = 'relative';
			document.body.appendChild(board);

			gm.init_colonies();

			var w=gm.tile.width;
			var h=gm.tile.height;

			//Append status:
			var w=gm.status_div=document.createElement('div');
			w.style.position='absolute';
			w.style.height=(3*h) + 'px';
			w.style.left='0px';
			w.style.top=(h*gm.master_board.ysize)+'px';
			board.appendChild(w);

			//Append help:
			var w=document.createElement('div');
			w.innerHTML='<pre>'+help+'</pre>';
			w.style.position='absolute';
			w.style.left='0px';
			w.style.top=((h+3)*gm.master_board.ysize +3)+'px';
			board.appendChild(w);


			gm.show_status();

			//should be last?:
			gm.init_navigation();

	};//init

})(jQuery);

$('document').ready( $.fn.tp$.game.init );

