
( function () {	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
gio.def.albums['flocks']={

	gkey : 'flocks',

	collections : 
			[
				{	ckey : 'beginner', credits : { title	: "Beginner" } },

				{ 	ckey : 'wells', "ref" : { "folder" : { fkey	: 'wells.txt' } },
					credits : { title	: "Wells" }
				}
			],



	dresses  :{


		"default"	:{	tile	:{	width : 60, height: 60 },
						rules	:	"Heros push boxes of match-color ...\nBlack matches own and any color ...\nBoxes are sticky:\npushed box moves contacting boxes\nof the same color."
					},

		/* abandoned, see bugs ...  why ..
		// not sure about inherit_from ... implemented?
		"chickens_promoted" :
		{
			skip : true,
			skin : "flockgarden"

		},
		*/

		chicken_garden :
		{

			credits : {
								"title" : "Chicken Garden",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"date"		: "December 30, 2012"
			},
			tile	:{	width : 60, height: 60 },
			style	:{	play:{ backgroundImage : 'background.png' } },			

			
			//inherit_from : "flocks", //TODO fails? will work? from own game?
			skin_key : "flockgarden",
			rules : "Each manager can push subject \nonly of own breed.",
			objective : "Put each breed in to own eggs.",
			skip : true,

			image_decoder :
			{
					"hero_f"	: "blue_man2.png",
					"box_f"		: "blue_chick.png",
					"target_f"  : "blue_target.png",
					"box_g"		: "red_chick.png",
					"hero_g"	: "red_man2.png",
					"target_g"  : "red_target.png",
					"ground_x"  : "egg_ground.png"
			},
			hname_table	:{
				hero_x	: 'grey manager',
				hero_a	: 'blue manager',
				hero_b	: 'green manager',
				hero_c	: 'red manager',
				hero_d	: 'manager',
				hero_e	: 'manager',
				hero_f	: 'blue manager',
				hero_g	: 'red manager',
				hero_h	: 'manager',
				hero_i	: 'manager',
				box_f	: 'blue chick',
				box_g	: 'red chick',
				box_h	: 'chick'
			}
		},


		flocks :{

			skin_key : 'flocks',
			chosen : true,

			credits : {
								"title"		: "Flocks",
								"author"	: "Konstantin Kirillov",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"web_site"	: "http://landkey.net/gio/gio/play",
								"date"		: "November 2, 2012"
			},
			tile	:{	width : 60, height: 60 },
			style	:{	play:{ backgroundImage : 'background.png' } },			


			rules	:
				"When fellow is pushed, fellows nearby\n"+
				"mock its move if space allows.\n"+
				"Each breed pushed by own teacher.\n",

			objective:
				"Fill out all available targets. \nEach breed has own targets to occupy.",

			story:
				"The Law of school says: the pupil can only be taught\n" +
				"when it is in his chair or egg\n" +
				"It is permittable to leave own place\n" + 
				"in break time, but be sure to get back\n" +
				"when classes begin ...\n" +
				"One who has lost its furniture, no longer can be taught...\n" +
				"....\n" +
				"When Teachers woke up afte a nap, \nthey found themselves at difficult task ...\n",


			hname_table	:{
				hero_x	: 'Teacher',
				hero_a	: 'Monkey shepherd',
				hero_b	: 'Chicken shepherd',
				hero_c	: 'Rabbit shepherd',
				box_a	: 'Fellow monkey',
				box_b	: 'Fellow chick',
				box_c	: 'Fellow rabbit',
				box_x	: 'Monkey'
			}
		}, ///flocks




		forest :{
			skin_key : 'forest',
			skip : true,

							
			credits : {
								"title"		: "Forest",
								"author"	: "Konstantin Kirillov",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"web_site"	: "http://landkey.net/gio/gio/play",
								"date"		: "November 2 2012"
			},

			tile	:{	width : 80, height: 80 },
						style	:{	play:{
									backgroundImage : 'background.png'
					},
			},

			rules	:
				"Hunter pushes monkeys and birds.\n"+
				"Pushed fellow entails own-breed neighbours " +
				"if they can.\n",

			objective:
				"Bring monkeys to bananas and birds to eggs.",

			"story" :

				"... walking through a foggy forest,\n" +
				"Birds and monkeys mocking me.\n" +
				"Round by round around corners,\n" +
				"Thought by thought around tree.\n" +
				"\n" +
				"What a darkeness in this valley,\n" +
				"Cannot see beyond next step.\n" +
				"Drink not from the wells around you,\n" +
				"Dreamy water does not help.\n" +
				"\n" +
				"Path is long and mind is tired,\n" +
				"Back to place from where I went.\n" +
				"Am I first here lost impaired,\n" +
				"Can one stretch a hand of lead ...\n",


			hname_table	:{
				hero_x	: 'hunter',
				box_a	: 'fellow monkey',
				box_b	: 'fellow chick'
			}


		}///forest
	}//dresses


};
})();


