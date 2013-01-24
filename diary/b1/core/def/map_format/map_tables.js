(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;



	//\\// Configures map/path de(en)coder


	// Inverse encoder for heros and boxes:
	// Only for colorban map:
	var breed2color = cmd.breed2color={};
	var color2breed = cmd.color2breed={};



	///	sets playpath format
	cmd.playpath	={	
						// * for sokoban converters:
						DIRECTION : {d : 2, u : -2, l : -1, r : 1},

						TOKEN_SEPARATOR : '|',
						SUBTOKEN_SEPARATOR : '.'
					};	

	cmd.map_sugar	=
	{
		GROUND : '-',
		WALL : '#',
		TARGET : '.',
		TARGET_REGEX : /0/g
	};

	cmd.sugar_soko_mapcut =
	{
		'0X'   : '*',
		'0x'   : '+',
		'x'    : '@',
		'X'    : '$',
		'.h0'  : '!',
		'h0.x' : '&',
		'h0.X' : '%'
	}

	///	configures pure Sokoban mapper,
	//	format: map-symbol : breed
	cmd.sokoban_decoder_table = {

		'u':'wall_a', //extra
		'v':'wall_b', //extra


		'@':'hero_x',
		'p':'hero_x',

		'+':['target_x','hero_x'],
		'P':['target_x','hero_x'],
		'&':['htarget_x','hero_x'],


		'$':'box_x',
		'b':'box_x',
		'*':['target_x','box_x'],
		'%':['htarget_x','box_x'],
		'B':['target_x','box_x'],

		'.':'target_x',
		'!':'htarget_x',
		'o':'target_x',
		
		' ':'ground_x',
		'_':'ground_x'
	};

	cmd.sokoban_decoder_table [ cmd.map_sugar.WALL ] = 'wall_x';
	cmd.sokoban_decoder_table [ cmd.map_sugar.GROUND ] = 'ground_x';


	// //\\ Configures colorban decoder table. Part I and II.

	///	Part I. Seeds colorban mapper,
	//	format: map-symbol : breed
	cmd.colorban_decoder_table = {
		// Part I. Before autobuiling, 
		// adds a little bit Sokoban compatibility:

		'_':'ground_x',
		'$':'box_x',
		'@':'hero_x',
		'.':'target_x',
		'!':'htarget_x',

		'+':['target_x','hero_x'],
		'*':['target_x','box_x'],
		'&':['htarget_x','hero_x'],
		'%':['htarget_x','box_x']
	};

	cmd.colorban_decoder_table [ cmd.map_sugar.WALL ] = 'wall_x';
	cmd.colorban_decoder_table [ cmd.map_sugar.GROUND ] = 'ground_x';


	//. Inverse mapping.
	cmd.colorban_encoder_table={};
	cmd.colorban_encoder_cotable={};


	/// Part II. Finalizes colorban mapper,
	cmd.finalize_colorban_decoder_table = function( game ) {

		var cnames = game.cnames;
		// ii=color_ix:
		for(var ii=0; ii<game.colors.length; ii++){

			var tt = cmd.colorban_decoder_table;
			var et = cmd.colorban_encoder_table;
			var ct = cmd.colorban_encoder_cotable;


			// Color symbol:
			var cc = game.colors[ ii ];
			var msw = game.wall_map_symbols[ ii ];


			//Define path recognition chars only for heros:
			//Breed to path-symbol:
			breed2color[ tt[ cc ] ] = cc;
			color2breed[ cc ] = tt[ cc ];


			//////////////////////////////////////////////////////////////////////
			// ... only the map scripot deviates from "canonical" breed names
			//     images should follow canonical notations hero_x, ...
			//////////////////////////////////////////////////////////////////////

			//Don't define path recognition chars for passive elements:
			//breed2color[cnames.box[i]]=c.toUpperCase();
			//color2breed[c.toUpperCase()]=cnames.box[i];	//X,A,B,C, ... 1X,...2B, - boxes 



			// decode hero-breeds:
			var kkk = cc;
			var vvv = cnames.hero[ii]; 
			tt[kkk] = vvv;    et[vvv] = kkk;

			// decode box-breeds:
			var kkk = cc.toUpperCase();
			var vvv = cnames.box[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;

			var kkk = '' + ii;
			var vvv = cnames.target[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//0,1,2,3 --- for target_x, target_a, target_b ...

			var kkk = 'h' + ii;
			var vvv = cnames.htarget[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//h0,h1,h2,h3 --- for htarget_x, htarget_a, htarget_b ...

			var kkk = msw;
			var vvv = cnames.wall[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//y,j,k,l,  - walls
			ct[vvv] = kkk;
			/// Sugar
			if( ii === 0 )
			{
				et[vvv] = cmd.map_sugar.WALL;
				ct[vvv] = cmd.map_sugar.WALL;
			}



			var kkk = msw.toUpperCase();
			var vvv = cnames.ground[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//Y,J,K, ... 1J,..2K, - grounds 
			ct[vvv] = kkk;
			/// Sugar
			if( ii === 0 )
			{
				et[vvv] = cmd.map_sugar.GROUND;
				ct[vvv] = cmd.map_sugar.GROUND;
			}


			// //\\ Makes co-table
			// decode hero-breeds:
			var vvv = cnames.hero[ii]; 
			var co_vvv = cnames.htarget[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			var vvv = cnames.box[ii]; 
			var co_vvv = cnames.target[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			var vvv = cnames.target[ii]; 
			var co_vvv = cnames.box[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			var vvv = cnames.htarget[ii]; 
			var co_vvv = cnames.hero[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			// \\// Makes co-table


		}
		//important: c onsole.log(t['y'],t['Y']);	// this gives: wall_x ground_x

	}; 	// //\\ Configures colorban decoder table. Part I and II.



})();


