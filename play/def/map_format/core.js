(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};

					// * this line is sufficient to enable this regex in all cmd subroutines
					var trim_match	= cmd.trim_match = /^\s*|\s*$/g;


	var conf						={ 
										// How far above a board does sokoban-backward-from-board-title
										// loose its effect:
										backward_title_range : 40
									 };


	// Key-value match. Value, if any, will be already trimmed.
	var _kv_match					=/^(:::|;)([^=]+)(?:=\s*(\S.*\S|\S)){0,1}\s*$/i;

	// Colorban key-value match:
	var _ckv_match					=/^(:::)([^=]+)(?:=\s*(\S.*\S|\S)){0,1}\s*$/i;

	// Key-value-required match
	// var __kvr_match					=/^(:::|;)([^=]+)=\s*(\S.*\S|\S)\s*$/i;

	// This lets wrong lines to leak:
	var sokoban_board_line_match	=/^( |-)*(#|\*|B).*(#|\*|B)(\s|-)*$/; //TODO move to cmd
	// This is stronger.
	// var sokoban_board_line_match	=/^( |-)*#.*#(\s|-)*$/;

	var comment_escape_char			=/^;/;



	///////////////////////////////////////////////////////////////////////
	// Main decoder "decode" method
	// Non-multithread safe
	// Input	:	maps_text - text of collection
	//				collection_ - collection component of bundle
	//
	// Output	:	in case of success: collection.maps_loaded ='success'; 
	//				otherwise simply returns;	
	// Usage	:	After first scan, maps can be added to text and
	//				"decode" can rescan them
	///////////////////////////////////////////////////////////////////////
	cmd.decode=function(maps_text, colln){

		var w;

		// ** Parser's zone flags
		var MAP_LOOKUP=0;			// Neutral state. Map did not start or ended.
		var BOARD=1;				// Map's board is entered
		var AFTER_BOARD=2;			// Map's board is done.
		var area_flag = MAP_LOOKUP;	// Parser's zone


		// Colorban state
		var cb_bflag=false;


		colln.reference = colln.reference || {};
		colln.parsed = colln.parsed || {};
		colln.parsed.lines_number = colln.parsed.lines_number || 0;
		var rescan_flag = colln.parsed.lines_number;

		// File scope flag
		var parsed_file_header_flag = colln.parsed.file_header;
		var map_ix=-1;

		colln.source_text = maps_text;  //TODm colln.script.source_text
		colln.script = colln.script || {};
		var flines=colln.script.flines = maps_text.split("\n");
		// Hoping this is a faster way to reserve the memory
		// instead of adding elements to this array while parsing "flines":
		// Source array with no white spaces at ends:
		var trimmed_lines = colln.script.trimmed_lines = maps_text.split("\n");


		// TODm Move to init_definitions module
		// One per framework calculation in cb-map is met: 
		if(!cmd.colorban_decoder_table.is_finished){
			cmd.finalize_colorban_decoder_table(colln.plgam);
		}


		if(rescan_flag){
			map_ix=colln.maps.length-1;
			var ww = '.. rescan began for map ix ' + (map_ix + 1);
			colln.maps_loaded += ww;
			if(gio.debug) gio.cons_add(ww);
		}else{
			// One-time-per-map_decoder calculation:
			colln.maps=[];
			map_ix=-1;
			// * Default
			colln.map_ix=0;
			colln.maps_loaded +='..decoding began..';
		}

		// Heavy inheritance of of Soko-map.
		// Backward comments contain map's title:
		// One have to keep track of the line's history:
		// Current-body:
		var currbody={start: colln.parsed.lines_number-1,  lim:colln.parsed.lines_number-1};

		var map=null;
		var raw_board_lines;
		var raw_map;
		var line='';
 		// Title line above board for sokoban maps:
		var backward_soko_title='';
		var conf_bt = conf.backward_title_range;





		//=========================================
		// Master loop via colln lines
		// Map scope binary flag:
		//=========================================
		var map_unfinalized_bflag=false;
		for(var yy=colln.parsed.lines_number; yy<flines.length; yy++){

			master_line=flines[yy].replace(/\r/g,'');
			trimmed_lines[yy]=flines[yy].replace(trim_match,'');

			//gio.cons('current master_line=="'+master_line+'"'+yy);


			// Cycle-scope binary-flags have postfix "raised"
			var map_fin_raised=false;
			var header_raised=false;
			var board_line_raised=false;
			var map_init_raised=false;

			var cb_match = colorbanKV(master_line); //master_line.match(_kv_match);


			if(cb_match.length && cb_match[2]){
				// Directive came


				// ...........................................
				// Digests :::-directive and runs short code
				// . . . . . . . . . . . . . . . . . . . . . .
				var cb_detector = cb_match[2];
				if(	cb_detector === 'map' ){
					if(!parsed_file_header_flag) header_raised = true;
					if(map_unfinalized_bflag) map_fin_raised=true;
					map_init_raised = true;
					// Dump all title collection for previous soko-maps:
					if(currbody.lim>0) currbody.lim=yy;
					cb_bflag = true;
					area_flag = BOARD;
				}else if(cb_bflag){ 

					// Can be in BOARD or AFTER_BOARD ...
					if(cb_detector === 'map_end'){
						map_fin_raised=true;
						area_flag = MAP_LOOKUP;
						cb_bflag = false;
					}else if(cb_detector === 'board_end'){
						area_flag = AFTER_BOARD;
					}else if(cb_detector === 'album_key'){
						map.reference.album_key = cb_match[3];
						area_flag = AFTER_BOARD;
					}else if(cb_detector === 'collection_index'){
						map.reference.collection_index = cb_match[3];
						area_flag = AFTER_BOARD;
					}else if(cb_detector === 'map_index'){
						map.reference.map_index = cb_match[3];
						area_flag = AFTER_BOARD;

					// This map can refer game from another album:
					// For BEFORE BOARD, BOARD, AFTER_BOARD zones:
					}else if(cb_detector === 'game_context'){
						if(gio.playzone.albums[cb_match[3]]){
							map.game = gio.playzone.albums[cb_match[3]].plgam;
						}else{
							w = "Failed to find game context " +
								cb_match[3]+ "\nfor map "+map.ix;
							colln.maps_loaded += w;
							gio.cons(w);
							return; //failed collection
						}
					}
				}//.. else cb_bflag
				// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
				// Digests :::-directive and runs short code
				// ...........................................................


			}else if(cb_bflag){
				// No :::-directive
				if(area_flag === BOARD){
					board_line_raised=true;
				}
			}else{
				// No :::-directive and soko-map
				var soko_board_line = sokoban_board_line_match.test(master_line);
				if(	soko_board_line ){
					if(area_flag !== BOARD ){
						if(!parsed_file_header_flag) header_raised = true;
						if(map_unfinalized_bflag) map_fin_raised=true;
						map_init_raised = true;
						area_flag = BOARD;
					}
					board_line_raised=true;
				}else{
					if(area_flag === BOARD ){
						area_flag=AFTER_BOARD;
						// ..board lines accomulated
					}
				}
				//..no directive and soko-map
			}
			//..Master loop via colln lines



			if(header_raised){
				if(yy>0){
						parsed_file_header_flag=cmd.finalize_file_header(currbody,colln);
				}else{
						parsed_file_header_flag={};
				}
				colln.parsed.file_header=parsed_file_header_flag;
			}


			if(map_fin_raised){
					var ww=cmd.finalize_map(map, currbody);
					map_unfinalized_bflag=false;
					if(ww){
							gio.cons_add(ww);
							colln.maps_loaded += ww;
						// * map is failed, but collection may be preserved
						if(rescan_flag) break;
						// * collection is failed
						return;
					}
			}





			//..Master loop via colln lines


			if(map_init_raised){
					map_ix++;
					map={
						ix : map_ix,
						// parents:
						game : colln.plgam,
						collection : colln,
						// children:
						skin:{},
						parsed : { backward_soko_title : backward_soko_title},

						// Stashes board info
						script : {	cbformat : !!cb_bflag,
									symbol2breed : !!cb_bflag && cmd.symbol2breed,
									breed2symbol : !!cb_bflag && cmd.breed2symbol,
									decoder_table : cb_bflag ? cmd.colorban_decoder_table : cmd.sokoban_decoder_table,
									flines : flines,
									first_map_line : currbody.lim > -1 ? currbody.lim : yy, 
									raw_board_lines : []
						},

						reference : {},


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
						baton_cols : [],
						target_cols : []

					};
					map_unfinalized_bflag = true;
					raw_board_lines = map.script.raw_board_lines;
				}


			//..Master loop via colln lines


			// Continued boarding:
			if(board_line_raised) raw_board_lines.push(flines[yy]);


			if(map_fin_raised || header_raised){
					// Beginning to parse board or looking for a map:
					currbody.start = -1;
					currbody.lim = -2;
					backward_soko_title='';
					// c onsole.log('Initiated zero-body. line='+yy+' '+flines[yy]);
			}


			// ====================================
			// Heavy inheritance of of soko-map.
			// ------------------------------------
			// Backward comments contain map's title:
			// One have to keep backward track:
			if(area_flag !== BOARD){
				if(area_flag === AFTER_BOARD && cb_bflag){
					if(currbody.start<0){
						currbody.start=yy;
						currbody.lim=yy+1;
						// c onsole.log('Initial zero-body update. currbody='+currbody.start+' '+currbody.lim);

					}else{
						currbody.lim=yy+1;
						// c onsole.log('Updated limit. currbody='+currbody.start+' '+currbody.lim);
					}
				}
				if(	trimmed_lines[yy].length>0){
					// Drawback form soko-colorban mixes:
					// This grabs :::map_end and :::board_and also. 
					backward_soko_title=trimmed_lines[yy].replace(comment_escape_char,'');
					if(yy>1){
						currbody.lim = yy+1;
						if(currbody.start<0)currbody.start=yy;
					}
				}else{
					if(!backward_soko_title){
						// Initial empty lines accomulation
						if(currbody.start<0)currbody.start=yy;
						currbody.lim = yy+1;
						// c onsole.log('Initial empty lines accoumulation. currbody='+currbody.start+' '+currbody.lim);
					} 
				}
				if( currbody.lim + conf_bt < yy ){
					// Destroys title if it is too high from the board
					currbody.lim = yy+1;	
					backward_soko_title = '';
				}
			}
			// ------------------------------------
			// Heavy inheritance of of soko-map.
			// ====================================



			//..Master loop via colln lines
		}//..Master loop via colln lines


		var in_the_middle_of_the_map_flag = area_flag!==MAP_LOOKUP;
		var in_the_middle_of_the_soko_board_flag = area_flag==BOARD;

		cmd.finalize_collection(
				colln,
				rescan_flag,
				map,
				currbody,
				in_the_middle_of_the_map_flag,
				in_the_middle_of_the_soko_board_flag
		);

	};





	///////////////////////////////
	// Utilities
	///////////////////////////////

	//============================
	//	Searches: for ^(;|:::)key=val or for ^(;|:::)key=val
	//	Input:
	//	If key is found:	returns [full_match, ";" or ":::", key, val],
	//						if target is supplied and w[1] = keykey, sets target.
	//============================
	var extractKey=cmd.extractKey=function(line,target,keykey){
		var w=line.match(_kv_match);
		if(w && w[2]){
			// Sets target[key]=val
			if(target && keykey && w[1]===keykey && w[3]) target[w[2]]=w[3]; // action
		}
		return w || [];
	};

	// The same as extractKey but only for colorban and
	// does not assign anything to a target
	var colorbanKV=cmd.colorbanKV=function(line){
		return line.match(_ckv_match) || [];
	};


})(jQuery);


