(function(){	 	var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var cmd			=  gio.core.def.map_format;



					// //\\//	JWON - JSON Wrapper Object Notation.
					//			Wrapper around Colorban standard map format.
					//			Version 10. Jan. 26, 2013.
					//			Version 9. Jan. 21, 2013.
					//			Version 8. Jan. 17, 2013.

					//:	Wson regular expression - primary working horse of the parser.
					//	Matches trimmed value in pattern  ^(indent)/(directive) (key) (value),
					//	directive is required and is just a non-space char.
					//	key and value are optional
					//
					//	legend:
					//		^(\s*)													//indent. optional. used for multitext input.
                    //		/														//jwon_default_marker
					//		(\S)													//directive
					//		\s*
					//		(?:		  
					//					(\S+)										//key
					//							(?:
					//								(\s+)							//kv_spacer
					//										(\S.*\S|\S)				//value	
					//							){0,1}							
					//		\s*){0,1}
					//	$/;
					var jwon_str_left		= "^(\\s*)";
					var jwon_default_marker	= '\/';
					var jwon_str_right		= "(\\S)\\s*(?:(\\S+)(?:(\\s+)(\\S.*\\S|\\S)){0,1}\\s*){0,1}$";
					// version 1: var jwon_re = /^(\s*):::(\/\/|\\\\)(?:(\S+)(?:\s+(\S.*\S|\S)){0,1}\s*){0,1}$/;
					// version 2: does not have in-line property insersion

					var left_trim_re	= /^(\s*)/;
					var dquotes_re		= new RegExp( '"',  "g" );
					var tab_re			= new RegExp( '\t', "g" );


					//:: directives

					//	Directive /{ ultimately opens parser and its value is ignored.
					//			Fore example:
					//				/{ hello, parser begins
					var JWON_INITIALIZATION	= "{";  // initiates parser

					var JWON_BEGINNING		= ":";  // resumes parser if not finalized
					var JWON_END			= "\\";	// suspends parsing
					var JWON_FINALIZATION	= "}";  // finalizes and disables parser

					var JWON_SINGLE			= ".";	// in-line sub-property insertion
					var JWON_FOLLOWED		= ",";	// in-line sub-property insertion
					var JWON_ASSIGMENT		= "=";	// in_line root-property assignment: /= my_key my_value

					var TEXT_BRACKETS		= '"';
					var COMMENT				= "/";





	/// Creates jwon-parser instance.
	//	Normally, instance is different for each collection.
	cmd.CreateJwon = function ( colln, jwon_marker ) {

		var self_jwon					= {};
		//. Redundant but clear.
		self_jwon.parser_disabled_bf 	= false;

		var jwon_marker				= jwon_marker || jwon_default_marker;
		var jwon_re					= new RegExp( jwon_str_left + jwon_default_marker + jwon_str_right, "i" );
		// c onsole.log( 'jwon_re = ', jwon_re )

		var flines					= colln.script.flines;
		//. even script has heap_json, this is a consistent style to secure it
		var heap_json				= colln.script.heap_json = colln.script.heap_json || {};
		var parsing__bf				= false;
		var text_mode_key			= '';
		var text					= '';
		var trim_indent__bf			= '';
		var raw						= '';


		//	//\\ Detects jwon at the beginning of text
		var ww						= jwon_marker + JWON_INITIALIZATION;
		var format_detector_re		= new RegExp ( '^(\s\n\r)*' + ww );
		/// Returns true if text begins with jwon neglecting leading spacers.
		self_jwon.detect_format = function ( text )
		{
			return format_detector_re.test( text )
		};
		//	\\// Detects jwon at the beginning of text



		///	Parses
		self_jwon.parse = function ( line_ix ) {

			if( self_jwon.parser_disabled_bf ) return false; //TODM slow. Yes. But consistent.

			var line = flines[ line_ix ];
			// c onsole.log( 'Line = ' + line );

			var match = line.match( jwon_re );

			/// DIRECTIVE DETECTED
			if( match ) {

				//. empty line converts undefined to ''
				var indent		= match[1] || '';
				var dir			= match[2];
				var key			= match[3] || '';
				var kv_spacer	= match[4] || '';
				var value		= match[5] || '';

				//. most useful debug
				// c ccc( 'Match = ', match );


				/// ESTABLISHES OR TERMINATES TEXT ASSEMBLY
				if( parsing__bf ) {

					if( !text_mode_key ) {

						/// ESTABLISHES TEXT MODE
						if( dir === TEXT_BRACKETS ) {
							trim_indent__bf = indent;
							text_mode_key = key || TEXT_BRACKETS;
							text = '';
							// c onsole.log( 'Established text mode. text_mode_key = ' + text_mode_key );
							return true;
						}
			
					}else{


						//:: IN TEXT MODE

						//. checks for termination	
						var w_term	= text_mode_key === TEXT_BRACKETS ? dir : dir + key;
	
						// c onsole.log( 'Text terminator candidate = ' + w_term );

						/// TERMINATING TEXT MODE
						if( w_term === text_mode_key ) {
							//:: going to terminate text
							// c onsole.log( "Terminating text mode. Text =\n" + text + "\n" );

							/// Sugarifies parsing. Appends to result all the remainder
							//	of the line after directive like /" or /END_OF_TEXT
							var string_remainder = text_mode_key === TEXT_BRACKETS ?
									key + kv_spacer + value :
									kv_spacer + value;

							raw += 
								'"' + 
								text.replace(/\\/g, "\\\\").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t") +
								'"' +
								string_remainder;
							text = '';
							text_mode_key = '';

							// c onsole.log( "Text mode terminated. Raw =\n" + raw + "\n\n" );
							return true;
						}

						/// UNCONDITIONAL ADDING DIRECTIVE LINE FAILED TO TERMINATE
						if( text ) text += "\n";
						text += trim_indent__bf ? line.replace( left_trim_re, '' ) : line;
						return true;

					}
				} // if( !parsing__bf ) {
				/// ESTABLISHES OR TERMINATES TEXT ASSEMBLY





				// //\\ UNCONDITIONAL SWITCHES

				/// STOPS OR DISABLES PARSER
				if( dir === JWON_END || dir === JWON_FINALIZATION ) { // TODM possibly slow
					//. STOPS PARSER
					parsing__bf = false;
					// c ccc( "Parsing mode stopped. Key = " + key + " Raw =\n" + raw + "\n\n");
					/// FIALIZES AND DISABLES PARSER
					if( dir === JWON_FINALIZATION ) {
						raw += "\n}";
						// c ccc( 'JWON_FINALIZE has been matched' );
						self_jwon.finalize ();
					}
					return true;
				}

				/// ADDS SINGLE-LINE ASSIGNMENTS
				if( dir === JWON_SINGLE || dir === JWON_FOLLOWED ) {
					var ww = dir === JWON_FOLLOWED ? "," : "";
					if( value ) {
						value = value.replace( dquotes_re, '\\"').replace( tab_re, "\\t" );
					}else{
						value = "";
					}
					raw += indent + '"' + key + "\" : \"" + value + "\"" + ww + "\n";
					return true;
				}

				//. (RE)ESTABLISHES DATA ADDITION MODE
				if( dir === JWON_BEGINNING || dir === JWON_INITIALIZATION ) {
					// if( !parsing__bf ) c cc( "Parsing begins ... " );
					parsing__bf = true;
					if( dir === JWON_INITIALIZATION ) {
						raw = "{\n";
					}
					return true;
				}else if( JWON_ASSIGMENT === dir && key ) {
					//. MAKES ONE-TIME DATA ADDITION
					//	corresponds to JWON_ASSIGMENT 
					heap_json[ key ] = ( heap_json[ key ] || '' ) + ( value && tp.core.str2mline( value ) );
					return true;
				}

				// \\// UNCONDITIONAL SWITCHES


				//:	discardes any other directives 
				if( parsing__bf ) return true;

				//. throws directive lines into calling wrapper
				//	to decide what to do with them
				return false;

			} /// DIRECTIVE DETECTED





			/// CONTINUES TEXT ASSEMBLY
			if( text_mode_key ) {
					text += "\n";
					text += trim_indent__bf ? line.replace( left_trim_re, '' ) : line;
					return true;
			}

			/// CONTINUES PARSING
			if( parsing__bf ) {
				raw += line + "\n";
				return true;
			}


			return false;
		} /// Parses







		///	jsonifies properties of assembled object
		//	and deactivates parser by setting ...disabled_bf flag to true
		self_jwon.finalize = function () {

			if( self_jwon.parser_disabled_bf ) return;

			// c onsole.log( "Finalizing jwon. Text=\n" + raw );
			// c onsole.log( ' Finalizing jwon ' );

			if( raw ) {
				try {
					tp.core.rpaste( heap_json, JSON.parse( raw ) );
				}catch( error ) {
					gio.cons_add(
						"JWON error \n" +
						( typeof error === 'object' && error !== null ? error.message : '' + error )
					);
					if( gio.debug ) tp$.deb( error );
					gio.debly( "JSON input text=\n" + raw );
				}
			}
			self_jwon.parser_disabled_bf = true;
			//. master debugging line
			// c onsole.log( 'JWON PARSER DISABLED. Heap=', heap_json );
		};


		return self_jwon;

	};


})();


