(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};


					var macro_def_match				=/^(\S+)=(.+)$/;
					var linef						=/\\n/g;

					//TODm	speed up: make one key: _macros_match and use it for macros and file header instead of these 3 lines:
					var macros_flag_match			=/^::\s*Macros/i;
					var macros_flag_stop			=/^::\s+/i;

					//.	sets caption format marker
					var caption_parser				= tp.core.make_kv_parser(':::\\.');





	///	Purpose:	finalizes_file_header
	//	Creates:	object parsed.file_header filled with parameters of file header,
	//				see /// sets pfh template
	//	Inputs:		if postboard === null, assumes no header exists
	cmd.finalize_file_header = function( postboard, colln ) {

		var flines = colln.script.flines;

		/// sets pfh template
		var pfh = colln.parsed.file_header = { captions : {} };

		if( postboard.lim === -1 ) {
			set_title( colln );
			// c onsole.log('empty header', pfh, colln.script);
			return;
		}

		pfh.raw = { start : postboard.start, end : ( postboard.lim === -1 ? 0 : postboard.lim - 1 ) };

		var macros = pfh.macros = {};
		var macros_area = false;

		var captions = pfh.captions;

		for( var master_y=postboard.start; master_y < postboard.lim; master_y++ ) {

			var line=flines[master_y];
			line=line.replace("\r",'');

			caption_parser(line, captions);

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
					var mkey = match[1].toLowerCase();
					macros[mkey] =
					{ 		regex	: new RegExp( '<#' + mkey + '#/>', 'gi' ),
							val		: match[2].replace(linef,"\n") 
					};
				}			
			}
		};//master_y

		colln.credits = tp.core.clone_many( captions.credits, colln.credits );
		tp.core.tooltipify(colln, "Collection");

		set_title( colln );
		// c onsole.log('parsed header', pfh, colln.script);
		return;
	};



	/// sets title from collection, colln
	var set_title = function (colln ) {
			var pfh = colln.parsed.file_header;
			colln.title =	colln.title || 
						tp.core.dotify( pfh.captions.title, -50 ) ||
						colln.title_compiled_from_credits || 
						tp.core.dotify( colln.address && colln.address.full, -50 ) || 
						tp.core.dotify( colln.external && colln.external.link, -50 ) || 
						( "Collection " + colln.coll_ix );
	};



})();


