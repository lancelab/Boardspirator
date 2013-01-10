(function(){	 	var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var ceach		=  tp.core.each;
					//.	core-map-decoder container
					var cmd			=  gio.core.def.map_format;
					var str2mline	=  tp.core.str2mline;

					//. this line is sufficient to enable this regex in all cmd subroutines
					var trim_match	= cmd.trim_match = /^\s*|\s*$/g;
					var reg_ex_r	= /\r/g;

					var conf		={ 
										// How far above a board does sokoban-backward-from-board-title
										// loose its effect:
										backward_title_range : 40
									 };

					// value-required match
					// var __kvr_match				= /^(:::|;)([^=]+)=\s*(\S.*\S|\S)\s*$/i;

					//. colorban key-value match:
					var _ckv_match					= /^(:::)([^=.][^=]*)(?:=\s*(\S.*\S|\S)){0,1}\s*$/i;
					var colorbanKV					= cmd.colorbanKV = function(line){ return line.match(_ckv_match) || []; };
					var comment_escape_char			= /^;/;

					//.	Before parsing collection-text, it is splitted by lines by 
					//	using this regular expression.
					//	For example, copy-pasted collection fragments from Internet can
					//	create a weird mix of delimited lines.
					//	Perhaps this slpitter is still weak. TODM.
					var file_lines_split_re			= /\r\n|\r|\n/g;


					//.	sets sokoban map line detector
					//	lets wrong lines to leak
					//	<br> added to the end to enable landing on map in web sites  TODM slow?
					var sokoban_board_line_match	=/^( |-)*(#|\*|B).*(#|\*|B)(\s|-)*(?:<br>)*$/;
					// This is stronger.
					// var sokoban_board_line_match	=/^( |-)*#.*#(\s|-)*$/;



	///	Main decoder "decode" method
	//	Non-multithread safe
	//	Input	:	maps_text - text of collection
	//				collection_ - collection component of bundle
	//
	//	Output	:	in case of success: collection.maps_loaded ='success'; 
	//				otherwise simply returns;	
	//	Usage	:	After first scan, maps can be added to text and
	//				"decode" can rescan them
	//	Coding pattern in master loop:
	//					a. top detects a change and sets ...-raised flags and flags, 
	//					b. set continue in master loop only if there are no flags raised, or
	//					postboard tip and soko-pretitle edit can be skipped
	cmd.decode = function ( colln ) {


		//: defines parser zone's flags
		var MAP_LOOKUP	= 0;	// Map-ended		zone	is entered.
		var BOARD		= 1;	// Map's board		zone	is entered.
		var AFTER_BOARD	= 2;	// Map's postboard	zone	is entered.

		var script				= colln.script;
		var parsed				= script.parsed;
		parsed.lines_number		= parsed.lines_number || 0;



		//: sets flags
		var area_flag					= MAP_LOOKUP;					// file is entered or map completed
		var rescan_bflag				= !!parsed.lines_number;
		var parsed_file_header_bflag	= !!parsed.file_header;
		//.	keeps colorban state,
		//	entered only by :::map and
		//	left only by :::map_end,
		//	very strict. Placing sokoban maps after colorban map
		//	requires :::map_end
		var cbzone_bf					= false;


		var map_ix=-1;


		// //\\ Splits text to lines
		var maps_text = script.source_text;

		var flines = script.flines = maps_text.split( file_lines_split_re );  //TODM wastes performance when appending text to collection; don't do split again;
			/// Sets memory for future trimmed lines.
			//	Be careful when using them not as a flag of empty lines:
			//	they are not macrosed and are raw.
			//
			//	Hopes this is a faster way to reserve the memory
			//	instead of adding elements to this array while parsing "flines".
			//	TODM do effectively
		var trimmed_lines = script.trimmed_lines = [];
		tp.core.each( flines, function( ix, val ) {
			trimmed_lines[ ix ] = '';
		}); 
		// \\// Splits text to lines

		


		if( rescan_bflag ) {

			map_ix = colln.maps.length-1;
			var ww = '.. rescan began for map ix ' + ( map_ix + 1 );
			colln.maps_loaded += ww;
			if( gio.debug ) gio.cons_add(ww);
		}else{

			//: begins parsing yet empty collection
			colln.maps = [];
			map_ix = -1;
			//. sets default map for gameplay
			colln.map_ix = 0;
			colln.maps_loaded += '..decoding began..';
		}


		//. recreates jwon every time when reparsing
		script.proc.jwon	= cmd.CreateJwon( colln );
		var jwon			= script.proc.jwon;	
		var parse_jwon		= jwon.parse;

		//.	lim is a flag, -1 means no postboard collection began
		var postboard = { start : parsed.lines_number, lim : -1 };

		var map = null;
		var raw_board_lines;
		var raw_map;
		var line = '';

 		//. by default, sets empty "title line" which is above map board for conventional sokoban maps
		var backward_soko_title = '';
		var conf_bt = conf.backward_title_range;



		///	Master loop via colln lines
		for( var yy = parsed.lines_number; yy < flines.length; yy++ ) {

			var master_line		= flines[yy] = flines[yy].replace(reg_ex_r, '');
			trimmed_lines[yy]	= master_line.replace( trim_match, '' );

			if( !jwon.parser_disabled_bf && parse_jwon( yy ) ) {
				//.	slowly "recuts" beginning of the file
				//	can be done faster, as in callback when jwon is closing,
				//	but this will be too hidden
				postboard.lim = -1;
				continue;
			}

			// gio.cons('current master_line=="'+master_line+'"'+yy);

			//: initializes cycle-scope binary-flags,
			//	they have postfix "raised"
			var map_fin_raised		= false;
			var header_raised		= false;
			var board_line_raised	= false;
			var map_init_raised		= false;

			//.	detects coloban directive
			var cb_match = colorbanKV( master_line );

			///	:::-directive came
			//	if(cb_match.length && cb_match[2]){
			if( cb_match[2] ) {
				var cb_detector = cb_match[2];
				//.. directive came


				// ///\\\ Digests :::-directive
				if(	cb_detector === 'map' ) {
					//:: enters colorban zone and raises soko-finalizers flags

					if( !parsed_file_header_bflag )				header_raised = true;
					if( cbzone_bf || area_flag !== MAP_LOOKUP )	map_fin_raised = true;
	
					//. completes zone for file-header or previous map
					if( postboard.lim > -1 ) postboard.lim = yy;

					cbzone_bf = true;
					map_init_raised = true;
					area_flag = BOARD;
					var map_key = cb_match[3] || '';


				}else if( cbzone_bf ) { 
					//::	does colorban-zone-ending or board-ending flags or
					//		sets generic colorban-data if any

					if( cb_detector === 'map_end' ) {

						map_fin_raised = true;
						if( postboard.lim > -1 ) postboard.lim = yy;
						area_flag = MAP_LOOKUP;
						cbzone_bf = false;

					}else if( cb_detector === 'board_end' ) {
						area_flag = AFTER_BOARD;
						continue;


					//::	sets generic colorban-data if any

					// //\\ dereferences map to map in another album or collection or game context
					}else if(cb_detector === 'akey'){
						if( area_flag === BOARD ) map.bundled__ref.akey = cb_match[3];
						continue;
					}else if(cb_detector === 'collection_index'){
						if( area_flag === BOARD ) map.bundled__ref.collection_index = cb_match[3];
						continue;
					}else if(cb_detector === 'map_index'){
						if( area_flag === BOARD ) map.bundled__ref.map_index = cb_match[3];
						continue;

					///	dereferences map.game to dressed game from another album
					// //.\\	context_akey means "dgame_akey" : sets dress and game context,
					//			points to album which will supply game-definition-context and
					//			dress-context for this map.


					}else if( cb_detector === 'context_akey' ){

						if( area_flag === BOARD ) {
							var ww = gio.def.procs.derive_album( cb_match[3] );
							if( ww ) {
								//. assigns dressed game
								map.game = ww.dgame;
							}else{
								var ww = "Failed to find dressed game context " +
									cb_match[3]+ "\nfor map "+map.ix;
								colln.maps_loaded += ww;
								gio.cons( ww );
								return; //failed collection
							}
						}
						continue;
					}
					// \\.// context_akey means dgame_akey : sets dress and game context
					// \\// dereferences map to map in another album or collection or game context


				}//.. else cbzone_bf
				// \\\/// Digests :::-directive


				//..	:::-directive but not cb_flag zone. Can be MAP_LOOKUP.
				//		It is good to not put here "continue" statement, because
				//		we can add an extension of directive inside Sokoban-postboard zone or in MAP_LOOKUP zone.

			}else if( cbzone_bf ) {
				//:: No :::-directive

				if( area_flag === BOARD ) board_line_raised=true;

			}else{
				//:: No :::-directive and in soko-area in: BOARD, AFTER BOARD, LOOK_FOR_MAP

				var soko_board_line = sokoban_board_line_match.test(master_line);
				if(	soko_board_line ){
					if(area_flag !== BOARD ){

						//:: initializes soko-map
						if( !parsed_file_header_bflag ) header_raised = true;

						if( area_flag !== MAP_LOOKUP ) map_fin_raised = true;

						map_init_raised = true;
						area_flag = BOARD;
						var map_key = '';

					}
					board_line_raised=true;

				}else{
					if(area_flag === BOARD ){
						//. raises board termination in soko-format
						area_flag = AFTER_BOARD;
					}
				}
				//..no directive and soko-map
			}
			//..Master loop via colln lines



			if( header_raised ) {
				cmd.finalize_file_header( postboard, colln );
				//. forcibly cancells maps parsing
				if( colln.script.presc.album ) {
					//. emulates cancellation of everything for finalizing collection
					area_flag = MAP_LOOKUP;
					break;
				}
				parsed_file_header_bflag = true;
			}


			if(map_fin_raised){
					var ww = cmd.finalize_map(map, postboard);
					if( ww ) {
						gio.cons_add( ww );
						colln.maps_loaded += ww;
						//. map is failed, but collection may be preserved
						if(rescan_bflag) break;
						//. collection is failed TODM why to fail here? why one map breaks an entire collection?
						return;
					}
			}


			//..Master loop via colln lines


			if(map_init_raised){
					map_ix++;
					map={
						ix : map_ix,
						key : map_key,
						// parents:
						game : colln.dgame,
						collection : colln,
						// children:
						skin:{},
						parsed : { backward_soko_title : str2mline( backward_soko_title ) },

						// Stashes board info
						script : {	cbzone_bf : !!cbzone_bf,
									color2breed : !!cbzone_bf && cmd.color2breed,
									breed2color : !!cbzone_bf && cmd.breed2color,
									decoder_table : cbzone_bf ? cmd.colorban_decoder_table : cmd.sokoban_decoder_table,
									flines : flines,
									first_map_line : ( postboard.lim > -1 ? postboard.lim : yy ), 
									raw_board_lines : []
						},

						bundled__ref : {},


						// Generated by board-line-parser later or by reference:
						units : [],
						dynamic_units : [],
						locs : [],
						size : [2,2,2],

						// maps:
						loc2lid : [],
						pos :	{	lid2uid : [],
									tops	: [],
									uid2lid : [], 
									uid2loc : []
								},
						acting_col : null,

						cols:[],
						actor_cols : [],
						dynamic_cols : [],
						objective : { target_units : [], baton_units : [] }
					};
					raw_board_lines = map.script.raw_board_lines;
				}


			//..Master loop via colln lines


			// Continued boarding:
			if(board_line_raised) raw_board_lines.push(flines[yy]);


			if( map_fin_raised || header_raised ){
					//:: normalizes beginning board parser or looking for a map:

					//. sets a flag
					postboard.lim = -1;
					//. not a flag, isn't set
					//	postboard.start = ...

					backward_soko_title = '';
					// c onsole.log('Initiated zero-body. line='+yy+' '+flines[yy]);

					//. wraps .. master loop via colln lines
					continue;
			}


			/// collects preboard containing map's title for soko-maps and
			//	shifts post-board directives
			if( area_flag !== BOARD ) {

				/// recreates top of postboard
				if( postboard.lim === -1) {
					postboard.lim = yy + 1;
					//. automatically skips jwon-header
					postboard.start = yy;
				}

				if(	!cbzone_bf ) {
					if( trimmed_lines[yy].length > 0 ) {
						backward_soko_title = trimmed_lines[yy].replace( comment_escape_char, '' );
						postboard.lim = yy;
					}else if( postboard.lim + conf_bt < yy ) {
						//: destroys title if it is too high from the board
						postboard.lim = yy + 1;	
						backward_soko_title = '';
					}
				}
			}

			//.. Master loop via colln lines
		}


		var in_the_middle_of_the_map_bflag = area_flag !== MAP_LOOKUP;
		var in_the_middle_of_the_soko_board_bflag = area_flag === BOARD;

		cmd.finalize_collection(
				colln,
				rescan_bflag,
				map,
				postboard,
				in_the_middle_of_the_map_bflag,
				in_the_middle_of_the_soko_board_bflag
		);

	};





})();


