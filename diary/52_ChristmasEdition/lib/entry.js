(function( $ ){		var tp =$.fn.tp$ = $.fn.tp$ || {};	
					var gio=tp.gio   = tp.gio   || {};


	gio.Description={
		Title			:'Boardspirator',
		Description		:'Boardpuzzle Framework Stub',
		Version			:'0.0.52',
		Date			:'December 19, 2011',
		License			:'Dual licensed under the MIT or GPL Version 2 licenses.',
		Copyright		:'(c) 2011 Konstantin Kirillov', 
		WebSite			:'landkey.net',
		Contact			:'spam-protection@landkey.net where spam-protection=beaverscript',
		Diary			:"\n"+

						"	0.0.52		select box for links to external maps. Dec. 19.\n"+
						"	0.0.51		tp improved. Dec. 16.\n"+
						"				Auto beautifier fn.tp$('select') for select box.\n"+
						"	0.0.50		Gradient fix for Opera. Dec. 14.\n"+
						"	0.0.49		Ad placehodler added. December 13, 2011.\n"+
						"	0.0.48		December 12, 2011.\n"+
						"				Adding text map import.\n"+
						"				Select-dom-element buttonized with gradients in tp,\n"+
						"				Textarea map import is done.\n"+
						"				Worked in IE ...\n"+
						"				...fixes...\n"+
						"	0.0.46		Added select-control for Game, Collection, Map.\n"+
				
						"	0.0.44		Adding macros/credits parser to Sokoban-file-map parser.\n"+
						"				refactored and enabled few collections of maps bound to one game,\n"+
						"				toggling between collections,\n"+
						"				attempted to lock events when in load by gio.initiating_a_game_flag=true,\n"+
						"	0.0.43		Each maps item from the maps file has own board,\n"+
						"				boards are selectable and have own rounds,\n"+
						"				board title is parsed, but soko-file-format not fully yet\n"+
						"	0.0.10		one lib to build all tiles;\n"+
						"				editing walls mode added;\n"+
						"	0.0.4		wall, hero selection; hero move; help;\n"
	};



	gio.initiating_a_game_flag=false;
	gio.init =	function()
	{
		var title=gio.Description.Title;
		if(!gio.init_gui()){alert(title +' cancelled'); return;}

		if(gio.init_until_non_failed_game()){
			gio.init_control_events();
			gio.init_navigation();
			return;
		}
		gio.cons_add(title + ' is not loaded.');
	};
	gio.init_wrap =	function(){	gio.init(); };

})(jQuery);

$('document').ready( $.fn.tp$.gio.init_wrap );

