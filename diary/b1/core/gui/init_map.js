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
		var album		= gs.playalb;
		var dress		= gm.dresses_wrap.chosen_dress;
		var dstyle		= dress.style;
		var parstyle	= dstyle.parent || {};
		var plstyle		= dstyle.play || {};
		var gboard_stl	= gm.board.style;
		var dcenter_stl	= gdr.dcenter.style;
		var BCOLOR		= 'transparent';

		document.title = gio.gui.procs.calculate_game_and_album_title();

		// * apparently IE 8 looses style.position='absolute', readd this here:
		gboard_stl.position='absolute';


		// ** establishes paths to find images
		var skin_standard_path	=	gio.config.defpaths.SKINS_DEF_PATH + '/'+ dress.skin_key
		// c onsole.log( 'init map. akey  '+album. key + ' dkey='+dress. title+' skin_standard_path='+ skin_standard_path );


		// ** modifies board's parent
		dcenter_stl.height='100%';
		dcenter_stl.backgroundColor = parstyle.backgroundColor || BCOLOR;
		if(parstyle.backgroundImage){
			var ww = parstyle.backgroundImage;
			var img	= ww.indexOf('/') > -1 ? ww : (skin_standard_path + '/' + ww);
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
			var img	= ww.indexOf('/') > -1 ? ww : (skin_standard_path + '/' + ww);
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
					unit.hname = colony.hname + (gio.debug ? ' id=' + unit.id : '');
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
							//. blocks prepending a path if it already has a slash
							img.src		= ww.indexOf('/') > -1 ? ww : (skin_standard_path + '/' + ww);
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

		//. changes image
		ggc.reset_unit_focuser(gm);

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
		if(gio.debug){ gio.cons_add(	'Reskinnified board for gm_ix ' + gm.ix + ' on gkey=' +
										gm.game.gkey+ ' dress.key=' + dress.key);
		}
	};//reskinnify_board = function()




	//=========================================
	// Creates plboard
	//=========================================
	ggc.board=function(gm){
		gm.board=document.createElement('div');
		gm.board.style.position = 'absolute';
		tp.gui.cornerize(gstyle.playboard.corners,gm.board);
		gio.gui.procs.reset_web_text_selection_appearance(	gm.board, 'none' );
		gdr.dcenter.appendChild(gm.board);
		// * vital
		gm.board.setAttribute('id', 'gm_board_debug');
		finalize_dresses_for_board(gm);
		if(gio.debug) gio.cons_add('Created board for gm_ix ' + gm.ix + ' on gkey=' + gm.game.gkey);
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
		if(gio.debug) gio.cons_add('Created tiles for gm_ix ' + gm.ix + ' on gkey=' + gm.game.gkey);
	};



	//=========================================
	// Creates game's focuser
	//=========================================
	ggc.map_focuser=function(gm){
		var ww = gm.focuser_img=document.createElement('img');
		ww.style.position = 'absolute';
		var ws=ww.style;
		ws.left=0;
		ws.top=0;
		// TODm no need?:
		ws.zIndex='-1';
	};


	/// Bad. ggc - bad structuring. use gio.gui.proc.
	ggc.reset_unit_focuser = function(gm) {
		var ww = gm.focuser_img;
		var www = gm.dresses_wrap.chosen_dress.focuser || 'default'; 
		ww.src = gio.config.defpaths.SKINS_DEF_PATH + '/' + www + '/focuser/focuser.png';
	};



	/// Produces:
	//	gm.dresses_wrap.arr = arr;
	//	gm.dresses_wrap.chosen_ix = chosen_ix;
	//	gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	var finalize_dresses_for_board=function(gm){

		var chosen_map_dkey = '';
		if(gm.dresses){

			/// establishes chosen_dkey or as first if none
			ceach(gm.dresses, function(dkey, dress){
				if(dress.chosen) chosen_map_dkey = dkey;
			});

			/// inherits from defaul or from co-named parent
			ceach(gm.dresses, function(dkey, dress){
				if( gm.game.dresses[dress.inherit_from] ){
					var ww = clonem(gm.game.dresses[dress.inherit_from],dress);
				}else{
					var ww = clonem(gio.def.default_dress,dress);
				}
				tp.core.paste_non_arrays(dress, ww);
			});
			var all =  clonem(gm.game.dresses, gm.dresses);
		}else{

			//. does not waste space if no map-dress
			var all =  gm.game.dresses;
		}

		if( !tp.core.get_first_or_null( all ) ) {
			//.	don't clone default dress for each map: 
			//	can be a lot of wasted space
			var all = { dresses : gio.def.default_dress };
		}

		gm.dresses_wrap = { all : all };

		/// sets album context
		ceach(all, function(dkey, dress){
			dress.akey = gm.game.akey;
			// c onsole.log('possibly board init.; key added. dress=',dress);
		});

		mapDresserArray( gm, chosen_map_dkey || gm.game.dresses_chosen_key );

	};




	//=========================================
	// Produces:
	//	gm.dresses_wrap.arr = arr;
	//	gm.dresses_wrap.chosen_ix = chosen_ix;
	//	gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	//	makes tooltipifies for non-skipped dresses
	//=========================================
	var mapDresserArray = function(gm, initial_dkey){

		var dresses		= gm.dresses_wrap.all;
		var arr			= [];
		var chosen_ix	= -1;
		var counter		= -1;

		ceach(dresses, function(dkey,dress){

				if(dress.skip) return true;
				counter +=1;

				var title = dress.title || tp.core.capitalizeFirstLetter(dkey.replace(/_/g,' '));

				//: makes an array for GUI select element
				arr[counter] = { 
						title : title,
						dress : dress
				};		
				if(initial_dkey === dkey){
					chosen_ix = counter;
				} 

				//. makes tooltip and credit html-table
				dress.credits.title = title; 
				tp.core.tooltipify(dress, "Dress");
				// c onsole.log('guified credits. key, credits_table='+dkey,dress.credits_table);
		});

		if( chosen_ix < 0 ) chosen_ix = 0;
		gm.dresses_wrap.arr = arr;
		gm.dresses_wrap.chosen_ix = chosen_ix;
		gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	};



})(jQuery);
