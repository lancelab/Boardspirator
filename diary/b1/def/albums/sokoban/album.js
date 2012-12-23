(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums[ 'sokoban' ] =
	{
			collections :[

				{	"list_title"	: "David Holland. dh1.",					"ref" : { "folder" : { "fkey": "authentic_David_Holland_dh1.txt",	"ckey": "holland" } }, 	"map_title_source"	: "comment" },

				{	"list_title"	: "David W Skinner. Microban.",				"ref" : { "folder" : { "fkey": "microban1.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Microban II.",			"ref" : { "folder" : { "fkey": "microban2.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Microban III.",			"ref" : { "folder" : { "fkey": "microban3.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Microban IV.",			"ref" : { "folder" : { "fkey": "microban4.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Microban V.",			"ref" : { "folder" : { "fkey": "microban5.txt",	"ckey": "skinner"  } } },

				{	
					"ref" :
					{ 
						link :
						{	
							link : 'http://users.bentonrea.com/~sasquatch/sokoban/m5'
						}
					},
					credits : { "author"	: "David W Skinner",
								"title"		: "Microban V (26 puzzles, October 2010, this set is unfinished)",
								"copyright" : "Copyright (c) 2010 David W Skinner",
								"license"	: "The sets Sasquatch and Microban may be freely distributed provided they remain properly credited.",
								"web_site"	: "http://users.bentonrea.com/~sasquatch/sokoban/",
								"email"		: "s a s q u a t c h (a) b e n t o n r e a . c o m"
							  }
				},



				{	"list_title"	: "David W Skinner. Sasquatch.",			"ref" : { "folder" : { "fkey": "sasquatch1.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch II.", 		"ref" : { "folder" : { "fkey": "sasquatch2.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch III.", 		"ref" : { "folder" : { "fkey": "sasquatch3.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch IV.", 		"ref" : { "folder" : { "fkey": "sasquatch4.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch V.", 			"ref" : { "folder" : { "fkey": "sasquatch5.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch VI.", 		"ref" : { "folder" : { "fkey": "sasquatch6.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch VII.", 		"ref" : { "folder" : { "fkey": "sasquatch7.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch VIII.", 		"ref" : { "folder" : { "fkey": "sasquatch8.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch IX.", 		"ref" : { "folder" : { "fkey": "sasquatch9.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch X.", 			"ref" : { "folder" : { "fkey": "sasquatch10.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch XI.", 		"ref" : { "folder" : { "fkey": "sasquatch11.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch XII.", 		"ref" : { "folder" : { "fkey": "sasquatch12.txt",	"ckey": "skinner"  } } },


			{
				"ref" : { "folder" : {	ckey: 'grigoriev', fkey: 'grigr2001.txt' } },
				credits : { "title"		: "Evgeny Grigoriev. 2001." },
				map_title_source	:'comment'
			},

			{
				"ref" : { "folder" : {	ckey: 'grigoriev', fkey: 'grigr2002.txt' } },
				credits : { "title"		: "Evgeny Grigoriev. 2002." },
				map_title_source	:'comment'
			},



			{
				"ref" : { "folder" : {	ckey: 'wierdy' } },
				credits : { "title"		: "Weirdy" 	},
				map_title_source	:'comment'
			}

		],


		/// dresses
		dresses  :
		{	'default' :
			{

				links	:	[
					{title:'<a target="_blank" href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
					{title:'<a target="_blank" href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
					{title:'<a target="_blank" href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
					{title:'<a target="_blank" href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'},
					{title:'<a target="_blank" href="http://sneezingtiger.com/sokoban/levels.html">Some Levels</a>'},
					{title:'<a target="_blank" href="http://www.sneezingtiger.com/sokoban/levels/yoshioText.html">Non Researched Source</a>'},
					{title:'<a target="_blank" href="http://sokoban.ws/">MF8 Sokoban Competition</a>'}
				],

				rules: 	"robot can push a box",
				objective: 	"push all boxes into black cells",
				story: 	"Our Hero, the robot, walks through the maze and pushes the boxes to dark cells."

			}, // default

			'pullpush' :
			{

					skin_key	: 'pullpush',

					credits : {
						"title"		: "Dinner",
						"author"	: "Konstantin Kirillov",
						"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
						"license"	: "host-based",
						"web_site"	: "http://landkey.net/gio/gio/play",
						"date"		: "November 2 2012",
						"email"		: "beaverscript (a) landkey (.) net"
					},

					tile	:{	width	: 40, height: 40 },
					style	:{	play	:{	backgroundImage:'background.png',
											backgroundColor:''
										}
							},			

					rules 		: "Rabbit can push cabbage",
					objective	: "Fill dishes with food",
					story		: "It is already evening and hero is hungry.\nWho can help to serve the dinner?",


					hname_table	:{
							hero_b	: 'Rabbit',
							box_b	: 'cabbage',
							wall_x	: 'vase'
					},

					image_decoder	:{
							hero_x		:	"hero_a_hat.png",
							box_x		:	"box_b.png",
							target_x	:	"target_b.png"
					}
			}

		}/// dresses
	};

})();


