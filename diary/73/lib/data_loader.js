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



	gio.download_collection=function(game){
		var collection=game.collections[game.collections.ix];
		var url;

		if(collection.path){
			url='collections/'+collection.path;
		}else{
			url=gio.external_maps_feed+collection.external.link;
		}

		collection.maps_loaded='began';
		//gio.cons('began to laod '+url);

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
						gio.reinit_or_create_div_board_and_pos();
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='ajax failed. loading default maps ... ';
					gio.cons_add(w+' url='+url);
					collection.maps_loaded +=w;
					game.maps_decoder(game.default_maps_text);
					gio.reinit_or_create_div_board_and_pos();
		});
	};

	// Purpose:	load maps from text, same way as it was loaded from file:
	// Action:	creates custom collection and drops text there:
	gio.load_custom_collection=function(text){
		var game=gio.games[gio.game_ix];

		//TODm try to find custom collecion first:
		var collection=
		{	// Borrow current collection ... to reuse collection images if any:
			path: game.collections[game.collections.ix].path,

			title: 'custom',
			skip_non_map_lines : false
		};
		game.collections.push(collection);
		game.collections.ix=game.collections.length-1; //TODO low level must not change env. 

		collection.maps_loaded='began';
		gio.cons('began to load custom collection ... ');

		game.maps_decoder(text);
		gio.reinit_or_create_div_board_and_pos();
	};

})(jQuery);


