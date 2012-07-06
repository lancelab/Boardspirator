(function( $ ){		var tp =$.fn.tp$ = $.fn.tp$ || {};	
					var gio=tp.gio   = tp.gio   || {};


	gio.Description={
		Title			:'Boardspirator',
		Description		:'Boardpuzzle Framework',
		Version			:'0.0.73',
		Date			:'May 7 2012. 8:21',
		Copyright		:'(c) 2011-2012 Konstantin Kirillov',
		License			:"Dual licensed under the MIT or GPL Version 2 licenses except the data.\n"+
						"\t\t\t\t\t\tThe data is \"play/collections\". It has separate licenses.",
		Language		:'JavaScript',
		SystemRequirements	:"\t\tTo play: FireFox 3.6+, IE 8+, any decent browser or mobile device.\n"+
							"\t\t\t\t\t\tTo deploy: FireFox 3.6+ and IE 8+: no server needed; Chrome and Opera? request a server.",
		Usage			:'Same as "SystemRequirements"',
		WebSite			:'landkey.net/gio/',
		Contact			:'spam-protection@landkey.net where spam-protection=beaverscript',
		Diary			:"\n"+

						"	0.0.72		... refactoring internal map representation ...\n"+
						"	0.0.67		Buttons on map editor.\n"+
						"				New maps.\n"+
						"				Empty collection header bug fix.\n"+
						"				Sokoban maps recognized better.\n"+
						"				Touch control is better.\n"+
						"				Playpath format bug fix.\n"+
						"	0.0.63		Multiactor recorder added. Cleaner.\n"+
						"	0.0.61		Status cells style fixed\n"+
						"	0.0.60		Able to link to external maps\n"+
						"	0.0.59		Portrait fluid layout added for mobiles;\n"+
						"				Many button controls added;\n"+
						"	0.0.58		Feb. 11; game Tokenban added;\n"+
						"				imatrix processing is sped up and ''swap'' added;\n"+
						"				_key_match replaces few keys in maps_decoder.js for performance;\n"+
						"				click events added: dblclick=unit selection, click=move;\n"+
						"				q&d fix for scroll bars in select elemen for IE8 and Opera which loose abs. pos\n"+
						"	0.0.57		debug.js added\n"+
						"	0.0.55 and below: see versions in Diary folder.\n"
	};


	gio.initiating_a_game_flag=false;
	gio.init =	function(){
		var w;
		var title=gio.Description.Title;
		if(!gio.init_gui()){alert(title +' cancelled'); return;}

		//Get parameter from URL query string:
		gio.debug= tp.core.getQueryPar('debug');


		//=================================
		// Load game definitions
		//---------------------------------
		gio.preload_games_list();
		tp.core.each(gio.games_list, function(ix,game_key){
			gio.load_game_definition(game_key);
		});
		if(!gio.games || gio.games.length===0){
			gio.cons_add('No game definitions are found.');
			return;
		}
		gio.init_gui_controls_and_game_list();
		//---------------------------------
		// Load game definitions
		//=================================



		//===============================================
		// Do select a startup game as user requested
		//-----------------------------------------------
		w=tp.core.getQueryPar('game_key');
		if(w){
			tp.core.each( gio.games, function(ix, game){
				if(game.key === w){
					gio.game_ix=ix;
					return false;
				}
			});
		}
		//===============================================

		//This is a good place to release messages stashed in debug, while
		//<body> did not exist yet:
		//tp$.deb('init done');

		if(gio.scroll_till_non_failed_game()){
			gio.init_control_events();
			gio.init_navigation();
			return;
		}
		gio.cons_add(title + ' is not loaded.');
	};
	gio.init_wrap =	function(){	gio.init(); };


})(jQuery);

$('document').ready( $.fn.tp$.gio.init_wrap );

