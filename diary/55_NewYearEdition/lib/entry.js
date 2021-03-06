(function( $ ){		var tp =$.fn.tp$ = $.fn.tp$ || {};	
					var gio=tp.gio   = tp.gio   || {};


	gio.Description={
		Title			:'Boardspirator',
		Description		:'Boardpuzzle Framework',
		Version			:'0.0.55',
		Date			:'January 14 2012',
		License			:'Dual licensed under the MIT or GPL Version 2 licenses.',
		Copyright		:'(c) 2011-2012 Konstantin Kirillov', 
		WebSite			:'landkey.net/gio/',
		Contact			:'spam-protection@landkey.net where spam-protection=beaverscript',
		Diary			:"\n"+

						"	0.0.55		bug fix for IE8; minors\n"+
						"	0.0.54		Jan. 07 2012. Checks winning state for targets_filled < or > boxes_in_targets added,\n"+
						"				game.config \"inheritance\" improved\n"+
						"	0.0.53		Dec. 28. 2011. Colorban added and is a \"shell\" game for all bundled games,\n"+
						"				colorban, sokoban, monkeyban, candelban, doubleban;\n"+
						"				single map_decoder for them;\n"+
						"				optional game config file: json or js\n"+
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
	gio.init =	function(){
		var w;
		var title=gio.Description.Title;
		if(!gio.init_gui()){alert(title +' cancelled'); return;}

		gio.debug= tp.core.getQueryPar('debug');

		gio.preload_games_list();
		tp.core.each(gio.games_list, function(ix,game_key){
			var success=true;
			if(gio.do_json_config_load){ //TODO not done
				//TODO wrong: gio.preload_game_config(game_key+'_abstract'); //TODm not checked
				success=gio.preload_game_config(game_key);
			}
			if(success)gio.preload_game(game_key);
		});

		if(!gio.games || gio.games.length===0){
			gio.cons_add('games configuration loader failed; no configuration of single game is loaded.');
			return;
		}

		gio.init_gui_controls_and_game_list();

		//===============================================
		//set gio.game_ix if prescribed in query string
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

