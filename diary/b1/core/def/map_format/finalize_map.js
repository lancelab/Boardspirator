(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var clonem	=  core.clone_many;
					var propertify		=  core.propertify;
					var cmd				=  gio.core.def.map_format;
					var str2mline		=  core.str2mline;
					var tooltipify_data	=  core.tooltipify_data;


					var empty_match					= /^\s*$/g;
					var macro_match					= /<#(.*)#\/>/g;
					var multiplayer_match			= /^:::multiplayer=\s*(\S*)\s*$/i;

					//: Sokoban Map Sugar. To get trimmed info ...
					var _get_malformatted_author	= /^\s*Author\s*(?::|=)\s*(\S(?:.*\S|\S)*)\s*$/i;
					var _get_malformatted_title		= /^\s*Title\s*(?::|=)\s*(\S(?:\S.*\S|\S)*)\s*$/i;


					// //\\	key value pairs for sokomaps
					//.		not good for ";Author:" because appends : to author
					//		var _kvsoko_match				= /^(;)\s*(\S+)\s*(\S(?:.*\S|\S)*)\s*$/;

					//.		can we? [^\s:=] ... who can tell?:
					//		var _kvsoko_match				= /^(;)\s*(\S*[^\s:=])\s*(?:\s|=|:)\s*([^\s:=](?:.*\S|\S)*)\s*$/;
					var _kvsoko_match				= /^(;)\s*(\S*[^\t :=])\s*(?:\s|=|:)\s*([^\t :=](?:.*\S|\S)*)\s*$/;
					// \\// key value pairs for sokomaps






	/// FINALIZES MAP
	//	Input:	cm relate to the map being finished
	//			in most cases, this map is not current, but
	//			is a predecessor of current map.
	cmd.finalize_map = function( map, postboard )
	{

		//. this will be changed to 'parsed' if success
		map.load				= 'invalid';

		var master_y;
		var colorbanKV			= cmd.colorbanKV;
		var script				= map.script;
		var cbzone_bf			= script.cbzone_bf;
		var collection			= map.collection;
		var parsed				= map.parsed;

		var flines				= collection.script.flines;
		var trimmed_lines		= collection.script.trimmed_lines;

		var parsed_file_header	= collection.script.parsed.file_header;
		var rbl__own			= script.raw_board_lines;

		script.last_map_line	= postboard.lim-1;

		// c onsole.log('cbzone_bf='+cbzone_bf);
		// c onsole.log('postboard=',postboard);




		// //\\ STASHES DATA BEFORE PROCESSING

		//::	creates string map.script.raw_map which is used
		//		in map-editor and "about map" popup
		var www	= '';
		var ww	= script.last_map_line;
		for( master_y = script.first_map_line; master_y <= ww; master_y++ ) {
			www += flines[master_y] + "\n";
		}
		script.raw_map = www;

		//:: recreates string map.script.raw_board used  
		//			in toggle_about_map_pane and
		//			as	a "digest" to compare saved and current board
		//				in session.js:
		//				if( gm.script.raw_board !== sess_map.raw_board )
		var ww_b = '';
		for(var yy=0; yy < rbl__own.length; yy++){
			ww_b += rbl__own[yy] + "\n";
		}
		script.raw_board = ww_b;
		// \\// STASHES DATA BEFORE PROCESSING




		// //\\ BUNDLES REFERRED MAP IF ANY
		var w_r			= map.bundled__ref;
		var w_r_coll	= w_r.collection_index;
		var ref_alb		= w_r.akey;

		//.	as this is seen below: these variables are flags of raw map presense
		if( !ref_alb || !(w_r_coll || w_r_coll === 0) ) {
			
			var map__eff = map;

		}else{

			// c onsole.log('map.bundled__ref=',map.bundled__ref);
			var coll_ix		= parseInt( w_r_coll );
			var map_ix		= parseInt( w_r.map_index );

			var coll__eff	= gio.navig.validate_coll_map( ref_alb, coll_ix, map_ix );

			/// TODM	This info is too dry: who is failed: collection wrapper or
			//			collection link, or collection text?
			//			provide external coll info if failed .... var ww_external = 
			//	
			if( !coll__eff ) {
				return	'Failed download referred map: ref_alb = ' + ref_alb + 
						' coll_ix=' + coll_ix + ' map_ix=' + map_ix;
			}

			var map__eff = coll__eff.maps[ map_ix ];
			if( !map__eff ){
				return	'Map with index ' + map_ix + ' does not exist' + "\n" +
						'Failed download referred map: ref_alb = ' + ref_alb + 
						' coll_ix=' + coll_ix;
			}

			//. These two names are not very good and misleading:
			//		map.coll__eff
			//		map.script.data_source_map
			//	They express the same concept, but they are spread via
			//	different properties and look differently.
			//	The concept is: always keep the most-original-credits "afloat".
			//	TODM Refactoring must be done to fix this flaw.
			script.data_source_map = map__eff.script.data_source_map || map__eff;

			map.data_source_coll	= coll__eff;

			// //\\	We have source collection
			//		Now, we are taking source-coll header credits, source-map credits,
			//		overriding coll. with map. and store result in map.data_source_coll_credits
			//		On "top" of this, recall from file_header_finalizer that
			//		colln.credits = clonem( colln.credits )
			//		Following is not consistent because looses collection header info, but
			//		is better than to loose it completely.
			map.data_source_coll_credits = clonem( coll__eff.credits, map__eff.credits );			
			// \\//

			// c onsole.log('reffered map success. board lines=',rbl__eff);
			// c onsole.log('flines',flines);

		}

		//.	used to populate web and source in credits in get_map_credits()
		map.coll__eff		= map__eff.coll__eff || map__eff.collection;
		var dtable			= map__eff.script.decoder_table;
		var rbl__eff		= clonem( map__eff.script.raw_board_lines );			
		if( !rbl__eff.length ) return 'Empty map`s board. Map ix=' + map.ix;

		// \\//	BUNDLES REFERRED MAP IF ANY








		// //\\ COLLECTS DATA FROM POSTBOARD
		var playpaths		= [];
		var playpath_tray	= { pp : null, cbflag : false };

		/// wraps data to exchange it with extract_to_dresses function
		var dress_tray	= {	dr : null, zoneon_flag : false,
							counter : 0, dresses : {}, map : map
						  };
		var macrosed_postboard = ''; 


		/// does loop through postboard
		for( master_y = postboard.start; master_y<postboard.lim; master_y++ ) {

			//. prepares line vitally for match
			var master_line			= flines[ master_y ]; 
			var master_line_trimmed	= trimmed_lines[ master_y ];

			/// inserts macros into lines of sokoban format zone
			//	TODM speed up by: if( parsed_file_header.macros ...
			core.each(parsed_file_header.macros, function( nam, macro ){
				master_line = master_line.replace( macro.regex, macro.val );
			});
			macrosed_postboard += master_line + "\n";

			var pkey = colorbanKV(master_line);
			var pkey1 = pkey[1];
			var pkey2 = pkey[2];
			var pkey3 = pkey[3];

			/// collects palypaths
			if( cmd.extract_to_playpaths (
				playpath_tray,
				master_line_trimmed,
				pkey,
				master_line,
				playpaths,
				cbzone_bf
			)) continue;


			try{
				/// collects dresses
				if( cmd.extract_to_dresses (
					dress_tray,
					master_line_trimmed,
					pkey,
					master_line,
					dtable
				)) continue;
			}catch(err){
				return "Invalid dress format\n"+err;
			}

			///.. does loop through postboard


			if(cbzone_bf && pkey1){

				var lcasekey = pkey2.toLowerCase();
				pkey3 = str2mline( pkey3 );

				if(	pkey2==='multiplayer' ){
						if(isNaN(pkey3))return 'Invalid map settings. multiplayer='+pkey3;
						map.multiplayer=parseInt(pkey3);
				}
				if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
					propertify( parsed, 'credits', lcasekey, pkey3 );
					continue;
				}	
			}//if(cbzone_bf){




			if( !cbzone_bf ) {

				var soko_keys = master_line.match(_kvsoko_match) || [];
				var pkey3 = str2mline( soko_keys[3] );

				if( soko_keys[2] ) {
					var lcasekey = soko_keys[2].toLowerCase();
					if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
						propertify( parsed, 'credits', lcasekey, pkey3 );
						continue;
					}	
				}

				// //\\ sugarifies. collects autor or title from poolry formatted Sokoban maps
				if( !parsed.credits || !parsed.credits.author ) {
					var match = master_line.match(_get_malformatted_author);
					propertify( parsed, 'credits', 'author', match && match[1] );
				}
				if( !parsed.credits || !parsed.credits.title ) {
					var match = master_line.match(_get_malformatted_title);
					propertify( parsed, 'credits', 'title', match && match[1] );
				}
				// \\// sugarifies. collects autor or title from poolry formatted Sokoban maps

			}
		} ///.. does loop through postboard

		if( playpaths.length > 0 )	map.playpaths = playpaths;
		if( dress_tray.counter )	map.dresses = dress_tray.dresses;
		// c onsole.log(' fin map ... added after counter ...map.dresses=', map.dresses, map.ix);
		map.parsed.macrosed_postboard = macrosed_postboard;
		// \\// COLLECTS DATA FROM POSTBOARD





		/// //\\ SETS TITLES AND CREDITS

		var ww_final_title = (parsed.credits && parsed.credits.title) || '';
		if(!cbzone_bf){
			if( !( collection.map_title_source === 'comment' && ww_final_title ) ){
				ww_final_title = parsed.backward_soko_title;
			}
		}	
		propertify( parsed, 'credits', 'title', ww_final_title );




		// ///\\\ pasting credits //////////////////////////////
		map.credits = map.credits || {};

		if( map.data_source_coll_credits ) {
			if( parsed.credits ) {


				map.credits = clonem( map.data_source_coll_credits );

				//. but child is preserved as subcredits
				map.credits.credits = [ clonem( parsed.credits ) ];
				//. makes display overengineered: to much duplicating info
				//	parent credits override child
				//	map.credits = clonem( map.data_source_coll_credits, parsed.credits );

				//. but child is preserved as subcredits
				//map.credits.credits = [ map.data_source_coll_credits ];

			}else{
				map.credits = map.data_source_coll_credits;
			}
		}else if( parsed.credits ) {
				map.credits = clonem( parsed.credits );
		}


		if( !map.credits.title ) map.credits.title = 'Map ' + map.ix;
		//: finalizes titles for select control
		map.title	=	core.dotify( map.credits.title, 50 );
		map.tooltip	=	core.dotify( map.credits.author, 200, 'Author: ', '. '  );
		map.tooltip	+=	core.dotify( map.credits.title, 200, 'Title: ', '. '  );
		map.tooltip	+=	'zcount: ' + map.ix + '.';
		// \\\/// pasting credits //////////////////////////////
		/// \\// SETS TITLES AND CREDITS



		//:: PARSES BOARD
		cmd.parse_board_lines( rbl__eff, map, map__eff.script.cbzone_bf, dtable );
		map.size[1] = rbl__eff.length;
		// c onsole.log("map.script.raw_map "+map.ix+"=\n"+script.raw_map+"\nRaw board=\n"+script.raw_board);



		/// //\\ BOOKKEEPS BREEDS
		var actors=0;
		ceach(map.actor_cols, function(dummy,col){
			actors +=col.units.length;
		});
		map.actors = actors;

		//:	collects numbers for winning criteria and
		//	puts them in map.objective "repository" 
		var obj = map.objective;
		obj.necessary = Math.min( obj.baton_units.length, obj.target_units.length );
		/// \\// BOOKKEEPS BREEDS



		//:: DOES PRIMITIVE VALIDATION TODm improve
		if( map.acting_col ) {
			map.load = 'parsed';
		}else{
			map.invalid_map_message = "no actor on the map";
		}


		//. ABSORBS MAP INTO COLLECTION
		collection.maps[map.ix] = map;
		// c onsole.log('gm =', map );


		return '';
	};/// FINALIZES MAP



})();


