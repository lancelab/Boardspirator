(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	gio.solver = gio.solver || {};


	// Constructs solver
	// Restriction:
	// gm.actor_cols.length > 0
	gio.solver.Adapter=function(solver, gm, nodes, spheres){ 

		var w;
		var self={};

		var lid2hid = gm.digest.lid2hid;
		var hid2lid = gm.digest.hid2lid;
		var hid2loc = gm.digest.hid2loc;

		var loc2lid = gm.loc2lid;
		var dynamic_units = gm.dynamic_units;
		var dynamic_cols = gm.dynamic_cols;
		var dynamic_cols_len = dynamic_cols.length;
		var units = gm.units;
		var locs = gm.locs;

		// Helper. Reused at each "restore":
		// Reserve memory for it:
		var l_pos=tp.core.tclone(gm.pos);
		var l_lid2uid = l_pos.lid2uid;
		var l_uid2lid = l_pos.uid2lid;
		var l_uid2loc = l_pos.uid2loc;
		var l_tops = l_pos.tops;

		// pstates
		var node_dimension=0;
		var NOT_YET_FILLED = -1;



		// ==========================================
		// Prepare snodes
		// ------------------------------------------
		var prepare_nodes=(function(){
			var limit = 1.0;
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
			solver.stat.flat_dynamics_top_nodes_estimation = limit;
			solver.stat.hids_number = hid2lid.length;
			solver.stat.node_dimension = node_dimension;


			/*

			//-------------------------------------------------
			// Preconstruct nodes arrays to save some run-time
			//- - - - - - - - - - - - - - - - - - - - - - - - - 

			// Suspended

			var count = 0;
			var nodes_count = 0;
			var ndline = [[nodes]];
			var PREBUILT_ARRAYS_LIMIT = gio.solver.config.PREBUILT_ARRAYS_LIMIT;
			build_nodes: for(var did=0; did<dynamic_cols_len; did++){
				var col = dynamic_cols[did];
				var ulen = col.units.length;
				for(var uix=0; uix<ulen; uix++){
					var current_ndline = ndline[count];
					var line_len = current_ndline.length;
					count += 1;
					var new_ndline = ndline[count] = [];
					for(var line=0; line<line_len; line++){
						var nd = current_ndline[line];
						for(var hid=0; hid<hid2lid.length; hid++){
							if(count === node_dimension){
								nd[hid] = NOT_YET_FILLED;
								// c onsole.log('New node added: ', nd[hid]);
							}else{
								nd[hid] = [];
								new_ndline.push(nd[hid]);
								// c onsole.log('New node array added: ', nd[hid]);
							}
							nodes_count += 1;
							if(nodes_count === PREBUILT_ARRAYS_LIMIT) break build_nodes;
						}
					}
				}
			}
			// c onsole.log(nodes);
			delete ndline;
			//- - - - - - - - - - - - - - - - - - - - - - - - - 
			// Preconstruct nodes arrays to save some run-time
			//-------------------------------------------------

			*/



		})();
		// ------------------------------------------
		// Prepare snodes
		// ==========================================


		// Action:	Checks node for existance,
		//			if not exists, creates new node and returns ordered_hids.
		self.createdNode=function(input_pos, sphere_id, angle_id, ignore_node){

			var ordered_hids = [];
			var lid2uid = input_pos.lid2uid;
			var tops = input_pos.tops;
			var count = 0;
			var new_node = false;
			var count = 0;

			for(var hid=0; hid<hid2lid.length; hid++){

				var loc0 = hid2loc[hid];
				var xx = loc0[0];
				var yy = loc0[1];
				var zz = tops[xx][yy];
				var lid = loc2lid[xx][yy][zz];
				var uid = lid2uid[lid];

				// c onsole.log('storing:  loc0=', loc0, 'zz='+zz+' lid='+lid+' uid='+uid, ' tops_xx=',tops[xx]);

				var unit = units[uid];
				var activity = unit.activity;

				// c onsole.log('activity = ',activity);
				if( !(activity.passive || activity.active) ) continue;
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

			if(ignore_node) return ordered_hids;

			count = 0;
			var nd = nodes;
			for(var did=0; did<dynamic_cols_len; did++){
				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				for(var uix=0; uix<ulen; uix++){
					count += 1;
					var hid = ordered_hids[did][uix];
					// Node not exists:
					var ndh = nd[hid];
					if(!ndh || ndh === NOT_YET_FILLED){
						new_node = true;
						if(count === node_dimension){
							ndh = nd[hid] = true; //good for statistics: [sphere_id, angle_id];
							// c onsole.log('New node added: ', ndh);
							// c onsole.log('New ordered_hids',ordered_hids);
				 			return ordered_hids;
						}else{
							nd[hid] = [];
						}
					}
					// Node exists:
					if(count === node_dimension) {
						// c onsole.log('Node: ', ndh);
						// c onsole.log('Node ',ndh, spheres[ndh[0]][ndh[1]][0],' is already exists');
						return null;
					}
					nd=nd[hid];
				}
			}

		};




		self.doReStorePosition=function(ordered_hids){

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
		};//self.doReStorePosition




		self.doCompareSpots=function(a,b)
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
		


		return self;
	};

})(jQuery);
