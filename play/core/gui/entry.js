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
		//			gm.board	... master playboard ... special for each map
		//						set in init_map
		//			gde.chaser	... follows the player position
		//						buttons, compelte-conrol-setup, status?				
		//						moves, status, unit, game
		//			gde.con_div top: dynamic, left: dynamic
		//						gde.con_div_child - console text container


		//For portrait mode, left-side controls are moved below the game board ...






	//=============================================================
	// recommend or leave if insufficient browser declined by user
	//=============================================================
	var leave_if_user_declined_browser=function(){

		var getout=false;
		var version_barrier;
		var message='The '+gio.Description.Title+' was not designed for ';
		var recommendation='FireFox, Chrome, or Internet Explorer 9+ are recommended';
		var recommendation_standard='FireFox, Chrome, CSS standard, or mutually compatible browsers are recommended';
		var question='Continue on your own risk?';

		if($.browser.msie){
			version_barrier=7;
			//c onsole.log($.browser.version,'  ',parseInt($.browser.version,10));
			if(parseInt($.browser.version,10)<=version_barrier){
				message += ' Internet Explorer version '+$.browser.version+".\n"+
							recommendation+".\n"+question;
				getout=!confirm(message);
			} 	//else{
				//	alert(recommendation_standard + ' for ' + gio.Description.Title+'.');
				//}
		}else if(tp.core.browser.Opera){
				alert(recommendation_standard + '. Opera will run with simple laoyout.');
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
		ww=gio.config.links.top_navig;
		w.innerHTML=ww.innerHTML.replace(/#%lstyle%#/g,ww.lstyle);
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
		// Vital for debug:
		w.setAttribute('id', 'dcenter_debug');
		// Hides until "display status" runs to remove startup flicker:
		w.style.display = 'none';




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




		////////////////////////////////////
		//Create common popup:
		////////////////////////////////////
		w=gio.common_popup=tp.core.single_popup_manager(gstyle.popups.help);
		ws=w.popup_el.style;
		ws.paddingLeft='10px';
		ws.fontSize='12px';
		ws.fontFamily='Arial, Helvetica';
		ws.zIndex=gstyle.popups.zIndex;
		ws.overflow='auto';



		////////////////////////////////////
		//Create message popup:
		//==================================
		w=gdw.popups.modal_message_popup=tp.core.single_popup_manager({owner:'modal'});
		tp.core.rpaste(w.popup_el.style,gstyle.messages);
		////////////////////////////////////




		////////////////////////////////////
		//Create input text popup:
		//==================================
		w=gdw.popups.input_text_popup=tp.core.single_popup_manager({
					owner:'input_text',
					width:500,
					height:300,
					backgroundColor:'#558855',
					innerHTML:	"<textarea style=\"position:relative; left:15px; top:50px; "+
								" width:465px; height:210px;\">::Input or Copy-Paste Map or Collection of Maps here\n</textarea>"
		});
		//TODm: style. tp.core.rpaste(w.popup_el.style,gstyle.messages);

		// For debug only:		
		// w.popup_el.setAttribute('id','input_text_popup');

		tp.gui.cornerize(gstyle.playboard.corners,w.popup_el);

		// It is vital to set zIndex after cornerize(), because apparently
		// AppleWebkit breaks zIndex:
		w.popup_el.style.zIndex='3000000';
		//gio.debstore += "\nAfter conrners2 " + w.popup_el.id + ' ' + w.popup_el.style.zIndex;

			/*
				//These stubs can be used also:
				//w=tp.core.matchChild(/Input Map/i,w.popup_el); //w=text area now
				$(ww).after(gdw.wraps.links_to_external_collections['wrapper']);
				tp.gui.cornerize(gstyle.playboard.corners,ww);
			*/

		gdw.wraps.links_to_external_collections=tp.form.create_select_el({c:{
				gui:{	wmax:310,
						ddbox_backgroudColor:'#DDDDDD',
						style:{wrapper:{display:'none', top:'15px', left:'15px'}}}}
		});
		

		w=gdw.popups.input_text_popup;
		w.popup_el.appendChild(gdw.wraps.links_to_external_collections['wrapper']);		


		var constyle=gstyle.controls;
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : 'Close',
								tooltip : 'Close or cancel your edit'
							}],
				callback :	gio.map_editors.hide_text_editor
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'15px', left:'430px',
												fontFamily	: constyle.fontFamily
											},
								display:	{	fontSize	: constyle.fontSize+'px',
												fontStyle	: constyle.fontStyle,
												fontWeight	: constyle.buttonsFontWeight,
												color		: constyle.color
											}

						}
					}
			}
		};

		gio.map_editors.text_editor_closing_button=tp.form.create_select_el(button_arg);
		button_arg.r=
			{	parent :	w.popup_el,
				options :	[{	title : 'Done',
								tooltip : 'Load your work and close editor'
							}],
				callback :	gio.map_editors.load_from_text_editor
			},
		button_arg.c.gui.style.wrapper.left='360px';
		gio.map_editors.text_editor_done_button=tp.form.create_select_el(button_arg);
		//==================================
		//Create input text popup:
		////////////////////////////////////




		if(!gdw.wraps.blinker)gdw.wraps.blinker=tp.core.blinker();




		////////////////////////////////////////////////////////////////  
		// Makes all-purpose consoles:
		// Composed out of 3 divs: parent and 2 childs.
		//			Parent - hides text which is not fit the space.
		//			Child 1 serves in gio.cons() as text output.
		//			Child 2 is console for debug.
		//			Parent - is referred as wrapper for flexible layout.
		////////////////////////////////////////////////////////////////  
		(function()
		{ 

			var STATUS_LINE_HEIGHT=gstyle.controls.STATUS_LINE_HEIGHT;
			var PADDING=gstyle.controls.PADDING;
			var PADDING_HORIZONTAL=gstyle.controls.PADDING_HORIZONTAL;

			var w,ws;


			// ======================================
			// Parent: console-text-div-wrapper
			// --------------------------------------
				w=gde.con_div=document.createElement('div');
				w.style.position='absolute';
				ws=w.style;

				if( !gio.debug ) ws.height=gstyle.console.height;
				ws.overflow=gstyle.console.overflow;
				if( gio.debug ) ws.overflow = "visible";
				ws.backgroundColor=gstyle.console.backgroundColor;

				ws.color=gstyle.controls.color;
				ws.zIndex=gstyle.controls.zIndex;			
				ws.visibility='visible';
				dcenter.appendChild(w);
			// --------------------------------------
			// Parent: text-div-wrapper
			// ======================================



			// ======================================
			// Child: console-text-div
			// --------------------------------------
				var console_display=document.createElement('div');
				gde.con_div.appendChild(console_display);
				gde.con_div_child=console_display;

				ws=console_display.style;

				// Poor: makes too big gap below board:
				// ws.bottom='0px';

				ws.paddingLeft='10px';
				ws.paddingRight='10px';
				ws.color=gstyle.controls.color;
				ws.visibility='visible';
			// --------------------------------------
			// Child: console-text-div
			// ======================================


			// ======================================
			// Console for Debug
			// --------------------------------------
				w=document.createElement('div');
				//w.style.position='absolute';
				ws=w.style;
				ws.backgroundColor=gstyle.console.backgroundColor;

				ws.color=gstyle.controls.color;
				ws.zIndex=gstyle.controls.zIndex;			

				// This attribute is set for output of tp$.deb only:
				w.setAttribute('id','tpdebug');

				gde.con_div.appendChild(w);
			// --------------------------------------
			// Console for Debug
			// ======================================





		})();// Makes all-purpose console

		return true;
	};


})(jQuery);
