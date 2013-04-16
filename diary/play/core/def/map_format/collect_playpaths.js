
( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var cmd		=  gio.core.def.map_format;


					//. TODM is this too loose error-prone-format?
					var sokoban_playpath_line_match	= /^( |\t)*(l|r|u|d|\[|\]|\*|[0-9])*(l|r|u|d)(l|r|u|d|\[|\]|\*|[0-9])*\s*$/i;
					var reg_ex_und = /_/g;		



	///	Collects optimal solution parameters path and interactions and
	//	puts them into pptt object.
	var grab_optpath = function ( pptt, pkey3, pkey2 )
	{
		var ww			= pkey3.split('.');
		var pp			= parseInt( ww[0] );
		var ii			= ww[1] ? parseInt( ww[1] ) : 0;
		var rr			= ww[2] ? parseInt( ww[2] ) : 0;
		pptt.optpath	= null;
		if( isNaN(pp) || isNaN(ii) || isNaN(rr) ) return;
		pptt.optpath = { p : pp, i : ii, r : rr, estimation : pkey2 };
		pptt.map.metrics.optpath = pptt.optpath;
		if( pptt.pp ) pptt.optpath.path = pptt.pp;

		var metrified_title = ( pkey2 === 'optpath' ? 'Opt.' : 'Est.' ) + pkey3;
		//. raw title
		pptt.title = pptt.title || metrified_title;
		//. final title
		if( pptt.pp) pptt.pp.title = pptt.pp.title || metrified_title;
	};


	/// TODM. If empty pp is a last one in file, it is not poped.
	var terminate_playpath = function ( pptt )
	{
		if( !pptt.pp.value ) 	pptt.playpaths.pop();
		pptt.cbflag				= false;
		pptt.optpath			= null;
		pptt.title				= '';
		//. kills reference, but pp is already
		//	collected in playpaths[ ww ]
		pptt.pp = null;
	};


	///	Collects data to playpaths.
	//	Directive :::playpath	does the job for both colorban and soko zones,
	//							benefit: cb-format is available
	//	Returns:	true to enforce caller to continue loop.
	cmd.extract_to_playpaths = function (

			playpath_tray,
			master_line_trimmed,
			pkey,
			cbzone_bf
	){

			var pptt			= playpath_tray;
			var add_to_soko_pp	= false;
			var initiate_pp		= false;

			var pkey2 = pkey[2];
			var pkey3 = pkey[3];

			///	We are traveling inside of colorban-style pp ...
			//	terminates it or appends to it
			if( pptt.cbflag ) {

				if( pkey2 === 'optpath' || pkey2 === 'solpath'  )
				{
					grab_optpath ( pptt, pkey3, pkey2 );
					return true;
				}

				//. only empty line terminates pp
				if( master_line_trimmed.length === 0 )
				{
					terminate_playpath( pptt );
				}else{
					//.	adds continuation of pp separated
					//	with \n for neatness
					pptt.pp.value += "\n" + master_line_trimmed;
				}
				//. enforces caller to continue loop
				return true;
			}

			/// Initiates cbpath or soko-detector-initiator/adder
			if( pkey2 === 'playpath' || pkey2 === 'optpath' || pkey2 === 'solpath') {
				//:: initiates cb-style pp
				pptt.cbflag	= true;
				if( pkey2 === 'optpath' || pkey2 === 'solpath')
				{
					grab_optpath ( pptt, pkey3, pkey2 );
				}else{
					pptt.title = pkey3;
				}
				initiate_pp		= true;

			//. means if we are in soko-zone or already collecting soko-style-pp
			}else if( !cbzone_bf || ( pptt.pp && !pptt.cbflag ) ) {

				//. detects pp loosely in soko-maps or in scanning soko-paths
				var ww = master_line_trimmed.match( sokoban_playpath_line_match );

				if( ww ) {
					//::	soko-style-path-line is encountered
					//.	initiates soko-pp
					if( !pptt.pp ) initiate_pp = true;
					//. sets flag to append to soko-pp
					add_to_soko_pp = true;

				}else if( pptt.pp ) {
					//.	comment
					//	c onsole.log('Playpath collection terminated in soko-zone by unmatched line.');
					terminate_playpath( pptt );

				}else{
					//:: in soko-zone and "irrelevant" line
					return false;
				}
			}

			if( initiate_pp ) {
				var ww = pptt.playpaths.length;
				pptt.title = pptt.title || 'Playpath ' + ww;
				pptt.pp = pptt.playpaths[ ww ] =
				{
					title : tp.core.capitalizeFirstLetter( pptt.title.replace( reg_ex_und, ' ') ),
					value : ''
				};
				if( pptt.optpath ) pptt.optpath.path = pptt.pp;
			}

			if( add_to_soko_pp ) pptt.pp.value += master_line_trimmed + "\n";
			if( add_to_soko_pp || initiate_pp) return true;

			return false;
	};	///	Collects data to playpaths



})();


