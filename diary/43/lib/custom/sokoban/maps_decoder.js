(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	gio.sokoban_maps_decoder=function(game,maps_text){

		game.maps_loaded +='..decoding began..';

		//c onsole.log('file to decode='+maps_text);
		//soko line:
		var map_line_indicator=/^( )*(#|\*|B).*(#|\*|B)\s*$/; 

		var map=null;
		var colonies=null;
		var breeds=null;
		var map_ix=-1;
		var mboard=null;
		var flag_map_done=true;

		game.map_ix=0; //default
		
		var ar=maps_text.split("\n");
		var y=-1;
		var map_title='';


		//aux:
		var finish_the_map=function(){
			mboard.ysize=y+1;

			//c onsole.log(breeds);

			//normalize and transfer map
			tp.core.each(breeds,function(k,v){
				var tm=v.tiles_map;
				for(var y=0; y<mboard.ysize; y++){
					tm[y]=tm[y] || [];
					for(var x=0; x<mboard.xsize; x++){
						tm[y][x]=tm[y][x] || {};
					}
				}
				//transfer
				colonies.push(v);
			});
			//c onsole.log('colonies=',colonies);
		};



		for(var yy=0; yy<ar.length; yy++){
			line=ar[yy].replace(/\t|\r/g,''); //TODm verify: apparently \r causes to miss /\s*$/ in re.
			//gio.cons('current line=="'+line+'"'+yy);
			//--------------------
			//recognize map's line
			//- - - - - - - - - - 
			if(map_line_indicator.test(line)){
				if(flag_map_done){
					//gio.cons('first map line encountered. line="'+line+'"');
					flag_map_done=false;
					map_ix++;
					map=game.maps[map_ix]={colonies:[]};
					map.title=map_title;
					mboard=map.mboard={xsize : 2, ysize : 2};
					breeds={};
					colonies=map.colonies;
					y=-1;
				}// else continue with map
				//gio.cons('cont with map. line='+line);
			}else{
				var cleaned_line=ar[yy].replace(/^\s*|(\s|\r)*$/g,''); //TODO check
				if(cleaned_line.length>0)map_title=cleaned_line;
				if(game.skip_non_map_lines)continue;
				if(!flag_map_done){
					//gio.cons('finishing the map '+(game.maps.length+1));
					finish_the_map();
					flag_map_done=true;
					continue;	
				}else{
					//c onsole.log('continue with comments. line=',line);
					continue;
				}
			}

			//clear up the end of line:
			line=line.replace(/\s+$/g,'');
			//- - - - - - - - - - 
			//recognize map's line
			//--------------------


			y++;
			if(mboard.xsize<line.length)mboard.xsize=line.length
			for(var x=0; x<line.length; x++){
				var c=line.charAt(x);
				var units=game.decoder[c];
				if(!units){
					w='unspecified character'+c+' in map';
					gio.cons(w);
					m.maps_loaded +='..'+w;
				}
				for(var ux=0; ux<units.length; ux++){
					u=units[ux];
					//update colony:
					var colony = breeds[u] = breeds[u] || {};

					//right to do, but no time:
					//colony.units = colony.units || [];
					//colony.units.push({x:x,y:y});
					colony.nam = u;
					colony.zorder = u===game.sokoban_floor_name || u===game.sokoban_target_name ? 10 : 100;
					colony.passive = u===game.sokoban_box_name;
					colony.frozen =	u===game.sokoban_floor_name || u===game.sokoban_target_name ||
									u===game.sokoban_wall_name;
					var tm=colony.tiles_map = colony.tiles_map || [];
					tm[y] = tm[y] || [];
					tm[y][x]={src:game.image_decoder[u]};
				}				
			}//x loop
		}//y loop

		if(!flag_map_done){
			//gio.cons('finishing the map '+(game.maps.length+1));
			finish_the_map();
			flag_map_done=true;
		}	


		//c onsole.log('maps=',game.maps);
		if(game.maps.length){
			game.colonies=game.maps[0].colonies;
			//game.master_board=game.maps[0].mboard;
			game.maps_loaded ='success';
		}else{
			w='..no maps found in text';
			game.maps_loaded +=w;
			gio.cons(w);
		}

	};


})(jQuery);


