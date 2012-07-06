(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	gio.reactivate_or_load_collection = function(coll){
		var game=coll.game; //gio.games[gio.game_ix];
		if(!coll.maps_loaded){ //==='not started'){
			game.download_collection();
			//TODO 	need a research. apparently
			//		no return till asyn. ajax finishes:
			return;   //gio.reinit_or_create_div_board_and_pos called in callback
		}else if(coll.maps_loaded!=='success'){
			return;
		}
		gio.reinit_or_create_div_board_and_pos();
	};


	gio.scroll_till_non_failed_game=function(){
		gio.lock_controls('Loading a Game ... '); //TODm too late here? .... move it to event handler? ...
		var len=gio.games.length;
		for(var i=0; i<len; i++){
			gio.game_ix=(i+gio.game_ix)%len;
			var game=gio.games[gio.game_ix];
			if(gio.scroll_till_non_failed_collection(game.collections)){
				//c onsole.log('resetting non failed game:'+gio.game_ix+' ',gio.games[gio.game_ix]);
				gio.title_select_el.reset({c:{choice_ix:gio.game_ix}});
				gio.unlock_controls();
				return true;
			}	
		}
		var w='No games available';
		gio.modal_message_popup.show({innerHTML:w});
		gio.cons_add(w);
		return false;
	};
	
	gio.scroll_till_non_failed_collection=function(collections){
		gio.collection_select_el.close();
		gio.map_select_el.close();
		var len=collections.length;
		for(var i=0; i<len; i++){
			collections.ix=(i+collections.ix)%len;
			collection=collections[collections.ix];

			//TODO relies on syncron. jQ ajax text download
			gio.reactivate_or_load_collection(collection);
			
			if(collection.maps_loaded==='success'){
					//c onsole.log('resetting non failed collection:',{options:collections},{choice_ix:collections.ix});
					gio.collection_select_el.reset(
						{r:{
							options				:collections
						},
						c:{	dont_reset_styles	:false,
							choice_ix			:collections.ix
						}}
					);

					gio.map_select_el.reset(
						{r:{
							options				:collection.maps
						},
						c:{	dont_reset_styles	:false,
							choice_ix			:collection.map_ix
						}}
					);

					return true;
			}
		}
		gio.cons_add("No collections available.");
		return false;
	};
	

})(jQuery);
