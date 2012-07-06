(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};




	var unspased_board_match = /^ *(#|-)[^ ]*(#|-)$/; //for map sugar



	///////////////////////////////
	// parse board line
	//============================
	cmd.parse_board_line=function( board_y, line, map, cbformat, dtable){

		var w,i,j,len;
		var plgam=map.game;
		var size=map.size;
		var rank;
		var soko_map = !cbformat;

		// ** Clear up the line
		line=line.replace(/\s+$/g,''); 
		line=line.replace(/\t/g,' ');  //TODm sugar. slow

		//Remove dangerous double space "beautifiers" from the map:
		if(!soko_map)line=line.replace(/\s+/,' ');

		//Apply sugar: slip to sokoban line if no blanks inside the walls:
		var oneSymbolPerCell = soko_map || unspased_board_match.test(line);

		w	=	oneSymbolPerCell ? '' : ' ';
		line_arr=line.split(w);

		// Advance x-dimension size:
		if(size[0]<line_arr.length)size[0]=line_arr.length;

		var ll = map.loc2lid;
		var ts = map.pos.tops;
		

		//===============================
		// Loops via cells
		//-------------------------------
		for(var x=0; x<line_arr.length; x++){
			var locx = ll[x] = ll[x] || [];
			var locy = locx[board_y] = locx[board_y] || [];
			var tsx = ts[x] = ts[x] || [];

			var c=line_arr[x];
			var units=[]; //array of units contained in one cell
			//towers[x]=[]; //array, see towers[x].push below ...

			//Here we further generilize (colorban) file format:
			//Commas will separate names which are longer than 1.
			//So, cell (cluster) can be: ab7 or a2,b,7
			//Test for comma first:
			var w= !oneSymbolPerCell && c.indexOf(',')>0 ? ',' : '';
			var cluster =c.split(w); //fe: a1,b,- ...


			//===============================
			// Loops trough cluster (tower)
			//-------------------------------
			//var dtable = map.script.decoder_table;
			for(i=0, len=cluster.length; i<len; i++){
				unit_char=cluster[i];

				//Before look in decoder table, extract unit's rank if any:
				if(cluster[i].length>1){
					rank=parseInt(unit_char.substr(1));
					unit_char=unit_char.charAt(0);
				}				


					w=dtable[unit_char]; //.charAt(i)]; //c[i]
					//assume wall. no validation for wrong char
					if(!w)w=dtable['#'];
					if(typeof w === 'object'){
						//array:
						units=units.concat(w);
					}else{
						// Until map does not really have ranks,
						// this "if" is idle:
						if(cluster[i].length>1)	w=[w,rank];
						units.push(w);
					}
			}
			//-------------------------------
			// Loops trough cluster (tower)
			//===============================



			//===================================================
			//Map sugar ... make 'ground' unnecessary
			//Check if ground is missed and add it ...
			w=true; //means missed
			for(i=0; i<units.length; i++){
				if(ground_check(units[i]))w=false;
				if(!w)break;
			}
			if(w)units.splice(0,0,'ground_x'); //add ground
			//====================================================


			//=================================================
			// Loops trough normalized cluster in single cell.
			// Adds colonies. Builds towers.
			//-------------------------------------------------
			tsx[board_y] = units.length-1;
			for(var zz=0; zz<units.length; zz++){
				// Do index location:
				var lid=map.locs.length;
				locy[zz] = lid;
				map.locs[lid]=[x,board_y,zz];
				u=units[zz];

				rank=-1;
				if(typeof u === 'object'){
					rank=u[1];
					u=u[0];
				}

				var colonies=map.cols;
				var colony = colonies[u];
				var gcol=plgam.cols[u];
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
						colony.race = gcol.race;
						colony.baton = !!gcol.baton;
						colony.target = !!gcol.target;
						colony.block = !!gcol.block;
						colony.pass = !!gcol.pass;

						//view:
						colony.focused = true;

						if(colony.target) map.target_cols.push(colony);
						if(colony.baton) map.baton_cols.push(colony);
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
						activity : activity, //sugar

						col : colony, 
						gm : map,
						cname : colony.nam, //sugar

						src : u				// for delayed decoding TODO rid?
				};
				
				map.units[unit_id]=unit;
				if(activity.active || activity.passive){
					map.dynamic_units.push(unit);
				}

				colony.units[unit_ix] = unit;
				map.pos.lid2uid[lid] = unit_id;
				map.pos.uid2lid[unit_id]=lid;
				map.pos.uid2loc[unit_id]=map.locs[lid];

				if(unit_ix === 0) colony.acting_unit=unit;
				//-------------------------



			}
		}//x loop
		//-------------------------------
		// Loops via cells
		//===============================
		return true;
	};
	//============================
	// parse board line
	///////////////////////////////





	// Helper
	var ground_check=function(name){
		if(typeof name === 'object')name=name[0];
		if(name.indexOf('ground_')===0)return true;
		return false;
	};



})(jQuery);


