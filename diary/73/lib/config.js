(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


    gio.top_left_board_links={
			board		:	{	left : '10px', top	: '0px' },
			style 		:	'style="text-decoration:none; color:#0000FF; font-family:Helvetica, Arial; '+
							'font-size:10px; font-weight:bold;"',
			innerHTML	:	'<a #%style%# href="http://landkey.net/games_of_choice/">More...</a> '+
							'<a #%style%# href="http://landkey.net/gio/">Development</a> '+
							'<a #%style%# href="http://landkey.net/">Home</a> '
	};



	gio.help_hint='h or ?';

	gio.help =
		"Keyboard Control:\n"+
		"h,?,ctrl+h,ctrl+?      help\n"+
		"esc                    close popups like this, map editor, autoplay\n"+
		"arrows,j,k,i,m         move a unit\n"+
		"u, ctrl+arrows         toggle units\n"+
		"t, ctrl+shitf+arrows   toggle breeds (unit types, colonies)\n"+
		"l/g/p                  toggle collections/games/maps\n"+
		"o                      toggle rounds\n"+
		"n                      new round\n"+
		"space,backspace,b      move back\n"+
		"f,ctrl+space           forward replay\n"+
		"s                      return to start\n"+
		"z                      autoplay of a round lazily\n"+
		"e                      edit/create/show/import map text\n"+
		"w                      edit/create/show/import playpath text\n"+
		"ctrl+d                 done ... do load from map editor\n"+
		"x                      display map credits, text, and comments\n"+
		"y                      display the story\n"+
		"a                      display about and credits\n";


	gio.modes=['play', 'edit'];

	//gio.external_maps_feed='http://landkey.net/gio/gio/play/requested_map.php?user_requested_link=mm';

	gio.external_maps_feed='server/requested_map.php?user_requested_link=mm';

})(jQuery);

