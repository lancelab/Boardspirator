(function( $ ){		var tp		= $.fn.tp$ = $.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var smode	= gio.modes.sta_tic;



					// This file executes immediately upon insertion of it



	// ** refreshes gio.session.server.message object data and its dependants
	gio.session.server.refresh_state = function(reset_gui){

		if( smode.db ){
			// ** gets server message
			ww = gio.session.server;
			core.download_object(	
					smode.db + '/albums?server_message=yes',
					ww, 'message'
			);
			// * enforces no-ad policy
			if(gio.session.server.message.loggedin) gio.config.advertisement.enabled=false;
		}

		if(gio.config.google_apps.reset_ad_visibility) gio.config.google_apps.reset_ad_visibility();
		if(reset_gui){
			gio.core.procs.update_top_links();
			var gm = gio.getgs().gm;
			if(gm) gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		}
	};


	(function(){

		// ** establishes database session if requested
		var ww = core.getQueryPar('db');
		if( ww ){
			if( typeof ww === 'string'){
				smode.db = ww === 'no' ? '' : ww;
			}else{
				smode.db = 
						window.location.protocol+'//'+
						window.location.host;
			}
		}

		// ** begins server interaction
		gio.session.server.refresh_state();

	})();


})(jQuery);


