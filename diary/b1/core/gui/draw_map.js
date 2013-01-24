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
		var img_dec		= dress.image_decoder;
		var dstyle		= dress.style;
		var parstyle	= dstyle.parent || {};
		var plstyle		= dstyle.play || {};
		var gboard_stl	= gm.board.style;
		var dcenter_stl	= gdr.dcenter.style;
		var BCOLOR		= 'transparent';
		document.title = gio.gui.procs.get_master_title_from_session_state();

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

					var w_key = cname + '_' + xx + '_' + yy;
					//. instead of wasting decoder, pollutes hard-code here
					var w_img = img_dec[ w_key ] || img_dec[ cname ] || (cname + '.png');
					//. blocks prepending a path if it already has a slash
					img.src		= w_img.indexOf('/') > -1 ? w_img : (skin_standard_path + '/' + w_img);
					img.width	= twidth;
					img.height	= theight;
					img.style.visibility='visible';

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




	/// Bad. ggc - bad structuring. use gio.gui.proc.
	ggc.reset_unit_focuser = function(gm) {
		var ww = gm.focuser_img;
		if( gm.dresses_wrap.chosen_dress.focuser !== '' ) {
			var www = gm.dresses_wrap.chosen_dress.focuser || 'default'; 
			ww.src = gio.config.defpaths.SKINS_DEF_PATH + '/' + www + '/focuser/focuser.png';
		}
	};


	/// Draw prepared map from shadows
	gio.gui.unhide_map = function ( gm ) {

			//: revisualizes titles
			var coll	= gm.collection;
			var lkey	= coll.ref.list.akey;
			var colls	= gio.session.procs.get_listed_album( lkey ).collections;
			gio.gui.procs.visualize_collection_titles( coll, colls );

			gio.gui.procs.do_display_curr_board( 'yes' );

			gio.gui.reset_playpaths_select_el( gm );
			gio.gui.reset_rounds_select_el( gm );
			gio.gui.reskinnify_board();
			gio.gui.procs.draw_status_and_scene();

	};


})(jQuery);
