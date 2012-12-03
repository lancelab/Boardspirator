(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;

					// This file must be loaded before other game javascript files:

					gio.config		= { 
										links : {},
										style : null,

										/// overridden from URL-query
										query : {
													//luck.... : false,				// logins softly
													slim : false,			// allows to manually set a limit 
													curl : '',
													aurl : '',						// loads ablums from Internet
													asingle : false,			// exclude default albums if albums is set
													akey : '',
													collection_ix : false,
													map_ix : false
										}	

									};
					gio.def			= { base_game : {},
										games : {}, albums : {}, 
										dresses : null,
										inherited_games : {}, dressed_albums : {},
										colorban_map_decoder : null,
										procs : {},
										personal_craft_akey : 'my_album'  };

					gio.playalbs 	= [];
					gio.playzone	= { albums : {} }; // Alternative album indices in form of strings

					gio.modes		= {	
										//.	TODF no static and dynamic ... everythig is dynamic
										//	perhas externably accessible and not.
										sta_tic : { db : null },
										dynamic : { verbose : true },
										app_loaded : false
									};

					// blocks : {}, probably will be a good name:
					gio.gui			= { procs : {}, 	modes : {},  init : {}, create : {} };
					gio.data_io		= { core : { load : {}, save : {} }, session : { load : {}, save : {} } };
					gio.session		= { procs : {},  reinit : {}, server : {}, init : {} };
					gio.core		= { procs : {}, reflection : {} };
					gio.controls	= {}; //TODm remove
					gio.navig		= { in_session : { round : {} }, in_map : {}}; // TODm map must be in gio.gui
					gio.map_editors	= {};
					gio.solver		= {};
					gio.domwrap		= {	regions : {}, popups : {}, elems : {}, wraps : {},
										headers : {}, status : {},
										cpanel : { controls : {} } 
									  };
					gio.info		= {	help : {},
										log : {
												//move : '' // don't do this; set in code.
									}};


	// Procedures layout:
	gio.cons = null;
	gio.cons_add = null;


	// Vital debug: will be unlocked by debug in URL-query:
	// gio.debug = true;




	/// Server part. Overriden by server if any
	gio.session.server.message = {	'form_authenticity_token'	: '',
									'craft_zone_url'			: 'https://boardspirator.herokuapp.com/auxiliary/howto.htm',
									'howto'						: 'doc/guest_readme.htm',
									'terms'						: 'user_terms.htm', // in feeder folder
									'login_url'					: 'https://boardspirator.herokuapp.com/login',
									'logout_url'				: 'https://boardspirator.herokuapp.com/logout',
									'loggedin'					: false,
									homehost					: 'landkey.net',
									homepath					: 'gio/gio/play',
									hide_db_site_links			: true
								};

	gio.session.server.top_menu_titles = {	
											'craft_zone_url'			: 'Craft',
											'howto'						: 'How',
											'terms'						: 'Terms',
											'login_url'					: 'Login',
											'logout_url'				: 'Logout',
											'dev'						: 'Dev',
											'more'						: 'More',
											'credits'					: 'Credits',
											'home'						: 'Boardy'
										};



	//: sets marketing links
	gio.config.links.dev_zone			='http://landkey.net/gio/';
	gio.config.links.more_zone			='http://landkey.net/games_of_choice/';
	gio.config.links.credits			='doc/credits.htm';
	gio.config.links.service_host		='http://landkey.net';


	gio.config.feeder					= { exists : false };
	gio.config.feeder.url				='feeder'; // in respect to app. root or full url
	gio.config.feeder.external_maps		='requested_map.php?user_requested_link=mm';
	gio.config.feeder.external_albums	='requested_albums.php?aurl=';


	gio.config.defpaths	=	{	GAMES_DEF_PATH : 'def',
								ALBUMS_DEF_PATH : 'def/albums',
								COLLECTIONS_DEF_PATH : 'def/collections',
								SKINS_DEF_PATH : 'def/skins'
							}


	// * controls are locked temporarily during map parsing or other tasks:
	gio.modes.dynamic.controls_locked = false;


	gio.info.help.hint = 'h or ?';
	gio.info.help.main =
		"Keyboard Control:\n\n"+

		"h,?                       help\n"+
		"r                         rules\n"+
		"o                         objective\n"+
		"esc                       close popups, map editor, autoplay\n"+
		"arrows,j,k,i,m            move a unit\n"+
		"backspace,b,ctrl+space    move back\n"+
		"space, ctrl+shitf+arrows  toggle breeds or colonies\n"+
		"u, ctrl+arrows            toggle units\n"+
		"a/c/M                     albums/collections/maps\n"+
		"t                         rounds\n"+
		"n                         new round\n"+
		"f                         forward replay\n"+
		"s                         return to start\n"+
		"z                         autoplay round lazily\n"+
		"e                         edit/create/show/import map\n"+
		"p                         playpath ... edit/create/show/import\n"+
		"ctrl+d                    done ... do load from map editor\n"+
		"S                         story\n"+
		"C                         credits\n"+
		"A                         about map\n";





	gio.solver.config = {
								CANON_IS_STRING	: true,		//true, false
								TIME_TO_WAIT_MS : 500,
								TIME_TO_WORK_MS : 500,
								// Memory limit:
								NODES_LIMIT : 300000,

								//: possibly helps to garbage collector
								//. increased time to wait for gc:
								CRITICAL_WAIT_TIME : 1000,	//ms
								//. threshold to increase for sphere volume
								CRITICAL_VOLUME : 300000,	//canons


								//. abandoned
								//PREBUILT_ARRAYS_LIMIT : 32 //10000

								help : 
									"Keyboard Control:\n\n"+

									"h,?                       help\n"+
									"esc                       close popups\n"+
									"left arrow                down inside a sphere\n"+
									"right arrow               up inside a sphere\n"+
									"up                        next upper sphere\n"+
									"down                      next lower sphere\n"+
									"Shift + up arrow          to highest point\n"+
									"Shift + down arrow        to lowest point\n"
								
						};




	// //\\ GOOGLE APPS

	gio.config.google_apps =
	{
			enabled			: false,	// *DONT-REMOVE-THIS-DEPLOYER-MACRO*gio.config.google_apps*
										// "false" disables an entire google suite
			//host			: ....,		// dynamically chosen by hostname

			forbidden_dir	: "/a1/",	// if this token is met in location.pathname, then
										// google traces do removed from site

			ad		: 					// overriden by host if any
			{ 
						google_ad_client	: "pub-3835495802867304",
						/* LandkeyNet 300x250, created 9/18/10 */
						google_ad_slot		: "9886381946",
						google_ad_width		: 300,
						google_ad_height	: 250
			},


			hosts			:
			{
				'landkey.net'	:
				{ 
						'_setAccount'		: 'UA-26834667-1',
				},

				'landkey.org'	:
				{ 
						'_setAccount'		: 'UA-26834667-3',
						ad					:
						{
							google_ad_client	: "pub-3835495802867304",
							/* LandkeyNet 300x250, created 9/18/10 */
							google_ad_slot		: "9886381946",
							google_ad_width		: 300,
							google_ad_height	: 250
						}
				},

				//http:
				'boardspirator.herokuapp.com'	:
				{
						'_setAccount'		: 'UA-26834667-4',
				},

				//http:
				'boardspirator.com'	:
				{
						'_setAccount'		: 'UA-26834667-5',
				}
			}//hostnames

	};


	gio.config.advertisement =
	{			enabled				: true,		// updates dynamically
				streaming_started	: false,	// updates dynamically

				divs				:
				{ 
						wrap : null, 	// updates dynamically
						subwrap : null,	// updates dynamically
						receiver : null	// updates dynamically
				},


				distanceFromGame	: 60,
				permittedBrowsers	: [ 'FireFox', 'Chrome' ], //TODM find out why IE fails?, does Opera work?



				style_and_settings	:
				{
					ad_wrapp			:
					{
						top				: 0,
						width			: 200,
						height			: 100,
						backgroundColor	: '#555555',
						color			: '#EEEEEE',
						overflow		: 'visible'
					},
					ad_subwrap			: 
					{	  
						position		: 'absolute',
						top				: 0,
						left			: 0,
						width			: 300,
						height			: 25,
						paddingTop		: 5,
						fontSize		: 13,
						fontWeight		: 'bold',
						fontFamily		: 'arial, helvetica',
						backgroundColor	: '#CCCCCC',
						color			: '#FFFFFF',
						textAlign		: 'center',
				        warning			: 'Google ad. Not a part of this page:'
					},
				    ad_receiver			:
					{
						id				: 'ad_receiver',
						position		: 'absolute',
						left			: 0,
						top				: 25,
						paddingLeft		: 0,
						paddingRight	: 0,
						paddingTop  	: 0,
						paddingBottom	: 0
					}
				}//style_and_settings
	};//gio.config.advertisement

	// \\// GOOGLE APPS






	// //\\//		CONFIGURATIONI SPAWNER 							/////////////
	// ///////////	Don't put configuration data below this line.	/////////////



	//: gets parameters from URL query string:
	var query 	= gio.config.query = tp.core.clone_many( gio.config.query, tp.core.getQueryKeyPairs('integerify') );
	gio.debug	= gio.debug || query.debug;
	gio.solver.config.NODES_LIMIT	= query.slim || gio.solver.config.NODES_LIMIT; 

	(function () { // //\\ SPAWNS GOOGLE CONFIGURATION

		var gapps = gio.config.google_apps;

		//. removes google from site if URL-query requested this
		if(query.nogoogle) gapps.enabled = false;

		/// removes traces of google apps for given subpathname
		var ww = window.location.pathname.toLowerCase();
		if(	ww.indexOf( gapps.forbidden_dir ) > -1 ) {
			gapps.enabled = false;
		}

		gapps.host = gapps.hosts[window.location.hostname.toLowerCase()] || gapps.hosts['landkey.net'];
		tp.core.paste_non_arrays(gapps.ad, gapps.host.ad);

		// //\\ ENABLES ADVERTISEMENT
		var ad = gio.config.advertisement;
		var forbidden = true;
	
		if(ad.enabled && gapps.enabled ){
			//.	disable ad for external albums or collections
			if(!query.curl && !query.aurl) {
				ceach(ad.permittedBrowsers, function(key,name){
					if(tp.core.browser[name]) forbidden = false
				});
			}
		}
		ad.enabled = !forbidden;
		// \\// ENABLES ADVERTISEMENT


	})(); // \\// SPAWNS GOOGLE CONFIGURATION




	// //\\	PREPARES COSMETICS
	///		Prepares top menu stubs
	var ww = gio.session.server.top_menu_titles;
	var www = {};
	tp.core.each( ww, function(k,v) {
		www[k] = '>' + v + '</a> ';
	});
	gio.session.server.top_menu_titles = www;
	// \\//	PREPARES COSMETICS




	/// checks feeder presence
	var feeder = gio.config.feeder;
	if(feeder.url){
			var ww = tp.core.path_from_page_to_app_root;
			if(ww && !feeder.url.match('http://') ){
				feeder.url = ww + '/' + feeder.url;
			}
			var ww = tp.core.load_object_synchronously( 
				feeder.url + "/" + feeder.external_maps + "&does_feeder_exist=yes",
				2000
			);
			if(typeof ww === 'object' && ww !== null && ww.feeder === "exists") feeder.exists = true;;
	}
	// TODM add message if(!feeder.exists) gio.cons_add("No feeder exists at URL = " + feeder.url);


})(jQuery);

