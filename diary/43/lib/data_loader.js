(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	gio.load_maps=function(gm){

		gm.maps_loaded='began';

		/*
		//----------------------------
		//secure backup variant: rid:
		var to=function(){
				//c onsole.log('to called');
				if(gm.maps_loaded==='began' || gm.maps_loaded==='failed'){
					gm.maps_decoder(gm.default_maps_text);
					gm.maps_loaded='reverted to default';
					//c onsole.log('timeout callback done: gm.maps_loaded='+gm.maps_loaded);
					gio.do_init_game_map();
				}
			};
		setTimeout(
			to,
			5000 //download timeout limit
		);
		//-----------------------------
		*/


		var ajax_call={
				url: gm.path+'/maps.txt',
				async:false,
				cache: false,
				dataType:'text',
				timeout:3000,
				success:function(data,textStatus){
					////c onsole.log('textStatus: '+textStatus);
					if(gm.maps_loaded==='began' && textStatus==='success'){
						gm.maps_loaded='ajax success';
						gm.maps_decoder(data);
						gio.do_init_game_map();
					} //else{
						////c onsole.log('maps ajax failed: '+textStatus);
						//gm.maps_loaded='failed';
					  //}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					//c onsole.log('Ajax map download failed: ',explanation.statusText);
					gm.maps_loaded='ajax failed. loading default maps ...';
					gm.maps_decoder(gm.default_maps_text);
					////c onsole.log('ajax callbak reverts to default maps');
					gio.do_init_game_map();
		});
	};


})(jQuery);


