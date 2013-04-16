(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
gio.def.albums['flockmasters']={

	gkey : 'flockmasters',
	"ref" : { "env" : { dress_akey : "flocks" } },

	
	collections : 
			[
				{ credits : { title	:'Beginner' } },

				{
					"ref" : { "folder" : { fkey	: 'wells.txt' } },
					credits : { title	: "Wells" }
				}
			],
	

	/// dresses
	dresses  :{

			"default" :
			{ rules : "Heros push boxes of match-color and \nPull boxes of alien color.\nBlack matches own and any color ...\nBoxes are sticky: moved box moves its neighbours ...\n" },


		flocks :{ 

			skin_key : 'flocks',
			credits : { "date"		: "November 6, 2012" },

			rules	:
				"Teacher pushes brown Monkeys and pulls Antimonkeys.\n" +
				"When fellow is pushed or pulled, fellows of similar breed nearby\n"+
				"mock its move (if no obstacles prevent this).",

			objective : "Bring Monkeys to chairs of their color or to white or black color.",

			story:
				"The Law of school says: the pupil can only be taught\n" +
				"when it is in his chair or egg\n" +
				"It is permittable, in break time to leave own place\n" + 
				"but be sure to get back when classes begin ...\n" +
				"One who has lost its furniture, no longer can be taught...\n" +
				"....\n" +
				"When Teachers woke up afte a nap,\nthey found themselves at difficult task ...\n",

			hname_table	:{
				hero_x	: 'Teacher',
				hero_a	: 'Monkey shepherd',
				hero_b	: 'Antimonkey shepherd',
				hero_c	: 'Rabbit`s shepherd',
				box_a	: 'Monkey',
				box_b	: 'Antimonkey',
				box_c	: 'Rabbit',
				box_x	: 'Real monkey'
			},

			image_decoder	:{
					"box_b"		: "box_b_anti.png",
					"wall_b"	: "wall_b_anti.png",
					"target_a"	: "target_a_anti.png",
					"target_b"	: "target_b_anti.png"
			}
		}, //flocks

		chicken_garden :
		{
			rules : "Each bread has own Master to push.\nMaster's of other breed pull its species"
		},



		///forest
		forest :{

			credits		: { "date" : "November 2 2012" },

			rules	:
				"Hunter pushes monkeys and pulls antimonkeys.\n"+
				"Pushed fellow entails own-breed neighbours " +
				"if they can.\n",

			objective:
				"Bring monkeys to bananas",

			story : "Everyone is lost and lost own things ... ",

			hname_table	:{
				hero_a	: 'Hunter',
				hero_i	: 'Hunter',
				box_a	: 'Monkey',
				box_b	: 'Antimonkey'
			},

			image_decoder	:{
					"box_b"		: "box_b_anti.png",
					"wall_b"	: "wall_b_anti.png",
					"target_a"	: "target_a.png",
					"target_b"	: "target_b_anti.png"
			}
		}///forest

	}///dresses
};

})();


