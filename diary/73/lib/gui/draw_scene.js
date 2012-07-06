(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.draw_scene=function(){

		var game, collection, gm, round;
		gio.gst(function(g,c,m,r){	game=g; collection=c; gm=m; round=r; });

		var w;

		gio.adjustDispositionsByBrowserWindow(gm);

		var reset_blinker_to_this_unit=null;
		var reset_focuser_to_this_unit=null;

		tp.core.each(round.pos, function(group,punits){
			var colony=gm.colonies[group];
			var units=colony.units;
			tp.core.each(punits, function(ix,punit){
				var u=units[ix];
				u.div.style.top=(punit.y+1)*game.tile.height+'px';
				u.div.style.left=(punit.x+1)*game.tile.width+'px';


				// set tooltip
				if(!colony.frozen){
					u.div.title=gio.human_name(colony,ix)
				}else{
					u.div.removeAttribute('title');
				}


				if(punits.selected===ix){
					if(!colony.frozen && !colony.passive){
						if(group === round.pos.colony_ix ){
							reset_blinker_to_this_unit=u;				
							//u.img.style.border='2px solid blue';
							if(	units.length>1 ||
								gm.number_of_active_colonies > 1 ||
								gm.multiplayer){
								reset_focuser_to_this_unit=u;
							}
						}
					}
				}
			});	
		});//tp.core.each(round.pos
		if(reset_blinker_to_this_unit){
			//units[punit.ix].div.appendChild(game.focuser_img);
			gio.blinker.dosetup_and_start(reset_blinker_to_this_unit.img, {opacity:0.5},{opacity:1.0},500);
		}else{
			gio.blinker.dostop();
		}

		//...focuser is more annoying and more restricted:
		if(reset_focuser_to_this_unit){
			//...rumors... doesnot detach from former parent?:			
			reset_focuser_to_this_unit.div.appendChild(game.focuser_img);
			game.focuser_img.style.display='inline';
		}else{
			game.focuser_img.style.display='none';
		}
	}



})(jQuery);
