(function( $ ){
	var tp  = $.fn.tp$ = $.fn.tp$ || {};	
	var gio = tp.gio   = tp.gio   || {};

	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var gm=games[gio.game_ix]={};
    var colonies=gm.colonies=[];

	gm.nam = 'Sokoban';

	//s p e c i f y  r u l e s :
	gm.DEEPNESS_LIMIT=2;
	gm.interact=
	{
		hero	: { box : 'push', wall : 'block'},
		box		: { wall : 'block', box : 'block' }
	} 

	//Test is position winning.
	//Returns eigther 'won' or 'playing'
	gm.doreport=function()
	{
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


	//gm.colony_ix=1; //optional. set default colony


	//s p e c i f y  m a p s :
	gm.master_board={xsize : 14, ysize : 7};

	src ='games/sokoban/img/hero.png';
	colonies.push(
	{
		nam			: 'hero',
		zorder		: 10,
		tiles_map	:
		[
			[{}],
			[{}],
			[{},{},{},{},{},{},{},{},{},{},{src:src}]
		]
	});



	src ='games/sokoban/img/box.png';
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



	src	='games/sokoban/img/wall_674c.gif';
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

	src	='games/sokoban/img/target.png';
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
	gm.style.parent.backgroundColor='#EEEEEE';
	gm.style.parent.backgroundImage='games/sokoban/img/background.png';

	gm.init_help=function()
	{
		//Will run after document.ready, hence all gio lib is available here:
		gm.story=
		"Our Hero, the robot, walks through the maze and pushes the boxes to dark cells.\n" +
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



})(jQuery);


