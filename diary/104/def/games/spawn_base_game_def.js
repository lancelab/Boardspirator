(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var gdf		=  gio.def;



	gdf.procs.spawn_base_game_and_dress=function(){
		gdf.procs.spawn_base_game_def();
		gdf.procs.spawn_base_game_dress();
	};




	gdf.procs.spawn_base_game_dress=function(){

		var bgame = gdf.inherited_games[gdf.base_game_key];
		var dress = gio.def.default_dress;

		var idec	= dress.image_decoder = dress.image_decoder || {};
		var hero	= bgame.cnames['hero'];					
		var box		= bgame.cnames['box'];
		var target	= bgame.cnames['target'];
		var wall	= bgame.cnames['wall'];

		for(var i=0; i<bgame.colors.length; i++){
					var ch=hero[i];
					var uch=ch.toUpperCase();
					idec[hero[i]]		=idec[hero[i]]		|| hero[i]+'.png';
					idec[box[i]]		=idec[box[i]]		|| box[i]+'.png';
					idec[target[i]]		=idec[target[i]]	|| target[i]+'.png';
					idec[wall[i]]		=idec[wall[i]]		|| wall[i]+'.png';
		}

		dress.human_name	= function(internal){	return this.hname_table[internal] || internal;   };
		dress.get_credits	= function(){ 
									return this.credits.replace(
											/#%game\.nam%#/g,
											gdf.dressed_games[this.game_key].nam

									);
		};
	};





	gdf.procs.spawn_base_game_def=function(){

		var game		 						= tp.core.clone_many(gdf.base_game);
		gdf.inherited_games[gdf.base_game_key]	= game;


		// Default if no file:
		game.default_maps_text =
					":::map\n"+
					"-#---#--##--#---#-###-\n"+
					"-##--#-#--#-##--#-#---\n"+
					"-#-#-#-@--$-.-#-#-##--\n"+
					"-#--##-#--#-#--##-#---\n"+
					"-#---#--##--#---#-###-\n"+
					":::board_end\n"+
					":::title=No Maps Found.\n"+
					":::map_end\n";


		game.maps_decoder		=	function(data, collection){ return gio.def.colorban_maps_decoder.decode(data, collection); },
		game.won_or_not			=	function(gm, pos){ return gio.colorban_is_game_won(gm, pos); };


	  ///////////////////////////////////////////////////////////////////////
	  //Extra Rules. Make this game "herdy" - dependent on sheep leadership
	  //=====================================================================
	  game.herd_rules=function(move,gm){

		var w;
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
				var yy=fellow_loc[1];

				// Skip faulty planar location:
				if(!gm.xy_exists[xx][yy]) continue;

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
					var result=gio.do_process_step( orig_step.direction, unitn, move, 2  );
					if(result){
						move=result;
						steps = move.steps;
						//c onsole.log('added for move. id='+unitn.id);
					}else{
						if(gio.debug){
							gio.cons_add(unitn.hname + " cannot follow the leader " + unitn.hname);
						}							
					}
					// Stop scrolling tower:
					break;	
				}
			}
		}
		return move;
	  };
	  //=====================================================================
	  //Extra Rules. Make this game "herdy" - dependend on box leadership
	  ///////////////////////////////////////////////////////////////////////






	  // ================================================
	  // This function automates colonies definition.
	  // It is exectuded immediately.
	  // It applies colors to races.
	  // ================================================
	  (function(game){
	
		var w;

		//Setup number of colors here:
		//Perhaps these colors would be enough:...
		var colors = game.colors;
		var itr = game.interact;
		var itrr = game.interact_rules;
		game.cnames = {};


		for(var color_ix=0; color_ix<colors.length; color_ix++){
			var color = colors[color_ix];
			tp.core.each(game.races, function( race_name, race ){

						var cnames = game.cnames[race_name] = game.cnames[race_name] || [];

						//init colony name:
						var cname = cnames[color_ix] = race_name + '_'+ color;	
						if(race.pass) itrr.pass[cname]=true;

						// Colonies by name. Slow? TODm add index:
						var cols = game.cols = game.cols || {}; 
						var col = cols[cname] = {
								color_ix : color_ix,
								race : race_name,
								activity : race.activity,
								baton : race.baton,
								target : race.target,
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

			itr[bb][gg]='pass';			//ground of the same color passes movement
			itr[hh][gg]='pass';			//ground of the same color passes movement

		}

		//c onsole.log(itr);
		//c onsole.log(game.cols);

	  })(game);
	}; //spawn_base_game_def


})(jQuery);


