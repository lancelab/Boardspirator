(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='doubleban';
	gio.config[key]={
		nam			: 'Doubleban',
		basekey		: 'colorban_abstract',
		isabstract	: false,
		DEEPNESS_LIMIT:2, //how many boxes can be pushed
		key			: key,
		path 		: 'games/'+key,
		collections : [
			{
				path: key +'/intro/intro.txt', title:'Intro'
			},
			{	path: 'sokoban/grigoriev/grigr2002.txt', 
				map_title_source	:'comment'
			},
			{	path: 'sokoban/holland/2008_06_29.txt',
				title: 'David Holland. 2008_06_29.',
				map_title_source	:'title'
			}
		],
		default_collection_ix	:0,

		rules	:
			"the robot can push one or two boxes;\n"+
			"but colors of the robot and box must match;\n"+
			"black, grey, white match any color for robot, box, and target\n",

		style	:{	play:{ backgroundColor:'#AAAAAA' } }
	};

})(jQuery);


