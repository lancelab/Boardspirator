(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	// "Behaviour":	if collection load failed, then quits.
	gio.reinit_or_create_div_board_and_pos = function(){
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		if(collection.maps_loaded!=='success'){
			gio.cons(	"In game "+game.nam+ ",\n"+
						"collection "+
						(collection.path ? collection.path : collection.external_link) + "\n" +
						"did fail to load\n"+
						"\ncomments: "+collection.maps_loaded);
			return false;
		}
		var gm=collection.maps[collection.map_ix] ;

		if(!gm.rounds){

			// for future solver make_indexed_location(gm);

			gm.start_pos=[];
			gm.rounds=null;

			if(gm.acting.cid > -1){
				gm.start_pos.colony_ix=gm.acting.cid; //TODO rid
			}else{
				gm.start_pos.colony_ix=gm.colony_ix || 0; //TODO rid

				// Some colony is always acting, even wall can in edit mode:
				gm.acting.cid = 0; 
			}				

			// TODO mess of non-gui and gui code: rid of punits and fix:
			gio.create_gui_board(gm);
			gio.create_game_focuser(game);
			gio.create_tiles(gm);

			gio.init_round(gm);

			game.init_help();
		}
		gm.board.style.display='block';
		//gio.skip_inactive_colony(gm,'right');

		//TODm check this ... we should be ready to set bundled playpaths now:
		if(gm.playpaths){
				gio.bundles_path_select_el.reset(
					{r:{
						options		:gm.playpaths,
						callback	:function(i,v){
										//TODnon-critical lockers while conversion ... takes long?
										gio.text2round(v.value);
										//TODm seems overkill: ... better: non failed map:
										//TODm: Not sure about check ... can this fail?:										
										gio.scroll_till_non_failed_collection(game.collections);

										//TODOnon-critical must use own unlocker, not generic:
										gio.unlock_controls();
									}
					},
					c:{	dont_reset_styles	:false,
						choice_ix			:0,
						gui					:{style:{wrapper:{display:'block'}}}
					}}
				);
		}else{
			gio.bundles_path_select_el.reset(
				{c:{gui:{style :{wrapper:{display:'none'}}}}});
		}


		gio.init_map_style();
		gio.draw_scene();
		gio.draw_status();
		return true;
	};


	/*
	gio.make_posbook=function(gm){
		var pb=gm.posbook=[];
		var loc=gm.pos.loc2lid;
		for(var x=0; x<loc.length; x++){
			var locx=loc[x];
			pb[x]=[];
			for(var y=0; y<locx.length; y++){
				pb[x][y]=locx[y].length-1;
			}
		}

	};
	*/

	// Purpose: Build flat locations available for move:
	// Hard coded assumption that wall_x always blocks TODm check this assumption dynamically.
	var make_indexed_location=function(gm){

		/*
		This code is for future when we will minimize required resources for solver
	
		// To build:
		// TODm rename? ixloc with m(ovable)loc(ation):
		var ixloc=gm.ixloc=[];
		// Do inverse:
		// var ixloc2ixlid=gm.ixloc2ixlid=[];
		var ixlid=0;
		// Having:
		var lid=gm.loc2lid;

		var units=gm.units;
		//var blocks=gm.game.interact_rules.blocks;

		for(var x=0; x<lid.length; x++){
			var column = lid[x];

			// TODm start from wall to wall. Find boundary-wall first.
			for(var y=0; y<column.length; y++){

				var tower = column[y];
				var isFree=true;
				// Leave z=0 for ground which is assumed free:
				for(var z=1; z<tower.length; z++){
					var lid=tower[z];
					var unit=units[gm.pos.lid2uid[lid]];
					if( unit && unit.cname === 'wall_x' ) isFree=false;
					// TODm unhardcode the assumption. Scan all units for this.
				}
				if(isFree){
					ixloc[ixlid]=[x,y,z];
					ixlid += 1;
				}
			}
		}
		console.log('Available for move locations=',gm.ixloc);
		*/

	};



})(jQuery);
