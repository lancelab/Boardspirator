(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums['antiflocks']={

		gkey : 'antiflocks',
		collections : 
			[
				{
					address	:
					{
						akey: 'antiflocks',
						fkey: 'intro.txt'
					},
					title	:'Intro'
				},

				{
					address	:
					{
						akey: 'antiflocks',
						fkey: 'wells.txt'
					},
					title	:'Wells'
				}


			],



		dresses  :{


			'default' :{	tile	:{	width : 45, height: 45 },
							rules	:	"Heros push boxes of matching-color and \nPull boxes of alien color.\nBlack matches own and other color ...\nBoxes are sticky: moved box moves its neighbours ...\n",

							image_decoder	:{
								'ground_a' : 'ground_x.png',
								'ground_b' : 'ground_x.png',
								'wall_a' : 'wall_x.png',
								'wall_b' : 'wall_x.png'
							},
			},


			flocks :{
							skin_key : 'antiflocks',
							title	:   'Zoo',
							chosen : true,

							credits : {
								"author"	: "Konstantin Kirillov",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"web_site"	: "http://landkey.net/gio/gio/play",
								"date"		: "November 2 2012"
							},

			
							links	:	[],

							//////////////////////// GUI /////////////////////////////////
							tile	:{	width : 45, height: 45 },
							style	:{	play:{
										backgroundImage : 'background.png'
									},
							},			
							//////////////////////// GUI END /////////////////////////////////


			//////////////////////// INFO /////////////////////////////////
			rules	:
				"When fellow is pushed or pulled, fellows nearby\n"+
				"mock its move if space allows.\n"+
				"Teachers push own breed and pull others.\n",

			objective:
				"Fill out all available targets. Each breed has own targets to occupy.",

			story:
				"The Law of school says: the pupil can only be taught\n" +
				"when it is in his chair or egg\n" +
				"It is permittable, in break time to leave own place\n" + 
				"but be sure to get back when classes begin ...\n" +
				"One who has lost its furniture, no longer can be taught...\n" +
				"....\n" +
				"When Teachers woke up afte a nap,\nthey found themselves at difficult task ...\n",
			//////////////////////// INFO END /////////////////////////////////



			/// masks with human names ... 
			hname_table	:{ //optional
				hero_x	: 'teacher',
				hero_a	: 'monkey`s shepherd',
				hero_b	: 'antimonkey shepherd',
				hero_c	: 'rabbit`s shepherd',
				box_a	: 'monkey',
				box_b	: 'antimonkey',
				box_c	: 'rabbit',
				box_x	: 'real monkey'
			},


				/// mask with human images ... 
				image_decoder	:{
					'ground_a' : 'ground_x.png',
					'ground_b' : 'ground_x.png',
					'wall_a'   : 'wall_x.png',
					'wall_b'   : 'wall_x.png'
				}

			}, //flocks





			forest :{
							skin_key : 'forest',
							title	:   'Forest',
							skip : true,

							
							credits : {
								"author"	: "Konstantin Kirillov",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"web_site"	: "http://landkey.net/gio/gio/play",
								"date"		: "November 2 2012"
							},

			
							links	:	[],

							//////////////////////// GUI /////////////////////////////////
							tile	:{	width : 80, height: 80 },
							style	:{	play:{
										backgroundImage : 'background.png'
									},
							},			
							//////////////////////// GUI END /////////////////////////////////
							

			// //\\ INFO /////////////////////////////////
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
			// \\// INFO /////////////////////////////////



			/// masks with human names ... 
			hname_table	:{ //optional
				hero_x	: 'hunter',
				box_a	: 'fellow monkey',
				box_b	: 'fellow chick'
			},

			/// mask with human images ... 
			image_decoder	:{
					'ground_a' : 'ground_x.png',
					'ground_b' : 'ground_x.png'
			}





			}//flocks






		}//dresses
	};


})();


