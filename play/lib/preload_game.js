(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.config = gio.config || {};

	//Very first step of game initiation:
	gio.preload_game=function(game_key){

		if(!gio.config[game_key]){
			gio.cons_add('Missed config for game key "'+ game_key +'".');
			return false;
		}

		var w;
		var ceach=tp.core.each;
		var tpaste=tp.core.tpaste;
		var tclone=tp.core.tclone;

		var game_config=gio.config[game_key]
		var key=game_config.key;
		var basekey=game_config.basekey;
		gio.settings = gio.settings || {};
		if(gio.settings[key])return true; //alreade defined


		//======================
		//"inheritance branch":
		if(basekey){
			//do recursion:
			w=gio.preload_game(basekey);
			if(!w)return false;
			w=gio.settings[basekey];
		}else{
			w=gio.base_settings;
		}
		w=tclone(w,game_config);
		gio.settings[key]=w;
		//======================

		//======================
		//"instantiation branch":
		if(w.isabstract)return true;
		var game=tclone(w);
		//======================

		gio.games = gio.games || [];
		gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
		gio.games[gio.game_ix]=game;


		//Spawn data:
		game.title=game.nam; //TODm later
		w='Unknown license. Copy-paste-play-personally should be fine. Follow links to find maps. Use maps only in text format, no xml.';
		ceach(game.links,  function(ix,link){link.tooltip=w;});

		//TODm q&d:
		ceach(game.collections,function(i,v){v.title = v.title || v.path;});
		game.collections.ix=game.default_collection_ix;


		//===========================
		//do finish image decoder:
		//---------------------------
		game.image_decoder=game.image_decoder || {};
		(function(){
			var w=game.image_decoder;
			var hero	=game.hero;					
			var box		=game.box;
			var target	=game.target;
			var wall	=game.wall;

			for(var i=0; i<game.colors.length; i++){
				var ch=hero[i];
				var uch=ch.toUpperCase();
				w[hero[i]]		=w[hero[i]]		|| hero[i]+'.png';
				w[box[i]]		=w[box[i]]		|| box[i]+'.png';
				w[target[i]]	=w[target[i]]	|| target[i]+'.png';
				w[wall[i]]		=w[wall[i]]		|| wall[i]+'.png';
			}
		})();
		//---------------------------
		//do finish image decoder
		//===========================


		//Here we depart from json scenario even further,
		//we digest supplied function, post_definition:
		if(game_config.post_definition){
			game_config.post_definition(game);
		}


		return true;

	};//gio.load_game_from_data

})(jQuery);


