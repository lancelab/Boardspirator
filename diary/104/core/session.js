(function( $ ){ 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;




	// ===============================================
	// Gets state, gs:
	// -----------------------------------------------
	// Don't use if:
	// if( collection.maps_loaded!=='success' ) return gs;
	gio.getgs=function(callback){

		var playalb	= gio.playalbs[gio.game_ix];
		var gs		= { playalb : playalb };

		gs.colls 		= playalb.collections;
		var collection	= gs.colls[playalb.collections.ix];
		gs.collection	= collection;
		gs.coll			= collection;
		// 				  Slow: // if( collection.maps_loaded!=='success' ) return gs;
		var gm			= gs.gm = collection.maps[collection.map_ix];

		// Most relevant game:
		var plgam = gs.plgam = gs.gm.game;

		gs.cols			= gm.cols;
		gs.col			= gm.acting_col;

		var round = gs.round = gm && gm.rounds && gm.rounds[gm.rounds.ix];
		var pos = gs.pos = round && round.pos;

		if(gs.col){
			gs.cid = gs.col.id;
			gs.unit = gs.col.acting_unit;
			gs.uid = gs.unit.id;
			if(pos){
				gs.lid = pos.uid2lid[gs.uid];
				gs.loc = gm.locs[gs.lid];
			}
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
