(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var game=games[gio.game_ix]={};

	game.nam = 'Sokoban';
	game.title=game.nam; //TODm later

	game.path ='games/sokoban';
	game.collections=[
		{	path: 'sokoban/grigoriev/grigr2002.txt', 
			skip_non_map_lines : false //true - to put all maps into one board, optional
		},
		{path: 'sokoban/holland/2008_06_29.txt'},
		{path: 'sokoban/kirillov/livemaze.txt'}
	];
	game.collections.ix=0;

	//TODm q&d:
	tp.core.each(game.collections,function(i,v){v.title = v.title || v.path;});


	////////////////////////////////////////////////////
	//s p e c i f y  r u l e s
	//==================================================
	game.DEEPNESS_LIMIT=1; //how many boxes can be pushed
	game.interact=
	{
		hero	: { box : 'push', wall : 'block'},
		box		: { wall : 'block', box : 'push' }
	} 

	//===================================
	//This function is optional.
	//Test is position winning. Returns eigther 'won' or 'playing'.
	game.won_or_not=function(){ return gio.sokoban_is_game_won(); };

	//==================================================
	//s p e c i f y  r u l e s
	////////////////////////////////////////////////////




	//////////////////////// GUI /////////////////////////////////
	game.tile	={ width : 25, height: 25 };
	game.style={play:{},control:{},parent:{}}; //template

	game.style.control.backgroundImage='';
	game.style.control.backgroundColor='#000000';

	game.style.play.backgroundImage=game.path+'/img/background.png';
	game.style.play.backgroundColor='';

	game.style.parent.backgroundImage='';
	game.style.parent.backgroundColor='#000000';
	//////////////////////// GUI END /////////////////////////////////





	//////////////////////// INFO /////////////////////////////////
	//Will run after document.ready, hence all gio lib is available here:
	game.init_help=function()
	{
		game.rules=
		"robot can push a box";

		game.objective=
		"push all boxes into black cells";

		game.story=
		"Our Hero, the robot, walks through the maze and pushes the boxes to dark cells.";


		game.credits=
		"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
		"This game, "+game.nam+ ", skin design, art, and story is Copyright (c) 2011 Landkey.net under MIT license.\n";

	};
	//////////////////////// INFO END /////////////////////////////////







	//////////////// mask with human names ... ///////////////////////
	var hname_table={ //optional
		hero	: 'robot'
	};
	game.human_name=function(internal){	return hname_table[internal] || internal; };
	///////////////////////////////////////////////////////////////////





	/////////////////////////////////////////////////////////////////////////////
	// maps. still "clumzy", but on the way to compact maps ...
	/////////////////////////////////////////////////////////////////////////////

	game.image_decoder={
		'hero':'hero.png',
		'box':'box.png',
		'wall':'wall.png',
		'target':'target.png',
		'ground':'ground.png'
	};

	tp.core.each(game.image_decoder, function(k,v){
		if(v) game.image_decoder[k] = game.path+'/img/'+v;
	});


	//default if no file:
	game.default_maps_text=
	"Default Map Test\n"+
	"\n"+
	"\t############\r\n"+
	"#       ...#\n"+
	"#---b$$ ####\n"+
	"# ###@###\n"+
	"#______#\n"+
	"#------#\n"+
	"########";


	game.maps_decoder=function(data){ return gio['sokoban_maps_decoder'].decode(game,data); };
	game.load_maps=function(){ gio.load_maps(game); };

})(jQuery);


