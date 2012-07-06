(function( $ ){ 	var tp			= $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			= tp.gio    =  tp.gio   || {};
					var cmd			= gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};




	// Returns:	true to continue loop caller
	cmd.extract_to_dresses=function(
			dress_wrap,
			com_trimmed,
			pkey,
			com,
			dtable
	){
			var ddww = dress_wrap;
			var add_to_dress=false;
			var initiate_dress=false;
			var dress_key;
			var dresses = ddww.dresses;
			var map = ddww.map;
			var trim_match = cmd.trim_match;

			// ** terminates or adds dress
			if(ddww.zoneon_flag){
				if(com_trimmed.length === 0){
					// ** only empty line terminates zone
					ddww.dr=null;
					ddww.zoneon_flag=false;
					return true; //continue
				}
				add_to_dress = true;
			}



			// ** initiates new dress-zone
			if(pkey[2]==='dress'){

				ddww.zoneon_flag =  true;
				dress_key = pkey[3] || map.game.dresses_chosen_key;

				// ** too complex logic:
				// var ww = map.game.dresses[dress_key];
				// ww && ww.skin_key || dress_key;
				// The simpler, the better:
				ddww.coll_skin_key = dress_key; 

				ddww.common_skin_key = '';
				setup_img_path(ddww);

	
				ddww.dr = dresses[dress_key]=
				{
					// * knows ownself
					key : dress_key,
					inherit_from : dress_key,
					title : tp.core.capitalizeFirstLetter(dress_key.replace(/_/g,' ')),
					style : { play : {}, parent : {} },
					image_decoder : {}
				};
				ddww.counter += 1;
				return true;
			}

			if(!add_to_dress) return false;

			// We are in dress collection zone. Do analyze input stream.
			// Any enabled :::key=value pair will contribute to dress now.
			var dress = ddww.dr;


			// ** extracts picture links
			if(pkey[2]==='image' || pkey[2] === 'back_image' || pkey[2] === 'center_image' ){
			
					if(pkey[2]==='image'){
						var reskin=pkey[3].split('=');
						var imagep =reskin[1] && reskin[1].replace(trim_match,'');
					}else{
						imagep = pkey[3];
					}	
					if(!imagep){
						throw 'Invalid skin image assignment '+ pkey[0];
					}

					// ** preserves full path if any in imagep
					imagep =	imagep.indexOf('/') > -1 ? 
								imagep : 
								ddww.current_img_path + '/' + imagep;

					if(pkey[2]==='image'){
							dress.image_decoder[dtable[reskin[0]]] = imagep;
					}else if(pkey[2] === 'back_image'){
							dress.style.play.backgroundImage = imagep;
					}else{	
							dress.style.parent.backgroundImage = imagep;
					}
			}else if(pkey[2]==='title'){
				dress.title = pkey[3];
			}else if(pkey[2]==='skip'){
				dress.skip = true;
			}else if(pkey[2]==='inherit_from'){
				dress.inherit_from = pkey[3];
			}else if(pkey[2]==='common_skin'){
				// ** resets current skins path
				ddww.common_skin_key = pkey[3];
				setup_img_path(ddww);
				ddww.dr.skin_key = pkey[3];
			}else if(pkey[2]==='skin'){
				// ** resets current skins path
				ddww.coll_skin_key = pkey[3];
				ddww.common_skin_key = '';
				setup_img_path(ddww);
			}else if(pkey[2]==='chosen'){
				dress.chosen = true;
			}
			return true;
	};



	// Sets current image path
	var setup_img_path = function(ddww){
			var map = ddww.map;
			if(ddww.common_skin_key){
				ddww.current_img_path =	gio.config.defpaths.SKINS_DEF_PATH + 
										'/'+ ddww.common_skin_key +'/img';
			}else{
				var ww = tp.core.getFileParent;
				ww = ww(ww(map.collection.address.full))
				ddww.current_img_path = ww + '/skins/' + ddww.coll_skin_key + '/img';
			}
	};

})(jQuery);


