
( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var conf	=  gio.config;
					var	srv_msg	=  gio.session.server.message;
				

	// //\\//		CONFIGURATIONI SPAWNER
	//				This file must be loaded before other game javascript files and
	//				after config_XXXX.js files
	//				Don't put configuration data below this line.


	//:				gets parameters from URL query string:
	var query 	=	conf.query = core.clone_many( conf.query, core.getQueryKeyPairs('integerify') );
	gio.debug	=	gio.debug || query.debug;

	//: 			shortcuts for conditional debug messages
	gio.debly	=	function ( message ) { if( gio.debug) gio.cons_add( message ); };
	gio.debtp	=	function ()			 { if( gio.debug) window.tp$.deb.apply( this, arguments ); };
	gio.debsol	=	function ( message ) { if( gio.debug) gio.solver_cons_add( message ); };		
	gio.debtp( query );


	///	Digests server_message if any.
	if( window.tp$ && window.tp$.server_message )
	{
		var ww = tp$.server_message;
		srv_msg.form_authenticity_token = ww.form_authenticity_token;
	}




	// //\\ Detects community ////////////////////////////////////////////

	var ww = 'My effective_hostname=' + core.effective_hostname;
	gio.debtp( ww );
	var env = conf.env;
	env.name = conf.comlookup [ core.effective_hostname ] || 'prod';
	ww_env = env[ env.name ];
	gio.debtp( 'ww_env = ', ww_env );

	/// Normalizes configuration
	core.each( ww_env, function ( kk, vv )
	{
		vv.p_h_p = core.build_p_h_p( vv.prot, vv.host, vv.port );
		vv.name = kk;
	});

	//: Makes env.com, to which community this site belongs.
	//	Initially it is "my_pc", no belonging to any community, perhap running from HD.
	env.com =
	{
		name	: 'com_my_pc',
		prot	: core.effective_protocol,
		host	: core.effective_hostname,
		port	: core.effective_port,
		p_h_p	: core.effective_p_h_p
	};	

	var ww_prv = ww_env.comprv;
	srv_msg.login_url	= ww_prv.p_h_p + '/login';
	srv_msg.logout_url	= ww_prv.p_h_p + '/logout';

	/// First, we check are we community private site.
	var ww = ww_prv; 
	if( core.do_match_prot_host_port( ww_prv.p_h_p, null, null, null, 'strip www' ) )
	{
		env.com = ww;
		conf.google_apps.enabled = false;

	/// We are not community private. Find out who we are.
	}else{

		core.each( ww_env, function ( kk, vv )
		{
			if( core.do_match_prot_host_port( vv.p_h_p, null, null, null, 'strip www' ) )
			{
				gio.debtp( 'matched: ' + vv.p_h_p + ' name=' + vv.name);
				env.com = vv;
				return false;
			}
		});
	}



	// //\\ Sugar ///
	env.com.env = env.name;
	if( env.com.name === 'comworld' )
	{
		env.com.compub = ww_env['compub'].p_h_p;
		srv_msg.dburl = env.com.compub;
		env.com.dburl = env.com.compub;
	}else{
		srv_msg.dburl = env.com.p_h_p;
		env.com.dburl = env.com.p_h_p;
	}

	// \\// Sugar ///
	if( env.com.name === 'com_my_pc' )
	{
		var ww = 'No community belonging detected. Perhaps own pc-hard-drive community.';
		env.com.dburl = '';
		gio.debtp( ww );
	}
	gio.debtp( 'Own community = ', env.com );

	// \\// Detects community ////////////////////////////////////////////







	gio.solver.config.NODES_LIMIT	= query.slim || gio.solver.config.NODES_LIMIT; 

	(function () { // //\\ SPAWNS GOOGLE CONFIGURATION

		var gapps = conf.google_apps;

		//. removes google from site if URL-query requested this
		if(query.nogoogle) gapps.enabled = false;


		// //\\ removes traces of google apps for preset paths or hosts
		var ww = window.location.pathname.toLowerCase();
		ceach( gapps.forbidden_dirs, function( dummy, dir ) { 
			if(	ww.indexOf( dir ) > -1 ) gapps.enabled = false;
		});
		var ww = window.location.hostname.toLowerCase();
		ceach( gapps.forbidden_host_names, function( dummy, host_name ) { 
			if(	ww.indexOf( host_name ) > -1 ) gapps.enabled = false;
		});
		// \\// removes traces of google apps for preset paths or hosts


		gapps.host = gapps.hosts[window.location.hostname.toLowerCase()] || gapps.hosts['landkey.net'];
		core.paste_non_arrays(gapps.ad, gapps.host.ad);

		// //\\ ENABLES ADVERTISEMENT
		var ad = conf.advertisement;
		var forbidden = true;
	
		if(ad.enabled && gapps.enabled ){
			//.	disable ad for external albums or collections
			if(!query.curl && !query.aurl) {
				ceach(ad.permittedBrowsers, function(key,name){
					if(core.browser[name]) forbidden = false
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
	core.each( ww, function(k,v) {
		www[k] = '>' + v + '</a> ';
	});
	gio.session.server.top_menu_titles = www;
	// \\//	PREPARES COSMETICS




	/// checks feeder presence
	var feeder = conf.feeder;
	if(feeder.url){
			var ww = core.path_from_page_to_app_root;
			if(ww && !feeder.url.match('http://') ){
				feeder.url = ww + '/' + feeder.url;
			}
			var ww = core.download_object( 
				feeder.url + "/" + feeder.external_maps + "&does_feeder_exist=yes",
				null, null, null, null,
				2000
			);
			if(typeof ww === 'object' && ww !== null && ww.feeder === "exists") feeder.exists = true;;
	}
	if( !feeder.exists ) gio.debtp( "No feeder exists at URL = " + feeder.url );


	if( !JSON || !JSON.parse || !JSON.stringify ) {
		var mess = 'No JSON features detected. Appliction halted.';
		gio.session.state.halted = mess;
		alert( mess );
		return;
	}


})();

