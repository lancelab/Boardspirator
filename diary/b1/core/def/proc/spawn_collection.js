(function( ){	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var giodf	=  gio.def;
					var defp	=  giodf.procs;
					var dotify	=  core.dotify;
					var exp_url	= tp.core.expand_to_parent;
					var do_debug = gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;









	/// Attaches and loads external collection from coll_url
	//	Makes it chosen.
	//	Input:		query - opt, used as a flag of request from URL
	//	Returns:	loaded-collection in success, othewise false-eqv
	//
	defp.attach_external_collection = function ( coll_url, akey, query ) {

		//. creates cseed
		var new_cseed				=	clonem ( gio.def.templates.def.coll );
		new_cseed.chosen			=	true
		new_cseed.ref.link			=
		{								link		: coll_url,
										list_title	: 'External'
		};
		new_cseed.akey				=	akey;


		if( !query ) {

			if( !akey ) return null;

			//.. request is came from link entered by user
			var w_album = gio.def.procs.derive_album ( akey, new_cseed );
			var new_collection = w_album.collections[ w_album.collections.length - 1 ]
			var success = gio.download_collection ( new_collection );
			return success ? new_collection : null;

		}else{

			//.. request is came from URL ... trying to fullfill it

			var credits = new_cseed.credits;
			//. imports query key.values filtered by tooltipify_array into new_cseed.credits
			ceach( core.tooltipify_array, function (index, key) {
				core.propertify( credits, key, query[key] );
			});

			new_cseed.akey = query.akey || new_cseed.akey;

//			if( query.cscript ) {
				//::	lets cscript load and decide ...
				var new_collection = cpaste( new_cseed, gio.def.templates.play.coll );
				//.	fixes link
				new_collection.ref.link.link = exp_url ( new_collection.ref.link.link );
				var success = gio.download_collection ( new_collection );
				return success ? new_collection : null;
/*
			}else{

				var w_album = gio.def.procs.derive_album ( new_cseed.akey, new_cseed );
				if( w_album ) {
					//..	collection is successfully attached, but not loaded yet
					var new_collection = w_album.collections[ w_album.collections.length - 1 ];
					//.	downloads collection ... this can be done later
					var success = gio.download_collection ( new_collection );
					return success ? new_collection : null;
				}else{
					gio.cons_add(	"Album \"" + new_cseed.akey +
									"\" derivation is failed for query.akey " + query.akey );
				}


			}
*/

			//..	either album-def is missed, or problems, or album-def is inside of cscript
			return null;

		}	
	};





	/// sets coll title
	//	This is an annoying procedure. Trace its logic from the code below.
	defp.assembly_coll_title = function ( colln ) {
			
			//. relies on title assigned in externifier
			if( colln.ref.link.link ) return;

			var dotify			= tp.core.dotify;
			var dumb_title		= "Collection " + colln.coll_ix;

			var list_title_r	= ( colln.list_title && ( ' ::: ' + colln.list_title ) ) || '';
			var list_title_l	= ( colln.list_title && ( colln.list_title + ' :: ' ) ) || '';

			var title			= colln.title_compiled_from_credits;
			if( !title ) {
				var title		= colln.list_title;
			}else{
				var title		= title && ( title + list_title_r );
			}

			if( !title	) {
				var title		=	dotify( colln.ref.link.link, -50 );
				var title		=	title && ( title + list_title_r );
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
	defp.spawn_coll_up_down_links = function( album, cix ) {


		var coll			= album.collections[ cix ];


		// //\\ "up-links"

		//: makes list-links
		coll.coll_ix		= cix;
		var akey = coll.lkey = album.key;


		//. dgame links
		coll.dgame_akey		= coll.dgame_akey || akey;


		// //\\ establishes dgame context
		var cgame			= album.dgame;
		/// finds collection redresser //TODM remove this feature if found useless
		if( coll.dgame_akey !== akey ) {
			cgame = defp.dress_game( coll.dgame_akey );
			if( !cgame ) {
				gio.cons_add(	'Missed game context for key ' + coll.dgame_akey +
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



		// //\\ establishes "down-links", credits, dom-title
		//		non-external collections set relative to albums tree on player server
		//		external collection referenced more complex way: see externify function.
		if( coll.ref.link.link ) {

				//: prepares external collection
				externify( coll, album.from_external_url );
				coll.credits.source = coll.ref.link.link;

		}else{
				spawn_coll_folder_address( coll, akey );
		}
		// \\// establishes "down-links"



		//. makes tooltip and credit html-table
		core.tooltipify( coll, "Collection" );
		giodf.procs.assembly_coll_title( coll );



		if(do_debug)
		{
			gio.cons_add(	'Seed assembled for coll ' + dotify( coll.title, 50 ) +
							' akey=' + album.key + '.');
		}

		return true;

	}; /// spawns collection-seed and mutifies





	///	expands definition of external collection,
	//	should work even for non-bound-to-album-collection,
	//	should give the same result if rerun N-times
	var externify = function ( external_collection, xurl ) {

		var coll		= external_collection;
		var ext			= coll.ref.link;
		var cred		= coll.credits;

		ext.link		= exp_url( ext.link,		xurl );
		cred.web_site	= exp_url( cred.web_site,	xurl );

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
			if( coll.ref.self ) return;

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



})();


