(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;

					var gdef	=  gio.def;
					var session	=  gio.session;
					var state	=  session.state;
					var ggp		=  gio.gui.procs;
					var gsp		=  gio.session.procs;
				





	
	/// Validates map and lands if requested
	gio.navig.landify_and_land_map = function( gm, do_land ) {

			var coll	= gm.collection;
			var list	= coll.ref.list;
			var akey	= list.akey;
			var album	= session.stemmed_albums[ akey ];
			var colls	= album.collections;
			var cix		= list.ix;

			var validated = session.reinit.landify_map( gm );
			if( !validated )
			{	gio.debly(	"Cannot land m,c,a = " + gm.ix + ', ' +
							cix + ', ' + akey + "\n" +
							(session.reinit.messages || '' ) + "\n"
				);
			}
			if( !do_land || !validated ) return validated;



			//: DOES LANDING
			ggp.do_display_curr_board	( false );
			ggp.do_set_state			( akey, null, cix, gm.ix );
			album.title					= ggp.get_master_title_from_session_state();
			gio.gui.unhide_map			( gm ); //TODO validation ... what if this GUI fails ?


			return true;
	};	/// Validates map and lands if requested






	///	Sets:		GUI states: session.state.album_ix, ... 
	//	Input:		all is optional
	//				akey pulled before aix.
	//				if album info is missed, then current is used and not changed.
	//				if coll info is missed, then current is used and not changed.
	//				if map info is missed, then current is used and not changed.
	ggp.do_set_state = function ( akey, aix, cix, mix ) {

				var ss			= session;
				if( akey ) {
					var album	= ss.procs.get_album( akey );
				}else if( aix || aix === 0 ) {
					var album = ss.alist[ aix ];
				}else{
					var album = ss.alist[ state.album_ix ];
				}

				if( !cix && cix !== 0 ) cix = album.collections.ix;
				var coll = album.collections[ cix ];

				if( !mix && mix !== 0 ) mix = coll.map_ix;

				//. first state component
				ss.state.album_ix	= album.ix;

				//. second state component
				album.collections.ix = cix;

				//. third state component
				coll.map_ix = mix;
	
				gio.debtp(	'Established state: aix,a,c,m = ' +
							album.ix + ', ' + album.key + ', ' + cix + ', ' + mix );

	};





	// Behaviour:	finds first album with collection with valid current map, and
	//				lands if requested
	gsp.scroll_till_landable_album = function( aix, do_land ) {

		var len = session.alist.length;
		var start_aix = aix || aix === 0 ?  aix : state.album_ix;

		for( var i=0; i < len; i++ ) {

			var state_aix	= ( start_aix + i) % len;
			playalb			= session.alist[ state_aix ];
			var mess		= " scroll to album " + state_aix + " " + playalb.title;
			if( gio.debug ) gio.cons_add( "Doing " + mess );
		
			var found_coll_ix1	= gsp.scroll_till_landable_coll(
					playalb.collections.ix, playalb.collections,
					!i, do_land
			);

			if( found_coll_ix1 ) return true;
			if(gio.debug) gio.cons_add( "Failed " + mess );
		}

		var ww = 'No games available';
		// TODO poor design: gio.domwrap.popups.modal_message_popup.show( { innerHTML : ww } );
		gio.cons_add( ww );
		return false;
	};




	// Behaviour:	finds first collection with valid current map and
	//				lands there
	// Alert:		returns coll. ix + 1, not coll. ix.
	// TODm:		... still weak. If current map fails logical validation
	//				all collection is skipped
	gsp.scroll_till_landable_coll = function( start_ix, collections, download_external_if_first, do_land ) {

		if( ! (collections && collections.length) ) return false;
		var len = collections.length;

		for( var i = 0; i < len; i++){

			var current_coll_ix = ( i + start_ix ) % len;
			var coll			= collections[ current_coll_ix ];
			//:: avoids external collection because not sure will it download
			if( !coll.ref.link.link || (download_external_if_first && !i) ) { //TODM rid
				var success = gio.navig.validate_coll_map( coll.ref.list.akey, coll.ref.list.ix, null, do_land ); 
			}else{
				if( gio.debug ) gio.cons_add( "Skipped scroll of external coll" );
			}
			if( success ) return ( current_coll_ix + 1 );
		}
		
		gio.cons_add( "Scroll failed for colls at akey = \"" + collections[0].ref.list.akey + "\"" );
		return false;
	};
	



	///	Purpose:	Master Navigation Subroutine
	//	Input:		All args are optional.
	//				If !!akey, takes it from session.alist_by_key[ akey ].
	//	Returns:	false is cannot position game and collection
	gio.navig.validate_coll_map = function(

			akey,
			cix,
			map_ix,
			do_land
	){


		/// Looks up album
		if( akey ) {
			//:: Tries to set akey if requested:
			var lista = gio.session.stemmed_albums[ akey ];// session.alist_by_key[ akey ];
			if( lista ) {
				var album_ix = lista.ix;
			}else{
				gio.debly( 'Missed akey ' + akey + ' in GUI-album-set');
				return false;
			}
		}else{
			var album_ix = state.album_ix;
			var lista = session.alist[ album_ix ];
		}

		/// Looks up collection
		if( cix || cix === 0  ) {
			if( lista.collections.length <= cix || cix < 0) return false;
		}else{
			cix = lista.collections.ix;
		}
		var coll = lista.collections[ cix ];



		/// Validates collection download
		if( !coll.maps_loaded ) gio.download_collection( coll );
		if(	coll.maps_loaded !== 'success' ) {
			gio.debtp( 'Failed maps load. Message: ' + coll.maps_loaded );
			return false;
		}


		//: Prevalidates map
		var map_requested	= map_ix || map_ix === 0;
		if( !map_requested ) map_ix = coll.map_ix;
		var gm = coll.maps[ map_ix ];
		if( !gm ) return false;


		var finalized = gio.navig.landify_and_land_map( gm, do_land );

		if( !finalized ) return false;
		return coll;
	};




	/// Tries:		to get best album selection from definitsions
	//	Retruns:	see last return statement
	gdef.procs.get_preferred_album_def = function () {

		var first_album = core.get_first_or_null( gdef.albums );
		if( !first_album ) return { album : null, key : '' };
		var chosen_akey = first_album.key;

		var state_aix = state.album_ix;
		var state_akey = state_aix || state_aix === 0 ? 
				session.alist[ state.album_ix ] : '';


		//. selects from chosen
		ceach( gdef.albums, function( akey, album ) {
			chosen_akey = ( album.ref.list.chosen && akey )	|| chosen_akey;
		});

		//. selects from preordered
		ceach( gdef.albums, function( akey, album ) {
			chosen_akey = ( album.ref.list.display_preordered && akey ) || chosen_akey;
		});

		chosen_akey = chosen_akey || state_akey;

		//: possibly for derived albums:
		//	chosen_akey =	( master_akey && session.alist_by_key[ master_akey ] && master_akey || 
		//					chosen_akey	

		return { album : gdef.albums[ chosen_akey ],   key : chosen_akey };
	};




})();
