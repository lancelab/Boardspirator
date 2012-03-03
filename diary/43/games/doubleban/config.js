(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var gm=games[gio.game_ix]={maps:[]};

	gm.nam = 'Doubleban';
	gm.path ='games/doubleban';


	////////////////////////////////////////////////////
	//s p e c i f y  r u l e s :
	//==================================================
	gm.DEEPNESS_LIMIT=2; //how many boxes can be pushed
	gm.interact=
	{
		hero	: { box : 'push', wall : 'block'},
		box		: { wall : 'block', box : 'push' }
	} 

	//===================================
	//This function is optional.
	//Test is position winning. Returns eigther 'won' or 'playing'.
	gm.doreport=function(){ return gio.sokoban_is_game_won(); };

	//==================================================
	//s p e c i f y  r u l e s :
	////////////////////////////////////////////////////









	//////////////////////// GUI /////////////////////////////////
	gm.tile	={ width : 25, height: 25 };
	gm.style={play:{},control:{},parent:{}}; //template

	gm.style.control.backgroundImage='';
	gm.style.control.backgroundColor='#000000';

	gm.style.play.backgroundImage=gm.path+'/img/background.png';
	gm.style.play.backgroundColor='';

	gm.style.parent.backgroundImage='';
	gm.style.parent.backgroundColor='#000000';
	//////////////////////// GUI END /////////////////////////////////





	//////////////////////// INFO /////////////////////////////////
	gm.init_help=function()
	{
		//Will run after document.ready, hence all gio lib is available here:
		gm.story=
		"Our hero has doubled own power ... can push two boxes at once ...";


		gm.rules=
		"Objective: push all boxes into black cells.\n" +
		"Our hero, robot, cannot pull boxes, but can push one or two boxes.";


		gm.credits=
		"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
		"Maps' credits are possibly <a style=\"color:#AAAAFF;\" href=\""+gm.path+"/original_maps.txt\">here</a>.\n"+
		"This game, "+gm.nam+ ", skin design, art, and story is Copyright (c) 2011 Landkey.net under MIT license.\n";
	};
	//////////////////////// INFO END /////////////////////////////////







	//////////////// generalizing Sokoban names: ... //////////////////
	//perhaps not all the name generalized
	gm.sokoban_pusher_name='hero';
	gm.sokoban_box_name='box';
	gm.sokoban_target_name='target';
	gm.sokoban_floor_name='ground';
	gm.sokoban_wall_name='wall';
	///////////////////////////////////////////////////////////////////



	/////////////////////////////////////////////////////////////////////////////
	// maps. still "clumzy", but on the way to compact maps ...
	/////////////////////////////////////////////////////////////////////////////
	gm.decoder={ //Sokoban decoder
		'#':['wall'],

		'@':['hero'],
		'p':['hero'],

		'+':['hero','target'],
		'P':['hero','target'],

		'$':['box'],
		'b':['box'],
		'*':['box','target'],
		'B':['box','target'],

		'.':['target'],
		'o':['target'],
		
		' ':['ground'],
		'-':['ground'],
		'_':['ground']
	};


	gm.image_decoder={
		'hero':'hero.png',
		'box':'box.png',
		'wall':'wall_674c.gif',
		'target':'target.png',
		'ground':''
	};

	tp.core.each(gm.image_decoder, function(k,v){
		if(v) gm.image_decoder[k] = gm.path+'/img/'+v;
	});


	//default if no file:
	gm.default_maps_text=
	"\t############\r\n"+
	"#       ...#\n"+
	"#---b$$ ####\n"+
	"# ###@###\n"+
	"#______#\n"+
	"#------#\n"+
	"########";


	gm.skip_non_map_lines=false; //true - to put all maps into one board
	gm.maps_decoder=function(data){ return gio['sokoban_maps_decoder'](gm,data); };
	gm.load_maps=function(){ gio.load_maps(gm); };
	gm.maps_loaded='waiting for load..';

})(jQuery);


