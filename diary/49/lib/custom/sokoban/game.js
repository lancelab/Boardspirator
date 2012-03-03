(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

	//===================================
	//Test is position winning.
	//Returns eigther 'won' or 'playing'
	//===================================
	gio.sokoban_is_game_won=function()
	{

		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];

		var test='won';
		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;
		var targets_ix=gm.colonies['target'].ix;
		var boxes_ix=gm.colonies['box'].ix;
		tp.core.each(pos[targets_ix], function(target_ix,target){
			var filled=false;
			tp.core.each(pos[boxes_ix], function(box_ix,box){
				if(box.x===target.x && box.y===target.y){
					filled=true;
					return false;
				}
			});
			if(!filled){
				test='playing';
				return false;
			}				
		});
		return test;
	};

})(jQuery);
