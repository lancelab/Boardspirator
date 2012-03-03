(function( $ ){		var tp =$.fn.tp$ = $.fn.tp$ || {};	
					var gio=tp.gio   = tp.gio   || {};


	gio.Description={
		Title			:'Gamio',
		Description		:'Boardpuzzle Authoring Framework',
		Version			:'0.0.43',
		Date			:'November 28, 2011',
		License			:'jQuery license',
		Copyright		:'(c) 2011 Konstantin Kirillov', 
		Diary			:"\n"+
						"	0.0.43		Each maps item from the maps file has own board,\n"+
						"				boards are selectable and have own rounds,\n"+
						"				board title is parsed, but soko-file-format not fully yet\n"+
						"	0.0.10		one lib to build all tiles;\n"+
						"				editing walls mode added;\n"+
						"	0.0.4		wall, hero selection; hero move; help;\n"
	};


	gio.init =	function()
	{
		gio.init_gui();
		gio.init_until_non_failed_game();
		gio.init_control_events();
		gio.init_navigation();
	};


})(jQuery);

$('document').ready( $.fn.tp$.gio.init );

