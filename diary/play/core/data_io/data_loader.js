
( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var exp_url	=  core.expand_to_parent;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var dio		=  gio.data_io;
					var session	=  gio.session;
					var deb		=  function ( string ) { gio.debly( "DataLoader: " + string ); };			
					var conadd	=  function ( string ) { gio.cons_add( "DataLoader: " + string ); };			

					var db_reg			=  /@/;		//To test is gamion in db.
					var question_reg	=  /\?/;	//To test query presence.



	/// Attaches:	Prepares gamion and downloads or parses it.
	//				Prepares means:
	//					creates cseed,
	//					passes data from metag to cseed,
	//					appends or replaces cseed in album if requested and not gafion.
	//
	//	Input:		coll_text - opt. Skips download and parses this text.
	//	Returns:	loaded-collection in success, othewise falsable.
	//
	dio.download_gamion = function ( metag, coll_text )
	{

		//. creates collection seed
		var cseed			= gdp.normalize_cseed();
		metag				= cpaste( cseed.script.metag, metag );
		var galfin			= metag.galfinition;
		var mapfin			= metag.mapfinition;
		var gafion			= galfin.gafion;
		var common			= metag.common;
		var query_is_source	= metag.common.query_is_source;
		var query_credits	= mapfin.query_credits;
		var cref			= cseed.ref;
		cref.dbased 		= metag.common.dbased;
		var cross_domain	= metag.common.dbased && gio.config.env.com.name === 'comworld';

		//:	fixes possible inconsistenses
		var cinsert 		= gafion ? 0 : metag.mapfinition.cix_to_insert1;
		var link			= metag.common.link;
		if( !coll_text && !link && !cref.dbased )
		{
			conadd('Possibly typo: link, gamion-text, and dbased are missed ...');
			return false;
		}

		deb( "Prepares gamion." + ( ( link && ( ' Link = ' + link ) ) || '' ) );

		cref.list.cix_to_insert1	= cinsert;
		cref.list.chosen			= metag.mapfinition.chosen;
		cref.list.title				= mapfin.title;
		cref.link.link				= link;
		cref.jwon					= metag.common.jwon;

		if( query_credits )
		{
			/// Transfers credits from query to cseed if any.
			var ww = cseed.credits;
			ceach( core.tooltipify_array, function (index, key) {
				core.propertify( ww, key, query_credits[ key ] );
			});
		}


		var parent_akey	= mapfin.akey_master || mapfin.akey_advice;
		//.				album is available
		var a_available	= !!parent_akey && gio.def.albums[ parent_akey ];


		if( gafion || ( !cinsert && ( !a_available || coll_text ) ) )
		{

			var downcoll = cpaste( cseed, gdef.templates.play.coll );


		
		//	do_merge	= cinsert || !(  gafion || !a_available || coll_text );
		//	do_merge	= cinsert || (  !gafion && a_available && !coll_text );
		//	!gafion &&             (         cinsert        ||               ( add_coll && !coll_text )     )
		//	( cinsert      ||               (  !gafion &&  a_available && !coll_text )     )
		}else{

			if( cinsert )
			{
				var gs			= gio.getgs();
				var parent_akey	= gs.akey;
				var cix			= cinsert - 1;
				deb( "Reuses album's collection a, c = " + parent_akey + ', ' + cix );
			}else{
				deb( "Adds coll-seed into album. akey = " + parent_akey );
			}

			//. prevents state change for middle-play downloads
			cseed.ref.list.preserve_gui_state = !query_is_source;

			var merged_album = gdp.derive_album ( parent_akey, cseed );
			if( !merged_album )
			{	conadd( "Failed adding coll-seed to akey " + parent_akey );
				return false;
			}
			var ww = merged_album.collections;
			var downcoll = cinsert ? ww[ cix ] : ww[ ww.length - 1 ];
		}	




		// //\\	Do support callbacks nest.
		var down_gamion_fup = function ( success )
		{
			//if( query_is_source && gafion && !success ) {
			if( query_is_source && !success )
			{
				var halted		= gio.description.title + ' is halted.';
				conadd( 'Failed download gafion from ' + link );
				session.state.halted = true;
				alert( halted );
			}
			return success ? downcoll : false;
		};

		var terminator = function ( success )
		{
			var sucess = down_gamion_fup( success );
			if( metag.call_back ) metag.call_back( sucess );
			return sucess;
		};
		// \\//	Do support callbacks nest.









		/// Decodes cfile ( downloads if requested before ).
		if( coll_text ) {

			deb( 'Decodes gamion ... ' );
			downcoll.maps_loaded = 'began';
			downcoll.script.source_text = coll_text;
			gio.core.def.map_format.decode( downcoll );
			deb( 'Gamion decoder finished. akey = ' + downcoll.ref.list.akey + '.' );
			var success =
				downcoll.maps_loaded === 'success' ||
				downcoll.script.state.definitions_processed;
		}else{

			//: downloads coll
			var ww = cross_domain ? terminator : null;
			var success	= dio.download_cfile ( downcoll, ww );
		}
		if( cross_domain ) return false;
		return terminator( success );

	}; // dio.download_gamion





	/// Low-level gamion downloader. Wraps call to AJAX.
	//	Action:		synchrounous ajax call gets coll text and parses it.
	//	Returns:	false if coll and default coll texts failed
	//	Advances:	to the point where map.load are 'parsed' and
	//				leaves maps in this state.
	dio.download_cfile = function( coll, terminator_cb )
	{
		var url;
		var coll_ix		= coll.ref.list.ix;
		var folder		= coll.ref.folder;
		var ownhost		= gdp.detect_ownhost_url( coll );
		var metag		= coll.script.metag;
		var cross_domain	= coll.ref.dbased && gio.config.env.com.name === 'comworld';

		if( cross_domain ) deb( 'download_cfile: cross domain' ); 
		// c ccc( 'download_cfile begins: terminator_cb =', terminator_cb );

		var down_cfile_fup = function ()
		{
			var w_success = coll.maps_loaded === 'success' || coll.script.state.definitions_processed;
			if( !w_success ) {
				var ww = " down_cfile_fup: Collection \"" + url + "\"\nis failed.\n";
				if( !coll.script.state.definitions_processed ) ww += "No galfinitions found.\n"
				ww	+= "coll.maps_loaded = " + coll.maps_loaded;
				conadd( ww );
			}
			return w_success;
		};


		if( folder.full ) {

			//. fixes displacement of documentation from app. rooot by adding webpath
			//	was: url = folder.full;
			url = core.app_webpath_noindex + '/' + folder.full;


		}else if( coll.ref.dbased ) {

			///	Does syntax check
			if( !gio.config.env.com.dburl ) {
				coll.maps_loaded += 'No db for db-collection ckey "' + coll.ref.folder.ckey + '"';
				return false;
			}

			var url = 	gio.config.env.com.dburl +
						'/gamions?' + 
						'text=yes' +
						( metag.galfinition.gafion ? '&gafion=true' : '' ) +
						( folder.ckey ? '&ckey=' + folder.ckey : '' );

		}else{

				url = coll.ref.link.link;

				if( !ownhost ) {

					if( gio.config.env.com.name === 'comprv' ) { //TODM should be more flexible.
						coll.maps_loaded += 'From db-collection this external link is forbidden "' + url + '"';
						return false;
					}

					if( gio.config.feeder.exists ) {
						url = gio.config.feeder.url + "/" + gio.config.feeder.external_maps + url;
					}else{
						coll.maps_loaded += 'No feeder exists for outhost: "' + url + '"';
						return false;
					}
				}
		}
		var query_prefix	= question_reg.test( url ) ? '&' : '?';
		var extra_query		= ( metag.common.query_pars && ( query_prefix + metag.common.query_pars ) ) || '';
		url					+= extra_query;

		coll.maps_loaded='began';
		if(gio.debug) gio.cons( 'Began loading ' + url );


		var success = false;
		var ajax_call = {

				url			: url,
				cache		: false,
				dataType	: cross_domain ? 'jsonp' : 'text',
				timeout		: 2000,
				success		: function( data, textStatus ) {
					// gio.cons('ajax success '+url);
					if( cross_domain ) data = data.text;
					if( coll.maps_loaded === 'began' && ( cross_domain || textStatus === 'success' ) ) {

						deb( coll.maps_loaded );
						coll.maps_loaded = 'ajax success';
						deb( 'data load ajax success' );

						if( data.match( /^:::failed/i ) )
						{
							coll.maps_loaded = 
									"Failed collection load.\nRedirector responded with text:\n" +
									data.substr(0, 200);
						}else{	

							coll.script.source_text = data;
							gio.core.def.map_format.decode( coll );
							deb( 'Finished maps decoder for akey ' + coll.ref.list.akey + '.' );
						}

						success = down_cfile_fup();
						if( terminator_cb ) terminator_cb( success );
					}
				}
		};

		if( cross_domain )
		{
			ajax_call.crossDomain = true;
		}else{
			ajax_call.async = false;
		}

		$.ajax( ajax_call ).fail( function( explanation ) {
					var ww = " .. ajax download failed .. ";
					coll.maps_loaded += ww;
					ww += "\nurl=" + url;
					conadd( ww );
					gio.debtp( "Possible error status = " + arguments[1] );
					gio.debtp( "Possible error expanation = " + arguments[2] );

					success = down_cfile_fup();
					if( terminator_cb ) terminator_cb( success );

		});
		// c onadd( "Skipping asyn if any in download_cfile. url=" + url );
		if( cross_domain ) return false;
		return success;

	}; // dio.download_cfile
	/// Low-level gamion downloader. Wraps call to AJAX.






	///	Loads:	maps from user-entered text
	//	Action:	adds custom text to colln.script.source_text,
	//			parses this addition, and then lands on
	//			the last map of collection.
	//			TODM the name is misleading.
	dio.add_map_text_and_land = function( text ) {

		var gs						=	gio.getgs();
		var colln					=	gs.coll;
		colln.script.source_text	+= 	"\n" + colln.maps.length + "\n\n" + text;

		colln.maps_loaded = 'began';
		if( gio.debug ) gio.cons( 'adding map to coll ... ' );

		//. parses new maps
		gio.core.def.map_format.decode ( colln );

		var failed = true;
		if( colln.maps_loaded === 'success' ) {

			//. gets last map from reparsed text
			var gm = colln.maps[ colln.maps.length-1 ];

			deb( 'Validates added-from-text-map ...' );
			if( session.reinit.landify_map( gm ) ) {
				deb( 'Lands on added-from-text-map ...' );
				gm.title = 'My Edited. ' + gm.title;
				failed = !gio.navig.landify_and_land_map( gm, 'do_land' );
				deb( 'Finished landing on added-from-text-map ...' );
			}
		}

		if( failed ) conadd( "Failed to edit map ... " + ( gm.invalid_map_message || '' ) );
	};





	dio.core.save.object = function( url, data )
	{
		var obj = { result : null };
		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				type : 'post',
				data : data,
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						obj.result = data;
						if(gio.debug) tp$.deb(data);
					}
				}
		};

		$.ajax(ajax_call).fail( function(explanation){
					var w='Ajax failed to upload object.';
					conadd(w+' url='+url+"\n");
					if(gio.debug) {
						tp$.deb( "Possible error status = " + arguments[1]);
						tp$.deb( "Possible error expanation = " + arguments[2]);
					}
		});
		return obj.result;
	};


	///	TODM too big file. Refactor.
	dio.download_database = function ()
	{

				gio.data_io.download_gamion ( 
				{
					galfinition : { gafion : true },
					common : { dbased : true }
				});
				
				deb( "Db games and albums load finished." );

				//	TODM scenarion is not elaborated
				//		overrides folder-based album definitions
				//		core.rpaste( gdef.albums, db_albums.albums );
				//		pastes preventively TODM slow
				//  	core.rpaste ( gdef.albums, core.rpaste( {}, db_albums.albums, gdef.albums ) );

				//	TODO needed?
				//: Derives the newly loaded albums which missed derivation at load.
				core.each( gdef.albums, function( akey, adummy ) { gdp.derive_album( akey ); });

	};



})(jQuery);


