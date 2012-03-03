(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var ceach=tp.core.each;


	//===================================
	//Test for is position winning
	//Returns:	eigther 'won' or 'playing'
	//Outputs:	gm.filled_units
	//===================================
	gio.colorban_is_game_won=function(){ 

		var filled_units=0;
		var filled=false;
		var result='';

		gio.gst(function(game,collection,gm,round,pos){

			//We swap external loop and internal loop depending on
			//which is greater, passives or targets - for performance reasons.
			var external_col=gm.baton_colonies;
			var internal_col=gm.target_colonies;
			if(gm.targets_count<gm.boxes_count){
				//targets fill required
				external_col=gm.target_colonies;
				internal_col=gm.baton_colonies;
			}
			ceach(external_col, function(pc_ix,pcol){
					ceach(pos[pcol.ix], function(pu_ix,punit){
						filled=false;
						ceach(internal_col, function(tc_ix,tcol){
							//TODm hard coded rule ... not good
							//colors not match:
							if(tcol.color_ix !== 0 && pcol.color_ix !== 0 && tcol.color_ix !== pcol.color_ix) return true; 
							ceach(pos[tcol.ix], function(tu_ix,tunit){
								//c onsole.log("external_col=", pcol, pcol.nam, pcol.color_ix, punit.x, punit.y, "\nlow col=",tcol.nam, tcol.color_ix, tunit.x, tunit.y);
								if(punit.x===tunit.x && punit.y===tunit.y){
									//c onsole.log('filled');
									filled_units +=1;
									filled=true;
									return false;
								}
								//console.log('missed');
							});														
							if(filled)return false;
						});

						//if(!filled)return false; //to speed up
					});
					//if(!filled)return false; //to speed up
			});//ceach(external_col
			gm.filled_units=filled_units;
			result=gm.min_necessary_filled === gm.filled_units ? 'won' : 'playing';
		});//gio.gst

		return result

	};

})(jQuery);
