(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
					var gdf	=  gio.def;



	gio.def.post_definitions = {



		tokenban :  function(game){

			var itr=game.interact;
			var boxnames=game.cnames['box'];
			for(var i=1; i<game.colors.length; i++){
				var b=boxnames[i];

				// TODm possibly non-consistent:
				game.cols[b].activity.active;

				for(var j=1; j<game.colors.length; j++){
					game.interact[b][boxnames[j]]='swap';
				}
			}
			//No goal to deliver cart to a target:
			game.cols[boxnames[0]].baton = false;
		}



	};


})(jQuery);


