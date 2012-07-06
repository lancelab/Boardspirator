(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	var visualize_collection_titles=function(collection, collections){

					var w;

					// c onsole.log('resetting non failed collection:',{options:collections},{choice_ix:collections.ix});
					gio.domwrap.headers.collection_select_el.reset(
						{r:{
							options				:collections
						},
						c:{	dont_reset_styles	:false,
							choice_ix			:collections.ix
						}}
					);
					gio.domwrap.headers.map_select_el.reset(
						{r:{
							options				:collection.maps
						},
						c:{	dont_reset_styles	:false,
							choice_ix			:collection.map_ix
						}}
					);

					collection.plalb.title = gio.gui.procs.calculate_game_and_album_title();

					gio.domwrap.headers.title_select_el.reset(); // TODm do we need to shake options?:

					return true;
	};


	
	var do_land_to_game_and_coll=function(game_ix, collection_ix, map_ix){

			if(gio.debug){
				tp$.deb('landing on game_ix, coll..ix, map_ix =',
				game_ix, collection_ix, map_ix);
			}

			// If we are behind successful framework init,
			// then hide playsession board first:
			// TODm modify getgs() to handle this better:
			var current_playalb = gio.playalbs[gio.game_ix];

			var current_coll = current_playalb.collections[current_playalb.collections.ix];
			if( current_coll.maps_loaded ==='success' ){
				var gs=gio.getgs();
				if( gs.gm.board ) gio.gui.procs.hide_current_board();
			}

				
			// ** Establish new game and collection in playsession:
			gio.game_ix = game_ix;
			var playalb = gio.playalbs[game_ix];

			var colls = playalb.collections;
			colls.ix = collection_ix;
			var coll = colls[colls.ix];

			if( (map_ix || map_ix === 0 ) &&
				coll.maps.length > 1 &&
				0 <= map_ix && map_ix < coll.maps.length
			){
				coll.map_ix = map_ix;
			}


			gio.session.reinit.rounds();

			// * Revisualize titles:
			gio.domwrap.headers.title_select_el.reset({c:{choice_ix:gio.game_ix}});
			visualize_collection_titles(coll,colls);
	};




	gio.scroll_till_valid_game=function(accept_default_map){
		gio.gui.procs.lock_controls('Loading a Game ... '); //TODm too late here? .... move it to event handler? ...
		var len=gio.playalbs.length;
		for(var i=0; i<len; i++){
			var tried_game_ix = (i+gio.game_ix)%len;
			var playalb=gio.playalbs[tried_game_ix];
			var found_coll_ix1 = gio.scroll_till_non_failed_collection(
						playalb.collections,
						accept_default_map);
			if(found_coll_ix1){
				do_land_to_game_and_coll(
						tried_game_ix,
						found_coll_ix1-1
				);
				gio.gui.procs.unlock_controls();
				return true;
			}	
		}
		var w='No games available';
		gio.domwrap.popups.modal_message_popup.show({innerHTML:w});
		gio.cons_add(w);
		return false;
	};






	gio.scroll_till_non_failed_collection=function(collections, accept_default_map){

		gio.domwrap.headers.collection_select_el.close();
		gio.domwrap.headers.map_select_el.close();
		if( !collections ) return false;
		var len=collections.length;
		if( len === 0 ) return false;
		for(var i=0; i<len; i++){
			var current_coll_ix=(i+collections.ix)%len;
			coll=collections[current_coll_ix];

			if(!coll.maps_loaded) gio.download_collection(coll);
			if( coll.maps_downloaded_and_validated || (coll.maps_loaded === 'success' &&  accept_default_map )){
				return (current_coll_ix+1);
			}
		}
		gio.cons_add("No collections available.");
		return false;
	};
	



	// ======================================================
	// Input:	All args are optional.
	//			If !!game_key or !!collection_ix is false,
	//			takes them from gio.getgs()
	// Returns: false is cannot position game and collection
	// ======================================================
	gio.navig.select_game_and_collection = function(
			game_key,
			collection_ix,
			map_ix,
			allow_ignore_download,
			dont_land
	){

		var collection_is_requested	= ( collection_ix || collection_ix === 0 );

		// Tries to set game_key if requested:
		if( game_key ){
			var game_ix = -1;
			tp.core.each( gio.playalbs, function(ix, playalb){
				if(playalb.key === game_key){
					game_ix = ix;
					return false;
				}
			});
			if(game_ix < 0) return false;
		}else{
			game_ix = gio.game_ix;
		}

		var playalbs = gio.playalbs[game_ix];

		if(collection_is_requested){
			if( playalbs.collections.length <= collection_ix || collection_ix < 0) return false;
		}else{
			collection_ix = playalbs.collections.ix;
		}
		var coll = playalbs.collections[collection_ix];


		if(gio.debug) tp$.deb('Download collection if not yet done');

		// Download collection if not yet done:
		if(!coll.maps_loaded) gio.download_collection(coll);

		if(	!coll.maps_downloaded_and_validated &&
			!(allow_ignore_download && coll.maps_loaded === 'success')
		){
			if(gio.debug) tp$.deb('Failed maps load.');
			return false;
		}

		if(!dont_land) do_land_to_game_and_coll(game_ix, collection_ix, map_ix);

		return coll;
	};





})(jQuery);
