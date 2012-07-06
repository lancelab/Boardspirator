(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};


	var empty_match					=/^\s*$/g;
	var macro_match					=/<#(.*)#\/>/g;
	var _kvsoko_match				=/^(;)\s*(\S+)\s*((?:\S.*\S|\S)+)\s*$/;

	var multiplayer_match			=/^:::multiplayer=\s*(\S*)\s*$/i;

	//TODm make target_ instead of target:
	var target_match				=/^target/i;  //match name target_XXX
	var box_name_match				=/^box_/;






	///////////////////////////////
	// cmd.finalize_map
	//=============================
	// Input:	cm relate to the map being finished
	//			in most cases, this map is not current, but
	//			is a predecessor of current map.
	cmd.finalize_map=function( map, currbody )
	{

		var w, ww, master_y;

		var extractKey = cmd.extractKey;
		var colorbanKV = cmd.colorbanKV;
		var cbformat = map.script.cbformat;
		var collection = map.collection;
		var parsed = map.parsed;

		var flines = collection.script.flines;
		var trimmed_lines = collection.script.trimmed_lines;

		var parsed_file_header = collection.parsed.file_header;
		var own_raw_board_lines=map.script.raw_board_lines;

		map.script.last_map_line = currbody.lim-1;

		// c onsole.log('cbformat='+cbformat);
		// c onsole.log('currbody=',currbody);

		w = '';
		for(master_y=map.script.first_map_line; master_y<map.script.last_map_line; master_y++){
			w += flines[master_y] + "\n";
		}
		map.script.raw_map = w; //TODm possibly need to detect a change for session-saved-maps


		// ** Sugar: own_raw_board TODm rid. bs used in session-saved-maps-detection
		var own_raw_board='';
		for(var yy=0; yy<own_raw_board_lines.length; yy++){
			own_raw_board += own_raw_board_lines[yy]+"\n";
		}
		map.script.raw_board=own_raw_board;


		// ====================================
		// Take raw map or referred map
		// ------------------------------------
		var ref_coll = null;
		if( map.reference.collection_index ){
			var ref_alb = map.reference.album_key;
			var ref_coll = map.reference.collection_index;
			var ref_map = map.reference.map_index;
			// c onsole.log('map.reference=',map.reference);
		}else if(collection.reference.collection_index){
			var ref_alb = collection.reference.album_key;
			var ref_coll = collection.reference.collection_index;
			var ref_map = map.ix;
			// c onsole.log('collection.reference=',collection.reference);
		}

		if(ref_coll){
			var coll_ix = parseInt(ref_coll);
			var map_ix = parseInt(ref_map);
			
			var original_coll = gio.navig.select_game_and_collection(
					ref_alb,
					coll_ix,
					map_ix,
					!'allow_ignore_download',
					'dont_land'
			);
			if(!original_coll) return 'Failed download referred map';

			var original_map = map.script.original_map = original_coll.maps[map_ix];
			raw_board_lines = tp.core.clone_many(original_map.script.raw_board_lines);			
			var line_parser_cbformat = original_map.script.cbformat;
			var dtable = original_map.script.decoder_table;
			// c onsole.log('reffered map success. board lines=',raw_board_lines);
			// c onsole.log('flines',flines);

		}else{
			raw_board_lines = own_raw_board_lines;
			var dtable = map.script.decoder_table;
			var line_parser_cbformat = map.script.cbformat;
		}

		// TODm move into parse_board_lines
		if(!raw_board_lines.length) return 'Empty map`s board. Map ix='+map.map_ix;
		for(var yy=0; yy<raw_board_lines.length; yy++){
			cmd.parse_board_line(yy,raw_board_lines[yy],map,line_parser_cbformat,dtable);
		}
		map.size[1]=raw_board_lines.length;


		// c onsole.log("map.script.raw_map "+map.ix+"=\n"+map.script.raw_map+"\nRaw board=\n"+map.script.raw_board);



		///////////////////////////////////
		// Collect data from board context
		//=================================
		var playpaths		= [];
		var current_pp		= { pp : null, cbflag : false };
		var dress_wrap	= { dr : null, zoneon_flag : false, counter : 0, dresses : {}, map : map };
		for(master_y=currbody.start; master_y<currbody.lim; master_y++){ //...loop through map comments

			var com=flines[master_y].replace(/\r/g,''); //vital for match
			var com_trimmed=trimmed_lines[master_y];			

			var pkey=colorbanKV(com); //extractKey(com);
			var pkey1 = pkey[1];
			var pkey2 = pkey[2];
			var pkey3 = pkey[3];
			// if(pkey1) c onsole.log('cbkeys=',pkey1, pkey2, pkey3);

			// ** Collect palypaths
			if( cmd.extract_to_playpaths(
				current_pp,
				com_trimmed,
				pkey,
				com,
				playpaths,
				cbformat
			)) continue;


			try{
				// ** Collect dresses
				if( cmd.extract_to_dresses(
					dress_wrap,
					com_trimmed,
					pkey,
					com,
					dtable
				)) continue;
			}catch(err){
				return "Invalid dress format\n"+err;
			}

			// ..map master loop



			if(cbformat && pkey1){
				if(	pkey2==='multiplayer' ){
						if(isNaN(pkey3))return 'Invalid map settings. multiplayer='+pkey3;
						map.multiplayer=parseInt(pkey3);
				}
				if(pkey2.toLowerCase()==='title'){
					parsed.title_from_control=pkey3;
				}
				if(	pkey2.toLowerCase()==='author' ){
					parsed.author=pkey3;
				}
				continue;
			}//if(cbformat){


			//insert macros:
			//TODm assert: no macros in playpaths
			tp.core.each(parsed_file_header.macros, function(nam,macro){
				com=com.replace('<#'+nam+'#/>',macro);
			});


			if(!cbformat){
				var soko_keys=com.match(_kvsoko_match) || [];
				// if(soko_keys[2]) c onsole.log('soko_keys=',soko_keys);
				if( soko_keys[2]){
					if(	soko_keys[2].toLowerCase()==='author' ){
						parsed.author=soko_keys[2];
						continue;
					}
					if(	soko_keys[2].toLowerCase()==='title' ){
						parsed.title_from_comment=soko_keys[3];
						continue;
					}
				}
			}
			// ..map master loop
		}
		//=================================
		// Collect data from board context
		///////////////////////////////////
		if(playpaths.length>0)map.playpaths=playpaths;
		if(dress_wrap.counter)map.dresses=dress_wrap.dresses;





		//===========================
		// Set titles and authors
		//---------------------------
		parsed.final_title = parsed.title_from_control;
		if(!cbformat){
			if(collection.map_title_source==='comment' && parsed.title_from_comment){
				parsed.final_title = parsed.title_from_comment;
			}else{
				parsed.final_title=parsed.backward_soko_title;
			}
		}	
		if(!parsed.final_title) parsed.final_title='Map '+map.ix;

		//Finalize the titles for select control:
		//		put title in title, author in tooltip.
		//      Select_el-control takes ".title =>
		//			we need to revert back from parsed.final_title to
		//			map.title.
		map.title = parsed.final_title;
		map.tooltip  =	(parsed.author ? ' Author: ' + parsed.author + '. ' : '') +
						(!cbformat && parsed.backward_soko_title ? parsed.backward_soko_title.substr(0,40) + ' ... ' : '') +
						(parsed.title_from_comment ? parsed.title_from_comment.substr(0,40) + ' ... ' : '') +	
						' Map number ' + map.ix + '.'
		//---------------------------
		// Set titles and authors
		//===========================




		// ..cmd.finalize_map




		// Completes races bookkeeping
		var targets=0;
		var batons=0;
		var actors=0;
		ceach(map.target_cols, function(dummy,col){
			targets +=col.units.length;
		});
		ceach(map.baton_cols, function(dummy,col){
			batons +=col.units.length;
		});
		ceach(map.actor_cols, function(dummy,col){
			actors +=col.units.length;
		});
		map.necessary_to_fill=Math.min(batons,targets);
		map.actors = actors;


		//==========================================================
		//TODm validate
		//==========================================================


		collection.maps[map.ix] = map;

		return '';
	};// ..cmd.finalize_map
	//=============================
	// cmd.finalize_map
	///////////////////////////////



})(jQuery);


