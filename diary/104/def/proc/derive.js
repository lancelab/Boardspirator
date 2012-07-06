(function( $ ){ 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var tpaste	=  tp.core.tpaste;
					var clonem	=  tp.core.clone_many;
					var giodf	=  gio.def;
					var defp	=  giodf.procs;





	// =============================================================
	// Purpose: derives game definition from parent game definition
	// =============================================================
	defp.inherit_game=function(game_key){


		// ** Verify if job already done
		var idef = giodf.inherited_games[game_key];
		if(idef) return idef;


		// ** Verify if own definition exists
		var gdef = giodf.games[game_key];
		if(!gdef){
			gio.cons_add('Missed own definition for game key "'+ game_key +'".');
			return false;
		}


		// ** Do the inherit job
		gdef.basekey = gdef.basekey || giodf.base_game_key;
		idef=defp.inherit_game(gdef.basekey);
		if(!idef)return false;
		idef=clonem(idef,gdef);


		// ** Save the job
		giodf.inherited_games[game_key]=idef;



		// ** Return the job
		return idef;
	};






	// ================================
	// Mixes game with album's dress
	// ================================
	defp.dress_game=function(album_key){


		// ** verifies if job already done
		var dgame = giodf.dressed_games[album_key];
		// Vital: returns copy, to protect template intact:
		if( dgame ) return clonem(dgame);



		// ** verifies if own definition exists
		var album_def = giodf.albums[album_key];
		if(!album_def){
			gio.cons_add('Missed definition for album key "'+ album_key +'".');
			return false;
		}
		


		// ** inherites dresses
		var game_part = clonem(album_def.game);
		game_part.dresses = clonem(album_def.dresses);
		if(!game_part.dresses){
			gio.cons_add('Missed dresses for album key "'+ album_key +'".');
			return false;
		}
		ceach(game_part.dresses, function(dress_key, dress){
			// ** injects default dress
			var ww = clonem(gio.def.default_dress, dress);
			tp.core.paste_non_arrays(dress, ww);
		});


		// ** establishes chosen_key or as first if none
		var chosen_drkey = '';
		var first_dress_key = '';
		ceach(game_part.dresses, function(dress_key, dress){
			if(!first_dress_key) first_dress_key = dress_key;
			if(dress.skip) return true;
			if(dress.chosen) chosen_drkey = dress_key;
		});
		// we have established chosen key:
		game_part.dresses_chosen_key = chosen_drkey || first_dress_key;


		// ** inherites game
		game_part.basekey = game_part.basekey || giodf.base_game_key;
		dgame=defp.inherit_game(game_part.basekey);
		if(!dgame) return false;
		dgame = clonem(dgame,game_part);


		// ** finalizes dresses
		ceach(dgame.dresses, function(dress_key,dress){
				// * knows ownself
				dress.key = dress_key;
				// ** sets GUI-tooltips for each link option
				var ww =	'Follow links to find maps. Paste maps only in text format.' +
							'Text and markup surrounding map is usually insignificant.';
				ceach(dress.links,  function(ix,link){link.tooltip=ww;});
		});


		// ** runs post-defs if any
		var w = dgame.post_definition;
		if(w && gio.def.post_definitions[w]) gio.def.post_definitions[w](dgame);

		// ** finalizes
		dgame.album_key = album_key;
		giodf.dressed_games[album_key] = clonem(dgame);
		return dgame;
	};//defp.dress_game




	// Mixes dressed game with collections
	defp.derive_album=function(album_key){

		var dgame = defp.dress_game(album_key);
		if( !dgame ) return false;


		// ** Bundlify
		var bundle = clonem(giodf.albums[album_key].bundle);
		if( !bundle.collections || bundle.collections.length === 0){
			gio.cons_add('Missed collections in bundle '+album_key);
			return false;
		}
		bundle.collections.ix=bundle.default_collection_ix || 0;
		bundle.key = album_key;
		bundle.plgam = dgame;

		bundle.ix = gio.playalbs.length;
		gio.playalbs[gio.playalbs.length]=bundle;
		gio.playzone.albums[album_key]=bundle;

		bundle.title = bundle.nam ? bundle.nam : '';



		// ** Collectionify
		ceach(bundle.collections,function(i,coll){
			var w,ww;
			var cgame = dgame;

			coll.coll_ix = i;

			//coll.owner_album_key = album_key;
			coll.context_album_key = coll.context_album_key || album_key;
			if(coll.context_album_key !== album_key){
				// We have reference to peer-album			
				cgame = defp.dress_game(coll.context_album_key);
				if( !cgame ){
					gio.cons_add(	'Missed game context for key ' + coll.context_album_key +
									' for collection ' + coll.coll_ix);
					return false;
				}
			}

			// Context
			coll.plgam = cgame;

			// Wrapper
			coll.plalb = bundle;

			// Prepare external collection
			if(coll.external){
				w=coll.external;
				//TODm how to do both: set a location and open new tag by js
				ww='<a target="_blank" href="';
				// TODm why external link works without urlencoding? fix this:
				coll.title='External: '+
						ww+w.human_readable+'"><span style="color:#00FF00">Site: ' +
						w.title + '</span></a> '+
						ww+w.link+'"><span style="color:#00FFFF">Text</span></a> '+
						'<span style="color:#FF8888">Try to load</span>';
			}else{
				var adr				=	coll.address = coll.address || {};
				adr.album_key		=	adr.album_key		|| album_key;
				adr.collection_key	=	adr.collection_key	|| 'default';
				adr.file_key		=	adr.file_key		|| 'maps.txt';
				// * Is flag:
				adr.full			=	gio.config.defpaths.ALBUMS_DEF_PATH+'/' + adr.album_key +
										'/collections/'+adr.collection_key +
										'/maps/'+ adr.file_key;
				coll.title			=	coll.title || adr.full;
			}

			bundle.title = gio.gui.procs.calculate_game_titile_from_names(dgame.nam, bundle.album_name)

		});


		// Add more constucts before loading maps if desired:
		// game.units ...

		return true;

	};//...derive_album

})(jQuery);


