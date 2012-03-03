(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

	gio.help_hint='h or ?';

	gio.help =
		"Keyboard Control:\n"+
		"h,?,ctrl+h,ctrl+?      help\n"+
		"esc                    close popups like this or map import\n"+
		"arrows,j,k,i,m         move a unit\n"+
		"u, ctrl+arrows         units\n"+
		"t, ctrl+shitf+arrows   unit types\n"+
		"l/g/p                  collections/games/maps\n"+
		"o                      rounds\n"+
		"r/n                    reset/new round\n"+
		"space,backspace,b      move back\n"+
		"f,ctrl+space           forward replay\n"+
		"s                      return to start\n"+
		"e                      edit/play\n"+
		"x                      map credits, text, and comments\n"+
		"y                      the story\n"+
		"c                      create or import maps from text\n"+
		"ctrl+d/z               finish/cancel creation and close text window\n"+
		"a                      about and credits\n";


	gio.modes=['play', 'edit'];


})(jQuery);

