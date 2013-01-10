(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;
					var cpaste	=  tp.core.paste_non_arrays;
					var clonem	=  tp.core.clone_many;
					var crpaste	=  tp.core.rpaste;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;

					var macro_def_match				=/^(\S+)=(.+)$/;
					var linef						=/\\n/g;

					//TODm	speed up: make one key: _macros_match and use it for macros and file header instead of these 3 lines:
					var macros_flag_match			=/^::\s*Macros/i;
					var macros_flag_stop			=/^::\s+/i;

		






	///	Finalizes_file_header
	//	Creates:	object parsed.file_header filled with parameters of file header,
	//				see /// sets pfh template
	//	Inputs:		if postboard === null, assumes no header exists
	cmd.finalize_file_header = function( postboard, colln ) {


		colln.script.proc.jwon.finalize();

		var flines = colln.script.flines;


		/// sets pfh template
		var pfh = colln.script.parsed.file_header =
		{		macros : {},
				raw : {}
		};
		pfh.raw.start	= postboard.start;
		pfh.raw.end		= postboard.lim === -1 ? 0 : postboard.lim - 1;
		var macros		= pfh.macros;
		var macros_area	= false;




		/// builds macros-definitions
		for( var master_y = postboard.start; master_y < postboard.lim; master_y++ ) {

			var master_line = flines[ master_y ];

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
		}; /// builds macros-definitions






		var jwon_heap = colln.script.heap_json;
		// c onsole.log("jwon_heap", jwon_heap );
//ccc( 'colln='+colln.ref.list.akey + " jwon_heap.credits=", jwon_heap.credits ); 

		//.	overrides collection-shell credits with original-text credits 
		cpaste( colln.credits, jwon_heap.credits );
		var prs = colln.script.presc;


		/// compiles added definitions
		if( jwon_heap.games || jwon_heap.albums ) {
			// c onsole.log( 'Definitions detected in scrith: ', jwon_heap );
			gio.debly( 'Scrith defs detected.');

			var w_dg = gdef.games;
			var w_da = gdef.albums;
			//. pastes preventively
			crpaste ( w_dg, crpaste( {}, jwon_heap.games, w_dg ) );
			crpaste ( w_da, crpaste( {}, jwon_heap.albums, w_da ) );

			/// derives missed albums
			gdp.normalize_album_defs( jwon_heap.albums );
			ceach( jwon_heap.albums, function( albkey, walbum ) {
				walbum.ref.link.link = colln.ref.link.link;
				walbum.ref.list.display_preordered = prs.album;
				// c onsole.log( "Derives missed album ", walbum );
				gdp.derive_album( albkey );
			});
			colln.script.state.definitions_processed = true;
		}

		

		var do_albumize = !prs.album && !prs.env.passive;
		var mess = "Fatal. Coll has no album to shellify.";

		if( do_albumize ) {

			if( !jwon_heap.collection ) {
				//.. one chance: colln is yet naked
				if( colln.state.shellified ) {
					do_albumize = false;
				}else{
					//:: trying to shellify it one more time
					var akey_probe = prs.env.akey_master || prs.env.akey_advice; // || akey_chosen ... TODO add akey from renewed album defs
					if( !akey_probe || !gdef.albums[ akey_probe ] ) {
						gio.cons_add( mess );
						throw mess; //TODM do better
					}					
					var hcoll = clonem( gdef.templates.def.coll );	
				}
			}else{
				var hcoll = jwon_heap.collection;
				// c onsole.log("Found head-coll=", clonem( hcoll ) );
				gdp.normalize_cseed( hcoll );

				//.	overrides caption credits with collection credits
				colln.credits = clonem( colln.credits, hcoll.credits );

				var pakey = gdef.procs.get_preferred_album_def().key;
				var akey_probe =	prs.env.akey_master ||
									hcoll.akey ||
									hcoll.ref.env.akey ||
									prs.env.akey_advice ||
									colln.ref.list.akey ||
									pakey;
				if( !akey_probe || !gdef.albums[ akey_probe ] ) {
					gio.cons_add( mess );
					throw mess; //TODM do better
				}					

				if( colln.ref.list.akey === akey_probe ) {  //TODO weak
					gio.debly (	'Skipping (re)albumizing of collection. Missed akey_probe = ' + akey_probe +
								' or equal to ' + colln.ref.list.akey );
					do_albumize = false;
				}

				//: requests display of target album,
				//	tricky: album definition can be ineffective now
				//	because album can be already derived
				var wa = gio.session.stemmed_albums[ akey_probe ] || gdef.albums[ akey_probe ];
				wa.ref.list.display_preordered = true;


			}
		}



		/// Collection derives album if not done, 
		//	self-attaches to it, and
		//	merges with currently parsing collection.
		if( do_albumize ) {

				//. comment
				gio.debly( 'Albumizes:     akey ' + akey_probe + " from scrith " + prs.link.link );

				//: sets data and passes data from the host colln
				cpaste							( hcoll, gdef.templates.def.coll );
				hcoll.ref.list.chosen			= hcoll.ref.list.chosen || prs.list.chosen; //TODM apparently overkill: always chosen?
				hcoll.ref.link					= clonem( colln.ref.link );
				hcoll.credits					= clonem( colln.credits, jwon_heap.credits, hcoll.credits );
				// c onsole.log( "Albumizes     albumizee coll.credits=", hcoll.credits );

				hcoll.map_title_source			= hcoll.map_title_source || colln.map_title_source;
				hcoll.ref.already_downloaded	= true;

				//. derives from cseed
				var w_album						= gdp.derive_album ( akey_probe, hcoll ); //TODO error check
				var wcoll						= w_album.collections[ w_album.collections.length -1 ];
//ccc( "albumizing ... hcoll.credits", hcoll.credits );
				//. preserves script already living in colln
				delete wcoll.script;
				//.	merges all other goodies from wcoll to colln					
				crpaste( colln, wcoll );
//ccc( "albumizing ... colln.credits", colln.credits ); 
				//. finally coincides generated and already-alive collections
				//	creating two album-hosts and lkey bound to wcoll
				w_album.collections[ w_album.collections.length -1 ] = colln;

		} /// Collection derives album if not done, 


		tp.core.tooltipify( colln, "Collection" );
		gdp.assembly_coll_title( colln );

		// c onsole.log('parsed header', pfh, colln.script);
		return;

	};///	Finalizes_file_header





})();


