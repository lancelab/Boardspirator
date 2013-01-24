(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;


	// //\\//		CONFIGURATIONI SPAWNER
	//				This file must be loaded before other game javascript files and
	//				after config_XXXX.js files
	//				Don't put configuration data below this line.


	//:				gets parameters from URL query string:
	var query 	=	gio.config.query = tp.core.clone_many( gio.config.query, tp.core.getQueryKeyPairs('integerify') );
	gio.debug	=	gio.debug || query.debug;

	//: 			shortcuts for conditional debug messages
	gio.debly	=	function ( message ) { if( gio.debug) gio.cons_add( message ); };
	gio.debtp	=	function ( message ) { if( gio.debug) window.tp$.deb( message ); };
	gio.debsol	=	function ( message ) { if( gio.debug) gio.solver_cons_add( message ); };		
	gio.debtp( query );


	gio.solver.config.NODES_LIMIT	= query.slim || gio.solver.config.NODES_LIMIT; 

	(function () { // //\\ SPAWNS GOOGLE CONFIGURATION

		var gapps = gio.config.google_apps;

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
			var ww = tp.core.download_object( 
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

