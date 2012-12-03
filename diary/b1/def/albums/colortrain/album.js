(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	

	
	gio.def.albums['colortrain']={

		gkey	: 'colortrain',
		album_name	: 'Caterpillars',

		collections 	:[
		{	

				"credits" : {	"author"	: "Authors credited for each map separately",
								"title"		: "Intro",
								"license"	: "Each map is licensed separately."
				},

				address	:
				{
					ckey : 'intro',
					fkey : 'intro.txt',
				},
				title	: 'Intro',
				map_title_source	:'title'
		}],


		dresses  :  { 'default' :
			{
				style : {	play:{ backgroundColor:'#AAAAAA' } },
				rules :
					"The robot can push any number of boxes of matching color.\n"+
					"Black matches any color.\n"
			}
		}// dresses

	};

})();


