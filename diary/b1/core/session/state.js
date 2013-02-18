
( function () {	 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;

					var session	=  gio.session;
					var gsp		=  gio.session.procs;
					var deb		=  function ( string ) { if( gio.debug )	gio.cons_add( "Session State: " + string ); };			



	/// Gets GUI state, gs. For GUI-listed albums and their collections.
	//	gm does not have to be finalized and valid.
	//	Slow precedure, but user is slow anyway.
	gio.getgs = function ( ) {

		var gs			= {};

		var state		= session.state;
		var akey		= state.akey__bf;

		//: Gatekeeps.
		if( !akey )		return gs;
		var aix			= akey ? state.album_ix : -1;
		var lst_alb		= gio.session.alist[ aix ];
		if( !lst_alb )	return gs;  //TODM garbage. remove

		var colls		= lst_alb.collections;
		var cix			= colls.ix;
		var coll		= colls[ cix ];
		var mix			= coll.map_ix;

		gs.playalb		= lst_alb;
		gs.colls 		= colls;
		gs.collection	= coll;
		gs.coll			= coll;

		gs.akey			= akey;
		gs.aix			= aix;
		gs.cix			= cix;
		gs.mix			= mix;

		var gm			= gs.gm = coll.maps[ mix ];

		gs.cols			= gm.cols;
		gs.col			= gm.acting_col;
		gs.board		= gm.board;

		var rounds		= gm.rounds;
		if( !rounds )	return gs;

		var round		= gs.round = gm.rounds[ gm.rounds.ix ];
		var pos			= gs.pos = round.pos;
		
		gs.cid			= gs.col.id;
		gs.unit			= gs.col.acting_unit;
		gs.uid			= gs.unit.id;
		if( pos ) {
			gs.lid		= pos.uid2lid[gs.uid];
			gs.loc		= gm.locs[gs.lid];
		}

		return gs;

	};	/// Gets state, gs





	gsp.get_listed_album = function ( album_key ) {
		return session.alist_by_key[ album_key ];
	};





	gsp.disable_GUI_state = function ( ) 
	{
		var sstt = session.state;
		if( !sstt.akey__bf ) return;
		deb(	'Disabling GUI state which is: aix, a = ' +
				sstt.album_ix + ', ' + sstt.akey__bf
		);
		sstt.akey__bf = '';
	};
	



	///	Sets:		GUI states: session.state.album_ix, ... 
	//	Input:		all is optional
	//				akey pulled before aix.
	//				if album info is missed, then current is used and not changed.
	//				if coll info is missed, then current is used and not changed.
	//				if map info is missed, then current is used and not changed.
	gsp.do_memorize_GUI_state = function ( akey, aix, cix, mix ) {

				var ss = session;
				if( akey )
				{
					var album	= gsp.get_listed_album( akey );
				}else if( aix || aix === 0 ) {
					var album = ss.alist[ aix ];
				}else{
					var album = ss.alist[ state.album_ix ];
				}

				if( !cix && cix !== 0 ) cix = album.collections.ix;
				var coll = album.collections[ cix ];

				if( !mix && mix !== 0 ) mix = coll.map_ix;

				//. state flag: tells is state set or not
				ss.state.akey__bf = album.key;

				//. first state component
				ss.state.album_ix	= album.ix;

				//. second state component
				album.collections.ix = cix;

				//. third state component
				coll.map_ix = mix;
	
				deb(	'Established state: aix,a,c,m = ' +
						ss.state.album_ix + ', ' + ss.state.akey__bf +  ', ' +
						cix + ', ' + mix
				);

	};


	gsp.debstate = function ( message )
	{
		var gs = gio.getgs();
		deb(	message + ' GUI State = akey, aix, cix, mix = ' +
				gs.akey + ', ' + gs.aix + ', ' +gs.cix + ', ' +gs.mix
		);
	};



})();
