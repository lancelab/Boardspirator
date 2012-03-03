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
		var colonies=gm.colonies;
		var round=gm.rounds && gm.rounds[gm.rounds.ix];
		var pos=round && round.pos;
		return callback(game,collection,gm,round,pos,colonies);
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


	//some colonies are disabled in play mode ... weed them out:
	//loop through all and find active index:
	gio.skip_inactive_colony=function(gm,direction)
	{
			if(gio.modes[gm.mode_ix]==='edit')return;

			var len=gm.colonies.length;
			var pos=gm.rounds[gm.rounds.ix].pos;
			var ix=pos.colony_ix;

			for(var i=0; i<len; i++)
			{
				if(!gm.colonies[ix].frozen && !gm.colonies[ix].passive)
				{
					pos.colony_ix=ix;					
					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					ix=(ix+len-1)%len;
				}else{
					ix=(ix+1)%len;
				}
			}
	};

	gio.virtual_select_colony=function(pointer){
		var game, collection, gm, round, pos;
		gio.gst(function(g,c,m,r,p){	game=g; collection=c; gm=m; round=r; pos=p;   });

		var len=gm.colonies.length;

		var ix=pos.colony_ix;
		if(  pointer === 'left' || pointer === 'up'   ){
			ix=(ix+len-1)%len;
		}else{
			ix=(ix+1)%len;
		}
		pos.colony_ix=ix;
		gio.skip_inactive_colony(gm,pointer);
	};


	////////////////////////////////////
	//lock and unlock controls
	//==================================
	//lock and show message:
	gio.lock_controls=function(msg){
		//gio.cons_add('locking ...');
		if(!gio.initiating_a_game_flag){
			gio.modal_message_popup.show({innerHTML: (msg || '')});
			gio.initiating_a_game_flag=true;
		}
	};
	gio.unlock_controls=function(){
		//gio.cons_add('unlocking ...');
		gio.initiating_a_game_flag=false;
		gio.modal_message_popup.hide();
	};
	////////////////////////////////////




})(jQuery);
