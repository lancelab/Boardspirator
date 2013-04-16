
( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;


					// //\\//	Describes Application and Credits.
					//			Must not be put before config.js and before config_gui.js file.




	// TODOs
	//	1. Prevent infinite recursion in overdivine album/game mode (by setting up depth < DEPTH_PROTECTOR).
	//	2. Prevent infinite recursion in rereferencing collections and maps (by setting up depth < DEPTH_PROTECTOR).




	gio.description = {	title : 'Boardspirator' };

	core.paste_non_arrays( gio.description, {


		description			: gio.description.title + " (Boardy). Tool\n                 " +
							  "to play, edit, solve, or develop board puzzles.",
		version				: '0.1.200',
		version_name		: 'Mono',	// "Monoaction". In interaction, there is no significant reaction from actees back to actors.
		maturity			: 'Draft',
		date				: 'February 24, 2013',
		copyright			: '(c) 2011-2013 Konstantin Kirillov',

		license				: "MIT, BSD, and GPL\n							" +
							  "except data in \"def/albums\" and \"def/skins\"\n							" + 
							  "when they explicitly have own lincense.",
		download			: 'http://github.com/lancelab/Boardspirator/',

		language			: 'JavaScript',
		usage_requirements	: "2012-modern browser (on-line) or FireFox 3.6+ or IE 8+ (from harddrive).",
		usage				: "Do land browser on " + tp.core.app_webpath_noindex + '/index.htm',
		web_site			: 'http://landkey.net/gio/',
		email				: 'beaverscript(a)landkey(.)net',
		developer_comment	: "In GitHub, the most recent version is put in folder diary/b1\n" + 
							  "Ruby is not required, but helpful for deployment scripts.",
		credits				:[	
								{	"title"		: "jQuery",
									"copyright"	: "Copyright 2011, John Resig"
								},

								{	"title"		: "Sizzle.js",
									"copyright"	: "Copyright 2011, The Dojo Foundation"
								}
							],

		diary			: 	"Diary contains stand-alone versions. Usual landing page is index.htm:\n\n" +


						"   0.1.200     Feb. 24, 2013. \n" +
						"   0.1.199     Feb. 19, 2013. tp.core.each simplified.\n" +
						"                              //tp/in_progress/ removed.\n" +
						"                              Based on jQ self.tpaste = function ... removed.\n" +
						"                              Based on jQ self.tclone replaced.\n" +


						"   0.1.198     Feb. 19, 2013. Fixes to 1.197.\n" +
						"   0.1.197     Feb. 17, 2013. To be a Publishstone.\n" +
						"   0.1.196     Publishstone. IE 10 is basicly runnable, image cosmetic glitch exists.\n" +
						"   0.1.194     Feb 11. Creativity Metrics.\n" +
						"   0.1.192     Feb 3. URL-query has ckey=, mkey=, dkey= ...\n" +
						"   0.1.191     Feb 2. Mode: Canon as Linked List in Solver.\n" +
						"   0.1.190     Jan. 25. Going to jQuery 1.9.0.\n" +
						"   0.1.189     Jan. 23. Gamion on-line editor. Converter to co-position script.\n" +
						"   0.1.181     Jan. 9, 2013. GitHubed. \n" +
						"                             Last version which:\n" +
						"                                has game.json.txt instead of game.jwon.txt \n" +
						"                                not having app.js inside documentation.\n" +
						"   0.1.173     Jan. 5, 2013. Text related to database features removed from readmes. Loss. Find in former versions.\n" +
						"   0.1.170     Dec. 30, 2012. htarget_X added.\n" +
						"   0.1.170     all meta-maps-text info is in jwon, no more \"caption\" format. \n" +
						"   0.1.169nn   after this version, jwon is changed. In about 169qq.\n" +
						"	0.1.167hh	Dec. 12. Collection design concept changed. It is a gamion, self-controlling script, now.\n" +
						"	0.1.165tt	Dec. 2. Solver Browser is better. Still obscure round manager.\n" +
						"	0.1.164		Nov.  27. Refactoring of internal formats began. Not sure will version b1 survie.\n" +
						"	0.1.162		Nov.  23. Map header parser fix. Won-condition corrected by motives-min-number.\n" +
						"	0.1.162		Solver: canon2str added and makes memory resources 3 times effective; browser to top.\n" +
						"	0.1.160		Nov.  6. Commenting style ... //\\\\//: is established as a horizon\n" +
						"	0.1.155		Nov.  4. Nested credits.\n" +
						"	0.1.151		Oct. 31. Added jump-interaction and ghostban, ghostjump. Leap bug fix.\n" +
						"	0.1.148		Oct. 26. salvor: contactless-path-finder-stub added.\n" +
						"                        changed to ''doctype html''.\n" +
						"                        LeapPush and Co-LeapPush do work.\n" +
						"	0.1.147		Oct. 25. added stub to process move to an arbitrary point on map.\n" +
						"	0.1.142		Oct. 20. Copyrights. Interaction bug fix. Readmes macrosed.\n" +
						"	0.1.141		Oct. 17. Readmes and comments\n" +
						"	0.1.139		Oct. 15. fixed: int tp, select-element-control bug of extra bogus item\n" +
						"	0.0.132		is renamed to branch 0.1.132. Branch 0.0.2.XXXX is to be redesigned independently.\n" +
						"	0.0.130		URL-query input standartized\n" +
						"	0.0.127		Saves/loads session to db better\n" +
						"	0.0.125		Loads external collection supplied from URL-query\n" +
						"	0.0.123		Skins and their images moved outside of collections\n" +
						"	0.0.121		CoPullPush added and solves\n" +
						"	0.0.120		PullPush added\n" +
						"	0.0.117		game/collection scrolls changed and cleaned\n" +
						"	0.0.116		gui is protected when map logically invalid\n" +
						"	0.0.115		default_maps_text removed, consoles reshuffled\n" +
						"	0.0.115		bumpytargets game added\n" +
						"	0.0.114		simpler getgs()\n" +
						"	0.0.112		cb map fix, map normalizer fix\n" +
						"	0.0.109		ajaxed login popup added\n" +
						"	0.0.108		deployer script added\n" +
						"	0.0.105		spawned base_game def is in gio.def.games now\n" +
						"	0.0.104		and below: see versions in Diary folder\n"
	});


	core.tooltipify( gio, 'Engine', gio.description );


})();

jQuery('document').ready( jQuery.fn.tp$.gio.session.init.wrap );

