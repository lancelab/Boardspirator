(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
	gio.def.albums[ 'colorban' ] = 
	{

		gkey : 'colorban',
		collections :
		[
				{
					"credits" : { "title"		: "Team of Two"	},
					"ref" : { "folder" : { fkey : 'team_of_two.txt'	} }
				},

				{
					"credits" : {	"title"		: "Soko Derivations" },
					"ref" : { "folder" : { fkey : 'soko_derivations.txt' } }
				},

				{
					"credits" : { "title"		: "Beginner"	}
				}

		],


		dresses :
		{	"default" :
			{
				rules : "Heros push boxes of match-color.\nBlack matches own and any color ...\n",

				links	:
				[
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
					{title:'<a href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
					{title:'<a href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'}
				],

				style	:
				{	play :
					{
						"backgroundImage": "",
						"backgroundColor": "#666666"
					}
				}
	
			}, // default


			/// colorban_vases
			"colorban_vases" :
			{

				skin_key : 'colorban_vases',
				skip	: true,
				credits : { title : "Rozen Stones", "date" : "January 4, 2013" },
				tile	: {	width : 100, height: 100 },
				"style"	:
				{			"play" :
							{	"backgroundImage" : "background.png",
								"backgroundColor" : ""
							}
				},			
				focuser : '',

				rules : "Rozen Stones are very delicate ...\n" +
						"They survive only if handled by Gardeners dressed in their \n" +
						"own color and planted in vases with their own color ...\n" +
						"Only the Black Rose recognizes any color, and \n" +
						"Black Gardener admitted by any Rose.\n" + 
						"The Crocodiles are devoted to plant Roses in this \n" +
						"annoying desert ... \n",

				objective : "Plant all Roses",


				hname_table	:{
					hero_x	: 'Black Master',
					hero_a	: 'Blue Gardener',
					hero_b	: 'Green Gardener',
					hero_c	: 'Red Gardener',
					hero_d	: 'Yellow Gardener',
					box_x	: 'Black Rose',
					box_a	: 'Blue Rose',
					box_b	: 'Green Rose',
					box_c	: 'Red Rose',
					box_d	: 'Yellow Rose'
				},



				links	:
				[
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
					{title:'<a href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
					{title:'<a href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'}
				]
	
			} /// colorban_vases


		} // dresses
	}; //gio.def.albums[ 'colorban' ]




	gio.def.albums['co_colorban'] = {

		"ref" : { "env" : { dress_akey	: "colorban" } },

		dresses  :
		{ 
			"default" :
			{
				rules	: "The heros pull boxes of matching color."
			}
		}

	};



})();


