(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var clonem	=  core.clone_many;
					var propertify		=  core.propertify;
					var cmd				=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};
					var str2multiline	=  core.str2multiline;
					var tooltipify_data	=  core.tooltipify_data;



	var empty_match					=/^\s*$/g;
	var macro_match					=/<#(.*)#\/>/g;


	// //\\ key value pairs for sokomaps
		//. not good for ";Author:" because appends : to author
		//var _kvsoko_match				=/^(;)\s*(\S+)\s*(\S(?:.*\S|\S)*)\s*$/;

		//. can we? [^\s:=] ... who can tell?:
		//var _kvsoko_match				=/^(;)\s*(\S*[^\s:=])\s*(?:\s|=|:)\s*([^\s:=](?:.*\S|\S)*)\s*$/;

		var _kvsoko_match				=/^(;)\s*(\S*[^\t :=])\s*(?:\s|=|:)\s*([^\t :=](?:.*\S|\S)*)\s*$/;
	// \\// key value pairs for sokomaps



	var multiplayer_match			=/^:::multiplayer=\s*(\S*)\s*$/i;

	//TODm make target_ instead of target:
	var target_match				=/^target/i;  //match name target_XXX
	var box_name_match				=/^box_/;

	//: Sokoban Map Sugar. To get trimmed info ...
	var _get_malformatted_author	=/^\s*Author\s*(?::|=)\s*(\S(?:.*\S|\S)*)\s*$/i;
	var _get_malformatted_title		=/^\s*Title\s*(?::|=)\s*(\S(?:\S.*\S|\S)*)\s*$/i;




	/// FINALIZES MAP
	//	Input:	cm relate to the map being finished
	//			in most cases, this map is not current, but
	//			is a predecessor of current map.
	cmd.finalize_map = function( map, postboard )
	{

		//. this will be changed to 'parsed' if success
		map.load = 'invalid';

		var master_y;

		var colorbanKV			= cmd.colorbanKV;
		var cbformat			= map.script.cbformat;
		var collection			= map.collection;
		var parsed				= map.parsed;

		var flines				= collection.script.flines;
		var trimmed_lines		= collection.script.trimmed_lines;

		var parsed_file_header	= collection.parsed.file_header;
		var own_raw_board_lines	= map.script.raw_board_lines;

		map.script.last_map_line = postboard.lim-1;

		// c onsole.log('cbformat='+cbformat);
		// c onsole.log('postboard=',postboard);

		var www = '';
		var ww = map.script.last_map_line;
		for( master_y = map.script.first_map_line; master_y <= ww; master_y++ ) {
			www += flines[master_y] + "\n";
		}
		map.script.raw_map = www; //TODm possibly need to detect a change for session-saved-maps


		var own_raw_board=''; 		//TODm rid ??. bs used in session-saved-maps-detection
		for(var yy=0; yy<own_raw_board_lines.length; yy++){
			own_raw_board += own_raw_board_lines[yy]+"\n";
		}
		map.script.raw_board=own_raw_board;


		// //\\ Takes raw map or referred map
		//		As this is seen below: ....collection_index is a flag. of raw map presense.
		var ref_coll = null;
		if( map.reference.collection_index ){

			var ref_alb = map.reference.akey;
			var ref_coll = map.reference.collection_index;
			var ref_map = map.reference.map_index;
			// c onsole.log('map.reference=',map.reference);
		}else if(collection.reference.collection_index){

			var ref_alb = collection.reference.akey;
			var ref_coll = collection.reference.collection_index;
			var ref_map = map.ix;
			// c onsole.log('collection.reference=',collection.reference);
		}

		if(ref_coll){
			var coll_ix = parseInt(ref_coll);
			var map_ix = parseInt(ref_map);
			
			var original_coll = gio.navig.select_album_and_collection(
					ref_alb,
					coll_ix,
					map_ix,
					'dont_land'
			);
			/// TODM provide external coll info if failed .... var ww_external = 
			if(!original_coll) {
				return	'Failed download referred map: ref_alb = ' + ref_alb + 
						' coll_ix=' + coll_ix + ' map_ix=' + map_ix;
			}

			var original_map = original_coll.maps[map_ix];
			if( !original_map ){
				return	'Map with index ' + map_ix + ' does not exist' + "\n" +
						'Failed download referred map: ref_alb = ' + ref_alb + 
						' coll_ix=' + coll_ix;
			}
			map.script.original_map		= original_map;
			raw_board_lines				= clonem( original_map.script.raw_board_lines );			
			var line_parser_cbformat	= original_map.script.cbformat;
			var dtable					= original_map.script.decoder_table;

			//. helps protecting original credits for external collections
			map.original_coll			= original_coll;
			// c onsole.log('reffered map success. board lines=',raw_board_lines);
			// c onsole.log('flines',flines);

		}else{

			map.original_coll = map.collection;
			raw_board_lines = own_raw_board_lines;
			var dtable = map.script.decoder_table;
			var line_parser_cbformat = map.script.cbformat;
		}
		// \\// Takes raw map or referred map



		if( !raw_board_lines.length ) return 'Empty map`s board. Map ix='+map.map_ix;
		cmd.parse_board_lines( raw_board_lines, map, line_parser_cbformat, dtable );
		map.size[1] = raw_board_lines.length;

		// c onsole.log("map.script.raw_map "+map.ix+"=\n"+map.script.raw_map+"\nRaw board=\n"+map.script.raw_board);






		// //\\ COLLECTS DATA FROM POSTBOARD
		var playpaths		= [];
		var current_pp		= { pp : null, cbflag : false };

		/// dress wrap
		var ddww	= {	dr : null, zoneon_flag : false,
						counter : 0, dresses : {}, map : map
					  };
		var macrosed_postboard = ''; 


		/// does loop through postboard
		for( master_y = postboard.start; master_y<postboard.lim; master_y++ ) {

			var com=flines[master_y].replace(/\r/g,''); //vital for match
			var com_trimmed=trimmed_lines[master_y]; //TODO trimmed will not be macrosed. do document this.

			/// inserts macros into lines of sokoban format zone
			//	TODM speed up by: if( parsed_file_header.macros ...
			core.each(parsed_file_header.macros, function( nam, macro ){
				com = com.replace( macro.regex, macro.val );
			});
			macrosed_postboard += com + "\n";

			var pkey=colorbanKV(com);
			var pkey1 = pkey[1];
			var pkey2 = pkey[2];
			var pkey3 = pkey[3];
			// if(pkey1) c onsole.log('cbkeys=',pkey1, pkey2, pkey3);

			/// collects palypaths
			if( cmd.extract_to_playpaths(
				current_pp,
				com_trimmed,
				pkey,
				com,
				playpaths,
				cbformat
			)) continue;


			try{
				/// collects dresses
				if( cmd.extract_to_dresses(
					ddww,
					com_trimmed,
					pkey,
					com,
					dtable
				)) continue;
			}catch(err){
				return "Invalid dress format\n"+err;
			}

			///.. does loop through postboard


			if(cbformat && pkey1){

				var lcasekey = pkey2.toLowerCase();
				pkey3 = str2multiline( pkey3 );

				if(	pkey2==='multiplayer' ){
						if(isNaN(pkey3))return 'Invalid map settings. multiplayer='+pkey3;
						map.multiplayer=parseInt(pkey3);
				}
				if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
					propertify( parsed, 'credits', lcasekey, pkey3 );
					continue;
				}	
			}//if(cbformat){




			if(!cbformat){

				var soko_keys=com.match(_kvsoko_match) || [];
				var pkey3 = core.str2multiline( soko_keys[3] );

				if( soko_keys[2]){
					var lcasekey = soko_keys[2].toLowerCase();
					if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
						propertify( parsed, 'credits', lcasekey, pkey3 );
						continue;
					}	
				}

				// //\\ sugarifies. collects autor or title from poolry formatted Sokoban maps
				if( !parsed.credits || !parsed.credits.author ) {
					var match = com.match(_get_malformatted_author);
					propertify( parsed, 'credits', 'author', match && match[1] );
				}
				if( !parsed.credits || !parsed.credits.title ) {
					var match = com.match(_get_malformatted_title);
					propertify( parsed, 'credits', 'title', match && match[1] );
				}
				// \\// sugarifies. collects autor or title from poolry formatted Sokoban maps

			}
		} ///.. does loop through postboard

		if( playpaths.length>0 ) map.playpaths = playpaths;
		if( ddww.counter ) map.dresses = ddww.dresses;
		// c onsole.log(' fin map ... added after counter ...map.dresses=', map.dresses);
		map.parsed.macrosed_postboard = macrosed_postboard;

		// \\// COLLECTS DATA FROM POSTBOARD





		/// //\\ SETS TITLES AND CREDITS

		var ww_final_title = (parsed.credits && parsed.credits.title) || '';
		if(!cbformat){
			if( !( collection.map_title_source === 'comment' && ww_final_title ) ){
				ww_final_title = parsed.backward_soko_title;
			}
		}	
		propertify( parsed, 'credits', 'title', ww_final_title );


		// ///\\\ pasting credits

		map.credits = map.credits || {};
		var ww_omap = map.script.original_map;
		if( ww_omap && ww_omap.credits ) {
			if( parsed.credits ) {
				map.credits = clonem( ww_omap.credits, parsed.credits );
				map.credits.credits = [ clonem( ww_omap.credits ) ];
			}else{
				map.credits = clonem( ww_omap.credits );
			}
		}else if( parsed.credits ) {
				map.credits = clonem( parsed.credits );
		}


		if(!map.credits.title) map.credits.title = 'Map ' + map.ix;
		//Finalize the titles for select control:
		map.title	=	core.dotify( map.credits.title, 50 );
		map.tooltip	=	core.dotify( map.credits.author, 200, 'Author: ', '. '  );
		map.tooltip	+=	core.dotify( map.credits.title, 200, 'Title: ', '. '  );
		map.tooltip	+=	'zcount: ' + map.ix + '.';
		// \\\/// pasting credits
		/// \\// SETS TITLES AND CREDITS



		//.. /// FINALIZES MAP




		/// //\\ bookkeeps breeds
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

		var objective = map.objective = map.objective || {};
		objective.necessary = Math.min(batons,targets);
		objective.targets = targets;
		objective.batons = batons;

		map.actors = actors;
		/// \\// bookkeeps breeds



		collection.maps[map.ix] = map;

		//: TODm validate
		if(map.acting_col){
			map.load = 'parsed';
		}else{
			//return "Invalid map. No actor on the map " + map.ix + ".";
			map.invalid_map_message = "no actor on the map";
		}


		return '';
	};/// FINALIZES MAP



})();


