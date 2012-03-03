(function( $ ){					//data for $.fn.tp$.game

	//secure names:
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gm=tp.game = tp.game || {};

	//specify data:
	var src ='img/hero.png';
	var colony=
	{
		nam			: 'hero',
		zorder		: 10,
		tiles_map	:
		[
			[ {}, {}, {src:src}, {}, {} ],
			[ {}, {}, {}, {src:src,selected:true}, {} ],
			[ {}, {}, {}, {}, {} ],
			[ {}, {}, {}, {}, {} ]
		]
	}


	//////// spawn data:

	gm.colonies = gm.colonies || [];
	var ix=gm.colonies.length;
	gm.colonies[ix]=colony;
	gm.colonies[colony.nam]=colony;

	colony.ix=ix;

})(jQuery);


