
(function( $ ){					//subplugin for $.fn.tp$.game

	//secure names:
	$.fn.tp$ = $.fn.tp$ || {};	
	var game=$.fn.tp$.game = $.fn.tp$.game || {};

	var src	='img/wall_674c.gif';
	var map_tiles	=	
	[
			[ {src:src}, {src:src}, {src:src}, {src:src}, {src:src} ],
			[ {}, {}, {src:src}, {src:src}, {src:src} ],
			[ {src:src}, {}, {src:src}, {src:src}, {src:src} ],
			[ {src:src}, {src:src}, {src:src}, {src:src}, {src:src} ],
			[ {src:src}, {src:src}, {src:src}, {src:src}, {src:src} ]
	];

	game.initWallTiles = function()
	{
		game.initTiles(1,map_tiles,'wall');
	}

})(jQuery);

