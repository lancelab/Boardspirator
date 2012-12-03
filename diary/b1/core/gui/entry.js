(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdw		=  gio.domwrap;
					var gde		=  gio.domwrap.elems;
					var gdr		=  gio.domwrap.regions;


		// This is a master page regions allocator.
		// Regions: topleft, center, ...


		//
		//gdr.droot
		//	root_relativizer
		//		gdr.dtopleft
		//		gdr.dtopcenter
		//			top navigation links
		//		gdr.dsubtop
		//			game captions
		//		gdr.dcenter
		//			gm.board				master playboard ... special for each map
		//									set in init_map
		//			gde.chaser				follows the player position
		//									buttons, compelte-conrol-setup, status?				
		//									moves, status, unit, game
		//			gde.advertisement		on the right of board ... depends on loaded map
		//			gde.con_div				top: dynamic, left: dynamic
		//				gde.con_div_child	console text container

		//For portrait mode, left-side controls are moved below the game board ...






	/// Warns and gets user's agreement to run app on specific browser
	var leave_if_user_declined_browser=function(){

		var getout=false;

		if( $.browser.msie ) {

			/*
			if(parseInt($.browser.version,9)<=version_barrier){
				var message +=	' Internet Explorer version '+$.browser.version+".\n"+
								recommendation+".\n"+question;
				getout=!confirm(message);
			} else {
			*/

			var message =	"Sorry, we have no extra time or software resources\n" +
							"to develop for Internet Explorer or Windows 8.\n" +
							"We cannot guarantee " + gio.description.title + " will run in this browser.\n" +
							"Fire Fox, Chrome, or WebKit browsers are recommended\n" +
							"Would you like to continue on your own risk?";
			getout=!confirm( message );


		}else if(tp.core.browser.Opera){
				//alert( recommendation_standard + '. Opera will run with simple laoyout.');
				alert(	gio.description.title + ' was not tested and not developed in Opera.\n' + 
						"Fire Fox, Chrome, or WebKit browsers are recommended\n"
				);
		}
		return getout;
	};








	////////////////////////////////////
	// Create region divs
	////////////////////////////////////
	gio.gui.init.entry=function(){

		var w, ww;




		// ** Remove missed-JS html-coded-waring which pollutes the body:
		var to_remove=tp.core.matchChild(/^\s*Game/i,document.body);
		if(to_remove){
			// Fails in Safary and ?Android:
			// document.body.removeChild(to_remove);
			to_remove.style.display='none';
		}
		if(leave_if_user_declined_browser())return false;





		// ** droot
		var droot = gdr.droot=document.createElement('div');
		droot.style.margin = 'auto';
		document.body.style.backgroundColor = gstyle.rootColor;
		document.body.appendChild(droot);
		// Vital for debug:
		droot.setAttribute('id', 'droot_debug');




		// ** relativizer
		root_relativizer = document.createElement('div');
		root_relativizer.style.position = 'relative';
		droot.appendChild(root_relativizer);
		// Vital for debug:
		root_relativizer.setAttribute('id', 'root_relativizer_debug');





		// ** dtopleft
		w=gdr.dtopleft=document.createElement('div');
		w.style.position='absolute';
		w.style.zIndex = gstyle.captions.zIndex;
		var ws=w.style;
		ws.top='0px';
		root_relativizer.appendChild(w);
		// Vital for debug:
		w.setAttribute('id', 'dtopleft_debug');



		// ** dtopcenter
		w=gdr.dtopcenter=document.createElement('div');
		w.style.position='absolute';
		ws=w.style;
		ws.zIndex = gstyle.captions.zIndex+1;
		ws.left=gstyle.top_navig.left+'px';
		ws.top=gstyle.top_navig.top+'px';
		ws.height=gstyle.top_navig.height+'px';
		root_relativizer.appendChild(w);
		//ww=gio.config.links.top_navig;
		//w.innerHTML=ww.innerHTML.replace(/#%lstyle%#/g,ww.lstyle);
		// Vital for debug:
		w.setAttribute('id', 'dtopcenter_debug');




		// ** dsubtop
		w=gdr.dsubtop=document.createElement('div');
		w.style.position='absolute';
		ws=w.style;
		ws.zIndex = gstyle.captions.zIndex;
		ws.top=gstyle.top_navig.height+'px';
		ws.height=gstyle.captions.height+'px';
		root_relativizer.appendChild(w);
		// Vital for debug:
		w.setAttribute('id', 'dsubtop_debug');



		// ** dcenter
		var dcenter = w = gdr.dcenter=document.createElement('div');
		w.style.position = 'absolute';
		w.style.zIndex = gstyle.playboard.zIndex;
		w.style.top = gstyle.captions.height+gstyle.top_navig.height+'px';
		w.style.left = 0+'px';
		root_relativizer.appendChild(w);
		// * vital for debug
		w.setAttribute('id', 'dcenter_debug');
		// * sets visible ... needed for startup consoles
		w.style.display = 'block';




		// ** chaser
		w=gde.chaser=document.createElement('div');
		w.style.position = 'absolute';
		w.style.left = '0px';
		w.style.zIndex = gstyle.controls.zIndex;
		w.style.backgroundColor=gstyle.controls.backgroundColor;
		w.style.color=gstyle.controls.color;
		dcenter.appendChild(w);
		// Vital for debug:
		w.setAttribute('id', 'chaser_debug');


		// ** advertisement
		gio.config.google_apps.create_ad_divs();


		gio.core.procs.update_top_links();

		if(!gdw.wraps.blinker)gdw.wraps.blinker=tp.core.blinker();

		gio.gui.init.popups();
		gio.gui.init.create_consoles();

		return true;
	};


})(jQuery);
