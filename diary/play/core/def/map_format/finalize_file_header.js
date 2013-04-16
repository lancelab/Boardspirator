
( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var core	=  tp.core;
					var ceach	=  core.each;
					var cmd		=  gio.core.def.map_format;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var crpaste	=  core.rpaste;

					var deb		=  gio.debly;
					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var do_deb	=  gio.debug;
					var dodeb	= function ( string ) { if( do_deb ) gio.cons_add( "FileHeader: " + string ); };


					var macro_def_match				=/^(\S+)=(.+)$/;
					var linef						=/\\n/g;

					//TODm	speed up: make one key: _macros_match and use it for macros and f. header inst. of these 3 lines:
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
		// c ccc( "jwon_heap", jwon_heap );

		//.	overrides collection-shell credits with original-text credits 
		cpaste( colln.credits, jwon_heap.credits );
		var ww = colln.script.metag;
		var galfin	= ww.galfinition;
		var mapfin	= ww.mapfinition;


		///	Defines most powerful sugar, just a flat game with possible maps.
		//	"interact" is required for this sugar to work.
		if( jwon_heap.interact && !jwon_heap.games && !jwon_heap.albums && !jwon_heap.collection ) {
			//		adding all necessary wrappers
			var ww = jwon_heap;
			//.	this overconditions !!colln.state.shellified
			jwon_heap = { games : { game : ww }, albums : { game : {} }, collection : { akey : 'game' } };
		}


		/// Estimates akey from headers
		var ww = core.get_first_or_null( jwon_heap.games );
		var estimated_master_gkey = ww && ww.key;
		var ww = core.get_first_or_null( jwon_heap.albums );
		var estimated_master_akey = (ww && ww.key) || estimated_master_gkey ;


		/// Compiles gafion
		if( jwon_heap.games || jwon_heap.albums ) {
			// c cc( 'Definitions detected in scrith: ', jwon_heap );
			deb( 'Galfinition detected.');

			var w_dg = gdef.games;
			var w_da = gdef.albums;
			gdp.normalize_album_defs( jwon_heap.albums );

			if( galfin.overdefine )
			{	//:
				deb( 'Pastes overridingly albums or games from gamion.');
				crpaste ( w_da, jwon_heap.albums );
				crpaste ( w_dg, jwon_heap.games );
				ceach( jwon_heap.games, function( gkey, game ) {
					gdp.derive_game( gkey, true );
				});
			}else{
				//:
				deb( 'Pastes preventively albums or games from gamion.');
				crpaste ( w_da, crpaste( {}, jwon_heap.albums, w_da ) );
				crpaste ( w_dg, crpaste( {}, jwon_heap.games, w_dg ) );
			}

			/// derives missed albums
			ceach( jwon_heap.albums, function( albkey, walbum )
			{
				var ww = walbum.ref;
				ww.link.link				= colln.ref.link.link;
				ww.list.listify_on_top		= galfin.listify_on_top;
				ww.list.penetrate_asingle	= galfin.penetrate_asingle;
				//. restricts album's child collections to db
				if( colln.ref.dbased ) ww.db	= true;
				// c onsole.log( "Derives missed album ", walbum );
				if( galfin.derive_at_download )
				{
					deb( 'Derives album ' + albkey + ' from gamion.');
					gdp.derive_album( albkey, ( galfin.overdefine ? 'overdefine' : '' ) );
				}
			});
			colln.script.state.definitions_processed = true;
		}/// Compiles gafion

		

		var do_albumize = ! ( galfin.gafion || ( mapfin.passive && colln.state.shellified ) );

		if( do_albumize ) {

			if( !jwon_heap.collection ) {
				//.. one chance: colln is yet naked
				if( colln.state.shellified ) {
					do_albumize = false;
				}else{
					//:: trying to shellify it one more time
					var akey_probe =	mapfin.akey_master ||
										estimated_master_akey ||
										mapfin.akey_advice ||
										gdef.default_album_key;
					var hcoll = clonem( gdef.templates.def.coll );	
				}
			}else{

				var hcoll = jwon_heap.collection;
				// c onsole.log("Found head-coll=", clonem( hcoll ) );
				gdp.normalize_cseed( hcoll );

				//.	overrides caption credits with collection credits
				colln.credits = clonem( colln.credits, hcoll.credits );

				var akey_probe =	mapfin.akey_master ||
									hcoll.akey ||
									hcoll.ref.env.akey ||
									estimated_master_akey ||
									mapfin.akey_advice ||
									colln.ref.list.akey ||
									gdef.procs.get_preferred_album_def().key ||
									gdef.default_album_key;

				if( colln.ref.list.akey === akey_probe ) {
					deb (	'Skipping (re)albumizing of collection. akey_probe = ' + akey_probe +
							' is equal to ' + colln.ref.list.akey );
					do_albumize = false;
				}

				//: requests display of target album,
				//	tricky: album definition can be ineffective now
				//	because album can be already derived
				var wa = gio.session.stemmed_albums[ akey_probe ] || gdef.albums[ akey_probe ];
				wa.ref.list.listify_on_top = true;


			}
		}



		/// hcoll-mapscape-collection derives album if not done, 
		//	self-attaches to it, and
		//	merges with currently parsing collection.
		if( do_albumize ) {

				var w_source	= colln.ref.link.link && ( 'from gamion link ' +  colln.ref.link.link );
				w_source		= w_source || 'possibly from text. ';
				//. comment
				dodeb(	'Attaches coll to akey = "' + akey_probe + '" ' + w_source );

				//: sets data and passes data from the host colln
				gdp.normalize_cseed				( hcoll );

				//. sets vital reference for merging
				hcoll.ckey						= colln.ckey;					
				hcoll.ref.link					= clonem( colln.ref.link );
				hcoll.ref.already_downloaded	= true;
				hcoll.ref.list.chosen			= hcoll.ref.list.chosen || mapfin.chosen;
				hcoll.credits					= clonem( colln.credits, jwon_heap.credits, hcoll.credits );
				hcoll.map_title_source			= hcoll.map_title_source || colln.map_title_source;

				//. derives from cseed
				var w_album						= gdp.derive_album ( akey_probe, hcoll ); // TODO error check and // TODM aways false: why? , meg.preserve_GUI_state ); 
				if( !w_album )
				{
					colln.maps_loaded += '.. file header failed .. ';
					return false;
				}
				var wcoll						= w_album.collections[ w_album.collections.length -1 ];

				gdp.paste_coll_to_from			( colln, wcoll );

		} /// Collection derives album if not done, 


		core.tooltipify( colln, "Collection" );
		gdp.assembly_coll_title( colln );

		// c onsole.log('parsed header', pfh, colln.script);
		return true;

	};///	Finalizes_file_header





})();


