(function(){	 	var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var cmd			=  gio.core.def.map_format;



					// //\\//	JWON - JSON Wrapper Object Notation.
					//			Wrapper around Colorban standard map format.
					//			Version 4. Jan. 7, 2013.

					//	Any directive is opening which does not have value.
					//	Directive /: is opening ultimately and its value is ignored.
					//	Fore example, each of the following will set parsing on:
					//			/: hello, parser begins
					//			/b


					//:	Wson regular expression - primary working horse of the parser.
					//	Matches trimmed value in pattern  ^(indent)/(directive) (key) (value),
					//	directive is required and is just a non-space char.
					//	key and value are optional
					//
					//	legend:
					//		^(\s*)													//indent. optional. used for multitext input.
                    //		/														//jwon_default_marker
					//		(\S)													//directive
					//		(?:		\s*  
					//					(\S+)										//key
					//							(?:
					//								(\s+)							//kv_spacer
					//										(\S.*\S|\S)				//value	
					//							){0,1}							
					//		\s*){0,1}
					//	$/;
					var jwon_str_left		= "^(\\s*)";
					var jwon_default_marker	= '\/';
					var jwon_str_right		= "(\\S)(?:\\s*(\\S+)(?:(\\s+)(\\S.*\\S|\\S)){0,1}\\s*){0,1}$";
					// version 1: var jwon_re = /^(\s*):::(\/\/|\\\\)(?:(\S+)(?:\s+(\S.*\S|\S)){0,1}\s*){0,1}$/;
					// version 2: does not have in-line property insersion

					var left_trim_re	= /^(\s*)/;
					var dquotes_re		= new RegExp( '"',  "g" );
					var tab_re			= new RegExp( '\t', "g" );


					//: directives
					var TEXT_BRACKETS	= '"';
					var COMMENT			= "/";
					var JWON_BEGINNING	= ":";
					var JWON_END		= "\\";
					var JWON_SINGLE		= ".";	// in-line sub-property insertion
					var JWON_FOLLOWED	= ",";	// in-line sub-property insertion
					var JWON_ASSIGMENT	= "=";	// in_line root-property insertion, reserved, not caught.

					//	any other directive starts parser, for example /:
					//. key. finalizes and disables parser.
					var JWON_FINALIZE	= "\\";






	/// Creates jwon-parser instance.
	//	Normally, instance is different for each collection.
	cmd.CreateJwon = function ( colln, jwon_marker ) {

		var self_jwon				= {};

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
				// c onsole.log( 'Match = ', match );

				/// ESTABLISHES OR TERMINATES TEXT ASSEMBLY
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

							//:	reestablishes data addition mode
							parsing__bf = true;
							
							// c onsole.log( "Text mode terminated. Raw =\n" + raw + "\n\n" );
							return true;
					}

					/// UNCONDITIONAL ADDING DIRECTIVE LINE FAILED TO TERMINATE
					text += "\n";
					text += trim_indent__bf ? line.replace( left_trim_re, '' ) : line;
					return true;

				}

				/// DOES NOTHING
				if( dir === COMMENT ) return true;


				/// STOPS OR DISABLES PARSER
				if( dir === JWON_END ) { // TODM possibly slow
					//. STOPS PARSER
					parsing__bf = false;
					// c onsole.log( "Parsing mode stopped. Key = " + key + " Raw =\n" + raw + "\n\n");
					/// FIALIZES AND DISABLES PARSER
					if( key === JWON_FINALIZE ) {
						// c onsole.log( 'JWON_FINALIZE has been matched' );
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

				if( dir === JWON_BEGINNING && !parsing__bf ) {
					parsing__bf = true;
				}else if( value ) {
					//. MAKES ONE-TIME DATA ADDITION
					//	corresponds to JWON_ASSIGMENT 
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


