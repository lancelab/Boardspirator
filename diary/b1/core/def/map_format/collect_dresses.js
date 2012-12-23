(function() { 	var tp			= $.fn.tp$  =  $.fn.tp$ || {};	
				var gio			= tp.gio    =  tp.gio   || {};
				var cmd			= gio.core.def.map_format;
				var propertify	= tp.core.propertify;
				var tooltipify_data	= tp.core.tooltipify_data;







	///	Parses or initiates parsing of dress
	//	Returns:	true to continue to loop caller
	cmd.extract_to_dresses = function (
			dress_tray,			// dress wrap established in finalize_map.js
			master_line_trimmed,
			pkey,				// colorbanKV(master_line)
			dummy_master_line,
			dtable 				// map__eff.script.decoder_table
	){

			var ddtt			= dress_tray;
			var add_to_dress	= false;
			var initiate_dress	= false;
			var dresses			= ddtt.dresses;
			var map				= ddtt.map;
			var trim_match		= cmd.trim_match;
			var dkey;


			//: terminates or adds dress
			if( ddtt.zoneon_flag ) {
				if( master_line_trimmed.length === 0 ) {
					//:	terminates zone by encountering empty line
					ddtt.dr				= null;
					ddtt.zoneon_flag	= false;
					//. continues to loop a caller
					return true;
				}
				//. resumes dressing
				add_to_dress = true;
			}


			var lcasekey	= ( pkey[2] && pkey[2].toLowerCase() ) || '';
			var pkeym		= ( lcasekey && pkey[3] && tp.core.str2mline( pkey[3] ) ) || '' ;

			/// initiates new dress-parsing-zone
			if( lcasekey === 'dress' ) {

				ddtt.zoneon_flag		= true;
				dkey					= pkeym || map.game.dresses_chosen_key;
				ddtt.common_skin_key	= dkey;
				setup_img_path( ddtt );

	
				ddtt.dr = dresses[dkey] =
				{
					//. knows ownself
					key : dkey,
					style : { play : {}, parent : {} },
					image_decoder : {},
					skip : false
				};
				ddtt.counter += 1;
				return true;
			} /// initiates new dress-parsing-zone




			if( !add_to_dress ) return false;




			// //\\ COLLECTS DIRECTIVES FOR DRESS
			//		Syntax:	pkey[2] is a directive
			// 		Any enabled :::key=value pair will contribute to dress now.
			var dress = ddtt.dr;



			if( lcasekey === 'image' || lcasekey === 'back_image' || lcasekey === 'center_image' ) {

				// //\\	MODIFIES IMAGE
					//: extracts	image path, imagep.
					if( lcasekey === 'image' ) {
						//::	extracts reskin[0], unit-char or unit_token
						var reskin = pkeym.split('=');
						var imagep = reskin[1] && reskin[1].replace(trim_match,'');
					}else{
						imagep = pkeym;
					}	
					if( !imagep ) {
						throw 'Invalid skin image assignment '+ pkey[0];
					}


					// //\\	FORMAT OF DIRECTIVE :::image=...
					//		see description in map_formats.htm 

					if(imagep.indexOf('//') === 0 ) {
						//. ties imagep to a parent: to external collection or given site
						imagep = tp.core.expand_to_parent ( imagep, map.collection.ref.link.link );
					}else{
						//. preserves full path if any in imagep
						imagep =	imagep.indexOf('/') > -1 ? 
									imagep : 
									ddtt.current_img_path + '/' + imagep;
					}
					if( lcasekey === 'image' ) {
							var w_key = reskin[0];
							w_key = w_key.length > 1 ? w_key : dtable[ w_key ];
							//. dtable is decoder_table from map_tables.js
							dress.image_decoder[ w_key ] = imagep;
					}else if( lcasekey === 'back_image' ) {
							dress.style.play.backgroundImage = imagep;
					}else{	
							dress.style.parent.backgroundImage = imagep;
					}
					// \\// FORMAT OF DIRECTIVE :::image=...

				// \\//	MODIFIES IMAGE



			// /\	modifies collection of directives

			}else if( lcasekey === 'skin' ) {
				//: resets current skins path
				ddtt.common_skin_key = pkeym;
				setup_img_path(ddtt);
				//.	affects all other maps and following execution: avoid this:
				//ddtt.dr.skin_key = pkeym;

			}else if( lcasekey === 'chosen' ) {
				dress.chosen = ( pkeym.toLowerCase() !== 'false' );

			}else if( lcasekey === 'skip' ) {
				dress.skip = ( pkeym.toLowerCase() !== 'false' );


			}else if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
					propertify( dress, 'credits', lcasekey, pkeym );
			}else{
					propertify( dress, lcasekey, pkeym );
			}

			// \/	modifies collection of directives
			// \\// COLLECTS DIRECTIVES FOR DRESS

			return true;
	}; ///	Parses or initiates parsing of dress




	/// sets current image path
	var setup_img_path = function( ddtt ) {
			var map = ddtt.map;
			ddtt.current_img_path =	gio.config.defpaths.SKINS_DEF_PATH + 
									'/'+ ddtt.common_skin_key;
	};

})();


