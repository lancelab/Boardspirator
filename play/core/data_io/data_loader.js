(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	gio.data_io.core.load.object=function(url, obj, property){
		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						obj[property] = data;
						if(gio.debug){
							//tp$.deb('property');
							//tp$.deb(data);
						}
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='Ajax failed to load object.';
					gio.cons_add(w+' url='+url+"\n");
					if(gio.debug) tp$.deb(explanation);
		});
		return obj[property];
	};


	gio.data_io.core.load.object_synchronously=function(url){
		var obj = { result : null };
		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						obj.result = data;
						if(gio.debug) tp$.deb(data);
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='Ajax failed to load object.';
					gio.cons_add(w+' url='+url+"\n");
					if(gio.debug) tp$.deb(explanation);
		});
		return obj.result;
	};



	gio.data_io.core.save.object=function(url, data){
		var obj = { result : null };
		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				type : 'post',
				data : data,
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						obj.result = data;
						if(gio.debug) tp$.deb(data);
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='Ajax failed to upload object.';
					gio.cons_add(w+' url='+url+"\n");
					if(gio.debug) tp$.deb(explanation);
		});
		return obj.result;
	};





	// Action:	synchrounous ajax call gets coll text and parses it.
	// Returns:	false if coll and default coll texts failed
	gio.download_collection=function(coll){

		coll_ix = coll.coll_ix;
		var game = coll.plgam;

		var url;

		if( gio.modes.sta_tic.db && coll.address.full){
			url =	gio.modes.sta_tic.db + 
					'/collections/1?text=yes' +
					'&album_key='		+ coll.address.album_key + 
					'&collection_key='	+ coll.address.collection_key +
					'&file_key='		+ coll.address.file_key;
		}else{
			if(coll.address && coll.address.full){
				url=coll.address.full;
			}else{
				url=gio.config.links.external_maps_feed+coll.external.link;
			}
		}


		coll.maps_loaded='began';
		if(gio.debug) gio.cons('began to load '+url);

		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'text',
				timeout:2000,
				success:function(data,textStatus){
					// gio.cons('ajax success '+url);

					if(coll.maps_loaded==='began' && textStatus==='success'){

						if(gio.debug)gio.cons_add(coll.maps_loaded);

						coll.maps_loaded='ajax success';
						if(gio.debug)gio.cons_add('data load ajax success');

						game.maps_decoder(data, coll);
						if(gio.debug)gio.cons_add('maps decoder done for '+ game.nam);

						if(coll.maps_loaded === 'success'){
							coll.maps_downloaded_and_validated = true;
						}else{
							w = 'Collection '+url+ ' text failed.';
							gio.cons_add(w);
							coll.download_failure_message = w;
							game.maps_decoder(game.default_maps_text, coll);
						}
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w='ajax download failed. loading default maps ... ';
					coll.maps_loaded +=w;
					w = w+"\nurl="+url;
					gio.cons_add(w);
					coll.download_failure_message = w;
					game.maps_decoder(game.default_maps_text, coll);
		});

		return coll.maps_loaded === 'success';
	};//gio.download_collection






	// ====================================================================
	// Purpose:	loads maps from text, same way as it was loaded from file
	// Action:	adds custom text to collection and parses the addition
	// ====================================================================
	gio.load_custom_collection=function(text){

		var gs				=	gio.getgs();
		var colln			=	gs.coll;
		var new_coll_txt 	= 	colln.source_text + "\n" +
								colln.maps.length + "\n\n"+text;

		colln.maps_loaded='began';
		if(gio.debug) gio.cons('began to add map to collection ... ');
		colln.plgam.maps_decoder(new_coll_txt, colln);
		if(colln.maps_loaded === 'success'){
			colln.map_ix = colln.maps.length-1;
			var gs = gio.getgs();
			gs.gm.title = 'My Edited. ' + gs.gm.title;
			gio.session.reinit.rounds();
		}
	};




})(jQuery);


