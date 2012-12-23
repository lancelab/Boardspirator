(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdw		=  gio.domwrap;
					var gdr		=  gio.domwrap.regions;
					var med		=  gio.map_editors;




	gio.gui.init.popups=function(){


		var dcenter = gdr.dcenter;




		// //\\ creates common popup

		var ww = gio.common_popup = tp.core.single_popup_manager( gstyle.popups.help );
			ws = ww.popup_el.style;
			ws.paddingLeft='15px';
			ws.fontSize='12px';
			ws.fontFamily='Arial, Helvetica';
			ws.zIndex=gstyle.popups.zIndex;
			ws.overflow='auto';

		tp.gui.cornerize(gstyle.playboard.corners, ww.popup_el);
		tp.gui.gradientizeOnce(gstyle.popups.help.backgroundColor,0.2,'top',ww.popup_el);

		gio.domwrap.popups.hide_common = function(dont_unlock){
			gio.common_popup.popup_el.style.visibility = 'hidden'; 

			/*
			//gio.common_popup.hide();
			gio.domwrap.popups.help_close_button.hide();
			//TOD?? or
			gio.domwrap.popups.help_close_button.wrapper.style.display='none'
			if(!dont_unlock)gio.gui.procs.unlock_controls();
			*/
		};



		/*
		// /\ Abandoned button addition.
		//		The solution should be to add middle-div between parent and the button.

		gio.domwrap.popups.show_common = function() {
			gio.common_popup.popup_el.style.visibility = 'visible';
			gio.domwrap.popups.help_close_button.reset({c:{gui:{style:{wrapper:{display:'block'}}}}});
			//gio.common_popup.show();
		};


		var ww = gio.domwrap.popups.common_div = document.createElement('div');
			ww.style.position = 'absolute';
			ws = ww.popup_el.style;
			ws.top = '0px';
			ws.left = '0px';
			ws.paddingLeft='10px';
			ws.fontSize='12px';
			ws.fontFamily='Arial, Helvetica';
			ws.zIndex=gstyle.popups.zIndex;
			ws.overflow='auto';

			ws.width = gstyle.popups.help.width + 'px';
			ws.height = gstyle.popups.help.height;
			ws.backgroundColor = gstyle.popups.help.backgroundColor;
			ws.color = gstyle.popups.help.color;
			gdw.popups.modal_message_popup.popup_el.appendChild(ww);

		
		var constyle=gstyle.controls;
		var button_arg={
			r:{	parent :	gdw.popups.modal_message_popup.popup_el,
				options :	[{	title : 'Close',
								tooltip : 'Close the window'
							}],
				callback :	function () {
					gio.domwrap.popups.hide_common();
				}
				//gio.map_editors.hide_text_editor
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'-120px', left : '230px',
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
		gio.domwrap.popups.help_close_button = tp.form.create_select_el(button_arg);
		// \/ Abandoned button addition.

		*/

		// \\// creates common popup
		



		//: creates message popup:
		var ww = gdw.popups.modal_message_popup = tp.core.single_popup_manager({owner:'modal'});
		tp.core.rpaste( ww.popup_el.style, gstyle.messages );



		////////////////////////////////////
		// Creates input text popup
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
		// Creates input text popup
		////////////////////////////////////





		////////////////////////////////////
		// Creates login popup
		//==================================
		// TODm use this. dont create a new one manager: gio.common_popup.update_owner({
		w=gdw.popups.login=tp.core.single_popup_manager({
					owner:'login',
					width : 350,
					height : 200,
					backgroundColor:'#111111',
					color : '#EEEEEE',

					// TODM dont break consistency: dont make in-js-code-html
					innerHTML :

							//  ** TODm Dead ways to enable remember-password browser-feature:
							//	"<form name=\"helps_browsers_to_remember_fields\" method=\"post\" action=\""+
							//	"http://localhost:3000/login" +
							//  This form is useless. Lef only in hope to achieve pw-prompt-feature:
								"<form method=\"post\" accept-charset=\"UTF-8\" action=\"" + 
								gio.session.server.message.login_url +
								"\">\n" +

							"<div	style=\"position:absolute; left:15px; top:10px; " +
							"		width:260px; height:20px; font-size : 10px; color:#FFAADD\">\n" +
							"</div>\n" +

							"<div	style=\"position:absolute; left:15px; top:50px; " +
							"		width:335px; height:20px;\">\n" +
							"	Login: <input id=\"email\" type=\"text\" name=\"email\" " +
							"		style=\" position:absolute; right : 20px; width:200px; height:20px;\">\n" +
							"</div>\n" +

							"<div	style=\"position:absolute; left:15px; top:85px; " +
							"		width:335px; height:20px;\"/>" +
							"	Password: <input type=\"password\" id=\"password\" name=\"password\" " +
							"		style=\" position:absolute; right : 20px; width:200px; height:20px;\">\n" +
							"</div>\n" +

							//  **	Dead ways to enable remember-password browser-feature:
							// 		"<input type=\"submit\" id=\"login\" value=\"Login\" name=\"commit\">\n" +
							"</form>"

		});

		w.popup_el.style.fontFamily = 'arial, helvetica';
		w.popup_el.style.fontSize = '13px';
		// * for debug only:		
		w.popup_el.setAttribute('id','login_popup_div_debug');

		tp.gui.cornerize(gstyle.playboard.corners,w.popup_el);

		// It is vital to set zIndex after cornerize(), because apparently
		// AppleWebkit breaks zIndex:
		w.popup_el.style.zIndex='3000000';

		tp.gui.gradientizeOnce('#880000',0.3,'top',w.popup_el);






		w=gdw.popups.login;
		var constyle=gstyle.controls;

		/*
		// ** creates login button
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : '<a href="#" style="text-decoration : none; color : #FFFFFF; " >Login</a>',
								tooltip : 'Click to login'
							}],
				callback :	med.send_login_request
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'125px', left:'15px',
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

		med.login_submit_button = tp.form.create_select_el(button_arg);
		*/


		// **	we create registration link here to preserve web-page tabbing order:
		//		user - password - login-button
		var register = document.createElement('div');
		register.style.position = 'absolute';
		var ww = register.style;
		ww.left = '15px';
		ww.top = '165px';
		gdw.popups.login.popup_el.appendChild(register);
		register.innerHTML = 
					"		<a	href=\"/register?send_verification_email=yes\" " +
					"			style=\"color : #8888FF; text-decoration : none; font-size : 11px; font-family : arial, helvetica; \"> " +
					"			Register. Forgot your password? Unfinished account activation?</a>";



		// ** creates "Close" button
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : '<a href="#" style="text-decoration : none; color : #FFFFFF; " >Close</a>',
								tooltip : 'Leave login window'
							}],
				callback :	med.hide_login
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'15px', left:'270px',
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
		med.login_closing_button=tp.form.create_select_el(button_arg);



		// ** adds carriage return event to password input box:
		var password_el = $(gdw.popups.login.popup_el).find('input')[1];
		tp.bindEvents( 
			'keydown',
			function(a){
				if(a.keyName == 'enter'){
					med.send_login_request();
					return false;
				}
				return true;
			},
			password_el
		);

		//  **	Dead ways to enable remember-password browser-feature:
		//		$('#login').bind( 'click', function() {
		//				med.send_login_request();
		//				return false;
		//		});


		// ** adds cancel event by escape
		tp.bindEvents( 
			'keydown',
			function(a){
				if(a.keyName == 'escape'){
					med.hide_login();
					return false;
				}
				return true;
			},
			gdw.popups.login.popup_el
		);

		//==================================
		// Creates login popup
		////////////////////////////////////


		return true;
	};


	// Auxiliary
	med.hide_login=function(dont_unlock){
			//med.login_submit_button.wrapper.style.display='none';
			med.login_closing_button.wrapper.style.display='none';
			gio.domwrap.popups.login.hide();
			if(!dont_unlock)gio.gui.procs.unlock_controls();
	};



})(jQuery);
