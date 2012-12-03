(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	
	
	gio.def.albums['doubleban']={


		gkey : 'doubleban',
		album_name	: 'Heavy Lifting',
		collections :[
			{	
				"credits" : {	"author"	: "Authors credited for each map separately",
								"title"		: "Intro",
								"license"	: "Each map is licensed separately."
				},

				address	:
				{
					ckey: 'intro',
					fkey: 'intro.txt', 
				},
				title:'Intro'
			},

			{	
				"ref" : {	"akey" : "sokoban",
								"ix"	: 0
				}
			},

			{
				"ref" : {	"akey" : "sokoban",
								"ix"	: 1
				}
			}

		],// collections


		dresses  :  { 'default' :
			{
				rules	:
					"The robot can push one or two boxes of matching color.\n"+
					"Black matches any color.\n",

				style	:{	play:{ backgroundColor:'#666666' } }
			}
		}

	};

})();


