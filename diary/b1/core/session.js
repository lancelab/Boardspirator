(function( ){	 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;



	
	///		Returns:	state even for pased (unvalidated) game map
	//		Possibly:	Poor design. TODM remove
	//		Input:		all args are optional.
	//					if collection is supplied, all state is derived
	//					from it, not from current album.
	gio.getUnfinishedState = function(callback, collection, no_map_requested){

		var state = gio.session.state;

		if(collection){

			var playalb = gio.session.procs.get_album( collection.lkey ); //TODO this album is last-current or current GUI album of this collection. Does this work in scroll_till_non_failed_collection ?
			var colls	= playalb.collections;
		}else{
			var playalb	= ( state.album_ix || state.album_ix === 0 ) &&  gio.session.alist[ state.album_ix ];

			//. at core/entry.js, albumion is not established yet
			if( !playalb ) return {};

			var colls	= playalb.collections;
			collection	= colls[colls.ix];
		}

		var gs		= { playalb : playalb };
		gs.colls 		= colls;
		gs.collection	= collection;
		gs.coll			= collection;

		if(no_map_requested) return gs;
		if(	!collection.maps ) return gs;
		var gm = gs.gm = collection.maps[collection.map_ix];
		if(gm){
			gs.game = gs.gm.game;
			gs.cols = gm.cols;
			gs.col = gm.acting_col;
		}
		return gs;
	}




	// ===============================================
	// Gets state, gs:
	// -----------------------------------------------
	gio.getgs=function(callback, collection){

		if(collection){
			var playalb = collection.album;
			var colls	= playalb.collections;
		}else{
			var playalb	= gio.session.alist[ gio.session.state.album_ix ];
			var colls	= playalb.collections;
			collection	= colls[colls.ix];
		}


		var gs		= { playalb : playalb };
		gs.colls 		= colls;
		gs.collection	= collection;
		gs.coll			= collection;

		var gm			= gs.gm = collection.maps[collection.map_ix];

		gs.cols			= gm.cols;
		gs.col			= gm.acting_col;

		var round = gs.round = gm.rounds[gm.rounds.ix];
		var pos = gs.pos = round.pos;
		
		gs.cid = gs.col.id;
		gs.unit = gs.col.acting_unit;
		gs.uid = gs.unit.id;
		if(pos){
			gs.lid = pos.uid2lid[gs.uid];
			gs.loc = gm.locs[gs.lid];
		}
		

		if(callback){
			return callback(gs);
		}else{
			return gs;
		}
	};
	// ---------------------------------------------
	// Gets state, gs
	// =============================================


	gio.session.procs.get_album = function ( album_key ) {
		return gio.session.alist_by_key[ album_key ];
	};


})();
