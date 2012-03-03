(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	//THIS RUNS EVERY TIME WHEN USER TOGGLED FROM GAME TO GAME:
	gio.init_map_style = function(){

		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];


		var w;
		var BCOLOR=gio.style.backgroundColor;

		//GUI: set width accorging play mode:
		var wgs=gio.style;
		w = gio.modes[gm.mode_ix]==='edit' ? 0 : wgs.edit_column_width;
		w=gm.dim_max_width + w;	
		gio.root_div.style.width = w+'px';

		//==================================
		//reshape parent:
		//----------------------------------
		w=game.style.parent;
		ww=gio.board.style;
		ww.backgroundImage = w.backgroundImage ? "url('"+game.img_path+'/'+w.backgroundImage+"')" : 'none';
		ww.backgroundColor = w.backgroundColor || BCOLOR;

		//define how to do centering of the game and parent:
		var local_master_width=gm.dim_max_width+2*game.tile.width;
		local_master_width=Math.max(gio.style.playboard.widthMin,local_master_width);
		ww.width=local_master_width+gio.style.controls.boardWidth+'px';
		ww.height='100%';
		//----------------------------------
		//reshape parent:
		//==================================


		document.title = game.title;


		//==================================
		//map playboard: gm.board
		//----------------------------------
		w=game.style.play;
		gm.board.setAttribute('id', 'gm_board_debug');

		ww=gm.board.style;

		//apparently IE 8 looses style.position='absolute', readd this here:
		gm.board.style.position='absolute';

		ww.left=gio.style.controls.boardWidth+'px';

		//for IE: gio.cons('gm.board.style.position='+gm.board.style.position);

		ww.backgroundImage = w.backgroundImage ? "url('"+game.img_path+'/'+w.backgroundImage+"')" : 'none';
		ww.backgroundColor = w.backgroundColor || BCOLOR;
		ww.width=(local_master_width)+'px';
		ww.height=(gm.dim_max_height+2*game.tile.height)+'px';
		ww.top = '0px'; 
		//----------------------------------
		//map playboard: gm.board
		//==================================


		//In-play console:
		//Will be revised after the first status drawing:
		//TODm get rid of this:
		gio.cons_div.style.top=Math.max(
			gm.dim_max_height+3*game.tile.height,
			gio.style.controls.STATUS_LINE_HEIGHT*5
		)+'px';

		//////////////////////////////////////////////
		//secure advertisement if any:
		w=gio.advertisement;
		if(w.div){
				w.div.style.left=ww;
				if(!w.div_attached){
					gio.board.appendChild(w.div);
					w.div_attached=true;
					w.div.style.visibility='visible';
					w.div.style.overflow='visible';
				}
				ww=parseInt(gio.board.style.width)+w.distanceFromGame +'px';
				w.div.style.left=ww;
				//c onsole.log(w, w.div);
		}
		//////////////////////////////////////////////
	};


})(jQuery);
