(function( ){	 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;





	/// Gets state, gs. For GUI-listed albums and their collections.
	//	gm does not have to be finalized and valid.
	gio.getgs = function( ) {

		//:	Does gatekeeping
		var state = gio.session.state;
		if( !state.album_ix && state.album_ix !== 0 ) return {}; // TODM slow ... but sure
		var playalb	= gio.session.alist[ state.album_ix ];
		if( !playalb ) return {};


		var colls		= playalb.collections;
		collection		= colls[ colls.ix ];

		var gs			= { playalb : playalb };
		gs.colls 		= colls;
		gs.collection	= collection;
		gs.coll			= collection;

		var gm			= gs.gm = collection.maps[ collection.map_ix ];

		gs.cols			= gm.cols;
		gs.col			= gm.acting_col;

		var rounds = gm.rounds;
		if( !rounds ) return gs;

		var round = gs.round = gm.rounds[ gm.rounds.ix ];
		var pos = gs.pos = round.pos;
		
		gs.cid = gs.col.id;
		gs.unit = gs.col.acting_unit;
		gs.uid = gs.unit.id;
		if( pos ) {
			gs.lid = pos.uid2lid[gs.uid];
			gs.loc = gm.locs[gs.lid];
		}

		return gs;

	};	/// Gets state, gs



	gio.session.procs.get_album = function ( album_key ) {
		return gio.session.alist_by_key[ album_key ];
	};


	/*
	/// Does debugging
	gio.session.get_state_snap = function () {
		var gs = gio.getgs();
		var akey = gs.playalb && gs.playalb.key;
		var cix = -1;
		var mix = -1;
		var coll = undefined;
		if( akey ) {
			cix = gs.colls.ix;
			var coll = gs.coll;
			mix =  coll.map_ix || coll.map_ix === 0 ? coll.map_ix : -1;
		}
		return [ akey, cix, mix, coll ];
	};
	*/

})();
