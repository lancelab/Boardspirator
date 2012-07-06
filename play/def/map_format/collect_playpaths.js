(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var cmd		=  gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};


	// Too loose error-prone-format?:
	var sokoban_playpath_line_match	=/^( |\t)*(l|r|u|d|\[|\]|\*|[0-9])*(l|r|u|d)(l|r|u|d|\[|\]|\*|[0-9])*\s*$/i;


	// Returns:	true to continue loop caller
	cmd.extract_to_playpaths=function(
			current_pp,
			com_trimmed,
			pkey,
			com,
			playpaths,
			cbformat
	){
			var add_to_pp=false;
			var initiate_pp=false;
			var playpath_title;

			// ** Terminator or adder for cbpath
			if(current_pp.cbflag){
				if(com_trimmed.length === 0){
					// Only empty line terminates pp
					current_pp.pp=null;
					current_pp.cbflag=false;
				}else{
					current_pp.pp.value +="\n"+com; //TODm why order is changed "\n"+com?
				}
				return true; //continue;
			}

			// ** Initiator for cbpath or soko-detector-initiator/adder
			if(pkey[2]==='playpath'){
				current_pp.cbflag =  true;
				playpath_title= pkey[3] || '';
				initiate_pp=true;
			}else if(pkey[2]==='sokoban_playpath'){
				current_pp.cbflag = false;
				playpath_title = pkey[3] || '';
				initiate_pp=true;
			}else if(!cbformat || (current_pp.pp && !current_pp.cbflag)){
				// Allow "loosy" pp detection only in soko-maps or in scanning soko-paths
				var w=com.match(sokoban_playpath_line_match);
				if(w){
					if(!current_pp.pp){
						playpath_title = '';
						initiate_pp=true;
					}
					add_to_pp=true;
				}else if(current_pp){
					// c onsole.log('Play path is terminated by sokoban-non-playpath-line');
					current_pp.pp=null;
				}
			}

			if(initiate_pp){
				w=playpaths.length;
				playpath_title = playpath_title || 'Playpath '+w;
				current_pp.pp = playpaths[w]=
				{
					title : tp.core.capitalizeFirstLetter(playpath_title.replace(/_/g,' ')),
					value : ''
				};
			}

			if(add_to_pp)current_pp.pp.value +=com+"\n";
			if(add_to_pp || initiate_pp) return true;
			return false;
	};


})(jQuery);


