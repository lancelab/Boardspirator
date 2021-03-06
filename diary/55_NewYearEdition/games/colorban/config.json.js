	{

		"_comm1" : "//////// Genereal ////////////////////////////////////////////",

		"nam" : "Colorban",
		"path" : "games/colorban",
		"collections" : [
			{"path": "colorban/kirillov/intro.txt"}
		],
		"default_collection_ix"	:0,
		"links"	:	[
			{"title":"<a href=\"http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html\">Yoshio Murase and Masato Hiramatsu. Handmade.</a>"},
			{"title":"<a href=\"http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html\">Yoshio Murase. Autogenerated.</a>"},
			{"title":"<a href=\"http://www.sourcecode.se/sokoban/levels.php\">Possibly enough for one human life ...</a>"},
			{"title":"<a href=\"http://users.bentonrea.com/~sasquatch/sokoban/\">Sokoban puzzles by David W. Skinner</a>"}
		],





		"_comm2" : "//////// s p e c i f y  r u l e s ////////////////////////////////////////////",

		"DEEPNESS_LIMIT"	:1,	"_comm_in2" : "how many boxes can be pushed",
		"herd_size"			:0,	"_comm_in3"	: "flag. >0 for flock behaviour",
		"activity_role"	:{
							"ground"		: "frozen"
		},

		"interact_rules"	:{
			"blocking_policy":true,
			"non_blocks":{"ground" : true}
		},




		"_comm3" : "//////// G U I ////////////////////////////////////////////",

		"tile"	:{ "width" : 25, "height" : 25 },
		"style"	:{	"play":{
							"backgroundImage":"background.png",
							"backgroundColor":""
					},

					"control":{
						"backgroundImage":"",
						"backgroundColor":"#000000"
					},

					"parent":{
						"backgroundImage":"",
						"backgroundColor":"#000000"
					}
		}, 



		"_comm4" : "//////// I n f o ////////////////////////////////////////////",

		"rules"	:
			"the robot can push only one box with matching color\nblack, grey, white match any color for robot, box, and target\n",

		"objective":
			"push all boxes into dark cells with matching color\n",

		"story":
			"Our Hero, thr robot, walks through the maze and pushes the boxes to dark cells.",


		"credits":
			"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\nSkin design, art, and story of #%game.nam%# is Copyright (c) 2011 Konstantin Kirillov under MIT license.\nAny similarity with other games is incidental and not intentional.\n",




		"_comm5" : "//////// M a s k   w i t h   h u m a n   n a m e s ",
		"hname_table"	:{ 
				"hero_x"	: "robot"
		},



		"image_decoder"	:{
					"ground":"ground.png"
		}
	}

