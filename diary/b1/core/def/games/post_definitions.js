(function( ) {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var gdf		=  gio.def;


	gio.def.sugar = {};

	var sugar_inverse_path_symbols =
	{	d : 'u', u : 'd', l : 'r', r : 'l',
		//. converts "swap" action
		D : 'U', U : 'D', L : 'R', R : 'L' 
	};
	/// Scope:		pullswappush aware
	//	Inputs:		copath - part of copath which is already made
	//				ccc - current path symbol to convert
	//	Outputs:	copath
	gio.def.sugar.copathy = function (gm, move, copath, ccc){

				if(move.steps.length === 1){
					ccc = sugar_inverse_path_symbols[ccc];
					// c onsole.log(' path 1. ccc='+ccc);

				}else if(	move.steps.length === 2 && 

							//find colors ... do for equal
							( gm.game.gkey === 'co_pullswappush' || gm.game.gkey === 'pullswappush' ||
							  gm.game.gkey === 'co_ghostban'	|| 	gm.game.gkey === 'ghostban'	 )
						){
		
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



	gio.def.post_definitions = {



		pullpush_inversifier :  function(game){
			ceach(game.interact, function(peerA, peersB){
				ceach(peersB, function(peerB, interaction){
					if(interaction === 'pull'){
						peersB[peerB] = 'push';
					}else if(interaction === 'push'){
						peersB[peerB] = 'pull';
					}
				});
			});
		},





		///		extends interactons to pull
		//		Extension is done for interactions:
		//			hero_alpha - box_beta and box_alpha - box_beta
		//			for alpha != beta and alpha,beta != x
		//		Extension is: pull for different colors, 
		//			for equal colors interaction is the same.
		pullpush :  function(game){

			var colors = game.colors;
			var itr = game.interact;

			for(var color_ix=1; color_ix<colors.length; color_ix++){
				var color = colors[color_ix];

				tp.core.each(game.races, function( race_name, race ){

					if(	(race_name !== 'box' && race_name !== 'hero') ||
						//. we don't change interactions with black color
						color_ix === 0 ){
						return true;
					}

					var initiator_name = game.cnames[race_name][color_ix];	
					for(var color_jx=1; color_jx<colors.length; color_jx++){
						var color = colors[color_jx];
						var peer_name = 'box_'+ color;	
						if(color_ix !== color_jx) itr[initiator_name][peer_name] = 'pull';
					}
				});//game.races
			}//for(var color_ix
	  	},//pullpush :  function(game)




		pullorpush :  function(game){

			var colors = game.colors;
			var itr = game.interact;

			for(var color_ix=1; color_ix<colors.length; color_ix++){
				var color = colors[color_ix];

				tp.core.each(game.races, function( race_name, race ){

					if(	(race_name !== 'box' && race_name !== 'hero') ||
						// * we don't change interactions with black color
						color_ix === 0 ){
						return true;
					}

					var initiator_name = game.cnames[race_name][color_ix];	
					for(var color_jx=1; color_jx<colors.length; color_jx++){
						var color = colors[color_jx];
						var peer_name = 'box_'+ color;	
						//. only even-color race pulls ... other's not ...
						if( (color_ix % 2 ) === 0 && color_ix === color_jx ) itr[initiator_name][peer_name] = 'pull';
					}
				});//game.races
			}//for(var color_ix
	  	},//pullorpush :  function(game)







		///		extends interactons to leap
		//		TODM compress ... "compress" "copy-paste" by adding a parameter to post-definitor: parameter=key=leappush, ...
		//		Extension is done for interactions:
		//			hero_alpha - box_beta and box_alpha - box_beta
		//			for alpha != beta and alpha,beta != x
		leappush :  function(game){

			var colors = game.colors;
			var itr = game.interact;

			for(var color_ix=1; color_ix<colors.length; color_ix++){
				var color = colors[color_ix];

				tp.core.each(game.races, function( race_name, race ){

					if(	(race_name !== 'box' && race_name !== 'hero') ||
						// * we don't change interactions with black color
						color_ix === 0 ){
						return true;
					}

					var initiator_name = game.cnames[race_name][color_ix];	
					for(var color_jx=1; color_jx<colors.length; color_jx++){
						var color = colors[color_jx];
						var peer_name = 'box_'+ color;	
						if(color_ix !== color_jx) itr[initiator_name][peer_name] = 'leap'; //was 'pull';
					}
				});//game.races
			}//for(var color_ix
	  	},//leappush :  function(game)










		///		extends interactons to pull, swap: hero swaps with higher colors, pulls with lower,
		//		Extension is done for interactions:
		//			hero_alpha - box_beta and box_alpha - box_beta
		//			for alpha != beta and alpha,beta != x
		pullswappush :  function(game){

			var colors = game.colors;
			var itr = game.interact;

			for(var color_ix=1; color_ix<colors.length; color_ix++){
				var color = colors[color_ix];

				tp.core.each(game.races, function( race_name, race ){

					if(	(race_name !== 'box' && race_name !== 'hero') ||
						//:	we don't change interactions with black color
						color_ix === 0 ){
						return true;
					}

					var initiator_name = game.cnames[race_name][color_ix];	
					for(var color_jx=1; color_jx<colors.length; color_jx++){
						var color = colors[color_jx];
						var peer_name = 'box_'+ color;	
						//: master changer
						if(color_ix < color_jx) itr[initiator_name][peer_name] = 'swap';
						if(color_ix > color_jx) itr[initiator_name][peer_name] = 'pull';
					}
				});//game.races
			}//for(var color_ix
	  	}//pullswappush :  function(game)


	};//gio.def.post_definitions
})();


