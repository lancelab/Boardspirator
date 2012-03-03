(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='sokoban';
	gio.config[key]={
		nam			: 'Sokoban',
		basekey		: 'colorban_abstract',
		isabstract	: false,
		key			: key,
		path 		: 'games/'+key,
		collections : [
			{
				path: key+'/grigoriev/grigr2002.txt', 
				map_title_source	:'comment'
			},
			{	path: key+'/holland/2008_06_29.txt',
				title: 'David Holland. 2008_06_29.',
				map_title_source	:'title'
			}
		],
		default_collection_ix	:0,
		links	:	[
			{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
			{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
			{title:'<a href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
			{title:'<a href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'},
			{title:'<a href="http://sneezingtiger.com/sokoban/levels.html">Some Levels</a>'},
			{title:'<a href="http://www.sneezingtiger.com/sokoban/levels/yoshioText.html">Non Researched Source</a>'},
			{title:'<a href="http://sokoban.ws/">MF8 Sokoban Competition</a>'}
		],

		img_path	: 'games/'+key+'/img',

		rules:
			"robot can push a box",

		objective:
			"push all boxes into black cells",

		story:
			"Our Hero, the robot, walks through the maze and pushes the boxes to dark cells.",

		credits:
			"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
			"Skin design, art, and story of #%game.nam%# is Copyright (c) 2011 Konstantin Kirillov under MIT license.\n"

	};


})(jQuery);


