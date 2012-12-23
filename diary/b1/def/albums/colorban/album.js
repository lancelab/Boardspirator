(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
	gio.def.albums[ 'colorban' ] = 
	{

		gkey : 'colorban',
		collections :
		[
				{
					"credits" : { "title"		: "Beginner"	}
				},

				{
					"credits" : { "title"		: "Team of Two"	},
					"ref" : { "folder" : { fkey : 'team_of_two.txt'	} }
				},

				{
					"credits" : {	"title"		: "Soko Derivations" },
					"ref" : { "folder" : { fkey : 'soko_derivations.txt' } }
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
	
			} // default
		} // dresses
	}; //gio.def.albums[ 'colorban' ]




	gio.def.albums['co_colorban'] = {

		dress_parent_akey	: "colorban",

		dresses  :
		{ 
			"default" :
			{
				rules	: "The heros pull boxes of matching color."
			}
		}

	};



})();

