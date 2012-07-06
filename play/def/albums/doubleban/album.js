(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	
	
	gio.def.albums['doubleban']={


		game	:{ basekey : 'doubleban' },


		bundle	:
		{
			album_name	: 'Heavy Lifting',
			collections :[
			{	address	:
				{
					collection_key: 'intro',
					file_key: 'intro.txt', 
				},
				title:'Intro'
			},
			{	address	:
				{
					album_key: 'sokoban',
					collection_key : 'grigoriev',
					file_key: 'grigr2002.txt', 
				},
				map_title_source	:'comment'
			},
			{	address	:
				{
					album_key: 'sokoban',
					collection_key : 'holland',
					file_key : '2008_06_29.txt', 
				},
				title: 'David Holland. 2008_06_29.',
				map_title_source	:'title'
			}]// collections
		},// bundle


		dresses  :  { 'default' :
			{
				rules	:
					"the robot can push one or two boxes;\n"+
					"but colors of the robot and box must match;\n"+
					"black matches any color for robot, box, and target\n",

				style	:{	play:{ backgroundColor:'#666666' } }
			}
		}

	};

})();


