(function(){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio		=  tp.gio    =  tp.gio   || {};
				var ads		=  gio.config.advertisement;
				var ggaps	=  gio.config.google_apps;


	// During inclusion, this file immediately fires google analytics if enabled.



	// ///////  PREPARES CUSTOM VARIABLE TRACERS ///////////////////////////////

	ggaps.track = {};

	///	tracks custom variable
	ggaps.track.variable = function( variable, value ) {

			if(!ggaps.enabled) return;

			if(gio.debug) gio.cons_add("Sending to GA: " + variable + "=" + value);

			_gaq.push(['_setCustomVar',
		      	1,					// To occupy slot 1? Required.
		      	''+variable,		// User activity.  Required.
		      	''+value,			// Value. Required.
		      	2					// Session level scope. Optional.
			]);

			_gaq.push(['_trackEvent',
				'Navigation',		// Category
				''+variable,		// Action
			]);
	};		


	///	tracks events variable
	//	_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
	//	https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
	ggaps.track.play_event = function( category, action, value ) {

			if(!ggaps.enabled) return;

			if(gio.debug) gio.cons_add("Sending event to GA: " + category + ',' + action + ',' + value);

			var arg = ['_trackEvent', category, action];
			if(value) arg[4] = value;
			arg[5] = true; // skip bounce count
			_gaq.push(arg);
	};		


	// category, action, opt_label, opt_value, opt_noninteraction





	// ///\\\  SCRIPTS SUPPLIED FROM GOOGLE //////////////////////
	//	Note:	false ads.enabled and ggaps.enabled
	//			do wipe out traces of these scripts from web-page

	/// runs script usually supplied from google analytics
	ggaps.init_analytics = function(){

		// *	removes analytics from site if !ggaps.enabled
		if(!ggaps.enabled) return;
    
	    var _gaq = window._gaq = window._gaq || [];
	    _gaq.push([    '_setAccount',   ggaps.host['_setAccount'] ]);
	    _gaq.push(['_trackPageview']);

	    (function() {
			var ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' == document.location.protocol ?
								'https://ssl' : 
								'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(ga, s);
	    })();


	};


	
	//.	TODm improve performance.
	//	Think about delaying this call until framework is 
	//	initialized after page load
	//
	//.	fires alanlytics
	ggaps.init_analytics();

	ggaps.insert_ad_div_with_script = function(){
			if(!ads.enabled) return;
			var ad_script = "" +
				"<div id=\"google_ad_receiver\">" +
				"	<script type=\"text/javascript\">" +
				"		(function(){ " +
		 		"			var ww = jQuery.fn.tp$.gio.config.google_apps.ad;" +
		        "    		 window.google_ad_client	= ww.google_ad_client;" +
		        "    		 window.google_ad_slot		= ww.google_ad_slot;" +
		        "    		 window.google_ad_width		= ww.google_ad_width;" +
		        "    		 window.google_ad_height	= ww.google_ad_height;" +
				"		})(); " +
				"	<" + "/script>" +
				"	<script	type=\"text/javascript\" " +
				"			src=\"http://pagead2.googlesyndication.com/pagead/show_ads.js\" >" +
				"	<"+"/script>" +
				"</div>";
			document.write(ad_script);
	};
	// \\\///  SCRIPTS SUPPLIED FROM GOOGLE //////////////////




	ggaps.reset_ad_visibility = function()
	{
		if( !ads.divs.wrap ) return;
		//. this is the place where ad (if any) becomes visible or not:
		ads.divs.wrap.style.display	= ads.enabled ? 'block' : 'none';

		/*
		// ** cannot make this happen:
		var this_function_fails = true;
		if(this_function_fails) return;

		// * this script usually is supplied from google ad sense
		if(!ads.streaming_started){
			ads.streaming_started = true;
			var ww = ggaps['landkey.net'];
			window.google_ad_client	= ww.google_ad_client;
			window.google_ad_slot	= ww.google_ad_slot;
			window.google_ad_width	= ww.google_ad_width;
			window.google_ad_height	= ww.google_ad_height;
			var script				= document.createElement('script');
            script.setAttribute('type', 'text/javascript');
			script.src				= "http://pagead2.googlesyndication.com/pagead/show_ads.js";
            //script.setAttribute('async', 'false');
			ads.divs.receiver.appendChild(script);
		}
		*/
	};



	/// as of this version, is used in ./core/gui/entry.js in section: "Create region divs"
	ggaps.create_ad_divs = function()
	{
		if(!ads.enabled) return;

		var style = ads.style_and_settings.ad_wrapp;

		// * makes wrapper
		var wrap			= ads.divs.wrap = document.createElement('div');
		wrap.id				= 'ad_wrapp_debug';
		wrap.style.position	= 'absolute';
		var ww				= wrap.style;
		ww.top				= style.top + 'px';
		ww.width			= style.width + 'px';
		ww.height			= style.height + 'px';
		ww.backgroundColor	= style.backgroundColor;
		ww.color			= style.color;
		ww.overflow			= style.overflow;
		ww.display			= 'none';
		gio.domwrap.regions.dcenter.appendChild(wrap);



		// * makes subwrap div
		var style				= ads.style_and_settings.ad_subwrap;
		var subwrap				= document.createElement('div');
		subwrap.style.position	= style.position;
		subwrap.id				= 'ad_subwrap_debug';
		var ww					= subwrap.style;
		ww.position				= style.position;
		ww.top					= style.top + 'px';
		ww.left					= style.left + 'px'
		ww.width				= style.width + 'px'
		ww.height				= style.height + 'px'
		ww.paddingTop			= style.paddingTop + 'px';
		ww.fontSize				= style.fontSize;
		ww.fontWeight			= style.fontWeight;
		ww.fontFamily			= style.fontFamily;
		ww.backgroundColor		= style.backgroundColor;
		ww.color				= style.color;
		ww.textAlign			= style.textAlign;
		subwrap.innerHTML		= style.warning;
		wrap.appendChild(subwrap);
			

		// ** establishes ad_receiver_div
		var receiver = ads.divs.receiver = document.getElementById('google_ad_receiver');

		// ** this fails
		// var receiver			= ads.divs.receiver = document.createElement('div');
		// receiver.id			= 'ad_receiver_debug';

		var style				= ads.style_and_settings.ad_receiver;
		receiver.style.position	= style.position;
		var ww					= receiver.style;
		ww.position				= style.position;
		ww.top					= style.top + 'px';
		ww.left					= style.left + 'px';
		ww.paddingTop			= style.paddingTop + 'px';
		ww.paddingLeft			= style.paddingLeft + 'px';
		ww.paddingRight			= style.paddingRight + 'px';
		ww.paddingBottom		= style.paddingBottom + 'px';



		subwrap.appendChild(receiver);
	};//create_ad_divs



})();


