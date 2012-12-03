(function( $ ){ 	var tp	=	$.fn.tp$  =  $.fn.tp$ || {};	
					var gio	=	tp.gio    =  tp.gio   || {};
					var med	=	gio.map_editors;


					// The purpose of this file is to prepare handlers ....



	med.invoke_login=function(){

		var login = gio.domwrap.popups.login;
		gio.gui.procs.lock_controls('Pulling login ... ');

		login.show();
		//med.login_submit_button.reset({		c:{	gui:{style:{wrapper:{display:'block'}}}}});
		med.login_closing_button.reset({	c:{	gui:{style:{wrapper:{display:'block'}}}}});

		// * hides useless button: CR works well instead:
		//med.login_submit_button.reset({		r:{	callback : med.send_login_request }});

		$(login.popup_el).find('input')[0].focus();
		$(login.popup_el).find('a')[1].href = gio.session.server.message.craft_zone_url;
		// * clears up message
		$(login.popup_el).children('div')[0].innerHTML = '';

	};


	med.send_login_request = function(){

		var login = gio.domwrap.popups.login;
		var alias_el = $(login.popup_el).find('input')[0];
		var password_el = $(login.popup_el).find('input')[1];
		var message_div = $(login.popup_el).children('div')[0];

		$.ajax({
			type: 'POST',
			url: gio.session.server.message.login_url,
			async : true,
			cache : false,
			data : {	users : { email : alias_el.value, password : password_el.value },
						authenticity_token : gio.session.server.message.form_authenticity_token,
						commit : 'Login'
			},
			success: function(data){
					// c onsole.log('data',data);
					if( data.status == 'success' ){
						// ** closes form, sets mode to logged, and modifies GUI
						message_div.innerHTML = 'Login success'
						gio.session.server.message.loggedin = true;
						gio.session.server.refresh_state('refresh gui'); //TODm not dry, must update ..server.message in one ajax call
						med.hide_login();
						// ** clears credentials in public place. vital: //TODm do this by not relying on login success
						alias_el.value = '';
						password_el.value = '';
					}else{
						// ** displays what is wrong to "please" user
						message_div.innerHTML = data.message || 'Invalid server response';
					}
               }, 
			// TODm ajax. what if failure happened? in send_login_request()
			dataType: 'json'
		});
	};


	med.send_logout_request = function(){
		$.ajax({
			type: 'POST',
			url: gio.session.server.message.logout_url,
			async : true,
			cache : false,
			data : {},
			success: function(data){
					// c onsole.log('data',data);
					if( data.status == 'success' ){
						// ** closes form, sets mode to logged, and modifies GUI
						gio.session.server.message.loggedin = false;
						gio.session.server.refresh_state('reset gui');
					}else{
						// ** displays what is wrong to "please" user
						gio.cons_add( data.message || 'Invalid server response' );
					}
               }, 
			// TODm ajax. what if failure happened? in send_logout_request()
			dataType: 'json'
		});
	};
})(jQuery);
