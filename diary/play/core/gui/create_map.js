(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var ggc		=  gio.gui.create;
					var gdr		=  gio.domwrap.regions;
					var clonem	=  tp.core.clone_many;
					var ceach	=  tp.core.each;





	/// Creates plboard  TODO Visible or not?
	ggc.board = function( gm ) {
		gm.board = document.createElement('div');
		gm.board.style.position = 'absolute';
		tp.gui.cornerize( gstyle.playboard.corners, gm.board );
		gio.gui.procs.reset_web_text_selection_appearance( gm.board, 'none' );
		gdr.dcenter.appendChild( gm.board );
		//. vital
		gm.board.setAttribute( 'id', 'gm_board_debug' );
		finalize_dresses_for_board( gm );
		if(gio.debug) gio.cons_add( 'Created board for gm_ix ' + gm.ix + ' on gkey=' + gm.game.gkey );
	};



	/// Creates tiles without skin
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



	/// Creates game's focuser
	ggc.map_focuser=function(gm){
		var ww = gm.focuser_img=document.createElement('img');
		ww.style.position = 'absolute';
		var ws=ww.style;
		ws.left=0;
		ws.top=0;
		// TODm no need?:
		ws.zIndex='-1';
	};



	/// Produces
	//
	//	1.	takes dresses parsed from postboard which are stored in
	//		map.dresses where map.dresses is created in "finalize_map.js",
	//	2.	does inherit by dkey by inherit_from from 
	//		dresses from game or context_akey::game
	//	3.	clones all the job in array "all" and drops "all" into property
	//		gm.dresses_wrap = { all : all }
	//	4.	further: does mapDresserArray
	//
	var finalize_dresses_for_board = function( gm ) {

		var chosen_map_dkey = '';
		if( gm.dresses ) {

			///	if parsed dresses have chosen key, establishes it,
			//	otherwise, keeps chosen_map_dkey empty
			ceach( gm.dresses, function( dkey, dress ) {
				if( dress.chosen ) chosen_map_dkey = dkey;
			});

			// //.\\ inherits from defaul or from co-named parent
			ceach( gm.dresses, function( dkey, dress ) {
				var inherit_from = dress.inherit_from || dkey
				var ww = gm.game.dresses[ inherit_from ] || gio.def.default_dress;
				//::	we must do this job in two steps because dress must override  //TODM slow
				//		parent properties
				//.	step 1
				var ww = clonem( ww, dress );
				//.	step 2:	stores collected tree in dress
				tp.core.paste_non_arrays( dress, ww );
			});
			var all =  clonem( gm.game.dresses, gm.dresses );
			// \\.// inherits from defaul or from co-named parent


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
		//..	at this moment gm.dresses_wrap.all contains all possible merges of dresses
		//		known for this map 

		mapDresserArray( gm, chosen_map_dkey || gm.game.dresses_chosen_key );

	};


	///	Produces final wrapper for map's dresses
	//		gm.dresses_wrap.arr
	//			1. skips all dresses which must be skipped
	//			2. tooltipifies
	//			3. establishes chosen dress
	//			4. establishes array of dreesses for GUI: gm.dresses_wrap.arr
	//
	var mapDresserArray = function(gm, initial_dkey){

		var dresses		= gm.dresses_wrap.all;
		var arr			= [];
		var chosen_ix	= -1;
		var counter		= -1;

		ceach(dresses, function(dkey,dress){

				if(dress.skip) return true;
				counter +=1;

				var title = dress.credits.title || tp.core.capitalizeFirstLetter(dkey.replace(/_/g,' '));

				//: makes an array for GUI select element
				arr[counter] = { 
						title : title,
						dress : dress
				};		
				if(initial_dkey === dkey){
					chosen_ix = counter;
				} 

				//. makes tooltip and credit html-table
				tp.core.tooltipify( dress, "Dress" );
				// c onsole.log('guified credits. key, credits_table='+dkey,dress.credits_table);
		});

		if( chosen_ix < 0 ) chosen_ix = 0;
		gm.dresses_wrap.arr = arr;
		gm.dresses_wrap.chosen_ix = chosen_ix;
		gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	};



})(jQuery);
