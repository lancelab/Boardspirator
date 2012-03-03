(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	//THIS RUNS EVERY TIME WHEN USER TOGGLED FROM GAME TO GAME:
	gio.init_game_style = function(){

		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix] ;



		var w;
		var BCOLOR=gio.style.DEFAULT_BACKGROUND_COLOR;

		//GUI: set width accorging play mode:
		var wgs=gio.style;
		w = gio.modes[gm.mode_ix]==='edit' ? wgs.ad_column_width : wgs.edit_column_width;
		w=gm.dim_max_width + w;	
		gio.root_div.style.width = w+'px';

		var local_master_width=gm.dim_max_width+2*game.tile.width;
	    if(local_master_width<600)local_master_width=600;




		//==================================
		//reshape parent:
		//----------------------------------
		w=game.style.parent;
		ww=gio.board.style;
		ww.backgroundImage = w.backgroundImage ? "url('"+w.backgroundImage+"')" : 'none';
		ww.backgroundColor = w.backgroundColor || BCOLOR;

		//define how to do centering of the game and parent:
		ww.width=local_master_width+gio.style.CONTROL_BOARD_WIDTH+'px';

		ww.height='100%';
		//----------------------------------
		//reshape parent:
		//==================================


		gio.title_div.innerHTML=game.nam;
		gio.title_div.title='Game number '+gio.game_ix;
		document.title = game.nam;


		//play: gm.board is "a play"
		w=game.style.play;
		ww=gm.board.style;
		ww.left=gio.style.CONTROL_BOARD_WIDTH+'px';

		ww.backgroundImage = w.backgroundImage ? "url('"+w.backgroundImage+"')" : 'none';
		ww.backgroundColor = w.backgroundColor || BCOLOR;
		ww.width=(local_master_width)+'px';
		ww.height=(gm.dim_max_height+2*game.tile.height)+'px';
		ww.top = gio.style.TITLE_BOARD_HEIGHT+'px';





		//control:
		w=game.style.control;
		ww=gio.control_subboard.style;
		ww.backgroundImage = w.backgroundImage ? "url('"+w.backgroundImage+"')" : 'none';

		//TODm no effect? no dims?:
		ww.backgroundColor = w.backgroundColor || BCOLOR;

		ww.width=(local_master_width)+'px';
		ww.top='0px'; 

		//possibly puts gio.control_subboard below "play board":
		//gm.dim_max_height+3*game.tile.height + 'px';


		//In-play console:
		gio.cons_div.style.top=
				gio.style.TITLE_BOARD_HEIGHT+
				gm.dim_max_height+3*game.tile.height + 'px';
		//For version when status board is below of playboard:
		//STATUS_LINE_HEIGHT*2+4*PADDING+'px';


	};


})(jQuery);
