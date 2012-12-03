(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	
	// Returns: JSONised array of all non-external available for load collections
	gio.core.reflection.serialize_collections=function(){

		if(!JSON || !JSON.stringify) return '{ "alert" : "no JSON found" }';
		
		var res = [];
		var len=gio.playalbs.length;
		for(var alix=0; alix<len; alix++){

			var alb=gio.playalbs[alix];
			for(var collix=0; collix<alb.collections.length; collix++){

				var coll = alb.collections[collix];
				if( coll.external ) continue;
				if( !coll.maps_loaded ) gio.download_collection(coll);
				if( coll.maps_loaded !== 'success' ) continue;
				var scoll = res[res.length] = {};
				var adr = coll.address;
				scoll.akey = adr.akey;
				scoll.ckey = adr.ckey;
				scoll.file_key = adr.fkey;
				scoll.source_text = coll.source_text;
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
