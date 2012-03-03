(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

	gio.help_hint='keys "h" or "?"';

	gio.help =
		"Keyboard Control:\n"+
		"h,?,ctrl+h,ctrl+?      help\n"+
		"esc                    close popups like this\n"+
		"arrows,j,k,i,m         move a unit\n"+
		"u, ctrl+arrows         units\n"+
		"t, ctrl+shitf+arrows   unit types\n"+
		"g/p                    games/maps\n"+
		"o                      rounds\n"+
		"r/n                    reset/new round\n"+
		"b,backspace            move back\n"+
		"f			            forward replay\n"+
		"s			            return to start\n"+
		"e                      edit/play\n"+
		"a                      about and credits\n";


	gio.modes=['play', 'edit'];


})(jQuery);

