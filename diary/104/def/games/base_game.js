(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	

	gio.def.base_game_key 	= 'mazy';
	gio.def.base_game		= {

		nam 					: 'Mazy',

		DEEPNESS_LIMIT				: 1,	//how many boxes can be pushed
		herd_sense					: 1,	//flag. >0 for flock behaviour
		herd_dimensionality			: 2,	//2 is for planar
		active_units_do_interact	: false,

		races		: {
							ground	: {		activity	: { frozen : true }
									  },
							wall	: {		activity	: { frozen : true }
									  },
							target	: {		activity	: { frozen : true },
											target		: true,
											pass		: true // puts 'pass' entry in interact_rules
									  },
							box		: {		activity	: { passive : true },
											baton		: true
									  },
							hero	: {		activity	: { active : true }
									  }
					  },

		colors				: ['x','a','b','c','d','e','f','g','h','i'],
		wall_map_symbols	: ['y','j','k','l','m','n','o','p','q','r'], // TODm text-map symbols sneaked here ...

		interact_rules	:{

			// If nothing is in effect, then unit blocks unit like in real life:
			// probably there will be no game with value set to "false":
			// blocking_policy		:true, 				

			// This is only to speed up finding blockers when checking interaction:
			block				:{wall_x:true}, 	//does block unconditionally; does not depend on imatrix

			pass				:{ground_x:true}	//unconditional; does not depend on imatrix

		},


		// When units are met on the same cell,
		// this iteraction matrix is checked after interact_rules.blocks and interact_rules.pass
		interact				:{},				//interaction matrix, imatrix


		// Used only once when spawning this definition
		// After spawning, skin_key property is deleted
		skin_key : 'mazy',




		// /////////////// IRREGULARITIES:  NOT EXACTLY RULES ///////////////////////////

		// * How tall map can be: Defines max permitted units number stacked in cell in z-direction:
		map_roof		: 3,
		map_boundary	: 'wall_x',

	    // Default if no file:
	    default_maps_text :	":::colorban\nNo Maps Available.\n"+
							"-#---#--##--#---#-###-\n"+
							"-##--#-#--#-##--#-#---\n"+
							"-#-#-#-@--$-#-#-.-##--\n"+
							"-#--##-#--#-#--##-#---\n"+
							"-#---#--##--#---#-###-\n"


	}; //gio.def.base_game
	

})(jQuery);


