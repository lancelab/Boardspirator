(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var tpaste	=  tp.core.tpaste;

					var defp	=  gio.def.procs;





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


		//	//\\	Missed doc for this. 
		//					$.ajax( ajax_call ).fail( function( explanation ) { ...
		//			Guessing this: error(jqXHR, textStatus, errorThrown)
		//			From this: http://api.jquery.com/jQuery.ajax/
		//	\\//
		$.ajax( ajax_call ).fail( function( explanation ) {
					var ww ='Ajax failed to load object.';
					gio.cons_add( ww + ' url=' + url + "\n");
					if(gio.debug) {
						tp$.deb( "Possible error status = " + arguments[1]);
						tp$.deb( "Possible error expanation = " + arguments[2]);
						// c onsole.log('arguments[0]=', arguments[0], "\n\n\narguments[1]=", arguments[1], "\n\n\narguments[1]=", arguments[2]);
					}
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

		//	//\\	Missed doc for this. 
		//					$.ajax( ajax_call ).fail( function( explanation ) { ...
		//			Guessing this: error(jqXHR, textStatus, errorThrown)
		//			From this: http://api.jquery.com/jQuery.ajax/
		//	\\//
		$.ajax( ajax_call ).fail( function( explanation ) {
					var ww ='Ajax failed to load object synchronously ';
					gio.cons_add( ww + ' url=' + url + "\n");
					if(gio.debug) {
						tp$.deb( "Possible error status = " + arguments[1]);
						tp$.deb( "Possible error expanation = " + arguments[2]);
						// c onsole.log('arguments[0]=', arguments[0], "\n\n\narguments[1]=", arguments[1], "\n\n\narguments[1]=", arguments[2]);
					}
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
					if(gio.debug) {
						tp$.deb( "Possible error status = " + arguments[1]);
						tp$.deb( "Possible error expanation = " + arguments[2]);
					}
		});
		return obj.result;
	};





	// Action:	synchrounous ajax call gets coll text and parses it.
	// Returns:	false if coll and default coll texts failed
	// Advances:	to the point where map.load are 'parsed' and
	//				leaves maps in this state.
	gio.download_collection = function( coll ) {

		var url;
		var coll_ix				= coll.ref.list.ix;
		var folder				= coll.ref.folder;
		var ownhost				= defp.detect_ownhost_url( coll );

		if( gio.modes.sta_tic.db && folder.full){
			var url = 	gio.modes.sta_tic.db + 
						'/collections/1?text=yes' +
						'&akey='	+ folder.akey + 
						'&ckey='	+ folder.ckey +
						'&fkey='	+ folder.fkey;
		}else{

			if( folder.full ) {

				url = folder.full;

			}else{

				url = coll.ref.link.link;

				if( !ownhost ) {
					if( gio.config.feeder.exists ) {
						url = gio.config.feeder.url + "/" + gio.config.feeder.external_maps + url;
					}else{
						coll.maps_loaded += 'No feeder exists for outhost: "' + url + '"';
						return false;
					}
				}
			}
		}


		coll.maps_loaded='began';
		if(gio.debug) gio.cons( 'Began loading ' + url );

		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'text',
				timeout:2000,
				success:function(data,textStatus){
					// gio.cons('ajax success '+url);

					if(coll.maps_loaded==='began' && textStatus==='success'){

						gio.debly( coll.maps_loaded );
						coll.maps_loaded = 'ajax success';
						gio.debly( 'data load ajax success' );

						if( data.match( /^:::failed/i ) )
						{
							coll.maps_loaded = 
									"Failed collection load.\nRedirector responded with text:\n" +
									data.substr(0, 200);
						}else{	

							coll.script.source_text = data;
							gio.core.def.map_format.decode( coll );
							gio.debly( 'Finished maps decoder for akey ' + coll.ref.list.akey + '.');
						}
					}
				}
		};

		$.ajax(ajax_call).fail( function(explanation){
					var w = " .. ajax download failed .. ";
					coll.maps_loaded +=w;
					w = w+"\nurl="+url;
					gio.cons_add(w);
					if(gio.debug) {
						tp$.deb( "Possible error status = " + arguments[1]);
						tp$.deb( "Possible error expanation = " + arguments[2]);
					}
		});

		var w_success = coll.maps_loaded === 'success' || coll.script.state.definitions_processed;
		if( !w_success ) {
				var ww = "Collection \"" + url + "\"\nis failed.\n";
				if( !coll.script.state.definitions_processed ) ww += "No definitions.\n"
				ww	+= "coll.maps_loaded = " + coll.maps_loaded;
				gio.cons_add( ww );
		}

		return w_success;
	};//gio.download_collection






	///	Loads:	maps from user-entered text
	//	Action:	adds custom text to colln.script.source_text,
	//			parses this addition, and then lands on
	//			the last map of collection.
	//			TODM the name is misleading.
	gio.add_map_text_and_land = function( text ) {

		var gs						=	gio.getgs();
		var colln					=	gs.coll;
		colln.script.source_text	+= 	"\n" + colln.maps.length + "\n\n" + text;

		colln.maps_loaded = 'began';
		if(gio.debug ) gio.cons( 'began to add map to collection ... ' );

		//. parses new maps
		gio.core.def.map_format.decode ( colln );

		var failed = true;
		if( colln.maps_loaded === 'success' ) {

			//. gets last map from reparsed text
			var gm = colln.maps[ colln.maps.length-1 ];

			//. validates
			if( gio.session.reinit.landify_map( gm ) ) {
				//: lands on map
				gm.title = 'My Edited. ' + gm.title;
				failed = gio.navig.landify_and_land_map( gm, 'do_land' );
			}
		}
		if( failed ) gio.cons_add( "Failed to edit map." );
	};


})(jQuery);


