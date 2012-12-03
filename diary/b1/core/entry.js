
(function(){		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;


	// //\\// Contains "Master Entry"


	gio.description = {	title : 'Boardspirator' };

	gio.description = core.tpaste( gio.description, {


		description			: gio.description.title + " (Boardy). Tool\n                 " +
							  "to play, edit, solve, or develop board puzzles.",
		version				: '0.1.165. Experimental.',
		version_name		: 'Mono',	// "Monoaction". In interaction, there is no significant reaction from actees back to actors.
		date				: 'December 3, 2012',
		copyright			: '(c) 2011-2012 Konstantin Kirillov',

		license				: "Dual licensed under the MIT or GPL Version 2\n                " +
							  "except items in \"def/albums\", \"def/skins\", and  \"doc/research\"\n " + 
							  "when they explicitly have own lincense.",
		download			: 'http://github.com/lancelab/Boardspirator/',

		language			: 'JavaScript',
		usage_requirements	: "2012-modern browser (on-line) or FireFox 3.6+ or IE 8+ (from harddrive).",
		usage				: "Do land browser on " + tp.core.app_webpath_noindex + '/index.htm',
		web_site			: 'http://landkey.net/gio/',
		email				: 'beaverscript(a)landkey(.)net',
		credits				:[	
								{	"title"		: "jQuery",
									"copyright"	: "Copyright 2011, John Resig"
								},

								{	"title"		: "Sizzle.js",
									"copyright"	: "Copyright 2011, The Dojo Foundation"
								}
							],

		diary			: 	"Diary is a snapshots of working alone versions:\n\n" +
						"	0.1.165tt	Dec. 2. Solver Browser is better. Still obscure round manager.\n" +
						"	0.1.164		Nov.  27. Refactoring of internal formats began. Not sure will version b1 survie.\n" +
						"	0.1.162		Nov.  23. Map header parser fix. Won-condition corrected by motives-min-number.\n" +
						"	0.1.162		David Holland collection removed (hope temporarily) due unclear file source and licenses.\n" +
						"	0.1.162		Solver: canon2str added and makes memory resources 3 times effective; browser to top.\n" +
						"	0.1.162		Fixed: herd bug for unwalled maps, interaction dress bug. \n" +
						"	0.1.160		Nov.  6. Commenting style ... //\\\\//: is established as a horizon\n" +
						"	0.1.159		Nov.  5. Credit info improved.\n" +
						"	0.1.155		Nov.  4. Nested credits.\n" +
						"	0.1.151		Oct. 31. Added jump-interaction and ghostban, ghostjump. Leap bug fix.\n" +
						"	0.1.148		Oct. 26. salvor: contactless-path-finder-stub added.\n" +
						"                        changed to ''doctype html''.\n" +
						"                        LeapPush and Co-LeapPush do work.\n" +
						"	0.1.147		Oct. 25. added stub to process move to an arbitrary point on map.\n" +
						"	0.1.143		Oct. 24. variables renamed. Refactored.\n" +
						"	0.1.142		Oct. 20. Copyrights. Interaction bug fix. Readmes macrosed.\n" +
						"	0.1.141		Oct. 17. Readmes and comments\n" +
						"	0.1.139		Oct. 15. fixed: int tp, select-element-control bug of extra bogus item\n" +
						"	0.1.138		external collection fixed; multiban path converter fixed\n" +
						"	0.1.133		external site demo is better\n" +
						"	0.0.132		is renamed to branch 0.1.132. Branch 0.0.2.XXXX is to be redesigned independently.\n" +
						"	0.0.130		URL-query input standartized\n" +
						"	0.0.129		Deployer is better.\n" +
						"	0.0.127		Saves/loads session to db better\n" +
						"	0.0.125		Loads external collection supplied from URL-query\n" +
						"	0.0.123		Skins and their images moved outside of collections\n" +
						"	0.0.121		CoPullPush added and solves\n" +
						"	0.0.120		PullPush added\n" +
						"	0.0.119		code cleanup\n" +
						"	0.0.117		game/collection scrolls changed and cleaned\n" +
						"	0.0.116		gui is protected when map logically invalid\n" +
						"	0.0.115		default_maps_text removed, consoles reshuffled\n" +
						"	0.0.115		bumpytargets game added\n" +
						"	0.0.114		simpler getgs()\n" +
						"	0.0.113		simpler startup validation scenario\n" +
						"	0.0.112		cb map fix, map normalizer fix\n" +
						"	0.0.109		ajaxed login popup added\n" +
						"	0.0.108		deployer script added\n" +
						"	0.0.106		simplified setup of google ads and analytics\n" +
						"	0.0.105		spawned base_game def is in gio.def.games now\n" +
						"	0.0.104		and below: see versions in Diary folder\n"
	});


	core.tooltipify( gio, 'Engine', gio.description );

	/// Master Entry
	//	Behaviour:	halts application and returns if startup problems
	gio.session.init.entry = function(){

		var halted = gio.description.title +' is halted.';

		//. gets query from URL
		var query 						= gio.config.query;
		if(gio.debug)					tp$.deb(query);

		// * does initial gui tasks
		if(!ggi.entry()){alert(halted); return;}

		//. informs		
		if(!feeder.exists) gio.cons_add("No feeder exists at URL = " + feeder.url);

		// * finalizes base definitions
		gdef.procs.spawn_base_game_and_dress();


		// ** loads game definitions
		if( smode.db ){	
				// ** loads all available game defs from database at once
				gio.data_io.core.load.object(
						smode.db + '/games',
						gdef, 'games',
						'do paste'
				);
		}else{
				gio.data_io.core.load.object( 
					gio.config.defpaths.GAMES_DEF_PATH+'/games.json.txt',
					gdef,
					'games',
					'do paste'
				);
		}


		// //\\ LOADS ALBUM DEFINITIONS
		//.	contains first met album. If albums are from exteranal url, then
		//	taken from there
		var first_album = null;
		if( smode.db ){	
				///	loads all available album_defs from database at once and 
				//	overrides loaded by <script> from index-page header
				gio.data_io.core.load.object(	
						smode.db + '/albums', //?json=yes',
						gdef, 'albums'
				);
		}
		if( query.aurl ) {
			if(feeder.exists) {
				//:: loads external album

				//. dresses url if naked
				query.aurl = gdef.procs.expand_to_parent( query.aurl );

				var ww = feeder.url + "/" + feeder.external_albums+query.aurl;
				gdef.external_albums = gio.data_io.core.load.object_synchronously(ww);
				tp.core.each(gdef.external_albums, function(key, album){
					album.from_external_url = query.aurl;
				});
				tp.core.paste_non_arrays(gdef.albums, gdef.external_albums);
				first_album = core.get_first_or_null(gdef.external_albums);
			}else{
				gio.cons_add("No feeder exists to load " + query.aurl);
			}
		}
		first_album = first_album || core.get_first_or_null(gdef.albums);
		if( !first_album ) {
			var ww = "No album definitions are loaded\n";
			gio.cons_add(ww);
			alert(ww + halted);
			return;
		}
		// \\// LOADS ALBUM DEFINITIONS


		var akey = query.akey || first_album.key;


		/// Attaches external collection if any
		var ecoll = query.curl;
		if(ecoll) gdef.procs.attach_external_collection ( ecoll, akey);




		//: finally, instantiates albums:
		core.each(gdef.albums, function(akey,album_def){
			gdef.procs.derive_album(akey);
		});
		if(!gio.playalbs || gio.playalbs.length===0){
			gio.cons_add('No album definitions are found.');
			alert(halted);
			return;
		}

		ggi.controls_and_game_list();


		//. releases messages stashed in debug before <body> created
		if(gio.debug) tp$.deb('Albums instantiated. Something done with "controls_and_game_list".');



		//: lands to requested map
		var collection_ix	= query.collection_ix;
		var map_ix			= query.map_ix;

		//. backs up album positioning in case if akey fails
		gio.album_ix			= 0; //TODM remove. akey must work well.

		if( !gio.navig.select_album_and_collection(akey, collection_ix, map_ix) ){
			if(!gio.scroll_till_valid_game()) return;
		}


		//: gets ears to listen to user
		ggi.control_events();
		ggi.step_events();
		gio.modes.app_loaded = true;

		// Doc: Good way to see app tree:
		// c onsole.log('application object tree',gio);

	};// gio.session.init.entry

	gio.session.init.wrap =	function(){	gio.session.init.entry(); };


})();

jQuery('document').ready( jQuery.fn.tp$.gio.session.init.wrap );

