(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='colortrain';
	gio.config[key]={
		nam			: 'Colortrain',
		basekey		: 'colorban_abstract',
		isabstract	: false,
		DEEPNESS_LIMIT:1000000, //how many boxes can be pushed
		key			: key,
		path 		: 'games/'+key,
		collections : [
			{	path: key+'/intro/intro.txt',
				title	: 'Intro',
				map_title_source	:'title'
			}
		],
		style	:{	play:{ backgroundColor:'#AAAAAA' } },
		default_collection_ix	:0,

		rules	:
			"the robot can push any number of boxes;\n"+
			"but colors of the robot and box must match;\n"+
			"black, grey, white match any color for robot, box, and target\n"

	};

})(jQuery);


