(function( $ ){
	var tp  = $.fn.tp$ = $.fn.tp$ || {};	
	var gio = tp.gio   = tp.gio   || {};

	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var gm=games[gio.game_ix]={};
    var colonies=gm.colonies=[];

	gm.nam = 'Multiban';
	gm.path ='games/multiban';

	gm.sokoban_box_name='box';
	gm.sokoban_target_name='target';


	//s p e c i f y  r u l e s :
	gm.DEEPNESS_LIMIT=2;
	gm.interact=
	{
		hero	: { box : 'push', wall : 'block', hero:'block'},
		box		: { wall : 'block', box : 'block', hero:'block'}
	} 

	//===================================
	//Test is position winning.
	//Returns eigther 'won' or 'playing'
	//===================================
	gm.doreport=function(){ return gio.sokoban_is_game_won(); };


	//gm.colony_ix=1; //optional. set default colony


	//s p e c i f y  m a p s :
	gm.mboard={xsize : 15, ysize : 8};

	src=gm.path+'/img/hero.png';
	colonies.push(
	{
		nam			: 'hero',
		zorder		: 10,
		tiles_map	:
		[
			[{}],
			[{}],
			[{},{},{},{},{},{},{},{},{},{src:src},{src:src}]
		]
	});



	src=gm.path+'/img/box.png';
	colonies.push(
	{
		nam			: 'box',
		zorder		: 10,
		passive		: true,
		tiles_map	:
		[
			[{}],
			[{}],
			[{}],
			[{},{},{},{},{src:src},{src:src},{src:src}]
		]
	});



	src=gm.path+'/img/wall_674c.gif';
	colonies.push(
	{
		nam			: 'wall',
		zorder		: 2,
		frozen		: true,  //moving only in edit
		tiles_map	:
		[
			[{},{},{},{},{},{},{},{},{},{},{src:src},{src:src},{src:src},{src:src},{src:src}],
			[{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{},{},{src:src},{src:src}],
			[{src:src},{},{},{},{},{},{},{},{},{},{},{},{},{src:src},{src:src},{},{},{},{}],
			[{src:src},{},{},{},{},{},{},{},{},{},{src:src},{src:src},{},{src:src},{src:src},{},{}],
			[{src:src},{src:src},{src:src},{},{},{},{},{src:src},{src:src},{src:src},{src:src},{src:src},{},{},{src:src}],
			[{},{},{src:src},{src:src},{},{},{},{},{},{},{},{},{},{},{src:src}],
			[{},{},{},{src:src},{src:src},{src:src},{},{},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src}],
			[{},{},{},	{},{src:src},{src:src},{src:src},{src:src},{src:src}]
		]
	});

	src=gm.path+'/img/target.png';
	colonies.push(
	{
		nam			: 'target',
		zorder		: 2,
		frozen		: true,  //moving only in edit
		tiles_map	:
		[
			[{}],
			[{}],
			[{},{},{},{},{},{},{},{},{src:src},{src:src},{src:src}]
		]
	});

	//g u i:	 
	gm.tile	={ width : 30, height: 30 };
	gm.style={play:{},control:{},parent:{}}; //template
	//gm.style.parent.backgroundColor='#EEEEEE';
	//gm.style.parent.backgroundImage=gm.path+'/img/background.png';


	//rid:
	gm.style.control.backgroundImage='';
	gm.style.control.backgroundColor='#000000';

	gm.style.play.backgroundImage=gm.path+'/img/background.png';
	gm.style.play.backgroundColor='';

	gm.style.parent.backgroundImage='';
	gm.style.parent.backgroundColor='#000000';



	gm.init_help=function()
	{
		//Will run after document.ready, hence all gio lib is available here:
		gm.story=
		"Our Heros, the robots, walks through the maze and pushes the boxes to dark cells.\n" +
		"The objective of the game is to put all the boxes in dark cells.\n" +
		"The robot cannnot pull boxes.\n";

		gm.rules=
		"The objective of the game is to put all the boxes in dark cells.\n" +
		"The robot cannnot pull boxes.\n";

		gm.credits=
		"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
		"This game skin design, art, and story is Copyright (c) 2011 Landkey.net under MIT license.\n" +
		"This game game framework and engine has separate copyright described here: " +
		gio.Description.Copyright + '. License: ' + gio.Description.License;
	};

	gm.maps_loaded='success';


})(jQuery);


