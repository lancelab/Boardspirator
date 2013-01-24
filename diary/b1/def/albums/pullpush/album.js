(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
	gio.def.albums['pullpush'] = {

		album_name	: 'TyaNee-TolKy',

			collections :
			[ 
				{	"list_title" : "Beginner" },


				{	"list_title"	: "Unexplored. David Holland. dh1.",				"ref" : { "folder" : {  "akey" : "sokoban", "fkey": "authentic_David_Holland_dh1.txt",	"ckey": "holland"  } }, 	
					/*,
					sugar :
					{ 
						do_colorize_randomly :
						{
									box : 3,
									target : 3,
									hero : 3
						}
					} */
				},

			{	

				"list_title"	: "Unexplored. D. W. Skinner. Microban.",			"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban1.txt",	"ckey": "skinner" }  },

				sugar : { 
							do_colorize_randomly : {
								box : 4,
								target : 4,
								hero: 4
							}
				}


			}
		],



		dresses  :
		{ 
			'default' :
			{
				tile	: { width : 30, height: 30 },
				rules	: "The hero pushes boxes of matching colors and\npulls boxes of other colors"
			},

			'pullpush' :
			{

					skin_key	: 'pullpush',
					chosen		: true,

					credits : {
						"title"		: "Dinner",
						"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
						"license"	: "host-based",
						"web_site"	: "http://landkey.net/gio/gio/play",
						"date"		: "November 2 2012",
						"email"		: "beaverscript (a) landkey (.) net"
					},

					tile	:{	width	: 60, height: 60 },
					style	:{	play	:{	backgroundImage:'background.png',
											backgroundColor:''
										},
							},			

					rules 		: "Hero pushes gold and food of own color and \npulls food of other colors",
					objective	: "Put food on color-matching plate.",
					story		: "It is already evening and heros are hungry.\nHelp them to serve a dinner.",


					hname_table	:{
							hero_b	: 'Rabbit',
							box_b	: 'cabbage',
							box_c	: 'carrot',
							box_x	: 'gold',
							wall_x	: 'obstacle'
					}
			}

		}// dresses

	};


	gio.def.albums['co_pullpush'] = {

		gkey	: 'co_pullpush',
		"env" : { "dress_akey" : "pullpush" },

		dresses  :
		{ 
			'default' :
			{
				rules	: "The hero pulls boxes of matching color and pushes boxes of other color."
			},

			"pullpush" :
			{
				"rules" 	: "Hero pulls food of own color and \npushes food of other colors"
			}

		}// dresses

	};



})();


