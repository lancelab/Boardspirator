(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


//ready for asyncronous work ... no map should be local var in constr. ...
gio.colorban_maps_decoder=(function(){
	var self={};

	var collection_title_match		=/^:::title\s+(\S.*)\s*$/;
	var author_match				=/^(?:\s|;)*author\s*:(.*)$/i; //match[1] will do the job
	var title_match					=/^(?:\s|;)*title\s*:(.*)$/i;
	var trim_match					=/^\s*|\s*$/g;
	var empty_match					=/^\s*$/g;
	var linef						=/\\n/g;

	var macro_match					=/<#(.*)#\/>/g;
	var macro_def_match				=/^(\S+)=(.+)$/;
	var macros_flag_match			=/^::\s*Macros/i;
	var macros_flag_stop			=/^::\s+/i;

	var colorban_match				=/^:::colorban\s+/i;
	var solid_sokoban_line_match	=/^ *(#|-)[^ ]*(#|-)$/; //for map sugar

	var board_line_match;
	var sokoban_board_line_match	=/^( )*(#|\*|B).*(#|\*|B)\s*$/;
	var colorban_board_line_match	=/^( )*(#|-).*(#|-)\s*$/; //more strict than for soko
	var sokoban_playpath_line_match	=/^( )*(l|r|u|d|\[\]\*).*(l|r|u|d|\[\]\*)\s*$/i;
	var multiplayer_match			=/^:::multiplayer=\s*(\S*)\s*$/i;

	var target_match				=/^target/i;  //match name target_XXX
	var comment_escape_char			=/^;/;


	var soko_map = true; //sokoban map is a default


	/////////////////////////////////
	// decoder tables configuration
	//===============================

	//Pure Sokoban mapper:
	var decoder_table;
	var sokoban_decoder_table={
		'#':'wall_x',
		'y':'wall_a', //extra
		'z':'wall_b', //extra


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
		
		' ':'ground',
		'-':'ground',
		'_':'ground'
	};


	var colorban_decoder_table={
		//add a little bit Sokoban compatibility
		'#':'wall_x',
		//temporary:
		'y':'wall_a',
		'z':'wall_b',

		'-':'ground',
		'_':'ground',

		'$':'box_x',
		'@':'hero_x',
		'.':'target_x',

		'+':['target_x','hero_x'],
		'*':['target_x','box_x']
	};


	var colorban_decoder_table_finished_flag=false;
	//This function defines rules 
	//how colored units are decoded in the map:
	var do_finish_colorban_decoder_table=function(game){
		for(var i=0; i<game.colors.length; i++){
			var t=colorban_decoder_table;
			var c=game.colors[i];
			var msw=game.wall_map_symbols[i];
			t[c]=game.hero[i];
			t[msw]=game.wall[i];
			t[c.toUpperCase()]=game.box[i];
			t[''+i]=game.target[i]; //0,1,2,3 --- for target_x, target_a, target_b ...
		}
		colorban_decoder_table_finished_flag=true;
	};
	//===============================
	// decoder tables configuration
	/////////////////////////////////


	///////////////////////////////
	// main decoder 
	// not-multithreaded
	//=============================
	var targets_count;
	var boxes_count;
	var collection;

	self.decode=function(game,maps_text){
		var w;

		//one-time calculation for dynamic heros:
		if(!colorban_decoder_table_finished_flag)do_finish_colorban_decoder_table(game);

		//what is map's family?:
		soko_map = !colorban_match.test(maps_text);

		if(soko_map){
			decoder_table=sokoban_decoder_table;
			board_line_match=sokoban_board_line_match;
		}else{
			//pure colorban maps:
			board_line_match=colorban_board_line_match;
			decoder_table=colorban_decoder_table;
		}


		collection=game.collections[game.collections.ix];
		collection.maps_loaded +='..decoding began..';
		collection.maps=[];

		//c onsole.log('file to decode='+maps_text);

		var map=null;
		//colony and breeds-element are the same: below: colony = breeds[u]:
		var breeds=null;
		var comments;
		var raw_board;
		var file_header={start:-1, end:-2}; //default is empty
		var map_ix=-1;
		var mboard=null;
		var line='';
		var parsed_file_header;

		//parser states:
		var FILE_HEADER=0;
		var BOARD=1;
		var BOARD_COMMENTS=2;
		var REPLAY=3;
		var REPLAY_COMMENTS=4
		var area_flag=FILE_HEADER;

		collection.map_ix=0; //default
		
		var flines=maps_text.split("\n");
		var y=-1;
		var map_title=''; //title line above board

		//============================
		// main loop
		//============================
		for(var yy=0; yy<flines.length; yy++){
			line=flines[yy].replace(/\r/g,'');
			//gio.cons('current line=="'+line+'"'+yy);

			//--------------------
			//detect map areas
			//- - - - - - - - - - 
			var bline=line.replace(/\t/g,'');
			if(board_line_match.test(bline)){
				if(area_flag!==BOARD){
					//gio.cons('first board line encountered. bline="'+bline+'"');
					if(area_flag!==FILE_HEADER){
						comments.end=yy-1;
						w=finish_the_map(
								game,
								flines, map, mboard, breeds,
								comments, raw_board,
								y,parsed_file_header,'board_came');
						if(w){
								collection.maps_loaded +=w;
								gio.cons(w);
								return; //failed load
						}
					}else{
						if(yy>0){
							file_header.start=0;
							file_header.end=check_title_lines(flines,yy);
							parsed_file_header=finish_file_header(flines,file_header);
						}	
					}
					area_flag=BOARD;
					raw_board='';
					map_ix++;
					map=collection.maps[map_ix]={colonies:[]};
					map.title=map_title;
					mboard=map.mboard={xsize : 2, ysize : 2};
					breeds={};
					comments={start:-1,end:-2};

					targets_count=0;
					boxes_count=0;
					y=-1;
				}
				raw_board += flines[yy]+"\n";
				y++;
				w=parse_board_line(y,bline,breeds,map,game);
				if(!w)return; //failed
			}else{
				//else == means not a board line arrived
				if(collection.skip_non_map_lines)continue;
				if(area_flag===BOARD){
					comments={start:yy};
					area_flag=BOARD_COMMENTS; //do switch mode
				}
				//comments.push(line);

				var trimmed_line=line.replace(trim_match,'');
				if(trimmed_line.length>0){
					map_title=trimmed_line.replace(comment_escape_char,'');
				}
				//gio.cons('continue with comments. line='+line);
			}
			//- - - - - - - - - - 
			//detect map areas
			//-------------------
		}//y loop

		if(area_flag!==FILE_HEADER){
			if(area_flag!==BOARD)comments.end = flines.length-1;
			w=finish_the_map(
				game,
				flines,
				map, mboard, breeds,
				comments,
				raw_board,
				y,parsed_file_header);
			if(w){
				collection.maps_loaded +=w;
				gio.cons(w);
				return; //failed load
			}
		}


		//================================
		//final steps:
		//--------------------------------

		//If no f-header at all, this is a salvation:
		parsed_file_header=parsed_file_header || finish_file_header(flines,file_header);

		collection.file_header=parsed_file_header.raw;
		if(collection.maps.length){
			collection.map_ix=0; //default

			//Finalize the titles for select control:
			//		put title in title, author in tooltip.
			//      Select_el-control takes ".title =>
			//			we need to revert back from map.final_title to
			//			map.title.
			tp.core.each(collection.maps, function(i,map){
				var w=map.final_title ? map.final_title : '';
				if(!map.final_title) map.final_title='Unnamed';
				map.title=map.final_title;
				map.tooltip= map.parsed_title ? map.parsed_title+'. ' : '';
				map.tooltip += map.author ? ' Author: '+map.author : ' Map number '+i;
			});

			collection.maps_loaded ='success';
			if(gio.debug)gio.cons(game.nam+' maps decoder success');

		}else{
			w='..no maps found in text';
			collection.maps_loaded +=w;
			gio.cons(w);
		}
		//--------------------------------
		//final steps:
		//================================
	};
	//============================
	// main decoder
	///////////////////////////////





	///////////////////////////////
	// parse board line
	//============================
	var parse_board_line=function(y,line,breeds,map,game){
		var w,i,j;
		var mboard=map.mboard; //sizes ..

		line=line.replace(/\s+$/g,''); //clear up the end of line

		//Remove dangerous double space "beautifiers" from the map:
		if(!soko_map)line=line.replace(/\s+/,' ');

		//Apply sugar: slip to sokoban line if no blanks inside the walls:
		var oneSymbolPerCell = soko_map || solid_sokoban_line_match.test(line);

		w	=	oneSymbolPerCell ? '' : ' ';
		line_arr=line.split(w);
		if(mboard.xsize<line_arr.length)mboard.xsize=line_arr.length

		for(var x=0; x<line_arr.length; x++){
			var c=line_arr[x];
			var units=[]; //array of units contained in one cell
			for(i=0; i<c.length; i++){
					w=decoder_table[c.charAt(i)]; //c[i]
					//assume wall. no validation for wrong char
					if(!w){
						w=decoder_table['#'];
					}
					if(typeof w === 'object'){
						//array:
						units=units.concat(w);
					}else{
						units.push(w);
					}
			}

			//Map sugar ... make 'ground' unnecessary
			//Check if floor is missed and add it ...
			w=true; //means missed
			for(i=0; i<units.length; i++){
				if(floor_check(units[i]))w=false;
				for(j=0; j<game.target.length; j++){
					if( units[i]===game.target[j] ){
						w=false;
						break;
					}
				}
				if(!w)break;
			}
			if(w)units.splice(0,0,'ground'); //add floor if missed

			for(var ux=0; ux<units.length; ux++){
				u=units[ux];
				//update colony:
				var colony = breeds[u] = breeds[u] || {};
				//right to do, but no time:
				//colony.units = colony.units || [];
				//colony.units.push({x:x,y:y});
				colony.nam = u;
				colony.zorder = floor_check(u,game) ? 10 : 100;

				w=passive_check(u,game);
				if(w) boxes_count +=1;
				colony.passive = w;

				if(target_check(u))targets_count +=1;

				if(game.activity_role){
					w=game.activity_role[u];
					if(u)colony[w]=true;
				}else{
					colony.frozen =	floor_check(u,game);
				}

				colony.color_ix = game.breed_color_ix[u]; //redundant sugar
				var tm=colony.tiles_map = colony.tiles_map || [];
				tm[y] = tm[y] || [];
				//it is VITAL to give empty image src=' ', not '' due to inconsistency of design:
				tm[y][x]={src: (game.image_decoder[u] ? game.img_path+'/'+game.image_decoder[u] : ' ')};
			}
		}//x loop
		return true;
	};
	//============================
	// parse board line
	///////////////////////////////




	///////////////////////////////
	// finish_the_map
	//=============================
	var finish_the_map=function(
				game,
				flines, map, mboard, breeds, cm,
				raw_board, last_y, parsed_file_header, board_came){
		var w,ww;

		mboard.ysize=last_y+1;

		// fix map comments
		cm.end=check_title_lines(flines,cm.end+1);


		//==========================================================
		//convert to framework map format
		//----------------------------------------------------------
		map.passive_colonies=[];
		map.target_colonies=[];
		var number_of_active_colonies=0;
			tp.core.each(breeds,function(k,v){
				//validator[k]=true;
				var tm=v.tiles_map;
				for(var iy=0; iy<mboard.ysize; iy++){
					tm[iy]=tm[iy] || [];
					for(var ix=0; ix<mboard.xsize; ix++){
						tm[iy][ix]=tm[iy][ix] || {};
					}
				}
				//transfer
				map.colonies.push(v);
				if(!v.passive && !v.frozen)number_of_active_colonies++;
				if(v.passive)				map.passive_colonies.push(v);
				if(target_check(k,game))	map.target_colonies.push(v);
			});
		map.number_of_active_colonies=number_of_active_colonies;
		//==========================================================


		map.raw_board=raw_board;


		//==========================================================
		//infrastructure: parse comments:
		//----------------------------------------------------------
		map.raw_comments='';

		//----------------------------------------
		//collect palypaths
		//- - - - - - - - - - - - - - - - - - - - 
		var playpaths=[];
		var in_play_path=false;
		for(var y=cm.start; y<=cm.end; y++){
			var com=line=flines[y].replace(/\r/g,''); //vital for match

			w=com.match(sokoban_playpath_line_match);
			if(w){
				if(in_play_path){
					playpaths[playpaths.length-1].value +="\n"+com;
				}else{
					in_play_path=true;
					playpaths[playpaths.length]={title:'Playpath '+(playpaths.length+1),value:com};
				}
			}else{
				in_play_path=false;
			}	
		//- - - - - - - - - - - - - - - - - - - - 
		//collect palypaths
		//----------------------------------------

			//we are following finished board
			//check for key/value
			w=com.match(author_match);
			if(w && w[1])map.author=w[1];
			w=com.match(title_match);
			if(w && w[1])map.parsed_title=w[1];
			if(!soko_map){
				//Get multiplayer mode if any:
				w=com.match(multiplayer_match);
				if(w && w[1]){
					if(isNaN(w[1]))return 'Invalid map settings. multiplayer='+w[1];
					map.multiplayer=parseInt(w[1]);
				}
			}
			//insert macros:
			//TODm assert: no macros in author and title in comments:
			tp.core.each(parsed_file_header.macros, function(nam,macro){
				com=com.replace('<#'+nam+'#/>',macro);
			});

			map.raw_comments += com + "\n";
		}

		///////// get title and author:
		if(collection.map_title_source==='comment' && map.parsed_title){
			map.final_title=map.parsed_title;
		}else if(collection.map_title_source==='title' && map.title){
			map.final_title = map.title;
		}else{
			//try on own risk:
			map.final_title = map.title || map.parsed_title || '';
			if(map.author && map.parsed_title)map.final_title = map.parsed_title;
		}
		///////// end getting title and author

		//----------------------------------------------------------
		//infrastructure: parse comments
		//==========================================================

		map.targets_count=targets_count;
		map.boxes_count=boxes_count;
		map.min_necessary_filled=Math.min(map.targets_count, map.boxes_count);

		//==========================================================
		//TODO validate
		//----------------------------------------------------------
		//==========================================================

		if(playpaths.length>0)map.playpaths=playpaths;
		return '';
	};
	//=============================
	// finish_the_map
	///////////////////////////////



	////////////////////////////////////////
	//check for title lines from next board
	//======================================
	//Returns position right before polluting line:
	var check_title_lines=function(flines,top_board_line){
		var i=top_board_line-1;
		if(i>-1){
			if(!empty_match.test(flines[i])){
				//gio.cons('one non-empty line '+flines[i]+i);
				return i-1;
			}
			if(i>0){
				if(!empty_match.test(flines[i-1])){
					//gio.cons('far non-empty line '+flines[i-1]);
					return i-2;
				}
			}
		}
		return i-1;
	};
	//======================================
	//check for title lines from next board
	////////////////////////////////////////



	///////////////////////////////
	//finish_file_header
	//=============================
	var finish_file_header=function(flines, file_header){
		var w;
		var pfh={};
		var raw='';
		var macros={};
		var macros_area=false;
		var extracted_title='';

		for(var i=file_header.start; i<=file_header.end; i++){
			var line=flines[i];
			raw += line +"\n";
			line=line.replace("\r",'');


			//override title:
			if(!soko_map && !extracted_title){
				w=line.match(collection_title_match);
				if(w && w[1])extracted_title=w[1];
			}


			//find macros flag
			if(macros_flag_match.test(line)){
				macros_area=true;
				continue;
			}
			if(macros_flag_stop.test(line)){
				//gio.cons('macro - out'+line);
				macros_area=false;
				continue;
			}

			if(macros_area){
				var match=line.match(macro_def_match);
				//gio.cons(''+macro_def_match+' line='+line);
				if(match){ // && match.length===2){
					macros[match[1]]=match[2].replace(linef,"\n");
				}			
			}
		};//i

		collection.title= extracted_title || collection.title;

		pfh.raw=raw;
		pfh.macros=macros;
		return pfh;
	};
	//=============================
	//finish_file_header
	///////////////////////////////

	//==========================================================
	//helpers
	//----------------------------------------------------------
	var floor_check=function(name,game){
		if(name==='ground')return true;
		return target_check(name,game)
	};

	var target_check=function(name,game){
		return target_match.test(name);
		/*		
		//slow?:
		var t=game.target;
		for(var i=0; i<t.length; i++){
			if(name===t[i]) return true;
		}
		return false;
		*/
	};

	var passive_check=function(name,game){
		var b=game.box;
		for(var i=0; i<b.length; i++){
			if(name===b[i]) return true;
		}
		return false;
	};
	//----------------------------------------------------------
	//helpers
	//==========================================================





	return self;
 })();

})(jQuery);


