(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	var visualize_collection_titles = function(collection, collections){

			if(!collection){
				var gs = gio.getUnfinishedState();
				collection = gs.coll;
				collections = gs.colls;
			}

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

			collection.album.title = gio.gui.procs.calculate_game_and_album_title();

			gio.domwrap.headers.title_select_el.reset(); // TODm do we need to shake options?:

			return true;
	};




	
	// Purpose:		lands on map
	//				if map is not initiated, initiates it
	//				if map initiation fails, then reverts to current map
	var do_land_to_album_and_coll=function(album_ix, collection_ix, map_ix){

			if(gio.debug){tp$.deb(	'landing on album_ix, coll..ix, map_ix =' + 
									album_ix + ', ' + collection_ix + ', ' + map_ix
			);}

			var gs				= gio.getUnfinishedState();
			var current_playalb	= gs.playalb;
			var current_coll	= gs.coll;

			if( gs.gm && gs.gm.load === 'finalized' ) gio.gui.procs.hide_current_board();


			//	TODm q&d fix: instead of validation of the map, 
			//	will revert back if map fails
			var stash_album_ix		= gio.album_ix;
			var stash_collection_ix	= current_playalb.collections.ix;
			var stash_map_ix		= current_coll.map_ix;


				
			// ** establishes new game and collection in playsession:
			gio.album_ix = album_ix;
			var playalb = gio.playalbs[album_ix];

			var colls = playalb.collections;
			colls.ix = collection_ix;
			var coll = colls[colls.ix];


			var target_map_ix = map_ix;
			if( (map_ix || map_ix === 0 ) && 
				coll.maps.length > 1 &&
				0 <= map_ix && map_ix < coll.maps.length
			){
				target_map_ix = map_ix;
			}else{
				target_map_ix = coll.map_ix;
			}
			coll.map_ix = target_map_ix;

			

			if(!gio.session.reinit.rounds()){
				//: reverts setting back
				gio.album_ix						= stash_album_ix;
				current_playalb.collections.ix	= stash_collection_ix;
				current_coll.map_ix				= stash_map_ix;

				// 	all maps and all game can be broken, so dont unhide:
				//	gio.gui.procs.unhide_current_dom_board();

				gio.cons_add(	"Failed to land on map " + target_map_ix + "\n" +
								gio.session.reinit.messages +
								"Reverted to game, collection, map: " + 
								gio.album_ix + ", " + 
								current_playalb.collections.ix + ", " + 
								current_coll.map_ix
							);
				return false;
			}


			// * Revisualize titles:
			gio.domwrap.headers.title_select_el.reset({c:{choice_ix:gio.album_ix}});
			visualize_collection_titles(coll,colls);
			return true;
	};




	// Behaviour:	finds first game with collection with valid current map, and
	//				lands there, and
	//				refreshesh GUI
	gio.scroll_till_valid_game = function(){

		gio.gui.procs.lock_controls('Loading a Game ... '); //TODm too late here? .... move it to event handler? ...
		var len = gio.playalbs.length;
		var start_album_ix = gio.album_ix;
		for(var i=0; i<len; i++){
			gio.album_ix		= (start_album_ix + i)%len;
			playalb			= gio.playalbs[gio.album_ix];
			if(gio.debug) gio.cons_add("Landing on album " + gio.album_ix + " " + playalb.title);
			var found_coll_ix1	= gio.scroll_till_non_failed_collection( playalb.collections, !i );
			if(found_coll_ix1){
				// * don't do this, landing already did this:
				// gio.gui.procs.refresh();
				gio.gui.procs.unlock_controls();
				return true;
			}
			if(gio.debug) {
				gio.cons_add(	'When scrolling valid games: Missed album: index=' + gio.album_ix +
								' title=' + playalb.title);
			}
		}
		var ww = 'No games available';
		gio.domwrap.popups.modal_message_popup.show({innerHTML:ww});
		gio.cons_add(ww);
		return false;
	};




	// Behaviour:	finds first collection with valid current map and
	//				lands there
	// Alert:		returns coll. ix + 1, not coll. ix.
	// TODm:		... still weak. If current map fails logical validation
	//				all collection is skipped
	gio.scroll_till_non_failed_collection = function(collections, download_external_if_first){

		gio.domwrap.headers.collection_select_el.close();
		gio.domwrap.headers.map_select_el.close();
		if( !collections ) return false;
		var len=collections.length;
		if( len === 0 ) return false;

		var start_ix = collections.ix;
		for(var i=0; i<len; i++){

			// * faulty: col ix changes when insuccessfully landing
			//var current_coll_ix = (i+collections.ix)%len;

			var current_coll_ix = (i+start_ix)%len;
			var coll			= collections[current_coll_ix];

			if(!coll.maps_loaded){
				//:: avoids external collection because not sure will it download
				if( !coll.external || (download_external_if_first && !i) ) {
					gio.download_collection(coll);
				}else{
					if( gio.debug ) {
						gio.cons_add(	"External collection def. skipped from downloading when scrolling " +
										"to avoid the risk." );
					}
				}
			}

			if(coll.maps_loaded === 'success'){
				var gs = gio.getUnfinishedState(null, coll);
				var landed = do_land_to_album_and_coll(
					gs.playalb.ix,
					coll.coll_ix
				);
				if(landed){
					gio.gui.procs.unlock_controls();
					return (current_coll_ix+1);
				}
			}
		}
		gio.cons_add("No collections available when scrolling via album. album key = \"" + collections[0].album.key + "\"");
		return false;
	};
	



	// ======================================================
	// Purpose:	Master Navigation Subroutine
	// Input:	All args are optional.
	//			If !!akey or !!collection_ix is false,
	//			takes them from gio.getgs()
	// Returns: false is cannot position game and collection
	// ======================================================
	gio.navig.select_album_and_collection = function(
			akey,
			collection_ix,
			map_ix,
			dont_land
	){
		var collection_is_requested	= ( collection_ix || collection_ix === 0 );

		// Tries to set akey if requested:
		if( akey ){
			var album_ix = -1;
			tp.core.each( gio.playalbs, function(ix, playalb){
				if(playalb.key === akey){
					album_ix = ix;
					return false;
				}
			});
			if(album_ix < 0) {
				if(gio.debug) {
					gio.cons_add( 'Missed akey ' + akey + ' in GUI-album-set, gio.playalbs.');
				}
				return false;
			}
		}else{
			album_ix = gio.album_ix;
		}

		var playalbs = gio.playalbs[album_ix];

		if(collection_is_requested){
			if( playalbs.collections.length <= collection_ix || collection_ix < 0) return false;
		}else{
			collection_ix = playalbs.collections.ix;
		}
		var coll = playalbs.collections[collection_ix];


		if(!coll.maps_loaded) gio.download_collection(coll);


		if(	coll.maps_loaded !== 'success'){
			if(gio.debug) tp$.deb('Failed maps load. Message: ' + coll.maps_loaded);
			return false;
		}

		if(!dont_land){
			if(!do_land_to_album_and_coll(album_ix, collection_ix, map_ix)) return false;
		}	


		return coll;
	};



	// Returns: false is cannot position game and collection
	gio.navig.select_album_map = function(gm){
		return gio.navig.select_album_and_collection(
			gm.collection.album.key,
			gm.collection.coll_ix,
			gm.ix
		);
	};



})(jQuery);
