(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var ceach=tp.core.each;


	// ===================================
	// Test for is position winning
	// Speed-critical because used in solver.
	// Input:	if gm and pos are provided
	//			then does work for them.
	//			Otherwise, tests currently
	//			running map and position
	//
	// Returns:	1 for 'won', 0 for 'playing'
	// Outputs:	pos.filled_units
	// ===================================
	gio.colorban_is_game_won=function(gm, pos){ 

		if(!gm){
			var gs = gio.getgs();
			gm = gs.gm;
			pos = gs.pos;
		}
		var game = gm.game;
		var uid2loc = pos.uid2loc;

		var necessary_to_fill = gm.necessary_to_fill;

		var filled_units=0;
		var filled=false;
		var result='';


			//We swap external loop and internal loop depending on
			//which is greater, passives or targets - for performance reasons.
			var external_col=gm.baton_cols;
			var internal_col=gm.target_cols;
			if(gm.target_cols.length<gm.baton_cols.length){
				//targets fill required
				external_col=gm.target_cols;
				internal_col=gm.baton_cols;
			}

			// TODm: Avoid this ... need speed: ceach(external_col, function(edummy,ecol){
			//var external_col_len = external_col.length;
			//for(var edummy=0; edummy<external_col_len; edummy++){
			//		var ecol = external_col[edummy];
			ceach(external_col, function(edummy,ecol){
				ceach(ecol.units, function(edummy2,eunit){
						filled=false;
						var eloc= uid2loc[eunit.id];
						ceach(internal_col, function(idummy,icol){
							//TODm hard coded rule ... not good
							//colors not match:
							if(	icol.color_ix !== 0 && ecol.color_ix !== 0 &&
								icol.color_ix !== ecol.color_ix)
								return true; 
							ceach(icol.units, function(idummy2,iunit){
								var iloc= uid2loc[iunit.id];

								if(eloc[0]===iloc[0] && eloc[1]===iloc[1]){
									//c onsole.log('filled external id='+eunit.id+' into int id='+iunit.id+' loc=',eloc);
									filled_units +=1;
									filled=true;
									return false;
								}
							});														
							if(filled)return false;
						});
						if(necessary_to_fill === filled_units) return false;
					});
					if(necessary_to_fill === filled_units) return false;
			});//external_col
			pos.filled_units=filled_units;
			result = necessary_to_fill === filled_units ? 1 : 0;

		return result
	};

})(jQuery);
