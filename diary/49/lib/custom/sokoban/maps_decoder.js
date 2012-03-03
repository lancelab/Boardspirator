(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


//ready for asyncronous work ... no map should be local var in constr. ...
gio.sokoban_maps_decoder=(function(){
	var self={};
	
	var author_match		=/^(?:\s|;)*author\s*:(.*)$/i; //match[1] will do the job
	var title_match			=/^(?:\s|;)*title\s*:(.*)$/i;
	var trim_match			=/^\s*|\s*$/g;
	var empty_match			=/^\s*$/g;
	var linef				=/\\n/g;
	var board_line_match	=/^( )*(#|\*|B).*(#|\*|B)\s*$/;

	var macro_match			=/<#(.*)#\/>/g;
	var macro_def_match		=/^(\S+)=(.+)$/;
	var macros_flag_match	=/^::\s*Macros/i;
	var macros_flag_stop	=/^::\s+/i;

	var decoder_table={
		'#':['wall'],

		'@':['hero','ground'],
		'p':['hero','ground'],

		'+':['hero','target'],
		'P':['hero','target'],

		'$':['box','ground'],
		'b':['box','ground'],
		'*':['box','target'],
		'B':['box','target'],

		'.':['target'],
		'o':['target'],
		
		' ':['ground'],
		'-':['ground'],
		'_':['ground']
	};


	///////////////////////////////
	// main decoder
	//============================
	self.decode=function(game,maps_text){
		var w;

		var collection=game.collections[game.collections.ix];
		collection.maps_loaded +='..decoding began..';
		collection.maps=[];

		//c onsole.log('file to decode='+maps_text);

		var map=null;
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
					y=-1;
				}
				raw_board += flines[yy]+"\n";
				y++;
				w=parse_board_line(y,bline,breeds,map,game);
				if(!w)return; //failed
			}else{
				if(collection.skip_non_map_lines)continue;
				if(area_flag===BOARD){
					raw_board.end=yy-1;
					comments={start:yy};
					area_flag=BOARD_COMMENTS; //do switch mode
				}
				//comments.push(line);

				var trimmed_line=line.replace(trim_match,'');
				if(trimmed_line.length>0)map_title=trimmed_line;
				//gio.cons('continue with comments. line='+line);
			}
			//- - - - - - - - - - 
			//detect map areas
			//-------------------
		}//y loop

		if(area_flag!==FILE_HEADER){
			if(area_flag!==BOARD)comments.end = flines.length-1;
			w=finish_the_map(
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
			collection.maps_loaded ='success';

			//finalize the titles:
			tp.core.each(collection.maps, function(i,map){
				var w=map.final_title ? map.final_title+'.' : '';
				//if(collection.maps.length>1) w=i+'. '+w;
				if(map.author) w+=' Author: '+map.author+'.'; 
				map.title= w || '';
				map.tooltip= map.author ? ' Author: '+map.author : ''+i;
			});

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
		var w;

		line=line.replace(/\s+$/g,''); //clear up the end of line
		var mboard=map.mboard;
		if(mboard.xsize<line.length)mboard.xsize=line.length

		for(var x=0; x<line.length; x++){
			var c=line.charAt(x);
			var units=decoder_table[c]; //array of units contained in one cell

			if(!units){
				w='unspecified character "'+c+'" in map';
				gio.cons(w);
				collection.maps_loaded +='..'+w;
				return false;
			}
			for(var ux=0; ux<units.length; ux++){
				u=units[ux];
				//update colony:
				var colony = breeds[u] = breeds[u] || {};
				//right to do, but no time:
				//colony.units = colony.units || [];
				//colony.units.push({x:x,y:y});
				colony.nam = u;
				colony.zorder = u==='ground' || u==='target' ? 10 : 100;
				colony.passive = u==='box';
				colony.frozen =	u==='ground' || u==='target' ||	u==='wall';
				var tm=colony.tiles_map = colony.tiles_map || [];
				tm[y] = tm[y] || [];
				tm[y][x]={src:game.image_decoder[u]};
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
				flines, map, mboard, breeds, cm,
				raw_board, last_y, parsed_file_header, board_came){
		var w;

		var validator={};
		mboard.ysize=last_y+1;
		//gio.cons('finishing the map');


		// fix map comments
		cm.end=check_title_lines(flines,cm.end+1);


		//==========================================================
		//convert to framework map format
		//----------------------------------------------------------
		var number_of_active_colonies=0;
			tp.core.each(breeds,function(k,v){
				validator[k]=true;
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
			});
		map.number_of_active_colonies=number_of_active_colonies;
		//==========================================================


		//==========================================================
		// validate
		//----------------------------------------------------------
		if(!validator['target'])return 'missed unit "target"';
		if(!validator['hero'])return 'missed unit "hero"';
		if(!validator['box'])return 'missed unit "box"';
		//==========================================================



		map.raw_board=raw_board;


		//==========================================================
		//infrastructure: parse comments:
		//----------------------------------------------------------
		map.raw_comments='';
		for(var y=cm.start; y<=cm.end; y++){
			var com=line=flines[y].replace(/\r/g,''); //vital for match
				
				//////////////////////////////////////////////////////
				//TODm insert parser for solutions and playformances ...
				//////////////////////////////////////////////////////

			//we are following finished board
			//check for key/value
			w=com.match(author_match);
			if(w && w[1])map.author=w[1];
			w=com.match(title_match);
			if(w && w[1])map.parsed_title=w[1];

			//insert macros:
			tp.core.each(parsed_file_header.macros, function(nam,macro){
				com=com.replace('<#'+nam+'#/>',macro);
			});

			map.raw_comments += com + "\n";

		}

		map.final_title = map.title || map.parsed_title || '';
		if(map.author && map.parsed_title)map.final_title = map.parsed_title;

		//----------------------------------------------------------
		//infrastructure: parse comments:
		//==========================================================

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
		var pfh={};
		var raw='';
		var macros={};
		var macros_area=false;
		for(var i=file_header.start; i<=file_header.end; i++){
			var line=flines[i];
			raw += line +"\n";
			line=line.replace("\r",'');

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
		pfh.raw=raw;
		pfh.macros=macros;
		return pfh;
	};
	//=============================
	//finish_file_header
	///////////////////////////////




	return self;
 })();

})(jQuery);


