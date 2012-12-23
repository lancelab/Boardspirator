(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
gio.def.albums['flocks']={

	gkey : 'flocks',

	collections : 
			[
				{ credits : { title	: "Beginner" } },

				{ 	"ref" : { "folder" : { fkey	: 'wells.txt' } },
					credits : { title	: "Wells" }
				}
			],



	dresses  :{


		"default"	:{	tile	:{	width : 60, height: 60 },
						rules	:	"Heros push boxes of match-color ...\nBlack matches own and any color ...\nBoxes are sticky: moved box moves its neighbours ...\n"
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

