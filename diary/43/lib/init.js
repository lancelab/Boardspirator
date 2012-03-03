(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	//TODm mix: gui and start position:
	gio.compile_colony = function(colony_ix,colony)
	{
			colony.ix=colony_ix;

			var game=gio.games[gio.game_ix];
			var gm=game.maps[game.map_ix] ;

			gm.colonies[colony.nam]=colony;

			var zorder=colony.zorder;
			var tiles_map=colony.tiles_map;
			var nam=colony.nam;

			var units = colony.units=[];
			var pos = gm.start_pos;
			var punits = pos[colony.ix]=[];
			
			var twidth=game.tile.width;
			var theight=game.tile.height;
			var board = gm.board;

			var selected_unit=0;
			var count=0;

			gm.dim_max_width= gm.dim_max_width || 0;
			gm.dim_max_height= gm.dim_max_height || 0;
			$.each(tiles_map, function(y,row)
			{
				$.each(row, function(x, tile_from_map)
				{
					if( !tile_from_map || !tile_from_map.src ) return true;
					
					//make tile:
					var tile={};
					var punit={};
					punit.x=x;
					punit.y=y;
					punit.ix=count; //TODm dry?
					punit.colony_ix=colony_ix; //TODm dry?
					tile.ix=count;
					tile.colony_ix=colony_ix; //TODm dry?

					if(tile.selected) selected_unit = count; //position

					var t = document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;

					var w=(twidth * x);
					if(gm.dim_max_width<w+twidth) gm.dim_max_width=w+twidth;
					s.left = w + 'px';

					w=theight * y;
					if(gm.dim_max_height<w+theight) gm.dim_max_height=w+theight;

					s.top = w + 'px';
					s.width=twidth+'px';
					s.height=theight+'px';
					s.overflow='visible'; //'hidden';
					s.zIndex=''+zorder;


					board.appendChild(t);
					tile.div=t;
								
					//make image:
					var img = document.createElement('img');
					img.src=tile_from_map.src;
					img.width=twidth;
					img.height=theight;
					t.appendChild(img);
					tile.img=img;

					units.push(tile);
					punits.push(punit);
					count++;
				});						
			});
			punits.selected = selected_unit;
	};


	//=========================================
	// create game's focuser
	//=========================================
	var create_game_focuser=function(game){
		var w=game.focuser_img=document.createElement('img');
		var width=game.tile.width*6/3;
		var height=game.tile.height*6/3;
		//var width=game.tile.width;
		//var height=game.tile.height;
		w.src='lib/gui/img/focuser.png';
		w.width=width;
		w.height=height;
		w.style.position='absolute';
		var ws=w.style;
		ws.left=(-width/4)+'px';
		ws.top=(-height/4)+'px';
		//ws.left=0+'px';
		//ws.top=0+'px';
		ws.zIndex=gio.style.MAX_ZINDEX;
		//do not append yet to anyone ...
	};



	gio.init_start_position = function()
	{
		var game=gio.games[gio.game_ix];
		if(game.maps_loaded!=='success'){
			gio.cons('Cannot initiate game: '+game.nam+'. maps_loaded='+game.maps_loaded);
			return;
		}
		game.init_help();

		var gm=game.maps[game.map_ix];
		gm.start_pos=[]; 
		gm.start_pos.colony_ix=gm.colony_ix || 0;

		//TODm mix fo GUI and logic ... no good
		create_game_focuser(game);

		tp.core.each(gm.colonies, function(ix,colony)
		{
			gio.compile_colony(ix,colony);
		});
	};

	gio.init_game =	function()
	{
		var game=gio.games[gio.game_ix];
		if(game.maps_loaded==='waiting for load..'){
			game.load_maps(); //maybe exits into ajax (to load maps) 
			return;			  //gio.do_init_game_map called in callback
		}else if(game.maps_loaded!=='success'){
			return false;
		}
		return gio.do_init_game_map();
	};

	gio.do_init_game_map =	function()
	{
		var game=gio.games[gio.game_ix];
		if(game.maps_loaded!=='success'){
			gio.cons('Cannot initiate game: '+game.nam+'. maps_loaded='+game.maps_loaded);
			return;
		}
		var gm=game.maps[game.map_ix] ;
		var board = gm.board;

		if(!gm.start_pos)
		{	
			//do for game:
			gm.mode_ix=0;
			board = gm.board=document.createElement('div');
			board.style.position = 'absolute';
			gio.init_start_position();
			gio.board.appendChild(board);
			gio.init_round();
		}else{
			board.style.display='block';
		}
		gio.skip_inactive_colony(gm,'right');
		gio.init_game_style();
		gio.draw_scene();
		gio.draw_status();
		return true;
	};

})(jQuery);
