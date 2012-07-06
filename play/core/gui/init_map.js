(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var ggc		=  gio.gui.create;
					var gdr		=  gio.domwrap.regions;
					var clonem	=  tp.core.clone_many;
					var ceach	=  tp.core.each;





	// ====================================================
	// Runs every time when user toggled from game to game
	// ====================================================
	gio.gui.reskinnify_board = function(){

		var gs			= gio.getgs();
		var gm			= gs.gm;
		var game		= gm.game;		
		var plalb		= gs.playalb;
		var dress		= gm.dresses_wrap.chosen_dress;
		var dstyle		= dress.style;
		var parstyle	= dstyle.parent || {};
		var plstyle		= dstyle.play || {};
		var gboard_stl	= gm.board.style;
		var dcenter_stl	= gdr.dcenter.style;
		var BCOLOR		= 'transparent'; //gstyle.backgroundColor; //TODO think

		document.title = gio.gui.procs.calculate_game_and_album_title();

		// * apparently IE 8 looses style.position='absolute', readd this here:
		gboard_stl.position='absolute';


		// ** establishes paths to find images
		var dress_im_path	=	gio.config.defpaths.SKINS_DEF_PATH + 
								'/'+ dress.skin_key +'/img'

		// c onsole.log( 'init map. album_key  '+plalb. key + ' dress_key='+dress. title+' dress_im_path='+ dress_im_path );


		// ** modifies board's parent
		dcenter_stl.height='100%';
		dcenter_stl.backgroundColor = parstyle.backgroundColor || BCOLOR;
		if(parstyle.backgroundImage){
			var ww = parstyle.backgroundImage;
			var img	= ww.indexOf('/') > -1 ? ww : (dress_im_path + '/' + ww);
			img = "url('" + img + "')";
		}else{
			img = 'none';
		}
		dcenter_stl.backgroundImage = img;
					
					


		// ** modifies board
		// for IE: gio.cons('gm.board.style.position='+gm.board.style.position);
		gboard_stl.backgroundColor = plstyle.backgroundColor || BCOLOR;
		if(plstyle.backgroundImage){
			var ww = plstyle.backgroundImage;
			var img	= ww.indexOf('/') > -1 ? ww : (dress_im_path + '/' + ww);
			img = "url('" + img + "')";
		}else{
			img = 'none';
		}
		gboard_stl.backgroundImage = img;



		// ** prepares shortcuts for loop
		var twidth = dress.tile.width;
		var theight = dress.tile.height;
		var mwidth = 0;
		var mheight = 0;



		// ** updates focuser
		var ww=gm.focuser_img;
		ww.width  = twidth;
		ww.height = theight;



		// ** reskins tiles
		tp.core.each(gm.cols, function(cid,colony){
			var cname=colony.nam;
			$.each(colony.units, function(unit_ix,unit){

					// Logical dressing:
					colony.hname = dress.human_name(colony.nam);
					unit.hname = colony.hname;
					if(colony.units.length > 1) unit.hname += ' '+unit_ix;

					// ** Gui dressing:
					var loc=gm.pos.uid2loc[unit.id];
					var xx=loc[0];
					var yy=loc[1];
					var div = unit.tile.div;
					var ss = div.style;
					var activity = colony.activity;

					// Sets tooltip:
					if(!colony.activity.frozen)	div.title=unit.hname;

					var ww=(twidth * xx);
					if(mwidth<ww+twidth) mwidth=ww+twidth;
					ss.left = ww + 'px';

					ww=theight * yy;
					if(mheight<ww+theight) mheight=ww+theight;

					ss.top = ww + 'px';
					ss.width = twidth + 'px';
					ss.height = theight + 'px';

					var img = unit.tile.img;
					//if( unit.src ){
					var ww = dress.image_decoder[cname];
					if(ww){
							// * don't prepend a path if it is already a full path:
							img.src		= ww.indexOf('/') > -1 ? ww : (dress_im_path + '/' + ww);
							img.width	= twidth;
							img.height	= theight;
							img.style.visibility='visible';
					}else{
						img.style.visibility='hidden'; //src = '';
					}
			});
		});
		// Static-per-play-size in pixels:
		gm.dim_max_width = mwidth;
		gm.dim_max_height = mheight;


		// ** finalizes dress-switch display
		var dress_display_flag = gm.dresses_wrap.arr.length < 2 ? 'none' : 'block';
		gio.domwrap.headers.dress_select_el.reset({
				r:	{
						options				:gm.dresses_wrap.arr
					},
				c:	{	dont_reset_styles	:false,
						choice_ix			:gm.dresses_wrap.chosen_ix,
						gui:{style :{wrapper:{display : dress_display_flag}}}
					}
		});



		// ** secures ad if any
		var ad=gio.config.style.advertisement;
		if(ad.div){
				// Appr. this div, div of advertisement comes not from configuration
				// but from something else. In this application subversion, there is no div
				// and this code is idle.
				ad.div.style.left=gboard_stl.width;
				if(!ad.div_attached){
					gdr.dcenter.appendChild(ad.div);
					ad.div_attached=true;
					ad.div.style.visibility='visible';
					ad.div.style.overflow='visible';
				}
				gboard_stl=parseInt(gdr.dcenter.style.width)+ad.distanceFromGame +'px';
				ad.div.style.left=gboard_stl;
		}
	};//reskinnify_board = function()




	//=========================================
	// Creates plboard
	//=========================================
	ggc.board=function(gm){
		gm.board=document.createElement('div');
		gm.board.style.position = 'absolute';
		tp.gui.cornerize(gstyle.playboard.corners,gm.board);
		gdr.dcenter.appendChild(gm.board);
		// * vital
		gm.board.setAttribute('id', 'gm_board_debug');
		finalize_dresses_for_board(gm);
	};



	//=========================================
	// Creates tiles without skin
	//=========================================
	ggc.tiles = function(gm){

		// TODm may be cleaner to make loop via units only:
		tp.core.each(gm.cols, function(cid,colony){
			var cname=colony.nam;
			var zorder=colony.zorder; //TODm rid

			$.each(colony.units, function(unit_ix,unit){

					var unit_id=unit.id;
					var tile=unit.tile={ ix : unit_ix }; 

					// ** Creates div for tile
					var div = tile.div= document.createElement('div');
					div.style.position = 'absolute';

					var s=div.style;
					s.overflow='visible';
					gm.board.appendChild(div);
					s.zIndex=''+gstyle.playboard.zIndex+zorder; //TODm rid

					var img = unit.tile.img = document.createElement('img');
					div.appendChild(img);
					
					// ** Adds clicks event handlers on tiles:
					$(div).bind('click',function(event){
						return gio.navig.in_map.handle_click_on_flat_cell(unit);
					});
			
				});				
			});
	};



	//=========================================
	// Creates game's focuser
	//=========================================
	ggc.map_focuser=function(gm){
		var ww=gm.focuser_img=document.createElement('img');
		ww.src='core/gui/img/focuser.png';
		ww.style.position='absolute';
		var ws=ww.style;
		ws.left=0;
		ws.top=0;
		// TODm no need?:
		ws.zIndex='-1';
	};



	//=========================================
	// Produces:
	//	gm.dresses_wrap.arr = arr;
	//	gm.dresses_wrap.chosen_ix = chosen_ix;
	//	gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	//=========================================
	var finalize_dresses_for_board=function(gm){

		// ** establishes chosen_drkey or as first if none
		chosen_drkey = 	gm.game.dresses_chosen_key

		var chosen_map_drkey = '';
		if(gm.dresses){
			ceach(gm.dresses, function(dress_key, dress){
				if(dress.chosen) chosen_map_drkey = dress_key;
			});
		}

		// ** inherits from defaul or from co-named parent
		ceach(gm.dresses, function(dress_key, dress){
			if( gm.game.dresses[dress.inherit_from] ){
				var ww = clonem(gm.game.dresses[dress.inherit_from],dress);
			}else{
				var ww = clonem(gio.def.default_dress,dress);
			}
			tp.core.paste_non_arrays(dress, ww);
		});


		// * does not waste space if no map-dress
		var all =  gm.dresses ? clonem(gm.game.dresses, gm.dresses) : gm.game.dresses;
		gm.dresses_wrap = { all : all };

		// ** sets game context
		ceach(all, function(dress_key, dress){
			dress.game_key = gm.game.album_key; //TODm don't confuse coder: game ... album ... equate them
		});

		mapDresserArray(gm, chosen_map_drkey || chosen_drkey);

	};




	//=========================================
	// Produces:
	//	gm.dresses_wrap.arr = arr;
	//	gm.dresses_wrap.chosen_ix = chosen_ix;
	//	gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	//=========================================
	var mapDresserArray = function(gm, initial_drkey){

		var dresses		= gm.dresses_wrap.all;
		var arr			= [];
		var chosen_ix	= -1;
		var counter		= -1;

		ceach(dresses, function(dress_key,dress){
				// ** makes an array for GUI select element
				if(dress.skip) return true;
				counter +=1;
				arr[counter] = { 
						title : dress.title || tp.core.capitalizeFirstLetter(dress_key.replace(/_/g,' ')),
						dress : dress
				};		
				if(initial_drkey === dress_key){
					chosen_ix = counter;
				} 
		});

		if(chosen_ix < 0 ) chosen_ix = 0;
		gm.dresses_wrap.arr = arr;
		gm.dresses_wrap.chosen_ix = chosen_ix;
		gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	};



})(jQuery);