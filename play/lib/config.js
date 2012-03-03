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
		"esc                    close popups like this, map import, autoplay\n"+
		"arrows,j,k,i,m         move a unit\n"+
		"u, ctrl+arrows         units\n"+
		"t, ctrl+shitf+arrows   unit types\n"+
		"l/g/p                  collections/games/maps\n"+
		"o                      rounds\n"+
		"r/n                    reset/new round\n"+
		"space,backspace,b      move back\n"+
		"f,ctrl+space           forward replay\n"+
		"s                      return to start\n"+
		"z                      lazy autoplay of a round\n"+
		"w                      import text soulution to current round\n"+
		"e                      edit/play\n"+
		"x                      map credits, text, and comments\n"+
		"y                      the story\n"+
		"c                      create or import maps from text\n"+
		"ctrl+d/z               finish/cancel creation and close text window\n"+
		"a                      about and credits\n";


	gio.modes=['play', 'edit'];


})(jQuery);

