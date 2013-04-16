
( function( $ ) { 	var tp	=	$.fn.tp$  =  $.fn.tp$ || {};	
					var gio	=	tp.gio    =  tp.gio   || {};

					var med	=	gio.map_editors;
					var srvmsg	= gio.session.server.message;

					var conadd	=  function ( string ) { gio.cons_add( "PopupHandler: " + string ); };			


					// The purpose of this file is to prepare handlers ....



	med.invoke_login=function(){

		conadd( 'Invoking login popup.' );
		var login = gio.domwrap.popups.login;
		gio.gui.procs.lock_controls('Pulling login ... ');

		login.show();
		//med.login_submit_button.reset({		c:{	gui:{style:{wrapper:{display:'block'}}}}});
		med.login_closing_button.reset({	c:{	gui:{style:{wrapper:{display:'block'}}}}});

		// * hides useless button: CR works well instead:
		//med.login_submit_button.reset({		r:{	callback : med.send_login_request }});

		$(login.popup_el).find('input')[0].focus();
		$(login.popup_el).find('a')[1].href = srvmsg.craft_zone_url;
		// * clears up message
		$(login.popup_el).children('div')[0].innerHTML = '';

	};


	med.send_login_request = function(){

		var login = gio.domwrap.popups.login;
		var alias_el = $(login.popup_el).find('input')[0];
		var password_el = $(login.popup_el).find('input')[1];
		var message_div = $(login.popup_el).children('div')[0];


		var ajax_call =
		{
			type: 'POST',
			url: srvmsg.login_url,
			async : false,
			// TODm ajax. what if failure happened? in send_login_request()
			dataType: 'json',
			cache : false,
			data : {	users : { email : alias_el.value, password : password_el.value },
						authenticity_token : srvmsg.form_authenticity_token,
						commit : 'Login',
						scenario : 'playgame popup'
			},

			success: function(data){
					// c onsole.log('data',data);
					if( data.status == 'success' ){
						// ** closes form, sets mode to logged, and modifies GUI
						message_div.innerHTML = 'Login success';
						srvmsg.loggedin = true;
						srvmsg.user_id = data.user_id;
						srvmsg.craft_zone_url = data.craft_zone_url;
						gio.session.server.update_state ();
						med.hide_login();
						// ** clears credentials in public place. vital: //TODm do this by not relying on login success
						alias_el.value = '';
						password_el.value = '';

						///	Pastes user's staff missed before login
						//	TODM Nested ajax. Do streamline.
						gio.cons_add( "Login success. Going to download own gamions. " );
						var result = gio.data_io.download_gamion ( 
						{
							galfinition :
							{	gafion : true,
								derive_at_download	: true
								//listify_on_top	: true	//TODM change this name. It is a pitfall. Apparently it means: do land to it at start up.
							},
							call_back : function ( success ) {
									if( success )
									{
										conadd( 'Gamion finalized. Updating states and gui ...');
										gio.session.server.update_state ();
										gio.gui.procs.visualize_collection_titles();
									}
							},
							common : { dbased : true, query_pars : "just_logged_in=true" }
						});
					}else{
						//. Displays what is wrong to "please" user.
						message_div.innerHTML = data.message || 'Invalid server response';
					}
               }
		};

		conadd( 'Sending login request' );
		$.ajax( ajax_call );
	};


	med.send_logout_request = function(){

		ajax_call = {
			type: 'POST',
			url: srvmsg.logout_url,
			async : false,
			cache : false,
			data : {	authenticity_token : srvmsg.form_authenticity_token,
						scenario : 'playgame popup'
			},
			success: function( data ) {
					// c onsole.log('data',data);
					if( data.status == 'success' ){
						//:	closes form, sets mode to logged out, and modifies GUI
						srvmsg.loggedin = false;
						srvmsg.user_id = '';
						srvmsg.craft_zone_url = data.craft_zone_url;
						gio.session.server.update_state ();
					}else{
						//.	displays what is wrong to "please" user
						gio.cons_add( data.message || 'Invalid server response' );
					}
               }, 
			// TODm ajax. what if failure happened? in send_logout_request()
			dataType: 'json'
		};

		$.ajax( ajax_call );

	};
})(jQuery);
