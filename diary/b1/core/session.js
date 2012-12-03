(function( $ ){ 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;



	
	// ***	Returns:	state even for pased (unvalidated) game map
	//		Input:		all args are optional.
	//					if collection is supplied, all state is derived
	//					from it, not from current album.
	gio.getUnfinishedState = function(callback, collection, no_map_requested){

		if(collection){
			var playalb = collection.album;
			var colls	= playalb.collections;
		}else{
			var playalb	= gio.playalbs[gio.album_ix];
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
			var playalb	= gio.playalbs[gio.album_ix];
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






})(jQuery);
