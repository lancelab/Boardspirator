(function(){	 	var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var cmd			=  gio.core.def.map_format;


					//.	primary working horse of the parser,
					//	matches trimmed value in pattern  ^(space):::(directive)(key) (value),
					//	directive is "//" or "\\",
					//	key and value are optional
					//
					//	legend:
					//		^(\s*)
                    //		:::
					//		(\/\/|\\\\)
					//		(?:  
					//				(\S+)  (?:\s+(\S.*\S|\S)){0,1}  \s*
					//		){0,1}$/;
					var jwon_re			= /^(\s*):::(\/\/|\\\\)(?:(\S+)(?:\s+(\S.*\S|\S)){0,1}\s*){0,1}$/;


					var left_trim_re	= /^(\s*)/;
					var TEXT_BRACKETS	= '"';
					var COMMENT			= "'";
					var JWON_END		= "\\\\";
					var JWON_FINALIZE	= "\\";






	/// Creates jwon-parser instance.
	//	Normally, instance is different for each collection.
	cmd.CreateJwon = function ( colln ) {

		var self_jwon				= {};
		var flines					= colln.script.flines;
		//. even script has heap_json, this is a consistent style to secure it
		var heap_json				= colln.script.heap_json = colln.script.heap_json || {};
		var parsing__bf				= false;
		var text_mode_key			= '';
		var text					= '';
		var indent__bf				= '';
		var raw						= '';





		///	Does master parsing job
		self_jwon.parse = function ( line_ix ) {

			if( self_jwon.parser_disabled_bf ) return false; //TODM slow. Yes. But consistent.

			var line = flines[ line_ix ];
			var match = line.match( jwon_re );


			/// DIRECTIVE DETECTED
			if( match ) {

				var dir		= match[2];
				var key		= match[3] || '';
				var value	= match[4] || '';


				// c onsole.log( 'Match = ', match );

				/// ESTABLISHES OR TERMINATES TEXT ASSEMBLY
				if( !text_mode_key ) {

					/// ESTABLISHES TEXT MODE
					if( key === TEXT_BRACKETS ) {
						indent__bf = match[1];
						text_mode_key = value || TEXT_BRACKETS;
						text = '';
						return true;
					}
			
				}else{


					//:: IN TEXT MODE

					//. checks for termination	
					var w_term	= dir + key;

					// c onsole.log( 'Text terminator candidate = ' + w_term );

					/// TERMINATING TEXT MODE
					if( w_term === '//' + text_mode_key ) {
							//:: going to terminate text
							raw += 
								'"' + 
								text.replace(/\\/g, "\\\\").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t") +
								'"' +
								value;
							text = '';
							text_mode_key = '';

							//:	reestablishes data addition mode
							parsing__bf = true;
							
							// c onsole.log( "Text mode terminated. Raw =\n" + raw + "\n\n" );
							// c onsole.log( "Text mode terminated. \n\n" );
							return true;
					}

					/// UNCONDITIONAL ADDING DIRECTIVE LINE FAILED TO TERMINATE
					text += "\n";
					text += indent__bf ? line.replace( left_trim_re, '' ) : line;
					return true;

				}

				/// DOES NOTHING
				if( key === COMMENT ) return true;


				/// STOPS OR DISABLES PARSER
				if( dir === JWON_END ) { // TODM possibly slow
					//. STOPS PARSER
					parsing__bf = false;
					// c onsole.log( "Parsing mode stopped. Key = " + key + " Raw =\n" + raw + "\n\n");
					// c onsole.log( "Parsing mode stopped. Key = " + key + "\n\n");
					/// FIALIZES AND DISABLES PARSER
					if( key === JWON_FINALIZE ) {
						// c onsole.log( 'JWON_FINALIZE has been matched' );
						self_jwon.finalize ();
					}
					return true;
				}

				if( value ) {
					//. MAKES ONE-TIME DATA ADDITION
					heap_json[ key ] = ( heap_json[ key ] || '' ) + ( value && tp.core.str2mline( value ) );
				}else{
					//. (RE)ESTABLISHES DATA ADDITION MODE
					parsing__bf = true;
				}

				return true;

			} /// DIRECTIVE DETECTED




			/// CONTINUES TEXT ASSEMBLY
			if( text_mode_key ) {
					text += "\n";
					text += indent__bf ? line.replace( left_trim_re, '' ) : line;
					return true;
			}

			/// CONTINUES PARSING
			if( parsing__bf ) {
				raw += line;
				return true;
			}


			return false;
		} ///	Does master parsing job






		///	jsonifies properties of assembled object
		//	and deactivates parser by setting ...disabled_bf flag to true
		self_jwon.finalize = function () {

			if( self_jwon.parser_disabled_bf ) return;

			// c onsole.log( ' Finalizing jwon ' + raw );
			// c onsole.log( ' Finalizing jwon ' );

			if( raw ) {
				tp.core.rpaste( heap_json, JSON.parse( raw ) );
			}
			self_jwon.parser_disabled_bf = true;
			//. master debugging line
			// c onsole.log( 'JWON PARSER DISABLED. Heap=', heap_json );
		};


		return self_jwon;

	};


})();


