(function( ) {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;

					var gdf		=  gio.def;


	gio.def.sugar = {};



	//	//\\	 Highly:	customized helper to build co-paths.
	//						Based on Q&D tricks. In worst case scenario,
	//						if used wrongly, will give just wrong co-path string.

	var sugar_inverse_path_symbols =
	{
		//. untouchable steps change direction
		d : 'u', u : 'd', l : 'r', r : 'l',		//(*)

		//. pull, push do not, so above line does the job for colorban, sokoban, pullpush and
		//	their cogames

		//. swap, leap, jump change direction
		//	len = move.steps.length
		//	leap: len = 1 => line (*) is used (covers leappush)
		//	jump: len = 1 => line (*) is used (covers ghostjump)
		//	swap: len = 2 => line below is needed:
		D : 'U', U : 'D', L : 'R', R : 'L' 
	};

	///	Scope:		Works for:
	//					colorban, sokoban, ghostjump, pullswappush, and ghostban
	//				and their co-games.
	//
	//	Inputs:		copath - part of copath which is already made
	//				ccc - current path symbol to convert
	//	Outputs:	copath
	gio.def.sugar.copathy = function ( gm, move, copath, ccc ) {

				if(move.steps.length === 1){
					ccc = sugar_inverse_path_symbols[ccc];
					// c onsole.log(' path 1. ccc='+ccc);

				}else if(	move.steps.length === 2 && 

							//find colors ... do for equal
							( gm.game.gkey === 'co_pullswappush' || gm.game.gkey === 'pullswappush' ||
							  gm.game.gkey === 'co_ghostban'	|| 	gm.game.gkey === 'ghostban'	 )
							)
				{
		
					//: "dissecting" colors
					var passee_id = move.steps[1].uid;
					var passee = gm.units[passee_id];
					var passee_color = passee.color_ix;			
					var actee_id = move.steps[0].uid;
					var actee = gm.units[actee_id];
					var actee_color = actee.color_ix;

					/// note:	(pullswappush and co_pullswappush), (colorban and co_colorban) do not change ccc for equal colors
					//			because "push" needs to encode action of the same direction symbol as "pull"
					if(	(gm.game.gkey === 'pullswappush' && passee_color < actee_color) ||
						(gm.game.gkey === 'co_pullswappush' && passee_color > actee_color) ||

						/// TODQD patch based on knowledge of interaction matrix. Does right swap with ghost
						(
							(gm.game.gkey === 'co_ghostban'	|| 	gm.game.gkey === 'ghostban'	 ) &&
							actee_color === 2 && passee_color !== 2
						)
					) {
						ccc = sugar_inverse_path_symbols[ccc];
					}
					// c onsole.log(' path 2. c='+c);
				}
				copath = ccc + copath;
				return copath;
	};//gio.def.sugar.copathy

	//	\\//	 Highly:	customized helper to build co-paths.






	///	Extends interactons to added interactions
	//			initiator_is_lower and initiator_is_higer.
	//	Only for
	//		non-black interands of different colors
	//		box-targets
	//	Input:	even -	optional. If supplied, 
	//					sets interaction only for colors 2, 4, ...
	//					for interands WITH EQUAL COLORS
	var unmatched_col_int_extender = function( initiator_is_lower, initiator_is_higer, even ) {

		return function( game ) {


			var colors = game.colors;
			var itr = game.interact;

			for( var color_ix=1; color_ix < colors.length; color_ix++ ) {

				var color = colors[ color_ix ];

				if( even && ( (color_ix % 2) != 0 ) ) continue;

				tp.core.each( game.races, function( race_name, race ) {

					if(	(race_name !== 'box' && race_name !== 'hero') ||
						//. we don't change interactions with black color
						color_ix === 0 ){
						return true;
					}


					var initiator_name = game.cnames[ race_name ][ color_ix ];	
					for( var color_jx=1; color_jx < colors.length; color_jx++ ) {
						var color = colors[color_jx];
						var peer_name = 'box_'+ color;

						if( even ) {

							if( color_ix == color_jx ) itr[ initiator_name ][ peer_name ] = initiator_is_lower;

						}else{

							if( color_ix < color_jx ) itr[ initiator_name ][ peer_name ] = initiator_is_lower;
							if( color_ix > color_jx ) itr[ initiator_name ][ peer_name ] = initiator_is_higer;
						}
					}
				});//game.races
			}//for(var color_ix
	  	};
	};///	Extends interactons to added_interaction









	gio.def.post_definitions = {


		/// Swaps 'pull' and 'push' interactions
		pullpush_inversifier :  function( game ) {

			ceach( game.interact, function( peerA, peersB ) {
				ceach( peersB, function( peerB, interaction ) {

					if( interaction === 'pull' ) {
						peersB[ peerB ] = 'push';
					}else if( interaction === 'push' ) {
						peersB[ peerB ] = 'pull';
					}
				});
			});
		},


		///	extends interactons to pull
		pullpush		: unmatched_col_int_extender( 'pull', 'pull' ),

		///	extends interactons to leap
		leappush		: unmatched_col_int_extender( 'leap', 'leap' ),

		pullswappush	: unmatched_col_int_extender( 'swap', 'pull' ),

		///	extends interactons to pull for colors 2, 4, ...
		pullorpush		: unmatched_col_int_extender( 'pull', null, 'even' )

	};//gio.def.post_definitions
})();


