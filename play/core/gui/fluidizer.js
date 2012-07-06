(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var ggp		=  gio.gui.procs;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;





	// =================================================
	// Adjusts front page layout when page is resized
	// =================================================
	ggp.adjustDispositionsByBrowserWindow=function(gm){

		var landscape = ( window.innerHeight * 13 /10 ) <  window.innerWidth; 

		set_lefttop_by_landscape(landscape); 

		var gs		= gio.getgs();
		var gm		= gs.gm;
		var dress	= gm.dresses_wrap.chosen_dress;
		var droot	= gdr.droot;

		var scrollTop			= Math.max($(window).scrollTop()-gstyle.captions.height-gstyle.top_navig.height, 10);

		var chaser_top;
		var chaser_width		= gstyle.controls.boardWidth;
		var playboard_height	= gm.dim_max_height	+2*dress.tile.height;
		var playboard_width		= gm.dim_max_width	+2*dress.tile.width;
		playboard_width			= Math.max(gstyle.playboard.widthMin, playboard_width);
		var play_area_width		= playboard_width + gstyle.edit_column_width;
		var play_area_height	= playboard_height + dress.tile.height;

		// c onsole.log('fl: BEGAN');
		// c onsole.log('fl: chaser='+chaser_width);
		// c onsole.log('fl: playa w='+play_area_width);
		// c onsole.log('fl: playb w='+playboard_width);
		gm.board.style.width = playboard_width +'px';
		gm.board.style.height = playboard_height +'px';

		if(landscape){
			// c onsole.log('landscape');
			gm.board.style.left			=chaser_width+'px';
			gdr.dtopcenter.style.left	=chaser_width+'px';
			gdr.dsubtop.style.left		=chaser_width+'px';
			droot.style.width			=play_area_width + chaser_width +'px';
			chaser_top					=scrollTop;
		}else{
			// c onsole.log('portrait');
			gm.board.style.left			='0px';
			gdr.dtopcenter.style.left	='0px';
			gdr.dsubtop.style.left		='0px';
			droot.style.width			= play_area_width +'px';
			chaser_top					=playboard_height;
		}
		// c onsole.log('f: droot='+droot.style.width);
		// c onsole.log('f: gm.board left='+gm.board.style.left);
		// c onsole.log('f: dtopcenter left='+gdr.dtopcenter.style.left);
		// c onsole.log('f: droot w='+droot.style.width);

		$(gde.chaser).css('top',chaser_top);


		//=================================
		// Fixes top position of console
		//---------------------------------
		w = chaser_top;
		w +=  gstyle.controls.STATUS_LINE_PERIOD * 8 + 10;
		//occupied by game board:
		ww=playboard_height; //gm.dim_max_height+3*gm.game.tile.height; 
		if( playboard_height > w ) w=playboard_height;
		var cons_stl =  gde.con_div.style;
		if(landscape){
			// Landscape
			cons_stl.top		= play_area_height+'px';
			cons_stl.left		= chaser_width+'px';
			cons_stl.width		= play_area_width + 'px';
		}else{
			// Portrait
			var console_width			= play_area_width-chaser_width;
			if(console_width < 10 )		console_width = 10;
			cons_stl.top		= play_area_height+'px';
			cons_stl.left		= chaser_width+'px';
			cons_stl.width		= console_width + 'px';
		}
		// c ons_stl.top		= playboard_height+'px';
		// c ons_stl.left		= chaser_width+'px';
		// c ons_stl.width		= play_area_width + 'px';
		//---------------------------------
		// Fixes top position of console
		//=================================
	}




	//=================================
	// Lefttop adjuster
	//=================================
	var set_lefttop_by_landscape=function(landscape){
			var ss = gdr.dtopleft.style;
			if(landscape){
				ss.display='block';
				var conf	= gio.config.style.top_left_pane;
				ss.left		= conf.left+'px';
				ss.top		= conf.top+'px';
				ss.height	= conf.height+'px';
			}else{
				ss.display='none';
			}
	};

})(jQuery);
