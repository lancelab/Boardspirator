(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	

	
	gio.def.albums['colortrain']={

		game	:{ basekey	: 'colortrain' },

		bundle :
		{
			album_name		: 'Caterpillars',
			collections 	:[
			{	address	:
				{
					collection_key : 'intro',
					file_key : 'intro.txt',
				},
				title	: 'Intro',
				map_title_source	:'title'
			}]
		},// bundle


		dresses  :  { 'default' :
			{
				style : {	play:{ backgroundColor:'#AAAAAA' } },
				rules :
					"the robot can push any number of boxes;\n"+
					"but colors of the robot and box must match;\n"+
					"black matches any color for robot, box, and target\n"
			}
		}// dresses

	};

})();


