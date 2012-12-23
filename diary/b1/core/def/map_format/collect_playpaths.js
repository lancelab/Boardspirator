(function() {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var cmd		=  gio.core.def.map_format;


					//. TODM is this too loose error-prone-format?
					var sokoban_playpath_line_match	= /^( |\t)*(l|r|u|d|\[|\]|\*|[0-9])*(l|r|u|d)(l|r|u|d|\[|\]|\*|[0-9])*\s*$/i;
					var reg_ex_und = /_/g;		




	///	Collects data to playpaths.
	//	Directive :::playpath	does the job for both colorban and soko zones,
	//							benefit: cb-format is available
	//	Returns:	true to enforce caller to continue loop.
	cmd.extract_to_playpaths = function (
			playpath_tray,
			master_line_trimmed,
			pkey,
			master_line,
			playpaths,
			cbzone_bf
	){

			var pptt			= playpath_tray;
			var add_to_soko_pp	= false;
			var initiate_pp		= false;
			var playpath_title;

			///	For colorban-style pp, terminates it or appends to it
			if( pptt.cbflag ) {
				//. only empty line terminates pp
				if( master_line_trimmed.length === 0 ) {
					//:: terminates pp
					pptt.pp		= null;
					pptt.cbflag	= false;
				}else{
					//.	adds continuation of pp separated
					//	with \n for neatness
					pptt.pp.value += "\n" + master_line;
				}
				//. enforces caller to continue loop
				return true;
			}

			/// Initiates cbpath or soko-detector-initiator/adder
			if( pkey[2] === 'playpath' ) {
				//:: initiates cb-style pp
				pptt.cbflag	= true;
				playpath_title		= pkey[3] || '';
				initiate_pp			= true;

			//. means if we are in soko-zone or already collecting soko-style-pp
			}else if( !cbzone_bf || (pptt.pp && !pptt.cbflag ) ) {

				//. detects pp loosely in soko-maps or in scanning soko-paths
				var ww = master_line.match( sokoban_playpath_line_match );
				if( ww ) {
					if( !pptt.pp ) {
						//:: initiates soko-pp
						playpath_title = '';
						initiate_pp = true;
					}
					//. sets flag to append to soko-pp
					add_to_soko_pp = true;

				}else if( pptt ) {

					//.	comment
					//	c onsole.log('Playpath is terminated by sokoban-non-playpath-line');

					//. kills reference, but pp is already
					//	collected in playpaths[ ww ]
					pptt.pp = null;
				}
			}

			if( initiate_pp ) {
				var ww = playpaths.length;
				playpath_title = playpath_title || 'Playpath ' + ww;
				pptt.pp = playpaths[ ww ] =
				{
					title : tp.core.capitalizeFirstLetter( playpath_title.replace( reg_ex_und, ' ') ),
					value : ''
				};
			}

			if( add_to_soko_pp ) pptt.pp.value += master_line + "\n";
			if( add_to_soko_pp || initiate_pp) return true;

			return false;
	};	///	Collects data to playpaths



})();


