(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


    //Input		gm = game, bad notation.
	gio.load_maps=function(gm){
		var collection=gm.collections[gm.collections.ix];
		var url='collections/'+collection.path;

		collection.maps_loaded='began';
		//gio.cons('began to laod '+url);

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
				url: url,
				async:false,
				cache: false,
				dataType:'text',
				timeout:3000,
				success:function(data,textStatus){
					//gio.cons('ajax success '+url);
					if(collection.maps_loaded==='began' && textStatus==='success'){
						collection.maps_loaded='ajax success';
						gm.maps_decoder(data);
						gio.do_init_game_map();
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='ajax failed. loading default maps ... ';
					gio.cons_add(w+' url='+url);
					collection.maps_loaded +=w;
					gm.maps_decoder(gm.default_maps_text);
					gio.do_init_game_map();
		});
	};

	//From text, same way as it was loaded from file:
	gio.load_custom_collection=function(text){
		var game=gio.games[gio.game_ix];
		var collection=
		{	path: 'custom_text',
			title: 'custom',
			skip_non_map_lines : false
		};
		game.collections.push(collection);
		game.collections.ix=game.collections.length-1; //TODO low level must not change env. 

		collection.maps_loaded='began';
		gio.cons('began to load custom collection ... ');

		game.maps_decoder(text);
		gio.do_init_game_map();
	};


})(jQuery);


