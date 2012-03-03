(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	//aux
	gio.aux = gio.aux || {};

	//TODm design event model better to remove this:
	//popup protection against closing by own click:
	gio.aux.common_popup_shown=true;
	var unlock_popup=function(){gio.aux.common_popup_shown=true;};
	gio.prolong_common_popup=function(){
		if(gio.common_popup.isVisible()){
			gio.aux.common_popup_shown=false;
			setTimeout(unlock_popup,1000);
		}
	};

	//gio game state - shortcut to get current framework-state
	gio.gst=function(callback){
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];
		callback(game,collection,gm);
	};


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




})(jQuery);
