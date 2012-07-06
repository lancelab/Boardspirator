(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};
					//	header-time-execution


	// The purpose of this file is to prepare handlers which
	// are common for button-click or key-strike control events.

	gio.toggle_help=function(){
		var game=gio.games[gio.game_ix];
		gio.common_popup.dotoggle({
				owner:'help',
				innerHTML:	'<pre>'+gio.help+
							"\n\nRules: \n"+game.rules+
							"\n\nObjective: \n"+game.objective+
							"\n"+'</pre>'
		});
		gio.prolong_common_popup();
	};


	gio.toggle_about_map_pane = function(){
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];
		var w = gm.raw_comments ? "\nMap Comments:\n"+
								gm.raw_comments+"\n\n" : '';
		w=tp.core.pre2html(w);
		w += "<pre>\nMap Text:\n"+
			tp.core.htmlencode(gm.raw_board)+"\n\n</pre>";
		gio.common_popup.dotoggle({owner:'map_comments', innerHTML:w});
		gio.prolong_common_popup(); //don't close now
	};


	gio.toggle_about_pane = function(){
		if(gio.initiating_a_game_flag)return;

		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];

		var gm=collection.maps[collection.map_ix];
		var about = 	"C r e d i t s\n"+game.credits+"\n\n"+
						"E n g i n e\n";

		//===================================
		// A little bit to respect copyright
		//-----------------------------------
		var external_link_info='';
		if(collection.external){
			external_link_info =
				"C r e d i t s\n"+
				"for external map collection:\n"+
				"You loaded this collection from external source:\n"+
				collection.external.link + "\n"+
				gio.Description.Title + " takes no responsibility for contents of external maps.\n"+
				"This content can be changed unexpectedly.\n";
				if(collection.external.human_readable){
					external_link_info += 
						"Known human-readable page for this link is:\n"+
						collection.external.human_readable +"\n\n";
				}
				about = external_link_info + about;
		}
		//-----------------------------------
		// A little bit to respect copyright
		//===================================


		tp.core.each(gio.Description, function(k,v){
			about += '    '+k+': '+v+"\n";
		});
		if(collection.file_header){about +=
			"\n\nO r i g i n a l   F i l e   H e a d e r   o r   C r e d i t s:\n\n"+
			tp.core.htmlencode(collection.file_header);
		}
		gio.common_popup.dotoggle({owner:'about', innerHTML:'<pre>'+about+'</pre>'});
		gio.prolong_common_popup();
	};

})(jQuery);
