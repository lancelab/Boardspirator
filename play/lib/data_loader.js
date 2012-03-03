(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.preload_games_list=function(){
		var url='games/list_to_load.json.txt';

		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						gio.games_list=data;
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='failed to load game list';
					gio.cons_add(w+' url='+url);
					gio.games_list=['colorban'];
		});
	};



	gio.preload_game_config=function(game_id){
		var url='games/'+game_id+'/config.json.js';
		var success=false;
		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						gio[game_id+'_settings']=data;
						gio.cons_add('succes of loading '+url);
						success=true;
					}
				}

				/*
				//don't use two error handlers: fail and error:
				error:(function(obj, stringErr, throwErr){

					var w='failed preload game config';
					gio.cons_add(w+' url='+url);
					//c onsole.log('fail strErr, obErr='+stringErr, throwErr);
				})
				*/

		};
		$.ajax(ajax_call).fail( function(explanation){
					//c onsole.log('explanation=',explanation);
					var w='failed preload game config '+game_id;

					/*
					//very good for debug in FF:
					w += '. url='+url + "\n";
					w += explanation.statusText;
					*/

					gio.cons_add(w);
					success=false;
		});
		return success;
	};




	gio.load_maps=function(game){
		var collection=game.collections[game.collections.ix];
		var url='collections/'+collection.path;

		collection.maps_loaded='began';
		//gio.cons('began to laod '+url);

		/*
		//----------------------------
		//secure backup variant: rid:
		var to=function(){
				//c onsole.log('to called');
				if(game.maps_loaded==='began' || game.maps_loaded==='failed'){
					game.maps_decoder(game.default_maps_text);
					game.maps_loaded='reverted to default';
					//c onsole.log('timeout callback done: game.maps_loaded='+game.maps_loaded);
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
				timeout:2000,
				success:function(data,textStatus){
					//gio.cons('ajax success '+url);
					if(collection.maps_loaded==='began' && textStatus==='success'){
						if(gio.debug)gio.cons_add(collection.maps_loaded);
						collection.maps_loaded='ajax success';
						if(gio.debug)gio.cons_add('data load ajax success');
						game.maps_decoder(data);
						if(gio.debug)('maps decoder done for '+ game.nam);
						gio.do_init_game_map();
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='ajax failed. loading default maps ... ';
					gio.cons_add(w+' url='+url);
					collection.maps_loaded +=w;
					game.maps_decoder(game.default_maps_text);
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


