
(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	




	///	seeds base game ... 
	//	will be extended to base game definition in spawn_base_game_def.js
	gio.def.base_game = {

		basekey						: 'mazy',
		nam							: 'Mazy',

		DEEPNESS_LIMIT				: 1,	//how many boxes can be pushed
		herd_sense					: 1,	//flag. >0 for flock behaviour
		herd_dimensionality			: 2,	//2 is for planar
		active_units_do_interact	: false,


		// Base units are like in Sokoban game
		// Activity, target, pass, baton, ... are possible attributes of a race ...
		// Rules can be done more consise way, but redundant attributes pass, frozen do
		// shorten definition.
		races		: {
							ground	: {		activity	: { frozen : true }
									  },
							wall	: {		activity	: { frozen : true }
									  },
							target	: {		activity	: { frozen : true },
											target		: true,

											// puts 'pass' entry in interact_rules
											// makes this behavior unconditional
											pass		: true 
									  },
							box		: {		activity	: { passive : true },
											baton		: true
									  },
							hero	: {		activity	: { active : true }
									  }
					  },


		// Here is the difference with Sokoban. Sokoban has units only of one color.
		// Here are 10 possible colors.
		// Color can be mapped to "any type" of behaviour and picture.
		colors				: ['x','a','b','c','d','e','f','g','h','i'],
		wall_map_symbols	: ['y','j','k','l','m','n','o','p','q','r'], // TODm text-map symbols sneaked here ...


		///	There are only two rules in this seed-definition:
		//	black wall blocks everything and black ground passes everything:
		//	This object is not used at run-time:
		//		instead it is used by spawner,
		// 		contributes directly to unconditinal attributes of a colony, and
		//		and then removed
		interact_rules	:{

			// If nothing is in effect, then unit does block a unit like in real life:
			// probably there will be no game with value set to "false":
			// blocking_policy		:true, 				

			// This is only to speed up finding blockers when checking interaction:
			block				:{wall_x:true}, 	//does block unconditionally; does not depend on imatrix

			pass				:{ground_x:true}	//unconditional; does not depend on imatrix

		},


		// This is the interaction matrix. 
		// It is not set here, but spawned when completing base-game definition by spawner.
		// When units are met on the same cell,
		// this iteraction matrix is checked after interact_rules.blocks and interact_rules.pass
		interact				:{},

		credits : {
			"author"	: "",
			"title"		: "",
			"copyright"	: "",
			"license"	: "Public Domain",
			"web_site"	: "http://landkey.net/gio/gio/play",
			"comments"	: "",
			"date"		: "",
			"email"		: "beaverscript (a) landkey (.) net"
		},



		//	//\\ APPLICATION ASSUMPTIONS"
		rule_helpers : {
			//. emulates game attribue derivation.
			//	compensates lack if source code to evaluate definitions.
			//	Range: true. IMPLEMENTATION-RESTRICTION
			// 	"true" means: "no more than one" and must be on top.
			//	Hence, definition crafters must make sure that definitions do
			//	not create play scenarios which violate this value.
			one_dynamic_unit_on_top : true,  //TODO does it make check during game play?
					

			//.	forces to add ground at the bottom of units stack,
			//	takes effect in parse_board_line.js at section ///	//\\ Sugarifies: adds ground if missed
			ground_always_on_level_0 : true,  // Range: true. IMPLEMENTATION-RESTRICTION

			//.	map-validator
			//	defines max permitted units number stacked in cell in z-direction: how tall map can be 
			map_roof		: 3,

			//.	map-parser parameter
			//	simplifies indexing of locations permitted for unit in a map
			map_boundary	: 'wall_x'
		}
		//	\\// APPLICATION ASSUMPTIONS




	}; //gio.def.base_game
	

})(jQuery);


