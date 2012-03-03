(function( $ ){
	var tp  = $.fn.tp$ = $.fn.tp$ || {};	
	var gio = tp.gio   = tp.gio   || {};

	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var gm=games[gio.game_ix]={};
    var colonies=gm.colonies=[];

	gm.nam = 'Wanderers';


	//s p e c i f y  r u l e s :
	gm.DEEPNESS_LIMIT=2;
	gm.interact=
	{
		boss	: { box : 'push', wall : 'block', hero : 'push', boss : 'block' },
		hero	: { box : 'push', wall : 'block', hero : 'block', boss : 'block' },
		box		: { wall : 'block', box : 'block' }
	} 




	//s p e c i f y  m a p s :
	gm.master_board={xsize : 14, ysize : 7};


	gm.colony_ix=1; //optional. set default colony

	var src ='games/wanderers/img/boss.png';
	colonies.push(
	{
		nam			: 'boss',
		zorder		: 10,
		tiles_map	:
		[
			[ {}],
			[ {}],
			[ {}, {}, {src:src,selected:true}]
		]
	});



	src ='games/wanderers/img/box.png';
	colonies.push(
	{
		nam			: 'box',
		zorder		: 10,
		passive		: true,
		tiles_map	:
		[
			[ {}],
			[ {}],
			[ {}],
			[ {}],
			[ {}, {}, {}, {src:src}],
			[ {}, {}, {}, {src:src}],
			[ {}, {}, {}, {src:src}]
		]
	});



	src ='games/wanderers/img/hero.png';
	colonies.push(
	{
		nam			: 'hero',
		zorder		: 10,
		tiles_map	:
		[
			[ {}, {}, {src:src}],
			[ {}, {}, {}, {src:src,selected:true}]
		]
	});



	src	='games/wanderers/img/wall_674c.gif';
	colonies.push(
	{
		nam			: 'wall',
		zorder		: 2,
		frozen		: true,  //moving only in edit
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
	});

	//g u i:	 
	gm.tile	={ width : 20, height: 20 };
	gm.style={play:{},control:{},parent:{}}; //template

	gm.init_help=function()
	{
		//Will run after document.ready, hence all gio lib is available here:
		gm.story=
		"Our Boss and Heros, basically lost in the maze ... \n" +
		"Boss pretends sho knows what to do and tries to take control in her hands ... \n" +
		"Boxes contain necessary life supplies, but it is not know for how long they will last ...\n";

		gm.rules=
		"Try arrows and see what happens ... \n" +
		"Boxes are so heavy that can be only pushed ...\n"+
		"Perhaps two heros can push them at once ...\n";

		gm.credits=
		"This game skin design, art, and story is Copyright (c) 2011 Landkey.net under MIT license.\n" +
		"This game game framework and engine has separate copyright described here: " +
		gio.Description.Copyright + '. License: ' + gio.Description.License;
	};





})(jQuery);


