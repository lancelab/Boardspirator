(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;
					var cpaste	=  tp.core.paste_non_arrays;
					var clonem	=  tp.core.clone_many;
					var crpaste	=  tp.core.rpaste;

					var macro_def_match				=/^(\S+)=(.+)$/;
					var linef						=/\\n/g;

					//TODm	speed up: make one key: _macros_match and use it for macros and file header instead of these 3 lines:
					var macros_flag_match			=/^::\s*Macros/i;
					var macros_flag_stop			=/^::\s+/i;

					//.	sets caption format markers
					var caption_parser				= tp.core.make_kv_parser(':::\\.');
					






	///	Finalizes_file_header
	//	Creates:	object parsed.file_header filled with parameters of file header,
	//				see /// sets pfh template
	//	Inputs:		if postboard === null, assumes no header exists
	cmd.finalize_file_header = function( postboard, colln ) {


		colln.script.proc.jwon.finalize();

		var flines = colln.script.flines;


		/// sets pfh template
		var pfh = colln.script.parsed.file_header =
		{		captions : {},
				macros : {},
				raw : {}
		};
		pfh.raw.start	= postboard.start;
		pfh.raw.end		= postboard.lim === -1 ? 0 : postboard.lim - 1;
		var captions	= pfh.captions;
		var macros		= pfh.macros;
		var macros_area	= false;


		/// builds definitions, captions collection, and macroses
		for( var master_y = postboard.start; master_y < postboard.lim; master_y++ ) {

			var master_line = flines[ master_y ];

			caption_parser( master_line, captions );

			//find macros flag
			if(macros_flag_match.test(master_line)){
				macros_area=true;
				continue;
			}
			if(macros_flag_stop.test(master_line)){
				//gio.cons('macro - out'+master_line);
				macros_area=false;
				continue;
			}

			if(macros_area){
				var match=master_line.match(macro_def_match);
				//gio.cons(''+macro_def_match+' master_line='+master_line);
				if(match){ // && match.length===2){
					var mkey = match[1].toLowerCase();
					macros[mkey] =
					{ 		regex	: new RegExp( '<#' + mkey + '#/>', 'gi' ),
							val		: match[2].replace(linef,"\n") 
					};
				}			
			}
		};//master_y


		//.. ///	Finalizes_file_header

		//.	overrides caption credits with collection credits
		colln.credits = tp.core.clone_many( captions.credits, colln.credits );


		/// compiles added definitions
		var w_d = colln.script.heap_json;
		if( tp.core.get_first_or_null( w_d ) && ( w_d.games || w_d.albums ) ) {
			// c onsole.log( 'Definitions detected in cscript: ', w_d );
			var w_dg = gio.def.games;
			var w_da = gio.def.albums;
			//. pastes preventively
			crpaste ( w_dg, crpaste( {}, w_d.games, w_dg ) );
			crpaste ( w_da, crpaste( {}, w_d.albums, w_da ) );
			//. derives missed albums
			ceach( w_d.albums, function( albkey, walbum ) {

				walbum.from_external_url = colln.ref.link.link; //TODM weak ...
				// c onsole.log( "derives missed albums. walbum=", walbum );
				gio.def.procs.derive_album( albkey );
			});
			colln.script.state.definitions_processed = true;
		}

		
		/// Merges cseed from cscript with host collection
		var w_coll = w_d && !colln.passive && w_d.collection;
		if( w_coll ) {

	
			//:: cseed is encountered
			var w_akey = w_coll.akey || colln.akey;
			cpaste( w_coll, gio.def.templates.def.coll );

			// c onsole.log( 'Merges cseed from cscript to akey ' + w_akey );


			/// collection derives album (if not yet done ), 
			//	self-attaches to it, and
			//	merges with currently parsing collection.
			if( !w_akey ||
				!colln.lkey ||
				!colln.lkey ===  w_akey ) {

				//.	overrides caption credits with collection credits
				colln.credits = clonem( colln.credits, w_coll.credits );
			}else{

				//::	attachment to akey is requested which is different than
				//		hosting (if any) akey

				var w_album_def = gio.def.albums[ w_akey ];
				if( !w_album_def ) {
					throw "No album def " + w_akey + " for self-controlled coll ";
				}

				w_coll.ref.self = true;
				// c onsole.log('Attachment to akey ' + w_akey + ' is requested. w_coll =', w_coll);

	
				//: sets data and passes "external" data from the host colln
				w_coll.chosen				= true;
				w_coll.ref.link				= clonem( colln.ref.link );
				w_coll.credits				= clonem( w_coll.credits, colln.credits );
				w_coll.map_title_source		= w_coll.map_title_source || colln.map_title_source;

				//. deriving from cseed
				var w_album					= gio.def.procs.derive_album ( w_akey, w_coll );
				var wcoll					= w_album.collections[ w_album.collections.length -1 ];

				//. preserves script already living in colln
				delete wcoll.script;
				//.	merges all other goodies from wcoll to colln					
				crpaste( colln, wcoll );
				//. finally coincides generated and already-alive collections
				//	creating two album-hosts and lkey bound to wcoll
				w_album.collections[ w_album.collections.length -1 ] = colln;

			}/// collection derives album (

		} /// Generates and merges collection from album definition.


		//.. ///	Finalizes_file_header


		tp.core.tooltipify( colln, "Collection" );

		gio.def.procs.assembly_coll_title( colln );

		// c onsole.log('parsed header', pfh, colln.script);
		return;

	};///	Finalizes_file_header





})();


