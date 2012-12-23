(function(){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio		=  tp.gio    =  tp.gio   || {};
				var ceach	=  tp.core.each;
				var gdf		=  gio.def;





	///	Derives base-game from base-dress and seed-dress and 
	//	builds default maps decoder.
	//	Results in bimatch game - alien colors do not recognized.
	gdf.procs.spawn_base_game_and_dress = function () {
		spawn_base_game_def();
		spawn_base_game_dress();
		gio.core.def.map_format.finalize_colorban_decoder_table( 
			gdf.games[ gdf.base_game.basekey ]
		);
	};





	///	Derives base-game from base-definition-seed.
	//	Results in bimatch game - alien colors do not recognized.
	var spawn_base_game_def = function () {

		var game							= tp.core.clone_many( gdf.base_game );
		gdf.games[ gdf.base_game.basekey ]	= game;


		game.won_or_not			=	function(gm, pos){ return gio.colorban_is_game_won(gm, pos); };




	  /// Extra Rules. Make this game "herdy" - dependent on sheep leadership
	  game.herd_rules = function( move, gm ) {

		var verbose = gio.modes.dynamic.verbose || gio.debug;
		var log = gio.info.log;
		var game=this;
		var steps = move.steps;
		// Original step:
		var orig_step=steps[1];
		var dir = orig_step.direction > 0 ? 1 : -1;
		var orig_unit=gm.units[orig_step.uid];
		var colony=orig_unit.col;
		var pos=move.pos;
		var orig_loc = pos.uid2loc[orig_unit.id];
		var sense = game.herd_sense;

		//. possibly sugar,
		//  possibly speeds up planar location validation
		var xy_exists = gm.xy_exists;

		// Loop via neighbourhood starting from the lead coordinate
		// Lead direction:
		var dimensionality=game.herd_dimensionality;

		// Dimension:
		var dim=Math.abs(orig_step.direction)-1;
		// Orthogonal dimension:
		var orth_dim = (dim + 1 ) % dimensionality;

		// Auxiliary for loop:
		var zz = orig_loc[2];
		var fellow_loc=[];

		// Loop via neighbours, xn, yn:
		// against leading direction:
		for(var nx=sense; nx >= -sense; nx--){
			fellow_loc[dim]= nx*dir + orig_loc[dim];
			// In orthogonal direction:
			for(var ny=sense; ny >= -sense; ny--){
				if( nx === 0 && ny === 0 ) continue;

				fellow_loc[orth_dim]=ny*dir + orig_loc[orth_dim];

				var xx=fellow_loc[0];
				//. skips invalid planar location
				if( !xy_exists[xx] ) continue;

				var yy=fellow_loc[1];
				//. skips invalid planar location
				if( !xy_exists[xx][yy] ) continue;

				// Finds out, is there a colony-fellow 
				var tower = gm.loc2lid[xx][yy];
				for(var zz=1; zz<tower.length; zz++){
					var lidn = tower[zz];
					var uidn = pos.lid2uid[lidn];

					// Tower's top reached:
					if(uidn<0)continue;

					var unitn = gm.units[uidn];
					// Finally, neighbour found.

					// Is it already scheduled for move?:
					var already_moving=false;
					for(var s=0; s<steps.length; s++){
						if(steps[s].uid === unitn.id){
							already_moving=true;
							break;
						}
					}
					// Hard-coded: only one fellow-peer can be in planar cell 
					// at the time:
					if(already_moving) break;

					// Skip if not a colony-fellow:
					if(unitn.cname !== colony.nam) continue;

					// Finally, fresh-fellow-neighbour found.
					// effective_recursion_deepness = 1 because is in respect of
					// fresh-fellow-neighbour:
					// c onsole.log('uidn='+uidn+' cname='+unitn.hname+' x,y='+xx+','+yy+' unitn',unitn);
					var result=gio.core.procs.do_interaction( orig_step.direction, unitn, move, 2  );
					if(result){
						move=result;
						steps = move.steps;
						//c onsole.log('added for move. id='+unitn.id);
					}else{
						if(verbose) log.move +=	unitn.hname + " cannot follow the leader " + unitn.hname +"\n";
					}
					// Stop scrolling tower:
					break;	
				}
			}
		}
		return move;
	  };  /// Extra Rules






	  ///	Automates colonies definition.
	  //	This function is executed immediately.
	  //	It applies colors to races.
	  //	We could make these definitions by hand,
	  //	but opted use this function.
	  ( function( game ) {
	
		var w;

		//Setup number of colors here:
		//Perhaps these colors would be enough:...
		var colors = game.colors;
		var itr = game.interact;
		var itrr = game.interact_rules;

		//. game.cnames will be game.cnames = [ hero	: [ "hero_x", "hero_a", ... ],
		//										box		: [ "box_x", "box_a", ...																
		game.cnames = {};


		for(var color_ix=0; color_ix<colors.length; color_ix++){
			var color = colors[color_ix];

			tp.core.each(game.races, function( race_name, race ){

						var cnames = game.cnames[race_name] = game.cnames[race_name] || [];

						//. inits cnames, colony-names: hero_x, hero_a, ... box_x, ...
						var cname = cnames[color_ix] = race_name + '_'+ color;	
						if(race.pass) itrr.pass[cname]=true;

						// Colonies by name. Slow? TODm add index:
						var cols = game.cols = game.cols || {}; 
						var col = cols[cname] = {

								// tribe attributes 
								// "redundant" to cname
								color_ix : color_ix,
								race : race_name,

								// gameplay behaviour
								activity : race.activity,

								// motivation attributes
								baton : race.baton,
								target : race.target,

								// unconditional behaviour attributes:
								block : !!itrr.block[cname],
								pass : !!itrr.pass[cname]
						};						

						// heros and boxes are going to interact
						if( race_name === 'hero' || race_name === 'box' ) itr[cname]={}; 
			});

			var hh=game.cnames['hero'][color_ix];
			var bb=game.cnames['box'][color_ix];
			var gg=game.cnames['ground'][color_ix];

			var blackb = game.cnames['box' ][0];
			var blackh = game.cnames['hero'][0]; 

			itr[ blackh ][bb]='push';	//blackhero can push every box
			itr[hh][ bb     ]='push';	//color hero can push boxes only of own color

			// TODm make this flexible:
			itr[hh][ blackb ]='push';	//color hero can push boxes of black

			itr[ blackb ][bb]='push';	//black box can push boxes of any color
			itr[bb][ bb     ]='push';	//color box can push boxes of own color

			// TODm make this flexible:
			itr[bb][ blackb ]='push';	//color box can push boxes of black color


			// //\\	interactions with walls and grounds are not set here
			//		they handled by color rule right in the interaction module:
			//			matched walls do block, non-matches do pass,
			//			matched grounds do pass, non-matched do block.
			//		if one needs to make specific interactions, set them right in the game definition
			//		below is a stub which is disabled
			//. ll	stands for ww, wall, but we cannot use work variable, ww
			//var ll=game.cnames['wall'][color_ix];
			//itr[bb][gg]='pass';			//ground of the same color passes movement
			//itr[hh][gg]='pass';			//ground of the same color passes movement

			//itr[bb][ll]='block';			//ground of the same color passes movement
			//itr[hh][ll]='block';			//ground of the same color passes movement
			// \\//	interactions with walls and grounds are not set here

		}

		//. removes this property because its job is done
		delete game.interact_rules

		//c onsole.log(itr);
		//c onsole.log(game.cols);

	  })(game);
	}; /// Derives base-game from




	/// finalizes base_game_dress
	var spawn_base_game_dress = function () {

		var bgame = gdf.games[gdf.base_game.basekey];
		var ddress = gio.def.default_dress;
		var hname = ddress.hname_table;
		var colors = bgame.colors;

		for( var color_ix=0; color_ix < colors.length; color_ix++ ) {
			tp.core.each(bgame.races, function( race_name, race ) {

				var cname = bgame.cnames[race_name][color_ix];
				//. wastes space by establishing hnames right in default dress
				hname[ cname ] = color_ix ? race_name : cname;
			});
		}

		//. defines sugar function
		ddress.human_name = function( nkey ) { return this.hname_table[ nkey ] || nkey; };
		bgame.dresses = { "default" : ddress };
	};



})();


