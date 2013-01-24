( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var tpaste	=  core.tpaste;
					var cpaste	=  core.paste_non_arrays;
					var exp_url	=  core.expand_to_parent;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var dio		=  gio.data_io;
					var deb		=  function ( string ) { gio.debly( "Dataloader: " + string ); };			
					var conadd	=  function ( string ) { gio.cons_add( "Dataloader: " + string ); };			





	/// Attaches:	Prepares gamion and downloads or parses it.
	//				Prepares means:
	//					creates cseed,
	//					passes data from metag to cseed,
	//					appends or replaces cseed in album if requested and not defion.
	//
	//	Input:		coll_text - opt. Skips download and parses this text.
	//	Returns:	loaded-collection in success, othewise false-eqv
	//
	dio.download_gamion = function ( metag, coll_text ) {

		var tdef		= gdef.templates.def;
		var tplay		= gdef.templates.play;

		var query		= metag.env.query;
		var link		= metag.link.link;
		var link		= metag.defion ? exp_url ( link ) : exp_url ( link, query && query.aurl );
		metag.link.link = link;
		deb( "Preparing gamion. " + ( link && ( ' link = ' + link ) ) );



		//. creates collection seed
		var cseed = gdp.normalize_cseed();
		cseed.ref.list.chosen	= metag.list.chosen;
		cseed.ref.link.link		= link;
		cseed.ref.jwon			= metag.jwon || query && query.jwon; //TODM redundant. Make one master metag.
		cpaste( cseed.script.metag, metag );


		if( query ) {

			/// Transfers credits from query to cseed if any.
			var ww = cseed.credits;
			ceach( core.tooltipify_array, function (index, key) {
				core.propertify( ww, key, query[ key ] );
			});

			cseed.ref.list.title = metag.list.title || "From Query";

		}

		var parent_akey			= metag.env.akey_master || metag.env.akey_advice;
		var add_coll_into_album	= !!parent_akey && gio.def.albums[ parent_akey ];


		if( !metag.reuse_collection && ( metag.defion || !add_coll_into_album || coll_text ) ) {

			var downcoll = cpaste( cseed, tplay.coll );

		}else{

			if( metag.reuse_collection ) {

				var gs = gio.getgs();
				var parent_akey = gs.akey;
				var cix = metag.cix_to_insert1 - 1;
				deb( "Reusing album's collection a, c = " + parent_akey + ', ' + cix );
			}else{
				deb( "Adding coll-seed into album. akey = " + parent_akey );
			}

			//. prevents state change for middle-play downloads
			var merged_album = gdp.derive_album ( parent_akey, cseed, !query );
			if( !merged_album )
			{	conadd( "Failed add coll-seed to akey " + parent_akey );
				return false;
			}
			var ww = merged_album.collections;
			var downcoll = metag.reuse_collection ? ww[ cix ] : ww[ ww.length - 1 ];
		}	


		/// Decodes cfile ( downloads if requested before ).
		if( coll_text ) {

			deb( 'Decoding gamion ... ' );
			downcoll.maps_loaded = 'began';
			downcoll.script.source_text = coll_text;
			gio.core.def.map_format.decode( downcoll );
			deb( 'Finished maps decoder. akey =' + downcoll.ref.list.akey + '.' );
			var success =
				downcoll.maps_loaded === 'success' ||
				downcoll.script.state.definitions_processed;

		}else{

			//. dowloads coll
			var success	= dio.download_cfile ( downcoll );
		}

		return success ? downcoll : false;

	}; // dio.download_gamion





	/// Low-level gamion downloader. Wraps call to AJAX.
	//	Action:		synchrounous ajax call gets coll text and parses it.
	//	Returns:	false if coll and default coll texts failed
	//	Advances:	to the point where map.load are 'parsed' and
	//				leaves maps in this state.
	dio.download_cfile = function( coll ) {

		var url;
		var coll_ix				= coll.ref.list.ix;
		var folder				= coll.ref.folder;
		var ref_db				= coll.ref.db;
		var ownhost				= gdp.detect_ownhost_url( coll );

		if( folder.full ) {

			//. fixes displacement of documentation from app. rooot by adding webpath
			//	was: url = folder.full;
			url = core.app_webpath_noindex + '/' + folder.full;


		}else if( ref_db ) {

			///	Does syntax check
			if( !gio.modes.sta_tic.db ) {
				coll.maps_loaded += 'No db for db-collection akey "' + ref_db.akey + '"';
				return false;
			}
			var url = 	gio.modes.sta_tic.db + 
						'/collections/1?text=yes' +
						'&album_key='		+ ref_db.akey + 
						'&collection_key='	+ ref_db.ckey +
						'&file_key='		+ ref_db.fkey;

		}else{

				url = coll.ref.link.link;

				if( !ownhost ) {

					if( coll.ref.dbased ) {
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


		coll.maps_loaded='began';
		if(gio.debug) gio.cons( 'Began loading ' + url );

		var ajax_call = {

				url			: url,
				async		: false,
				cache		: false,
				dataType	: 'text',
				timeout		: 2000,
				success		: function( data, textStatus ) {
					// gio.cons('ajax success '+url);

					if(coll.maps_loaded==='began' && textStatus==='success'){

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
					}
				}
		};

		$.ajax( ajax_call ).fail( function( explanation ) {
					var ww = " .. ajax download failed .. ";
					coll.maps_loaded += ww;
					ww += "\nurl=" + url;
					conadd( ww );
					gio.debtp( "Possible error status = " + arguments[1] );
					gio.debtp( "Possible error expanation = " + arguments[2] );
		});

		var w_success = coll.maps_loaded === 'success' || coll.script.state.definitions_processed;
		if( !w_success ) {
				var ww = "Collection \"" + url + "\"\nis failed.\n";
				if( !coll.script.state.definitions_processed ) ww += "No definitions.\n"
				ww	+= "coll.maps_loaded = " + coll.maps_loaded;
				conadd( ww );
		}

		return w_success;
	}; // dio.download_cfile
	/// Low-level gamion downloader. Wraps call to AJAX.




	dio.download_defion = function ( arg ) {

			//:	available arguments
			var url					= arg.url;
			var query				= arg.query;
			var listify_on_top		= arg.listify_on_top;
			var penetrate_asingle	= arg.penetrate_asingle;
			var derive_at_download	= arg.derive_at_download;

			var session				= gio.session;
			var halted				= gio.description.title + ' is halted.';


			var metag =
			{ 	defion : true,
				env	:
				{	query				: query,
					listify_on_top		: listify_on_top, //TODM bad coding
					derive_at_download	: derive_at_download,
					penetrate_asingle	: penetrate_asingle,
				},
				link :
				{	link : url
				},
				list :
				{	chosen : !!query,
					title : query && "External"
				}
			};
			deb( "Downloading defion " + url );
			var downed_alb = dio.download_gamion ( metag );
			if( !downed_alb ) {
				conadd( 'Failed download defion from ' + url );
				session.state.halted = true;
				alert( halted );
			}
			return downed_alb;

	};



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
		if( gio.debug ) gio.cons( 'began to add map to collection ... ' );

		//. parses new maps
		gio.core.def.map_format.decode ( colln );

		var failed = true;
		if( colln.maps_loaded === 'success' ) {

			//. gets last map from reparsed text
			var gm = colln.maps[ colln.maps.length-1 ];

			deb( 'Validates added-from-text-map ...' );
			if( gio.session.reinit.landify_map( gm ) ) {
				deb( 'Lands on added-from-text-map ...' );
				gm.title = 'My Edited. ' + gm.title;
				failed = !gio.navig.landify_and_land_map( gm, 'do_land' );
				deb( 'Finished landing on added-from-text-map ...' );
			}
		}

		if( failed ) conadd( "Failed to edit map ... " + ( gm.invalid_map_message || '' ) );
	};





	dio.core.save.object=function(url, data){

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




})(jQuery);


