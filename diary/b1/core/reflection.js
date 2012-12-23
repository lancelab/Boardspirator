(function( $ ){ 	var tp		= $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		= tp.gio    =  tp.gio   || {};
					var cpaste	= tp.core.paste_non_arrays;



	
	// Returns: JSONised array of all non-external available for load collections
	gio.core.reflection.serialize_collections=function(){

		if(!JSON || !JSON.stringify) return '{ "alert" : "no JSON found" }';
		
		var res = [];
		var len=gio.session.alist.length;
		for(var alix=0; alix<len; alix++){

			var alb=gio.session.alist[alix];
			for(var collix=0; collix<alb.collections.length; collix++){

				var coll = alb.collections[collix];
				if( coll.ref.link.link ) continue;
				if( !coll.maps_loaded ) gio.download_collection(coll);
				if( coll.maps_loaded !== 'success' ) continue;
				var scoll = res[res.length] = 
					cpaste( {}, gio.def.templates.play.coll );
				var folder = coll.ref.folder;
				scoll.akey = folder.akey;
				scoll.ckey = folder.ckey;
				scoll.file_key = folder.fkey;
				scoll.script.source_text = coll.script.source_text;
			}
		}
		return JSON.stringify(res,null,'\t');
	};

	// Returns: JSONised array of all non-external available for load collections
	gio.core.reflection.serialize_game_defs=function(){
		if(!JSON || !JSON.stringify) return '{ "alert" : "no JSON found" }';
		return JSON.stringify(gio.def.games,null,'\t');
	};

	// Returns: JSONised array of all non-external available for load collections
	gio.core.reflection.serialize_basegame_def=function(){
		if(!JSON || !JSON.stringify) return '{ "alert" : "no JSON found" }';
		var def = gio.def.inherited_games[	gio.def.base_game.basekey  ];
		return JSON.stringify( def,null,'\t' );
	};



})(jQuery);
