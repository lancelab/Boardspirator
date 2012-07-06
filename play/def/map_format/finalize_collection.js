(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};





	cmd.finalize_collection=function(
				colln,
				rescan_flag,
				map,
				currbody,
				in_the_middle_of_the_map_flag,
				in_the_middle_of_the_soko_board_flag
		){


		var flines = colln.script.flines;
		var trimmed_lines = colln.script.trimmed_lines;

		if(!rescan_flag && !colln.parsed.file_header){
			//If no f-header at all, this is a salvation:
			parsed_file_header=cmd.finalize_file_header(flines,file_header,colln);
			colln.parsed.file_header=parsed_file_header;
		}
		var parsed_file_header = colln.parsed.file_header;


		if( in_the_middle_of_the_map_flag ){
			if(!in_the_middle_of_the_soko_board_flag)currbody.lim = flines.length;

			w=cmd.finalize_map(map, currbody);
			if(w){
				colln.maps_loaded +=w;
				gio.cons(w);
				return; //failed collection
			}
		}




		if(colln.maps.length){
			if(!rescan_flag) colln.map_ix=0; //default

			colln.parsed.lines_number = flines.length;
			colln.maps_loaded ='success';
			if(gio.debug)gio.cons(colln.plgam.nam+' maps decoder success');
		}else{
			w='..no maps found in text';
			colln.maps_loaded +=w;
			gio.cons(w);
		}

		// c onsole.log('colln=',colln);
	};

})(jQuery);


