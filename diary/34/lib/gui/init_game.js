
(function( $ ){					//addition to $.fn.tp$.game

	//secure names:
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};

	gio.init_game_style = function()
	{
		var gm=gio.games[gio.game_ix];
		document.title = gm.nam;


		var w;
		var BCOLOR=gio.style.DEFAULT_BACKGROUND_COLOR;

		//GUI: set width accorging play mode:
		var wgs=gio.style;
		w = gio.modes[gm.mode_ix]==='edit' ? wgs.ad_column_width : wgs.edit_column_width;
		w=gm.dim_max_width + w;	
		gio.root_div.style.width = w+'px';

		var tmp_width_until_style_is_implemented=gm.dim_max_width+2*gm.tile.width;
	    if(tmp_width_until_style_is_implemented<600)tmp_width_until_style_is_implemented=600;

		//parent:
		w=gm.style.parent;
		ww=gio.board.style;
		ww.backgroundImage = w.backgroundImage ? "url('"+w.backgroundImage+"')" : 'none';
		ww.backgroundColor = w.backgroundColor || BCOLOR;
		ww.width=tmp_width_until_style_is_implemented+'px';
		ww.height='100%';

		//play:
		w=gm.style.play;
		ww=gm.board.style;
		ww.backgroundImage = w.backgroundImage ? "url('"+w.backgroundImage+"')" : 'none';
		ww.backgroundColor = w.backgroundColor || BCOLOR;
		ww.width=(tmp_width_until_style_is_implemented)+'px';
		ww.height=(gm.dim_max_height+2*gm.tile.height)+'px';


		//control:
		w=gm.style.control;
		ww=gio.control_subboard.style;
		ww.backgroundImage = w.backgroundImage ? "url('"+w.backgroundImage+"')" : 'none';

		//TODm no effect? no dims?:
		ww.backgroundColor = w.backgroundColor || BCOLOR;

		ww.top=gm.dim_max_height+3*gm.tile.height + 'px';
	};


})(jQuery);
