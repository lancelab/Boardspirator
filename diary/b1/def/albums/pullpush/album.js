(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
	gio.def.albums['pullpush'] = {

		album_name	: 'TyaNee-TolKy',

			collections : [
			{	
				"credits" : {	"title"		: "Intro" }
			},


			{
				"ref" : {		"akey" : "sokoban",
								"ix"	: 0
				},

				sugar : { 
							do_colorize_randomly : {
								box : 3,
								target : 3,
								hero : 3
							}
				}

			},

			{	

				"ref" : {	"akey" : "sokoban",
								"ix"	: 1
				},
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
				rules	: "The hero pushes boxes of matching color and pulls boxes of other color."
			},
			'pullpush' :
			{

					skin_key : 'pullpush',
					chosen	: true,
					title	: 'Dinner',

					credits : {
						"author"	: "Konstantin Kirillov",
						"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
						"license"	: "host-based",
						"web_site"	: "http://landkey.net/gio/gio/play",
						"date"		: "November 2 2012",
						"email"		: "beaverscript (a) landkey (.) net"
					},

					tile	: { width : 50, height: 50 },

					//////////////////////// GUI /////////////////////////////////
					tile	:{ width : 60, height: 60 },
					style	:{	play:{
										backgroundImage:'background.png',
										backgroundColor:''
								},
						},			
					//////////////////////// GUI END /////////////////////////////////

					//:: INFO 
					rules 		: "Hero pushes gold and food of own color and \npulls food of other colors",
					objective	: "Put food on color-matching plate.",
					story		: 'It is already evening and heros are hungry. Help them to serve a dinner.',


						//////////////// mask with human names ... ///////////////////////
						hname_table	:{ //optional
							hero_b	: 'rabbit',
							box_b	: 'cabbage',
							box_c	: 'carrot',
							box_x	: 'gold',
							wall_x	: 'obstacle'
						},
						///////////////////////////////////////////////////////////////////

						image_decoder	:{
							//wall_x	: 'bouquet_of_flowers_01.svg.med.png'
						}
			}

		}// dresses

	};


	gio.def.albums['co_pullpush'] = {

		gkey	: 'co_pullpush',
		dress_parent_akey : "pullpush",

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


