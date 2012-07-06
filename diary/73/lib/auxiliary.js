(function( $ ){ 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;


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


	// Safequard to allow execution only when all is set:
	// Returns: true only when game round is running:
	// TODO why gio.game_ix is defined?
	gio.posIsInitiated=function(){
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		if(collection.maps_loaded!=='success')return false;
		if(!collection.map_ix && collection.map_ix !== 0)return false;
		var gm=collection.maps[collection.map_ix];
		var round=gm && gm.rounds && gm.rounds[gm.rounds.ix];
		var pos=round && round.pos;
		if( !pos )return false;
		return gm;
	}


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
