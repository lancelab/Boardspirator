(function( ){	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var dotify	=  core.dotify;
					var exp_url	=  core.expand_to_parent;


					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var tcoll	=  gio.def.templates.def.coll;

					var do_debug = gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;









	/// Attaches and loads external collection from presc.ref.link.link
	//	Makes it chosen.
	//	Input:		query - opt, used as a flag of request from URL
	//	Returns:	loaded-collection in success, othewise false-eqv
	//
	gdp.download_scriptio = function ( presc ) {


		var der_alb		= gdef.procs.derive_album;
		var down_coll	= gio.download_collection;
		var tdef		= gdef.templates.def;
		var tplay		= gdef.templates.play;

		var query		= presc.env.query;
		var link		= presc.link.link;
		var link		= presc.album ? exp_url ( link ) : exp_url ( link, query && query.aurl );
		presc.link.link = link;
		

		//. creates collection seed
		var cseed					= gdp.normalize_cseed();
		cseed.ref.list.chosen		= presc.list.chosen;
		cseed.ref.link.link			= link;
		cpaste( cseed.script.presc, presc );


		var akey = presc.env.akey_master || presc.env.akey_advice;
		var album_def = gio.def.albums[ akey ];
		var do_merge_to_album = !!album_def;

		gio.debly( "Going to download scrith: akey, link = " + akey + ", " + link );

		if( query ) {

			/// takes credits from query if any
			var ww = cseed.credits;
			ceach( core.tooltipify_array, function (index, key) {
				core.propertify( ww, key, query[ key ] );
			});

			cseed.ref.list.title = presc.list.title || "From Query";
			if( presc.album ) {
				do_merge_to_album = false;
			}else if( !presc.coll ) {
				throw "Fatal. Query. Neither aurl, nor curl."; //TODO
			}
		}

		if( do_merge_to_album ) {

			//. prevents state change for middle-play downloads
			var merged_album = der_alb ( akey, cseed, !query );
			if( !merged_album )
			{	gio.cons_add( "Failed add cseed to akey " + akey );
				return false;
			}
			var ww = merged_album.collections;
			var downcoll = ww[ ww.length - 1 ];

		}else{

			var downcoll = cpaste( cseed, tplay.coll );
		}

		//. dowloads coll
		var success		= down_coll ( downcoll );
		return			success ? downcoll : false;
	};





	/// sets coll title
	//	This is an annoying procedure. Trace its logic from the code below.
	gdp.assembly_coll_title = function ( colln ) {
			
			//. relies on title assigned in externifier
			if( !gdp.detect_ownhost_url( colln ) ) return;

			var dotify			= tp.core.dotify;
			var dumb_title		= "Collection " + colln.ref.list.ix;

			var l_title		= colln.ref.list.title || colln.list_title;
			var l_title_r	= ( l_title && ( ' ::: ' + l_title ) ) || '';
			var l_title_l	= ( l_title && ( l_title + ' :: ' ) ) || '';

			var title			= colln.title_compiled_from_credits;
			// c onsole.log( "Assembling coll-title: t from_credits = " + title +
			// " cix " + colln.coll_ix  + " colln.l_title = " + l_title );

			if( !title ) {
				title		= l_title;
			}else{
				title		+= l_title_r;
			}

			if( !title	) {
				var title		=	dotify( colln.ref.link.link, -50 );
				var title		=	title && ( title + l_title_r );
				//. for case of: dotify( colln.ref.folder.full, -50 )
				var title 		=	title || colln.list_title; 
			}

			colln.title			= title || dumb_title;

	};


	/// spawns collection-seed
	//	"up" and "down" mean:
	//		"down" -	do point to physical location: like to hard-drive folder or
	//					to url on Internet
	//		"up"	-	do point to "parents" like contaning album, game-context,
	//					dresses context ...
	gdp.spawn_coll_up_down_links = function( album, cix, externified ) {


		var coll			= album.collections[ cix ];
		gdp.normalize_cseed( coll );


		// //\\ "up-links"

		//: makes list-links
		var akey			= album.key;
		coll.ref.list.akey	= akey;
		coll.ref.list.ix	= cix;
		


		//. dgame links
		coll.ref.env.dgkey = coll.ref.env.dgkey || coll.ref.env.akey || akey;


		// //\\ establishes dgame context
		var cgame			= album.dgame;
		/// finds collection redresser //TODM remove this feature if found useless
		if( coll.ref.env.dgkey !== akey ) {
			cgame = gdp.dress_game( coll.ref.env.dgkey );
			if( !cgame ) {
				gio.cons_add(	'Missed game context for key ' + coll.ref.env.dgkey +
								' for collection ' + cix );
				return false;
			}
			//. combines with parent dress
			cpaste( cgame.dresses, game.dresses );
		}
		//: contextifies
		coll.dgame = cgame;
		// \\// establishes dgame context
		// \\// "up-links"

		if( !externified) gdp.externify_and_hostify( coll, album );


		//. makes tooltip and credit html-table
		core.tooltipify( coll, "Collection" );
		gdef.procs.assembly_coll_title( coll );


		coll.state.shellified = true;

		if(do_debug)
		{
			var ww = dotify( coll.title, 50 );
			gio.cons_add(	'"' + ww + '" cshell filled for akey ' + album.key + '.');
		}

		return true;

	}; /// spawns collection-seed and mutifies




	/// Sets proper flags to false if collection link is from foreign host.
	gdp.detect_ownhost_url = function ( coll ) {

		var link = coll.ref.link.link;
		if( link ) {
			if( !core.do_match_own_host( link ) ) {
				coll.ref.link.ownhost	= false;
				// c onsole.log( "Outhost detected: link = " + link );
				return false
			}
		}
		coll.ref.link.ownhost = true;
		return true;
	};




	/// Externifies and detects own host
	gdp.externify_and_hostify = function ( coll, album ) {

		gdp.normalize_cseed( coll );

		// //\\ establishes "down-links", credits, dom-title
		//		non-external collections set relative to albums tree on player server
		//		external collection referenced more complex way: see externify function.
		if( coll.ref.link.link ) {
				//: prepares external collection
				externify( coll, album.ref.link.link );
				coll.credits.source = coll.ref.link.link;
		}else{
				spawn_coll_folder_address( coll, album.key );
		}
		gdp.detect_ownhost_url( coll );
		// \\// establishes "down-links"

	}; 	/// Externifies and detects own host




	///	expands definition of external collection,
	//	should work even for non-bound-to-album-collection,
	//	should give the same result if rerun N-times
	var externify = function ( external_collection, xurl ) {

		var coll		= external_collection;
		var ext			= coll.ref.link;
		var cred		= coll.credits;

		ext.link		= exp_url( ext.link,		xurl );
		cred.web_site	= exp_url( cred.web_site,	xurl );

		if( gdp.detect_ownhost_url( external_collection ) ) {
			return;
		}

		// //\\ retitlifies
		//TODm how to do both: set a location and open new tag by js
		var astub	= '<a target="_blank" style="text-decoration:none;" href="';
		var title	= dotify( cred.title, 30 );
		title		= title || dotify( cred.author, 30 );
		title		= title || dotify( cred.web_site, 30 );
		title		= title && ("External: " + title );
		title		= title || "External"; 
		title		= core.htmlencode( title );

		//:		This class, class="dontload_external", enables a scenario employed to detect
		//		user's intent to load external map.
		if( cred.web_site ) {
			var ext_cred	=	astub + cred.web_site +
								'"><span class="dontload_external" style="color:#00FF00">Site: ' +
								title + "</span></a>\n";
		}else{
			var ext_cred	=	'<span class="dontload_external" >' + title + "</span>\n";
		}
		ext_cred 			+=	astub + ext.link +
								'"><span class="dontload_external" style="color:#00FFFF">Text</span></a> ';
								// TODm why external link works without urlencoding? fix this:
		coll.title			=	ext_cred + '<span style="color:#FF8888; cursor:pointer;" >Try to load</span>';
		// \\// retitlifies


	}; ///	expands definition of ...





	/// assembles folder-address from given and default values
	var spawn_coll_folder_address =  function ( coll, akey ) {

			// we don't need folder at all
			if( coll.ref.already_downloaded ) return;

			var ff	= coll.ref.folder;
			ff.akey	= ff.akey	|| akey;
			ff.ckey	= ff.ckey	|| 'default';
			ff.fkey	= ff.fkey	|| 'maps.txt';
			//. is a flag:
			ff.full	= gio.config.defpaths.ALBUMS_DEF_PATH + 
							'/' + ff.akey +
							'/collections/'+ff.ckey +
							'/'+ ff.fkey;
	};


	/// Normalizes or creates normal collection seed.
	//	Input:	coll - opt. I omitted, then coll-seed is created.
	gdp.normalize_cseed = function ( coll ) {

		coll = coll || {};
		cpaste( coll, tcoll );
		coll.ref.env.akey = coll.akey || coll.ref.env.akey;
		//. deletes sugar
		if( coll.hasOwnProperty( 'akey') ) delete coll.akey;
		return coll;

	};

})();


