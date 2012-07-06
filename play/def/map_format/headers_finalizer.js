(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};


	var macro_def_match				=/^(\S+)=(.+)$/;
	var linef						=/\\n/g;
	var collection_title_match		=/^:::title\s+(\S.*)\s*$/;
	//TODm	speed up: make one key: _macros_match and use it for macros and file header instead of these 3 lines:
	var macros_flag_match			=/^::\s*Macros/i;
	var macros_flag_stop			=/^::\s+/i;



	///////////////////////////////////////////
	// Decoder tables.
	// Format: map-symbol : breed
	//=========================================

	// Inverse encoder for heros and boxes:
	// Only for colorban map:
	var breed2symbol = cmd.breed2symbol={};
	var symbol2breed = cmd.symbol2breed={};
	
	//Pure Sokoban mapper:
	cmd.sokoban_decoder_table={
		'#':'wall_x',
		'u':'wall_a', //extra
		'v':'wall_b', //extra


		'@':'hero_x',
		'p':'hero_x',

		'+':['target_x','hero_x'],
		'P':['target_x','hero_x'],

		'$':'box_x',
		'b':'box_x',
		'*':['target_x','box_x'],
		'B':['target_x','box_x'],

		'.':'target_x',
		'o':'target_x',
		
		' ':'ground_x',
		'-':'ground_x',
		'_':'ground_x'
	};


	//=======================================
	// Towerban decoder table. Part I and II.
	//---------------------------------------
	cmd.colorban_decoder_table={
		// Part I. Before autobuiling, 
		// adds a little bit Sokoban compatibility:
		'#':'wall_x',
		'-':'ground_x',
		'_':'ground_x',
		'$':'box_x',
		'@':'hero_x',
		'.':'target_x',

		'+':['target_x','hero_x'],
		'*':['target_x','box_x'],
		is_finished : false
	};


	// Part II. Autobuiling, 
	// This function defines rules 
	// how colored units are decoded in the map:
	cmd.finalize_colorban_decoder_table=function(plgam){

		var cnames = plgam.cnames;
		// i=color_ix:
		for(var i=0; i<plgam.colors.length; i++){
			var t=cmd.colorban_decoder_table;
			// Color symbol:
			var c=plgam.colors[i];
			var msw=plgam.wall_map_symbols[i];

			// decode hero-breeds:
			t[c]=cnames.hero[i];

			//Define path recognition chars only for heros:
			//Breed to path-symbol:
			breed2symbol[t[c]]=c;
			symbol2breed[c]=t[c];

			/////////////////////////////////////////////////////////////
			// ... only the map deviates from "canonical" breed names
			//     images should "adhere" canonical ...
			/////////////////////////////////////////////////////////////

			// decode box-breeds:
			t[c.toUpperCase()]=cnames.box[i];

			//Don't define path recognition chars for passive elements:
			//breed2symbol[cnames.box[i]]=c.toUpperCase();
			//symbol2breed[c.toUpperCase()]=cnames.box[i];	//X,A,B,C, ... 1X,...2B, - boxes 

			t[msw]=cnames.wall[i];							//y,i,j,k,l,  - walls
			t[msw.toUpperCase()]=cnames.ground[i];			//Y,I,J,K, ... 1J,..2K, - grounds 
			t[''+i]=cnames.target[i];						//0,1,2,3 --- for target_x, target_a, target_b ...
		}
		//important: c onsole.log(t['y'],t['Y']); // this gives: wall_x ground_x
		t.is_finished=true;
	};
	//---------------------------------------
	// Towerban decoder table. Part I and II.
	//=======================================
	// Decoder tables.
	/////////////////////////////////////////








	/////////////////////////////////////////////////
	// Purpose:	finalize_file_header
	// Returns:	object named "parsed_file_header"
	//			empty if no data in a header
	//===============================================
	cmd.finalize_file_header=function(currbody, colln){



		var w;
		var flines = colln.script.flines;
		var pfh={ raw: { start : currbody.start, end : currbody.lim-1 } };
		var macros={};
		var macros_area=false;
		var extracted_title='';

		for(var master_y=currbody.start; master_y<currbody.lim; master_y++){

			var line=flines[master_y];
			line=line.replace("\r",'');


			// Set collection ref. if any
			var cb_match = cmd.colorbanKV(line);
			if(cb_match.length && cb_match[2]){
				if(cb_match[2] === 'album_key'){
					colln.reference.album_key = cb_match[3];
				}else if(cb_match[2] === 'collection_index'){
					colln.reference.collection_index = cb_match[3];
				}
			}


			//override title:
			if(!extracted_title){
				w=line.match(collection_title_match);
				if(w && w[1])extracted_title=w[1];
			}


			//find macros flag
			if(macros_flag_match.test(line)){
				macros_area=true;
				continue;
			}
			if(macros_flag_stop.test(line)){
				//gio.cons('macro - out'+line);
				macros_area=false;
				continue;
			}

			if(macros_area){
				var match=line.match(macro_def_match);
				//gio.cons(''+macro_def_match+' line='+line);
				if(match){ // && match.length===2){
					macros[match[1]]=match[2].replace(linef,"\n");
				}			
			}
		};//master_y

		colln.title = colln.title || extracted_title;

		pfh.macros=macros;
		return pfh;
	};
	//=============================
	//finalize_file_header
	///////////////////////////////


})(jQuery);


