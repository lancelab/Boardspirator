( function () {	 	var tp		= $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		= tp.gio    =  tp.gio   || {};
					var ceach	= tp.core.each;



	/// Tests:	is position winning or not
	//			Speed-critical because used in solver.
	//	Input:	if gm and pos are provided
	//			then does work for them.
	//			Otherwise, tests currently
	//			running map and position.
	//
	// Returns:	1 for 'won', 0 for 'playing'
	// Outputs:	pos.filled_units
	gio.colorban_is_game_won = function( gm, pos ) { 

		if( !gm ) {
			var gs	= gio.getgs();
			gm		= gs.gm;
			pos		= gs.pos;
		}

		var uid2loc		= pos.uid2loc;
		var objective	= gm.objective;

		var necessary_to_fill = objective.necessary;
		if( !necessary_to_fill ) return 0;

		var filled_units	= 0;
		var units			= objective.baton_units;

		for( var nn = 0, len = units.length; nn < len; nn++ ) {
			var unit = units[ nn ];

			//.. good ... we have a unit ... now, checking is it matched

			var loc = pos.uid2loc[ unit.id ];
			//. TODH targets are always on the second floor
			if( loc[2] < 2 ) continue;

			var peer_lid	= gm.loc2lid[ loc[0] ][ loc[1] ] [ 1 ]; 
			var peer_uid	= pos.lid2uid[ peer_lid ];
			var peer		= gm.units[ peer_uid ];
			
			if( peer.target && 
				(	peer.motive_name === unit.cname ||
					( ( peer.color_ix === 0 || unit.color_ix === 0 ) && peer.motive_race === unit.race )
				)
			){
				filled_units += 1;
				if( filled_units >= necessary_to_fill ) break;
			}
			// c onsole.log( 'peer.motive_name=' + peer.motive_name + ' unit.cname=' + unit.cname +
			//	 'peer.color_ix =' + peer.color_ix + " unit.color_ix " + unit.color_ix +
			//	 'peer.motive_race= ' + peer.motive_race + 'unit.race=' + unit.race
			//	);

		}
		pos.filled_units	= filled_units;
		result				= filled_units >= necessary_to_fill ? 1 : 0;
		return result
	};

})();
