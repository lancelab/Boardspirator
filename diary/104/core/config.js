(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					// This file must be loaded before other game javascript files:

					gio.config		= { links : {}, style : null };
					gio.def			= { base_game : {},
										games : {}, albums : {}, 
										dresses : null,
										inherited_games : {}, dressed_games : {},
										colorban_map_decoder : null,
										procs : {},
										personal_craft_album_key : 'my_album'  };

					gio.playalbs 	= [];
					gio.playzone	= { albums : {} }; // Alternative album indices in form of strings

					gio.modes		= {	sta_tic : {}, dynamic : {} };

					// blocks : {}, probably will be a good name:
					gio.gui			= { procs : {}, 	modes : {},  init : {}, create : {} };
					gio.data_io		= { core : { load : {}, save : {} }, session : { load : {}, save : {} } };
					gio.session		= { procs : {},  reinit : {}, server : {}, init : {} };
					gio.core		= { procs : {}, reflection : {} };
					gio.controls	= {}; //TODm remove
					gio.navig		= { in_session : { round : {} }, in_map : {}};
					gio.map_editors	= {};
					gio.solver		= {};
					gio.domwrap		= {	regions : {}, popups : {}, elems : {}, wraps : {},
										headers : {}, status : {},
										cpanel : { controls : {} } 
									  };
					gio.info		= {	help : {}, log : {} };


	// Procedures layout:
	gio.cons = null;
	gio.cons_add = null;
	// There is a lot more to document: ...
	// ....


	// Vital debug: will be unlocked by debug in URL-query:
	// gio.debug = true;




	// ** Server part. Required only if server database is used.
	//gio.modes.sta_tic.db = 'http://localhost:3000';
	gio.session.server.login_link = '/login';
	// This settings overrides above:
	gio.session.server.full_login_link = 'https://boardspirator.herokuapp.com/login';



	gio.modes.dynamic.controls_locked = false;


	gio.config.links.external_maps_feed='feeder/requested_map.php?user_requested_link=mm';
	var w = gio.session.server.full_login_link || gio.session.server.login_link || '';    
	gio.config.links.top_navig={
			lstyle 		:	'style="text-decoration:none; color:#5555FF; font-family:Helvetica, Arial; '+
							'font-size:10px; font-weight:bold;"',
			innerHTML	:
							'<a #%lstyle%# href="'+w+'" target="_blank">Login-CraftZone</a> '+
							'<a #%lstyle%# href="http://landkey.net/gio/" target="_blank">DevZone</a> '+
							'<a #%lstyle%# href="http://landkey.net/games_of_choice/" target="_blank">MoreZone</a> '
	};
	gio.config.defpaths	=	{	GAMES_DEF_PATH : 'def/games',
								ALBUMS_DEF_PATH : 'def/albums',
								COLLECTIONS_DEF_PATH : 'def/collections',
								SKINS_DEF_PATH : 'def/skins'
							}



	gio.info.help.hint = 'h or ?';
	gio.info.help.main =
		"Keyboard Control:\n"+
		"h,?,ctrl+h,ctrl+?         help\n"+
		"esc                       close popups like this, map editor, autoplay\n"+
		"arrows,j,k,i,m            move a unit\n"+
		"backspace,b,ctrl+space    move back\n"+
		"space, ctrl+shitf+arrows  toggle breeds (unit types, colonies)\n"+
		"u, ctrl+arrows            toggle units\n"+
		"l/g/p                     toggle collections/games/maps\n"+
		"o                         toggle rounds\n"+
		"n                         new round\n"+
		"f                         forward replay\n"+
		"s                         return to start\n"+
		"z                         autoplay of a round lazily\n"+
		"e                         edit/create/show/import map text\n"+
		"w                         edit/create/show/import playpath text\n"+
		"ctrl+d                    done ... do load from map editor\n"+
		"x                         display map credits, text, and comments\n"+
		"y                         display the story\n"+
		"a                         display about and credits\n";




	gio.solver.config = {
								TIME_TO_WAIT_MS : 500,
								TIME_TO_WORK_MS : 500,
								// Memory limit:
								NODES_LIMIT : 400000,
								PREBUILT_ARRAYS_LIMIT : 32 //10000
						};


})(jQuery);

