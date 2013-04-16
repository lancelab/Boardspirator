
( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var deb		= function ( string ) { if( gio.debug )	gio.cons_add( "Virtual Landifying Map: " + string ); };			
					var conadd	= function ( string ) { gio.cons_add( "Virtual Landifying Map: " + string ); };			






	///	Boundarifies map.
	//	Builds an internal area information.
	//		Before building "holes" and "exists",
	//		calculates wall boundaries for each y-row.
	var boundarify = function ( map, left_wall, right_wall,  loc2lid, lid2uid )
	{

		var msize_x = map.size[0];
		var msize_y = map.size[1];
		var tops	= map.pos.tops;	
		var units	= map.units;


		var internal_cells_number = 0;

		//.	detects is map boundaryness,
		//	if it is, sets map_boundary to cname of a wall (usually wall_x),
		//	if not, sets to false.
		var map_boundary	=	map.parsed.wall_boundary_encountered && 
								map.script.decoder_table[ map.game.rule_helpers.map_boundary ];
								deb( 'Map boundarness = ' + map_boundary ); //TODM  slow if scrolling maps

		for( var yy = 0; yy < msize_y; yy++ ) {
			
			var left	= boundarify_line(	1,	yy, msize_x, map_boundary, loc2lid, lid2uid, tops, units );
			var right	= boundarify_line(	-1,	yy, msize_x, map_boundary, loc2lid, lid2uid, tops, units );
			if( map_boundary && left === -1 && right === msize_x )
			{
				deb( "Walled map but walless line " + yy + ".\n" +
					'"Map: "' +  map.title + "'."
				);
			}

			//. normalizes
			if( left >= right ) right = left + 1;
			left_wall[ yy ]		= left;
			right_wall[ yy ]	= right;
			internal_cells_number += right - left - 1;
		}
		// Good debug:
		// c onsole.log('Left/right walls:', left_wall, right_wall); 	

		//: helps to build metrics
		map.metrics.internal_cells_number = internal_cells_number;
	};



	/// Does job for single line
	//	for lef or right directions for right or left walls correspondingly.
	var boundarify_line = function ( direction, yy, msize_x, map_boundary, loc2lid, lid2uid, tops, units )
	{

		var left = -1;

		/// Loops via directionless variable xx_v.
		for( var xx_v = 0; xx_v < msize_x; xx_v++ )
		{
			var xx = direction < 0 ? msize_x - xx_v - 1 : xx_v;

			var tower = loc2lid[ xx ][ yy ];
			var block = false;

			//. as of today, there is no auto completion of unfilled cells in map
			if( !tower )
			{

				//. Continues in "opening" area.
				if( left < 0 && map_boundary ) continue;
				block = true;

			} else {
				var top = tops[ xx ][ yy ];

				//. HARD CODED ASSUMPTION THAT GROUND OCCUPIES THE z=0 cell
				for( var zz = 1; zz <= top; zz++ )
				{
					var unit = units[ lid2uid[ tower[ zz ] ] ];
					if( unit.block || ( map_boundary && unit.cname === map_boundary ) )
					{
						block = true;
						break;
					}
				}								
			}
			if( block )
			{
				left = xx_v;
			}else{
				if( !map_boundary || left > -1 ) break;
			}
		}
		if( map_boundary && left < 0 ) left = msize_x;
		return ( direction > 0 ? left : msize_x - left - 1 );
	};



	/// Purpose:	builds wall boundaries: if missed are -1 or row.length
	//				fills	inverse array loc2lid for all z range till map roof.
	//						and synchronizes direct array locs
	//			
	// 				builds flat cells map.xy_exists which are
	//				available to place dynamic units.
	// Returns:		true in success case,
	//				false if failed. Sets map.load='invalid' in this case.	
	var normalize_map = function( map )
	{

		var game = map.game;
		var roof = game.rule_helpers.map_roof;
		var rhelper_dyn = game.rule_helpers.one_dynamic_unit_on_top;

		// * shortcuts primary dynamic indices
		var pos = map.pos;
		var lid2uid=pos.lid2uid;
		var lu=map.pos.lid2uid;
		var tops=pos.tops;	

		// ** shortcuts static indices
		var units = map.units;
		var locs = map.locs;
		var loc2lid = map.loc2lid;
		var msize_x = map.size[0];

		// ** shortcuts flat indices
		var exists=map.xy_exists = [];
		map.digest = {};
		var hid2lid = map.digest.hid2lid = [];
		var hid2loc = map.digest.hid2loc = [];
		var lid2hid = map.digest.lid2hid = [];

		var internal_blocking_units = 0;

		var left_wall		= [];
		var right_wall		= [];
		boundarify ( map, left_wall, right_wall,  loc2lid, lid2uid );

		for(var xx=0; xx<map.size[0]; xx++){

			var ex = exists[xx] = [];
			//var hidx = hol2hid[xx] = [];

			var lx = loc2lid[xx] = loc2lid[xx] || [];
			for(var yy=0; yy<map.size[1]; yy++){

				var forbidden_xx = ( xx <= left_wall[ yy ] || xx >= right_wall[ yy ] ); //TODM why not to do continue when forbidden_xx?

				//.	..recall lx[yy] is an array, never 0.
				if(!lx[yy]){
					// Forbidden position:
					ex[yy]=false;
				}else{
					ex[yy]=true;
					var ly=lx[yy];
					for(var zz=0; zz<roof; zz++){
						if(!ly[zz] && ly[zz] !== 0){
							// New location is discovered
							var nlid=locs.length;
							ly[zz] = nlid;
							locs[nlid]=[ xx,yy,zz ];
							// No units there:
							lu[nlid]=-1; 
						}else{

							var lid = ly[zz];
							var uid = lu[lid];
							var unit = map.units[uid];
							//. absorbs unconditionally blocking units like wall_x
							if( unit.block )
							{
								ex[yy]=false;
								if( !forbidden_xx ) internal_blocking_units += 1;
							}


							// ** makes sure dynamic units are on top
							if(rhelper_dyn && zz > 0){
								var lid_below = ly[zz-1];
								var uid_below = lu[lid_below];
								var unit_below = map.units[uid_below];
								var activity_below = unit_below.activity; 
								if( activity_below.active || activity_below.passive ){
									var activity = unit.activity; 
									if( activity.active || activity.passive ){

										map.load = 'invalid';
										conadd(	"Broken map. Two dynamic units in one cell.\n" +
														"Map: " +  map.title +
														" Unit below: " + unit_below.id + ", " +
														"Unit above: " + unit.id + ", " +
														"Cell: x,y,z: " + xx + ", " + yy + ", " + zz
										); //TODm Map validation must be separate from normilizer.
										return false;

									}else{
										// **	moves active to top by swapping with top unit,
										//		looks like too much work to fix the map ... TODm redesign?
										lu[lid_below] = uid;
										lu[lid] = uid_below;
										map.pos.uid2lid[uid] = lid_below;
										map.pos.uid2loc[uid] = map.locs[lid_below];
										map.pos.uid2lid[uid_below] = lid;
										map.pos.uid2loc[uid_below] = map.locs[lid];
									}
								}								
							}
						}
					}
					//. Recall ... unconditionally blocking walls were already washed out from ex.
					if(ex[yy]){
						if( xx <= left_wall[yy] || xx >= right_wall[yy] ){
							ex[yy] = false;
						}else{
							// Add new hid ("hole id")
							var hid=hid2lid.length;
							hid2lid[hid]=ly[0];
							hid2loc[hid]=locs[ly[0]];
							for(var zz=0; zz<roof; zz++){
								var lid = ly[zz];
								lid2hid[lid]=hid;
								//c onsole.log(map.locs[lid]+' lid='+lid+' hid='+hid);
							}
						}
					}
				} //.. loc2lid[xx][yy] exists ...
			} // yy
		} // xx
		/*
		c onsole.log('map.locs=',map.locs);
		c onsole.log('map.loc2lid=',map.loc2lid);
		c onsole.log('loc2lid=',map.pos.loc2lid);
		*/
		// Good debug:
		// c onsole.log('constructed: hid2loc=',hid2loc);

		//: helps to build metrics
		map.metrics.internal_blocking_units = internal_blocking_units;

		var corners = gio.solver.bays_builder(map); 
		gio.session.reinit.metrify( map );

		map.load = 'valid';
		return true;
	};



	///	Finalizes:	map after successful parsing
	//	returns:	false if validation failed
	gio.session.reinit.landify_map = function( gm ) {

		var coll = gm.collection;
		var game = gm.game;
		deb( 'Begins ... m,c,a = ' + gm.ix + ', ' + coll.ref.list.ix + ', ' + coll.ref.list.akey );

		if( gm.load === 'invalid') {
			gio.session.reinit.messages =
				"Invalid \"gm.load\" flag\n" +
				( gm.invalid_map_message || '') +
				"\nMap board = \n" +
				tp.core.dotify( gm.script.raw_board, 1000, "", "", "\n(....)" ) +
				"\n";
			return false;
		}

		if( gm.load !== 'parsed' ) {
			gio.debly(	'Map ' + gm.ix + ' on gkey=' + gm.game.gkey + 
						"is already finalized" );
			return true;
		}


		if( !normalize_map( gm ) ) return false;

		gm.solver = gio.solver.create_solver(gm);
		//. creates a flag, gm.rounds
		gio.navig.in_session.round.init_round(gm);

		//: GUI
		gio.gui.create.board(gm);
		gio.gui.create.map_focuser(gm);
		gio.gui.create.tiles(gm);

		if(gm.playpaths){
			// Preserve initial pos for supplied paths:
			tp.core.each(gm.playpaths,function(ii,pp){
				//. By cloning we enable future changes of initial pos
				//	when solver injects a solution starting from arbitrary position.
				pp.pos = tp.core.tclone( gm.pos );
			});
		}
		gm.load = 'finalized';

		gio.debly(	'Finalized map: validated, boardified, titled: m,c,a = ' +
					gm.ix + ', ' + gm.collection.ref.list.ix + ', ' + gm.collection.ref.list.akey
		);
		return true;
	};



	///	TODM This sub. must be somewere in generate map or rebuild map ... not here
	/// Adds path to map
	gio.gui.add_and_land_ppath = function ( gm, directive, start_pos, path_text, title, dont_land )
	{
		gm.playpaths = gm.playpaths || [];
		gm.playpaths.push(
		{
						title		: title,
						value		: path_text,
						pos			: tp.core.tclone( start_pos ),
						directive	: directive
		});


		var validator_err = '';
		// Reflect solution on playpaths dom-element if
		// user is on the same map:
		if( gio.getgs().gm === gm )
		{
			var validator_err = gio.gui.reset_playpaths_select_el( !dont_land && ( gm.playpaths.length - 1 ) );
		}

		return validator_err;
	};


})();
