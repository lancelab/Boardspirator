
( function () {	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio  =  tp.gio    =  tp.gio   || {};


				var config	= gio.solver.config;






				// //.\\ hid
				//			hid[did][placeholder]
				//				did			= dynamic-colony id 
				//				placeholder = 0..n, n = number of units in colony
				//			array hid[did] always contains hids in ascending order
				//				(it does not hold unit's ids, so does not have "redundancy")
				// \\// hid





	///	Constructs adapter for given solver
	//	Restriction: gm.actor_cols.length > 0
	gio.solver.Adapter = function( map_sol_ver, gm  ) { 

		var w;
		var adapter={};

		var lid2hid = gm.digest.lid2hid;
		var hid2lid = gm.digest.hid2lid;
		var hid2loc = gm.digest.hid2loc;

		var loc2lid = gm.loc2lid;
		var dynamic_units = gm.dynamic_units;
		var dynamic_cols = gm.dynamic_cols;
		var dynamic_cols_len = dynamic_cols.length;
		var units = gm.units;
		var locs = gm.locs;
		var game = gm.game;
		
		//:	localizes constants
		var CANON_REPRESENTED_AS	= config.CANON_REPRESENTED_AS;
		var wCON					= gio.solver.CONSTANTS;
		var CANON__STRING			= CANON_REPRESENTED_AS	=== wCON.CANON_STRING;
		var CANON__ARRAY			= CANON_REPRESENTED_AS	=== wCON.CANON_ARRAY;
		var CANON__LINKED_LIST		= CANON_REPRESENTED_AS	=== wCON.CANON_LINKED_LIST;

		//: localizes indices
		var ww				= gio.solver.POSPOINT;
		var STATE			= ww.STATE;
		var HID				= ww.HID;
		var UPLINKS			= ww.UPLINKS;


		// //\\ Shadowed-Position. Not a current position. 
		//		Keeps non-dynamic units unchanged. 
		//		"Shuffles" dynamic units.
		//		ATTENTION: must contain valid position before and after manipulation with.
		//		ATTENTION:	can lead to a bug in multithreaded environment when two callers
		//					change it.
		//		APPARENTLY IS DISCARDED AFTER EVERY CONSTRUCTION OF CANON OR VICE VERSA
		//		Helper. Reused at each "restore":
		//		Reserves memory for l_ - variables
		var l_pos=tp.core.tclone(gm.pos);

		//: sets masters
		var l_lid2uid	= l_pos.lid2uid;
		var l_tops		= l_pos.tops;
		
		//: sets auxiliaries
		var l_uid2lid	= l_pos.uid2lid;
		var l_uid2loc	= l_pos.uid2loc;
		// \\// Shadowed-Position. Not a current position. 



		/// apparently does preliminary estimations

		// pstates
		var node_dimension=0;
		var NOT_YET_FILLED = -1;
		var limit = 1.0;

		/// calculated po-states-space volume upper boundary	
		(function( map_sol_ver ) {
			var permitted_hids = hid2lid.length;
			for(var did=0; did<dynamic_cols_len; did++){
				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				node_dimension += ulen;

				var repetition = 1;
				for(var uix=0; uix<ulen; uix++){
					repetition *= (uix+1);
					limit *= permitted_hids;
					permitted_hids -= 1;
				}
				limit /= repetition;
			}

		})();


		adapter.get_stat_info = function( map_sol_ver ) {
			map_sol_ver.stat.flat_dynamics_top_nodes_estimation = limit;
			map_sol_ver.stat.hids_number = hid2lid.length;
			map_sol_ver.stat.node_dimension = node_dimension;
		}



		// Action:	Converts pos to canon
		// Input:	sphere_id, angle_id - optional, only for debug.
		//			they are ignored if nodes_repository is omitted.
		//			nodes_repository -	optional, 
		//					if omitted quits after creating ordered_hids,
		//					otherwise, marks canon as existing in nodes_repository.
		// Returns: ordered_hids
		adapter.createdNode = function( input_pos, sphere_id, angle_id, nodes_repository ) {

			var ground_always_on_level_0 = game.rule_helpers.ground_always_on_level_0;

			var ordered_hids	= [];
			var lid2uid			= input_pos.lid2uid;
			var tops			= input_pos.tops;
			var count			= 0;

			for(var hid=0; hid<hid2lid.length; hid++){

				var loc0 = hid2loc[hid];
				var xx = loc0[0];
				var yy = loc0[1];
				var zz = tops[xx][yy];
				if( !zz && ground_always_on_level_0 ) continue;
				var lid = loc2lid[xx][yy][zz];
				var uid = lid2uid[lid];

				// c onsole.log('storing:  loc0=', loc0, 'zz='+zz+' lid='+lid+' uid='+uid, ' tops_xx=',tops[xx]);

				var unit = units[uid];
				var activity = unit.activity;

				// c onsole.log('activity = ',activity);
				if( !(activity.passive || activity.active) ) continue;
				//. dynamic unit id
				var did = unit.col.did;
					
				// Slow:
				ordered_hids[did] = ordered_hids[did] || [];
				ordered_hids[did].push(hid);
				// c onsole.log('	ordered_hids[did].push(hid);'+did+' '+hid);
				count +=1;
				// No more slots to fill left:
				if(count === node_dimension) break;

			}//for( hid=...
			// c onsole.log(' return stored pos=', ordered_hids);


			if( !nodes_repository ) {
				return CANON__ARRAY ? ordered_hids : canon2str( ordered_hids );
			}


			count = 0;
			var nd = nodes_repository;
			for(var did=0; did < dynamic_cols_len; did++){
				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				var w_oh_did = ordered_hids[did];

				for(var uix=0; uix < ulen; uix++){
					count += 1;
					var hid = w_oh_did[uix];
					var ndh = nd[ hid + UPLINKS ];

					/// Node not exists.
					if( !ndh ) {

						//..	not sure how web-browser handles sparse arrays
						//		For the future: perhaps making this with ArrayBuffer will preserve memory ... but
						//		we should do this better than well elaborated browser's "hashes" ...
						ndh = nd[ hid + UPLINKS ] = [];
						if( CANON__LINKED_LIST )
						{
							ndh[ STATE ]		= count === 1 ? null : nd;
							ndh[ HID ]			= hid;
						}
						// c ccc('New ordered_hids',ordered_hids);
						if(count === node_dimension) {
							if( CANON__LINKED_LIST )
							{
								//cccc( 'Adapter: new canon =' + canon2str( ordered_hids ) + ' canode=', ndh );
								//.	Returns array itself which is a placeholder for spheres information.
								//	We don't return canon because it is contained in "own address".
								return ndh;
							}else{
								nd[ hid ] = true;
								//.	Returns "canon" because it must be stored in spheres.
								return CANON__STRING ? canon2str( ordered_hids ) : ordered_hids;
							}
						}
					}

					/// Node exists.
					if( count === node_dimension )
					{
						// c onsole.log('Node: ', ndh);
						return null;
					}

					nd = ndh;
				}
			}

		};



		///	Converts ordered_hids to valid position.
		adapter.doReStorePosition = function( ordered_hids ) {

			// Remove all dynamic units from two masters:
			// lid2uid and tops
			for(var ix=0; ix<dynamic_units.length; ix++){
				var unit=dynamic_units[ix];
				var lid=l_uid2lid[unit.id];
				l_lid2uid[lid]=-1;
				var loc = locs[lid];
				l_tops[loc[0]][loc[1]] -= 1;
			}

			// Construct pos:
			for(var did=0; did<dynamic_cols_len; did++){

				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				var ohids = ordered_hids[did] ;

				for(var uix = 0; uix < ulen; uix++){

					var uid = cunits[uix].id;

					// We always have colony's and hid's order the same:
					var hid = ohids[uix];

					var loc0 = hid2loc[hid];
					var xx = loc0[0];
					var yy = loc0[1];

					var zz = l_tops[xx][yy]+1;
					l_tops[xx][yy] = zz;

					var tlid=loc2lid[xx][yy][zz];
					l_lid2uid[tlid]=uid;

					l_uid2lid[uid]=tlid;
					l_uid2loc[uid]=locs[tlid];
					// c onsole.log(' restoring. loc='+xx+','+yy+','+zz+' uid='+uid+
					//			' hid='+hid+' tlid='+tlid+' l_lid2uid[tlid]',l_lid2uid[tlid]);
				}//uix
			}//did
			//c onsole.log('adapter: restored l_pos=', l_pos, ' l_pos 27 ='+l_pos.lid2uid[27]);
			return l_pos;
		};//adapter.doReStorePosition


		/// Converts canode to pos by bypassing canon.
		adapter.canode2pos = function( canode ) {

			//: masters
			var l_u = l_lid2uid;
			var l_t = l_tops;

			//. used aux
			var l_l = l_uid2lid;
			//. non-used aux
			var l_o = l_uid2loc;

			/// Removes all dynamic units from two masters: lid2uid and tops.
			for(var ix = 0, wlen = dynamic_units.length; ix < wlen; ix++ ) {
				var unit				= dynamic_units[ ix ];
				var lid					= l_l[ unit.id ];
				l_u[ lid ]				= -1;
				var lc					= locs[ lid ];
				l_t[ lc[0] ][ lc[1] ]	-= 1;
			}

			var len = dynamic_cols_len;
			// cccc( 'Adapter: canode2canon: canode=', canode);

			for( var dcol = len-1; dcol > -1; dcol-- )
			{
				var col		= dynamic_cols[ dcol ];
				var units	= col.units; 
				var ulen	= units.length;

				for( var dunit = ulen - 1; dunit > -1; dunit-- )
				{
					var uid = units[ dunit ].id;
					var hid = canode[ HID ];

					//: gets location
					var loc0		= hid2loc[ hid ];
					var xx			= loc0[0];
					var yy			= loc0[1];
					var zz			= l_t[xx][yy] + 1;

					//.	sets first master: top
					l_t[ xx ][ yy ]	= zz;

					//:	sets second master: uid
					var tlid	= loc2lid[ xx ][ yy ][ zz ];
					l_u[ tlid ]	= uid;

					//. sets inverse maps
					l_l[ uid ]	= tlid;
					l_o[ uid ]	= locs[ tlid ];
					// c onsole.log(' restoring. loc='+xx+','+yy+','+zz+' uid='+uid+
					//				' hid='+hid+' tlid='+tlid+' l_lid2uid[tlid]',l_lid2uid[tlid]);

					//. steps back along canode
					canode = canode[ 0 ];
				}
			}
			//c onsole.log('adapter: restored l_pos=', l_pos, ' l_pos 27 ='+l_pos.lid2uid[27]);
			return l_pos;
		};	// adapter.canode2p..



		/*
		//abandoned
		adapter.doCompareSpots=function(a,b)
		{
			for(var did=0; did<dynamic_cols_len; did++){
				var au = a[did];
				var bu = b[did];
				var len = au.length; // TODm do shortcut this
				// Loop via colony and compare hids:
				for(var ix=0; ix<len; ix++){
					if( au[ix] !== bu[ix] )	return false;
				}
			}
			return true;
		};
		*/
		
		/// converts canon to string representation: xxx.xxx:yyy.yyy...
		var canon2str = adapter.canon2str = function( ordered_hids ) //TODMS
		{	
			var result = '';
			for( var dcol = 0, len = ordered_hids.length; dcol < len; dcol++ )
			{
				var collection_group = ordered_hids[dcol];
				for( var dunit = 0, ulen = collection_group.length; dunit < ulen; dunit++ )
				{
					var hid = collection_group[dunit];
					result += hid;
					if( dunit < ulen-1 ) result += '.';
				}
				if( dcol < len-1 ) result += ':';
			}
			return result;
		};


		/// converts string to canon
		adapter.str2canon = function( str ) //TODMS
		{	
			var breeds = str.split(':');
			var canon = [];
			for( var dcol = 0, len = breeds.length; dcol < len; dcol++ )
			{
				var group = canon[dcol] = breeds[dcol].split('.');
				for( var dunit = 0, ulen = group.length; dunit < ulen; dunit++ )
				{
					group[dunit] = parseInt(group[dunit]);					
				}
			}
			// c onsole.log('str, canon =' + str, canon);
			return canon;
		};


		
		/// converts canode to canon
		adapter.canode2canon = function( canode )
		{	
			var canon = [];
			var len = dynamic_cols_len;
			// cccc( 'Adapter: canode2canon: canode=', canode);

			for( var dcol = len-1; dcol > -1; dcol-- )
			{
				var col = dynamic_cols[ dcol ];
				var cunits = col.units; 
				var ulen = cunits.length;
				var sub_canon = canon[ dcol ] = [];
				for( var dunit = ulen - 1; dunit > -1; dunit-- )
				{
					sub_canon[ dunit ] = canode[ HID ];
					canode = canode[ 0 ];
				}
			}
			//cccc( 'Adapter: canode2canon: canon =' + canon2str( canon ) + ' canon=', canon );
			return canon;
		};



		return adapter;
	}; /// Constructs adapter for given map_sol_ver


})();
