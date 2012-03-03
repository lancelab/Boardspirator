
(function( $ ){					//subplugin for $.fn.tp$.game

	//secure names:
	$.fn.tp$ = $.fn.tp$ || {};	
	var game=$.fn.tp$.game = $.fn.tp$.game || {};

	var src ='img/hero.png';
	tiles_map =
	[
			[ {}, {}, {src:src}, {}, {} ],
			[ {}, {}, {}, {src:src,selected:true}, {} ],
			[ {}, {}, {}, {}, {} ],
			[ {}, {}, {}, {}, {} ]
	];

	game.initHeroTiles = function()
	{
		game.initTiles(10,tiles_map,'hero');
	}

})(jQuery);

