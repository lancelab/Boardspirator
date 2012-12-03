(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var tpaste	=  tp.core.tpaste;



	// Input:	do_paste forces delivered data content to be pasted into
	//			obj[property]. If !do_paste, obj[property] = data.
	gio.data_io.core.load.object=function(url, obj, property, do_paste, async){
		var ajax_call={
				url : url,
				async : !!async,
				cache : false,
				dataType:'json',
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						if(do_paste){
							obj[property] = tp.core.clone_many(obj[property],data);
						}else{
							obj[property] = data;
						}
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
	// Advances:	to the point where map.load are 'parsed' and
	//				leaves maps in this state.
	gio.download_collection=function(coll){

		coll_ix = coll.coll_ix;
		var game = coll.game;

		var url;

		if( gio.modes.sta_tic.db && coll.address.full){
			url =	gio.modes.sta_tic.db + 
					'/collections/1?text=yes' +
					'&akey='		+ coll.address.akey + 
					'&ckey='	+ coll.address.ckey +
					'&fkey='		+ coll.address.fkey;
		}else{
			if(coll.address && coll.address.full){
				url=coll.address.full;
			}else{
				if(gio.config.feeder.exists){
					url = gio.config.feeder.url + "/" + gio.config.feeder.external_maps + coll.external.link;
				}else{
					coll.maps_loaded += 'No feeder exists to load "' + coll.external.link + '"';
					return coll.maps_loaded === 'success';
				}
			}
		}


		coll.maps_loaded='began';
		if(gio.debug) gio.cons('Began loading '+url);

		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'text',
				timeout:2000,
				success:function(data,textStatus){
					// gio.cons('ajax success '+url);

					if(coll.maps_loaded==='began' && textStatus==='success'){

						if(gio.debug) gio.cons_add(coll.maps_loaded);

						coll.maps_loaded='ajax success';
						if(gio.debug) gio.cons_add('data load ajax success');

						game.maps_decoder(data, coll);
						if(gio.debug) gio.cons_add('maps decoder done for akey '+ coll.album.key + '.');

						if(coll.maps_loaded !== 'success'){
							w = 'Collection "' + url + '" text failed.';
							gio.cons_add(w);
						}
					}
				}
		};
		$.ajax(ajax_call).fail( function(explanation){
					var w = " .. ajax download failed .. ";
					coll.maps_loaded +=w;
					w = w+"\nurl="+url;
					gio.cons_add(w);
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
		colln.game.maps_decoder(new_coll_txt, colln);
		var failed = true;
		if(colln.maps_loaded === 'success'){
			var gm = colln.maps[colln.maps.length-1];
			if(gio.session.reinit.finalize_map(gm)){
				colln.map_ix = colln.maps.length-1;
				var gs = gio.getgs();
				gs.gm.title = 'My Edited. ' + gs.gm.title;
				gio.session.reinit.rounds();
				failed = false;
			}
		}
		if(failed) gio.cons_add( "Failed to edit map.");
	};


})(jQuery);


