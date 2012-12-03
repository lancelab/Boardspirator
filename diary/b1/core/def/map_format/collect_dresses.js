(function() { 	var tp			= $.fn.tp$  =  $.fn.tp$ || {};	
				var gio			= tp.gio    =  tp.gio   || {};
				var cmd			= gio.def.colorban_maps_decoder = gio.def.colorban_maps_decoder || {};








	/// Returns:	true to continue to loop caller
	cmd.extract_to_dresses = function(
			dress_wrap,		// possibly in:	cmd.finalize_map=function(
			com_trimmed,
			pkey,			// was or is:	pkey=colorbanKV(com)
			com,			// was or is:	com=flines[master_y].replace(/\r/g,'')
			dtable 			// was or is:	original_map.script.decoder_table 
	){

			var ddww = dress_wrap;
			var add_to_dress=false;
			var initiate_dress=false;
			var dkey;
			var dresses = ddww.dresses;
			var map = ddww.map;
			var trim_match = cmd.trim_match;

			//: terminates or adds dress
			if(ddww.zoneon_flag){
				if(com_trimmed.length === 0){
					//:	terminates zone by encountering empty line
					ddww.dr				= null;
					ddww.zoneon_flag	= false;
					//. continues to loop a caller
					return true;
				}
				//. resumes dressing
				add_to_dress = true;
			}



			/// initiates new dress-parsing-zone
			if(pkey[2]==='dress'){

				ddww.zoneon_flag		= true;
				dkey				= pkey[3] || map.game.dresses_chosen_key;
				ddww.common_skin_key	= dkey;
				setup_img_path( ddww );

	
				ddww.dr = dresses[dkey]=
				{
					//. knows ownself
					key : dkey,
					inherit_from : dkey,
					title : tp.core.capitalizeFirstLetter(dkey.replace(/_/g,' ')),
					style : { play : {}, parent : {} },
					image_decoder : {},
					skip : false
				};
				ddww.counter += 1;
				return true;
			}

			if(!add_to_dress) return false;




			// //\\ COLLECTS DIRECTIVES FOR DRESS
			//		Syntax:	pkey[2] is a directive
			// 		Any enabled :::key=value pair will contribute to dress now.
			var dress = ddww.dr;

			if(pkey[2]==='image' || pkey[2] === 'back_image' || pkey[2] === 'center_image' ){

				// //\\	modifies image
					//: extracts	image path, imagep.
					//				If pkey[2]==='image', then extracts unit-char, reskin[0].
					if(pkey[2]==='image'){
						var reskin = pkey[3].split('=');
						var imagep = reskin[1] && reskin[1].replace(trim_match,'');
					}else{
						imagep = pkey[3];
					}	
					if(!imagep){
						throw 'Invalid skin image assignment '+ pkey[0];
					}


					// //\\	FORMAT OF DIRECTIVE :::image=...
					//		see description in map_formats.htm 

					if(imagep.indexOf('//') === 0 ) {
						//. ties imagep to a parent: to external collection or given site
						imagep = gio.def.procs.expand_to_parent( imagep, map.collection.external && map.collection.external.link );
					}else{
						//. preserves full path if any in imagep
						imagep =	imagep.indexOf('/') > -1 ? 
									imagep : 
									ddww.current_img_path + '/' + imagep;
					}
					if(pkey[2]==='image'){
							//. dtable is apparently decoder_table from map_tables.js
							dress.image_decoder[dtable[reskin[0]]] = imagep;
					}else if(pkey[2] === 'back_image'){
							dress.style.play.backgroundImage = imagep;
					}else{	
							dress.style.parent.backgroundImage = imagep;
					}
					// \\// FORMAT OF DIRECTIVE :::image=...


				// \\//	modifies image



			// /\	modifies collection of directives
			}else if(pkey[2]==='title'){
				dress.title = pkey[3];
			}else if(pkey[2]==='rules'){
				dress.rules = pkey[3];
			}else if(pkey[2]==='objective'){
				dress.objective = pkey[3];
			}else if(pkey[2]==='links'){
				dress.rules = pkey[3];
			}else if(pkey[2]==='skip'){
				dress.skip = true;
			}else if(pkey[2]==='inherit_from'){
				dress.inherit_from = pkey[3];
			}else if(pkey[2]==='credits'){
				dress.credits = pkey[3];
			}else if(pkey[2]==='author'){
				dress.author = pkey[3];
			}else if(pkey[2]==='copyright'){
				dress.copyright = pkey[3];
			}else if(pkey[2]==='skin'){
				//: resets current skins path
				ddww.common_skin_key = pkey[3];
				setup_img_path(ddww);
				//.	affects all other maps and following execution: avoid this:
				//ddww.dr.skin_key = pkey[3];
			}else if(pkey[2]==='chosen'){
				dress.chosen = true;
			}
			// \/	modifies collection of directives
			// \\// COLLECTS DIRECTIVES FOR DRESS
			return true;
	};



	/// sets current image path
	var setup_img_path = function(ddww){
			var map = ddww.map;
			ddww.current_img_path =	gio.config.defpaths.SKINS_DEF_PATH + 
									'/'+ ddww.common_skin_key;
	};

})();


