
(function( $ ){					//data for $.fn.tp$.game


	//secure names:
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gm=tp.game = tp.game || {};


	//specify data:
	var src	='img/wall_674c.gif';
	var colony=
	{
		nam			: 'wall',
		zorder		: 2,
		tiles_map	:
		[
			[ {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src}, {src:src} ],
			[ {src:src}, 		{},		   {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {src:src} ],
			[ {src:src}, 		{src:src}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {src:src}, {src:src} ],
			[ {src:src}, 		{src:src}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {src:src}, {src:src} ],
			[ {src:src}, 		{src:src}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {src:src}, {src:src} ],
			[ {src:src}, 		{src:src}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {src:src}, {src:src} ],
			[ {src:src}, 		{src:src}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {src:src}, {src:src} ]
		]
	};


	//////// spawn data:

	gm.colonies = gm.colonies || [];
	var ix=gm.colonies.length;
	gm.colonies[ix]=colony;
	gm.colonies[colony.nam]=colony;

	colony.ix=ix;

})(jQuery);

