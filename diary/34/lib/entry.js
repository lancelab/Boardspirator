(function( $ ){		var tp=$.fn.tp$ = $.fn.tp$ || {};	
					var gio=tp.gio = tp.gio || {};


	gio.Description={
		Title			:'Gamemio and Puzzmio Puzzle Authoring Framework',
		Version			:'0.0.34',
		Date			:'November 22, 2011',
		License			:'jQuery license',
		Copyright		:'(c) 2011 Konstantin Kirillov', 
		Diary			:"\n"+
						"	0.0.34		added won-reporter to Sokobans,\n"+
						"				game \"herdy\" added: sheeps follow the leader,\n"+
						"				edit/play-mode is a property of game, not framework now\n"+
						"				move back option added, moves/back indicator added\n"+
						"				mode togglers do not use Ctrl key, use plain keys\n"+
						"				recorder module added to record a game\n"+
						"				tp.core.single_popup_manager for help/credit window\n"+
						"	0.0.28		little more style ... blinking \n"+
						"	0.0.25		rounds can be kept \"simultaneously\" ... about window ... \n"+
						"	0.0.22		toggler's fixes\n"+
						"	0.0.21		game collection boards\n"+
						"				two games coexist now Sokoban and Wanderers...\n"+
						"				they can be toggled ...\n"+
						"	0.0.19		added game modes: paly/edit\n"+
						"	0.0.16		box, boss units added ...\n"+
						"	0.0.15		collision tester is on its way ...\n"+
						"	0.0.14		primitive collision detector and rules: interact ... with wall\n"+
						"				previous code is redesigned\n"+
						"	0.0.10		one lib to build all tiles;\n"+
						"				editing walls mode added;\n"+
						"	0.0.4		wall, hero selection; hero move; help;\n"
	};


	gio.init =	function()
	{
		gio.init_gui();
		gio.init_game();
		gio.init_control_events();
		gio.init_navigation();
	};


})(jQuery);

$('document').ready( $.fn.tp$.gio.init );

