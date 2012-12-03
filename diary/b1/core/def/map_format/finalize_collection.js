(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};





	cmd.finalize_collection=function(
				colln,
				rescan_bflag,
				map,
				postboard,
				in_the_middle_of_the_map_bflag,
				in_the_middle_of_the_soko_board_bflag
		){


		var flines = colln.script.flines;
		var trimmed_lines = colln.script.trimmed_lines;

		if(!rescan_bflag && !colln.parsed.file_header){
			//. if no f-header at all, this is a salvation
			cmd.finalize_file_header( postboard, colln );
		}


		if( in_the_middle_of_the_map_bflag ){
			if( !in_the_middle_of_the_soko_board_bflag) postboard.lim = flines.length;

			var w=cmd.finalize_map(map, postboard);
			if(w){
				colln.maps_loaded +=w;
				gio.cons(w);
				return; //failed collection
			}
		}




		if(colln.maps.length){
			if(!rescan_bflag) colln.map_ix=0; //default

			colln.parsed.lines_number = flines.length;
			colln.maps_loaded ='success';
			if(gio.debug)gio.cons(colln.game.nam+' maps decoder success');
		}else{
			var w='..no maps found in text';
			colln.maps_loaded +=w;
			gio.cons(w);
		}

		// c onsole.log('colln=',colln);
	};

})();


