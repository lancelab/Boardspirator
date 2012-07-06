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
		w = wgs.edit_column_width;
		w=gm.dim_max_width + w;	
		gio.root_div.style.width = w+'px';

		//==================================
		//reshape parent:
		//----------------------------------
		w=game.style.parent;
		ww=gio.board.style;
		//It seems as a bad definition: game.style.parent refers not to board's parent but to board itself:
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
		ww.position='absolute';
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

	//Startup methods:
	gio.create_gui_board=function(gm){
		gm.board=document.createElement('div');
		gm.board.style.position = 'absolute';
		tp.gui.cornerize(gio.style.playboard.corners,gm.board);
		gio.board.appendChild(gm.board);
	};


	gio.create_tiles = function(gm){
		var game=gm.game;


		// TODO is this reasonable to cycle via col? must? via uid:
		tp.core.each(gm.colonies, function(cid,colony){
			var colName=colony.nam;
			var twidth = game.tile.width;
			var theight= game.tile.height;

			gm.dim_max_width= gm.dim_max_width || 0;
			gm.dim_max_height= gm.dim_max_height || 0;


			var zorder=colony.zorder; //TODO rid


			// TODO rid:
			var units = colony.units=[];
			var pos = gm.start_pos;
			var punits = pos[colony.ix]=[];

			// Make tiles:
			$.each(colony.uids, function(unit_ix,uid){

					var unit_id=uid;
					var unit=gm.units[unit_id];
					var tile=unit.tile={ ix : unit_ix }; 
					tile.colony_ix=cid; //TODO rid

					var loc=gm.locs[unit.lid];
					var xx=loc[0];
					var yy=loc[1];

					//TODO rid:
					var punit={};
					punit.x=xx;
					punit.y=yy;
					punit.ix=unit_ix;
					punit.colony_ix=cid;




					//========================================
					// Create tile as dom-div-element
					//----------------------------------------
					var t = tile.div= document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;

					var w=(twidth * xx);
					if(gm.dim_max_width<w+twidth) gm.dim_max_width=w+twidth;
					s.left = w + 'px';

					w=theight * yy;
					if(gm.dim_max_height<w+theight) gm.dim_max_height=w+theight;

					s.top = w + 'px';
					s.width=twidth+'px';
					s.height=theight+'px';
					s.overflow='visible';
					gm.board.appendChild(t);

					s.zIndex=''+gio.style.playboard.zIndex+zorder; //TODO rid
					//----------------------------------------
					// Create tile as dom-div-element
					//========================================


					
					//=========================================
					//add clicks event handlers on tiles:
					//-----------------------------------------
					$(t).bind('click',function(event){
						//return gio.handle_click_on_unit(unit_id);
						return gio.handle_click_on_flat_cell(
								cid, unit_ix,  //rid
								uid); //was colony_ix TODO do above.
					});
					/*
					// TODm Is this good?:
					switch(game.activity_role[colony.nam]){
						case 'active':
							$(t).bind('dblclick',function(event){
								return gio.select_active_unit(unit_id);
							});
							break;
					}
					*/
					//=========================================


					//=========================================
					//make image:
					//=========================================
					if( unit.src || gm.skin[colName] ){
						var img = tile.img = document.createElement('img');
						//img.src=unit.src;
						img.src= gm.skin[colName] ? 'collections/'+gm.skin[colName] : unit.src;
						img.width=twidth;
						img.height=theight;
						t.appendChild(img);
						tile.img=img; //TODO rid
					}	

					units.push(tile); //TODO rid
					punits.push(punit); //TODO rid
			
				});						
				//TODO rid:
				punits.selected = gm.units[gm.acting.cols[cid].uid].ix;
				punits.former_selected_unit_ix= -1;
			});
			
	};


})(jQuery);
