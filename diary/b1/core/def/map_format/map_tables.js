(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;



	//\\// Configures map/path de(en)coder


	// Inverse encoder for heros and boxes:
	// Only for colorban map:
	var breed2symbol = cmd.breed2symbol={};
	var symbol2breed = cmd.symbol2breed={};



	///	sets playpath format
	cmd.playpath	={	
						// * for sokoban converters:
						DIRECTION : {d : 2, u : -2, l : -1, r : 1},

						TOKEN_SEPARATOR : '|',
						SUBTOKEN_SEPARATOR : '.'
					};	
	

	///	configures pure Sokoban mapper,
	//	format: map-symbol : breed
	cmd.sokoban_decoder_table={
		'#':'wall_x',
		'u':'wall_a', //extra
		'v':'wall_b', //extra


		'@':'hero_x',
		'p':'hero_x',

		'+':['target_x','hero_x'],
		'P':['target_x','hero_x'],

		'$':'box_x',
		'b':'box_x',
		'*':['target_x','box_x'],
		'B':['target_x','box_x'],

		'.':'target_x',
		'o':'target_x',
		
		' ':'ground_x',
		'-':'ground_x',
		'_':'ground_x'
	};



	// //\\ Configures colorban decoder table. Part I and II.

	///	Part I. Seeds colorban mapper,
	//	format: map-symbol : breed
	cmd.colorban_decoder_table={
		// Part I. Before autobuiling, 
		// adds a little bit Sokoban compatibility:
		'#':'wall_x',
		'-':'ground_x',
		'_':'ground_x',
		'$':'box_x',
		'@':'hero_x',
		'.':'target_x',

		'+':['target_x','hero_x'],
		'*':['target_x','box_x']
	};

	/// Part II. Finalizes colorban mapper,
	cmd.finalize_colorban_decoder_table = function( game ) {

		var cnames = game.cnames;
		// i=color_ix:
		for(var i=0; i<game.colors.length; i++){
			var t=cmd.colorban_decoder_table;
			// Color symbol:
			var c=game.colors[i];
			var msw=game.wall_map_symbols[i];

			// decode hero-breeds:
			t[c]=cnames.hero[i];

			//Define path recognition chars only for heros:
			//Breed to path-symbol:
			breed2symbol[t[c]]=c;
			symbol2breed[c]=t[c];
			/////////////////////////////////////////////////////////////
			// ... only the map deviates from "canonical" breed names
			//     images should "adhere" canonical ...
			/////////////////////////////////////////////////////////////

			// decode box-breeds:
			t[c.toUpperCase()]=cnames.box[i];

			//Don't define path recognition chars for passive elements:
			//breed2symbol[cnames.box[i]]=c.toUpperCase();
			//symbol2breed[c.toUpperCase()]=cnames.box[i];	//X,A,B,C, ... 1X,...2B, - boxes 

			t[msw]=cnames.wall[i];							//y,j,k,l,  - walls
			t[msw.toUpperCase()]=cnames.ground[i];			//Y,J,K, ... 1J,..2K, - grounds 
			t[''+i]=cnames.target[i];						//0,1,2,3 --- for target_x, target_a, target_b ...
		}
		//important: c onsole.log(t['y'],t['Y']); // this gives: wall_x ground_x

	}; 	// //\\ Configures colorban decoder table. Part I and II.



})();


