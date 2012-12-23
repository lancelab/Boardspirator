(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	
	
	gio.def.albums['doubleban']={


		gkey : 'doubleban',
		album_name	: 'Heavy Lifting',
		collections :[
			{	
				"credits" : {	"author"	: "Authors credited for each map separately",
								"title"		: "Beginner",
								"license"	: "Each map is licensed separately."
				}
			},

			{	"list_title"	: "Unexplored. D. W. Skinner. Microban.",			"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban1.txt",	"ckey": "skinner" }  } },
			{	"list_title"	: "Unexplored. David Holland. dh1.",				"ref" : { "folder" : {  "akey" : "sokoban", "fkey": "authentic_David_Holland_dh1.txt",	"ckey": "holland",  } }, 	"map_title_source"	: "comment"  }


		],


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


