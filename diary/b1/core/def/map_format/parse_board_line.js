(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;

					var unspased_board_match	= /^ *(#|-)[^ ]*(#|-)$/;	//for map sugar
					var reg_ex_cont_space		= /\s+/g;					//for map sugar


	///////////////////////////////
	// parse board line
	//============================

	// * reserves object for races
	var sugar;
	var sugar_color;
	var sugar_range;
	var breed2color = cmd.breed2color;
	var color2breed = cmd.color2breed;


	/// enters? board lines parser
	cmd.parse_board_lines = function(raw_board_lines, map, cbzone_bf, dtable){
		sugar		= map.collection.sugar;
		sugar_range	= sugar && sugar.do_colorize_randomly;
		sugar_color	= map.sugar_color = map.sugar_color || {};

		breed2color = cmd.breed2color;
		color2breed = cmd.color2breed;

		map.parsed.wall_boundary_encountered = false;
		/// processes the job via board lines
		for(var yy=0; yy<raw_board_lines.length; yy++){
			cmd.parse_board_line(yy,raw_board_lines[yy],map,cbzone_bf,dtable);
		}
	};




	cmd.parse_board_line=function( board_y, line, map, cbzone_bf, dtable){

		var w,i,j,len;
		var game=map.game;
		var size=map.size;
		var rank;
		var rhelper_ground = game.rule_helpers.ground_always_on_level_0;
		var sugar_speed_map_boundary = game.rule_helpers.map_boundary;
		var mparsed = map.parsed;

		//: clears up the line
		line=line.replace(/\s+$|<br>/gi,''); 
		line=line.replace(/\t/g,' ');  //TODm sugar. slow
		//. removes dangerous double space "beautifiers" from the map //TODM fails?
		if( cbzone_bf ) line=line.replace(reg_ex_cont_space, ' ');

		//. applies sugar: slips to sokoban line if no blanks inside the walls
		var oneSymbolPerCell = (!cbzone_bf) || unspased_board_match.test( line );

		w	=	oneSymbolPerCell ? '' : ' ';
		line_arr=line.split(w);

		// Advance x-dimension size:
		if(size[0]<line_arr.length)size[0]=line_arr.length;

		var ll = map.loc2lid;
		var ts = map.pos.tops;
		

		/// Loops via cells
		for(var x=0; x<line_arr.length; x++){

			var locx = ll[x] = ll[x] || [];
			var locy = locx[board_y] = locx[board_y] || [];
			var tsx = ts[x] = ts[x] || [];

			var c=line_arr[x];
			var units=[]; //array of units contained in one cell
			//towers[x]=[]; //array, see towers[x].push below ...


			//	//\\	Here we further generilize (colorban) file format:
			//			Periods will separate names which are longer than 1.
			//			So, cell (cluster) can be: ab7 or a2.b.7
			//			c onsole.log( 'cbzone_bf=' + cbzone_bf + ' oneSymbolPerCell=' + oneSymbolPerCell );
			if( cbzone_bf && !oneSymbolPerCell ) {
				var wsplitter = c.indexOf( '.' ) > -1 ? '.' : '';
			}else{
				var wsplitter = '';
			}
			var cluster = c.split( wsplitter ); //fe: a1,b,- ...
			if( !cluster[ cluster.length - 1 ] ) cluster.pop();
			//. replaces empty unit with zero-ground
			if( !cluster[ 0 ] ) cluster[ 0 ] = 'Y';
			// c onsole.log('cluster=', cluster);
			//	\\//	Here we further generilize (colorban) file format:



			/// Loops trough cluster (tower)
			for(i=0, len=cluster.length; i<len; i++){

				var utoken = cluster[i];
				var ranked_unit = false;

				//Before look in decoder table, extract unit's rank if any:
				if( utoken.indexOf( ':' ) > 1 ) {
					ranked_unit = true;
					var ww = utoken.split( ':' );
					rank=parseInt( ww[1] );
					utoken = ww[0];
				}				

				if( utoken === sugar_speed_map_boundary ) {
					mparsed.wall_boundary_encountered =
						mparsed.wall_boundary_encountered || [x, board_y];
				}


				var ww = dtable[ utoken ]; //.charAt(i)]; //c[i]
				//assume wall. no validation for wrong char
				if( !ww ) ww = dtable[ '#' ];
				if( typeof ww === 'object' ) {
						//.. dtable maps utoken to array of units
						units = units.concat( ww );
				}else{
						// Until map does not really have ranks,
						// this "if" is idle:
						if( ranked_unit )	ww = [ ww, rank ];
						units.push( ww );
				}
			} /// Loops trough cluster





			///	Sugarifies: adds ground if missed
			if( rhelper_ground ){
				//. sets "ground is missed"-flag
				var ww = true;
				for(i=0; i<units.length; i++){
					if( ground_check(units[i]) ) ww=false;
					if(!ww) break;
				}
				//. adds ground
				if(ww) units.splice(0,0,'ground_x');
			}



			///	Loops trough normalized cluster in single cell.
			//	Adds colonies. Builds towers.
			//	c onsole.log('units in cell=', units);
			tsx[board_y] = units.length-1;
			for(var zz=0; zz<units.length; zz++){

				//: //\\	Indexes location //////////////////
				//.			Generates new index, lid.
				var lid=map.locs.length;
				locy[ zz ] = lid;
				//.	Adds new location.
				map.locs[ lid ]=[ x, board_y, zz ];
				//: \\//	Indexes location //////////////////


				u=units[zz];

				rank=-1;
				if(typeof u === 'object'){
					rank=u[1];
					u=u[0];
				}


				var colonies = map.cols;
				var colony = colonies[u];
				var gcol = game.cols[u];
				var race = gcol.race;

				// ** sugarifies
				if(sugar_range){
					var sugarr = sugar_range[race];
					if(	sugarr && ( race === 'box' || race === 'hero' || race === 'target') ){
						if(gcol.color_ix === 0){
							// ** converts black color to blue
							next_color_ix = gcol.color_ix || 1;
							var u = game.cnames[race][next_color_ix];
							var colony = colonies[u];
							var gcol = game.cols[u];
						}

						if(colony){
							var previous_colony_color = sugar_color[race];
							var next_color_ix = ( previous_colony_color + 1) % sugarr;
							next_color_ix = next_color_ix || 1;
						}

						var u = game.cnames[race][next_color_ix];
						var gcol = game.cols[u];
						var colony = colonies[u];
						sugar_color[race] = next_color_ix;
						// if(map.ix===0) c onsole.log('sugarr='+sugarr+' next='+next_color_ix+ ' u='+u);
					}else if(u === 'wall_x'){
						// ** replaces walls with movable boxes
						var u = 'box_x';
						var gcol = game.cols[u];
						// * removes walls from goals
						gcol.baton = false;
						var colony = colonies[u];
					}
				}

				var activity = gcol.activity;


				//-------------------------
				// Create colony:
				//- - - - - - - - - - - - - 
				if(!colony){
						colony = colonies[colonies.length]={id:colonies.length};
						colonies[u] = colony;
						colony.nam = u;

						// Important for flat maps:
						colony.zorder = ground_check(u) ? 10 : 200;
						colony.zorder = gcol.target ? 100 : colony.zorder;

						colony.units = [];

						colony.color_ix = gcol.color_ix;

						colony.activity = activity;
						colony.race = race;
						colony.baton = !!gcol.baton;
						colony.target = !!gcol.target;
						colony.block = !!gcol.block;
						colony.pass = !!gcol.pass;

						//view:
						colony.focused = true;

						if(activity.active){
							map.actor_cols.push(colony);
							if(!map.acting_col){
								map.acting_col=colony;
							}
						}
						if(activity.active || activity.passive){
							colony.did = map.dynamic_cols.length;
							map.dynamic_cols.push(colony);
						}

				}
				//-------------------------







				//-------------------------
				// Create unit:
				//- - - - - - - - - - - - - 

				unit_ix=colony.units.length;
				var unit_id=map.units.length;
				
				var unit=map.units[unit_id]={
						id : unit_id, 		//addr in parent
						ix : unit_ix, 		//addr in colony attr
						did : colony.did,	//addr in dynamic col

						rank : rank, //attr
						color_ix : colony.color_ix,
						race : colony.race,
						pass : colony.pass,
						block : colony.block,
						target : colony.target,
						baton : colony.baton,
						activity : activity, //sugar

						col : colony, 
						gm : map,
						cname : colony.nam,
						uname : colony.nam + '_' + unit_ix + '_' + unit_id,						

						src : u				// for delayed decoding TODm rid?
				};
				
				map.units[unit_id]=unit;
				if(activity.active || activity.passive){
					map.dynamic_units.push(unit);
				}

				// //\\ Making motivations
				if( colony.target ) {
					unit.motive_name = colony.nam.replace( 'htarget', 'hero' ).replace( 'target', 'box' ); //TODQ 
					unit.motive_race = colony.race.replace( 'htarget', 'hero' ).replace( 'target', 'box' );
					map.objective.target_units.push( unit );
				}
				if( colony.baton ) map.objective.baton_units.push( unit );
				// \\// Making motivations
				

				colony.units[unit_ix] = unit;
				map.pos.lid2uid[lid] = unit_id;
				map.pos.uid2lid[unit_id]=lid;
				map.pos.uid2loc[unit_id]=map.locs[lid];

				if(unit_ix === 0) colony.acting_unit=unit;
				//-------------------------



			} /// Loops trough normalized cluster in single cell

		}/// Loops via cells

		return true;
	};
	//============================
	// parse board line
	///////////////////////////////





	/// returns true if 'ground_' is detected in name
	var ground_check=function(name){
		if(typeof name === 'object')name=name[0];
		if(name.indexOf('ground_')===0)return true;
		return false;
	};



})();


