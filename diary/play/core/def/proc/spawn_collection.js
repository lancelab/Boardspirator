
( function( ) {	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var dotify	=  core.dotify;
					var exp_url	=  core.expand_to_parent;


					var gdef	=  gio.def;
					var gdp		=  gdef.procs;

					var do_deb	=  gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;
					var dodeb	=  function ( string ) { if( do_deb )		gio.cons_add( "SpawnColl: " + string ); };
					var deb		=  function ( string ) { if( gio.debug )	gio.cons_add( "SpawnColl: " + string ); };			
					var conadd	=  function ( string ) { 					gio.cons_add( "SpawnColl: " + string ); };			

					var db_reg	= /@/g; //Tests does db flag exist in ckey.


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


	/// Completes:	album_to ( and album_from if any )
	//				begin to point to the same collection,
	//				contents of collections merged:
	//					coll_from ovrrides coll_to,
	//					except coll_to.script which overrides coll_from.script.
	//				coll_from still knows album_from as an owner.
	//	Input:		coll_from and album_from must be in sync.
	//	NOTE:		coll_from.key becomes a ckey. coll_to.ckey is lost.
	//				album_to possibly does not exist at all.
	gdp.paste_coll_to_from = function ( coll_to, coll_from )
	{
		//. preserves script already living in coll_to
		coll_from.script = coll_to.script;
		//.	merges all other goodies from wcoll to colln					
		core.rpaste( coll_to, coll_from );

		var akey		= coll_from.ref.list.akey;
		var cix			= coll_from.ref.list.ix;
		var album_from	= gio.session.stemmed_albums[ akey ];

		//: fixes album_from references
		album_from.collections[ cix ]		= coll_to;
		album_from.coll_ref[ coll_to.ckey ]	= coll_to;
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


		//: Cidifies and keyifies collection.
		///	This property must be not overridden in other
		//	places of code:
		if( !coll.ref.cid || coll.ref.cid !== 0 )
		{
			coll.ref.cid = gio.def.colls.maxcid;
			gio.def.colls.maxcid += 1;
		}
		var ww = coll.ckey || 'col_' + coll.ref.cid;


		/*
		// //\\ Abandoned
		/// Protects against overriding existing collection.
		var ww_item = coll.ckey && gio.def.colls.items[ coll.ckey ];
		if(	!album_overdefines && !coll.ref.list.cix_to_insert1 &&
			ww_item && ww_item !== coll )
		{
			coll.ckey = 'col_' + coll.ref.cid;
		}

		//. Sets global inventory.
		gio.def.colls.items[ coll.ckey ] = coll;
		// \\// Abandoned
		*/


		//.	Makes up album.coll_ref link.
		album.coll_ref[ coll.ckey ] = coll;


		// //\\ "up-links"

		//: Makes list-links to most recent album-list owner.
		var akey			= album.key;
		coll.ref.list.akey	= akey;
		coll.ref.list.ix	= cix;
		

		// //\\ establishes dgame context

		//. dgame links
		var dgkey =	coll.ref.env.dgkey = coll.ref.env.dgkey || coll.ref.env.akey || akey;
		var cgame = album.dgame;
		/// finds collection redresser //TODM remove this feature if found useless
		if( dgkey !== akey ) {
			cgame = gdp.dressi_gami_fy_album( dgkey );
			//. combines with parent dress
			cpaste( cgame.dresses, game.dresses );
		}
		//: contextifies
		coll.dgame = cgame;
		// \\// establishes dgame context
		// \\// "up-links"

		if( !externified ) gdp.externify_and_hostify( coll, album );


		//. makes tooltip and credit html-table
		core.tooltipify( coll, "Collection" );
		gdef.procs.assembly_coll_title( coll );

		coll.state.shellified = true;
		dodeb(	'"' + dotify( coll.title, 50 ) + '" up-down links done. a, c = ' +
				coll.ref.list.akey	+ ', ' +
				coll.ref.list.ix	+ '.' );

		
		return true;

	}; /// spawns collection-seed and mutifies




	/// Sets proper flags to false if collection link is from foreign host.
	//	Returns true or false.
	gdp.detect_ownhost_url = function ( coll ) {

		var ref		= coll.ref;
		var link	= ref.link;
		var ll		= link.link;
		if( ref.folder && db_reg.test( ref.folder.ckey ) ) {
			link.ownhost = true;
		}else if( ll ) {
			if( core.do_match_own_host( ll ) ) {
				link.ownhost = true;
			}else{
				link.ownhost = false;
				// c ccc( "Outhost detected: link = " + linkT );
			}
		}else{
			link.ownhost = true;
		}
		return link.ownhost;
	};




	/// Externifies and detects own host
	gdp.externify_and_hostify = function ( coll, album ) {

		gdp.normalize_cseed( coll );

		// //\\ Establishes "down-links", credits, dom-title,
		//		non-external collections set relative to albums tree on player server,
		//		external collection referenced more complex way: see externify function.
		if( coll.ref.link.link ) {
				//: prepares external collection
				externify( coll, album.ref.link.link );
				coll.credits.source = coll.ref.link.link;
		}else{

			spawn_coll_folder_address( coll, album.key );
		}
		gdp.detect_ownhost_url( coll );
		// \\// Establishes "down-links"

	}; 	/// Externifies and detects own host




	///	Expands definition of external collection.
	//	Should work even for non-bound-to-album-collection,
	//	should give the same result if rerun N-times.
	var externify = function ( external_collection, xurl )
	{

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





	/// normalizes and assembles folder-address from given and default values
	//	as of today, called only for link-missed collections
	var spawn_coll_folder_address =  function ( coll, akey ) {

			var ref = coll.ref
			//. We don't need folder at all
			if( ref.already_downloaded ) return;

			ref.dbased	= ref.dbased || db_reg.test( ref.folder.ckey );
			var ff		= ref.folder;
			ff.ckey		= ff.ckey	|| 'default';
			ff.fkey		= ff.fkey	|| 'maps.txt';

			if( !ref.dbased )
			{
				ff.akey =	ff.akey || akey;
				ff.full	=	gio.config.defpaths.ALBUMS_DEF_PATH + 
							'/' + ff.akey +
							'/collections/'+ff.ckey +
							'/'+ ff.fkey;
			}

	};


	/// Normalizes or creates normal collection seed.
	//	Input:	coll - opt. I omitted, then coll-seed is created.
	gdp.normalize_cseed = function ( coll ) {

		coll = gio.def.templates.normalize_coll( coll );
		coll.ref.env.akey = coll.akey || coll.ref.env.akey;
		//. deletes sugar
		if( coll.hasOwnProperty( 'akey') ) delete coll.akey;
		return coll;

	};

})();


