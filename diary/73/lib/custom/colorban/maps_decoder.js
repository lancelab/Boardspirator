(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


//ready for asyncronous work ... no map should be local var in constr. ...
gio.colorban_maps_decoder=(function(){
	var self={};

	// ... if used, must be the first line in collection text:
	self.colorban_maps_flag			=':::colorban';

	var soko_map = true; 			//sokoban map is a default

	// In particular, matches format :::par[2]=par[3]. See: extractKey=function...
	var _key_match					=/^(:::|;)([^=]+)=\s*(\S.*\S|\S)\s*$/i;

	var collection_title_match		=/^:::title\s+(\S.*)\s*$/;
	var trim_match					=/^\s*|\s*$/g;
	var empty_match					=/^\s*$/g;
	var linef						=/\\n/g;

	var macro_match					=/<#(.*)#\/>/g;
	var macro_def_match				=/^(\S+)=(.+)$/;


	//TODm	speed up: make one key: _macros_match and use it for macros and file header instead of these 3 lines:
	var macros_flag_match			=/^::\s*Macros/i;
	var macros_flag_stop			=/^::\s+/i;

	var colorban_match				=new RegExp("^"+self.colorban_maps_flag+"\\s+",'i');

	var solid_sokoban_line_match	=/^ *(#|-)[^ ]*(#|-)$/; //for map sugar

	var board_line_match;

	//this lets wrong lines to leak:
	var sokoban_board_line_match	=/^( |-)*(#|\*|B).*(#|\*|B)(\s|-)*$/;
	//this is stronger:
	//var sokoban_board_line_match	=/^( |-)*#.*#(\s|-)*$/;

	var colorban_board_line_match	=/^( |-)*#.*#(\s|-)*$/;

	// Too loose error-prone-format?:
	var sokoban_playpath_line_match	=/^( |\t)*(l|r|u|d|\[|\]|\*|[0-9])*(l|r|u|d)(l|r|u|d|\[|\]|\*|[0-9])*\s*$/i;

	var multiplayer_match			=/^:::multiplayer=\s*(\S*)\s*$/i;

	//TODm make target_ instead of target:
	var target_match				=/^target/i;  //match name target_XXX
	var comment_escape_char			=/^;/;
	var box_name_match				=/^box_/;




	///////////////////////////////////////////
	// Decoder tables.
	// Format: map-symbol : breed
	//=========================================
	
	var decoder_table;

	//Pure Sokoban mapper:
	var sokoban_decoder_table={
		'#':'wall_x',
		'u':'wall_a', //extra
		'v':'wall_b', //extra


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
		
		' ':'ground_x',
		'-':'ground_x',
		'_':'ground_x'
	};


	//=======================================
	// Towerban decoder table. Part I and II.
	//---------------------------------------
	var colorban_decoder_table={
		// Part I. Before autobuiling, 
		// adds a little bit Sokoban compatibility:
		'#':'wall_x',
		'-':'ground_x',
		'_':'ground_x',
		'$':'box_x',
		'@':'hero_x',
		'.':'target_x',

		'+':['target_x','hero_x'],
		'*':['target_x','box_x']
	};
	// Inverse encoder for heros and boxes:
	// Only for colorban map:
	var breed2symbol={};
	var symbol2breed={};


	var colorban_decoder_table_finished_flag=false;
	// Part II. Autobuiling, 
	// This function defines rules 
	// how colored units are decoded in the map:
	var do_finish_colorban_decoder_table=function(game){
		// i=color_ix:
		for(var i=0; i<game.colors.length; i++){
			var t=colorban_decoder_table;
			// Color symbol:
			var c=game.colors[i];
			var msw=game.wall_map_symbols[i];

			// decode hero-breeds:
			t[c]=game.hero[i];

			//Define path recognition chars only for heros:
			//Breed to path-symbol:
			breed2symbol[t[c]]=c;
			symbol2breed[c]=t[c];

			/////////////////////////////////////////////////////////////
			// ... only the map deviates from "canonical" breed names
			//     images should "adhere" canonical ...
			/////////////////////////////////////////////////////////////

			// decode box-breeds:
			t[c.toUpperCase()]=game.box[i];

			//Don't define path recognition chars for passive elements:
			//breed2symbol[game.box[i]]=c.toUpperCase();
			//symbol2breed[c.toUpperCase()]=game.box[i];	//X,A,B,C, ... 1X,...2B, - boxes 

			t[msw]=game.wall[i];							//y,i,j,k,l,  - walls
			t[msw.toUpperCase()]=game.ground[i];			//Y,I,J,K, ... 1J,..2K, - grounds 
			t[''+i]=game.target[i];							//0,1,2,3 --- for target_x, target_a, target_b ...
		}
		//important: c onsole.log(t['y'],t['Y']); // this gives: wall_x ground_x
		colorban_decoder_table_finished_flag=true;
	};
	//---------------------------------------
	// Towerban decoder table. Part I and II.
	//=======================================
	// Decoder tables.
	/////////////////////////////////////////


	// Keep current map data while parsing:
	var targets_count;
	var boxes_count;
	var collection;
	//  ... source array with no white spaces at ends:
	var trimmed_lines;

	///////////////////////////////////////////////////////////////////////
	// Main decoder "decode" method
	// Non-multithread safe
	// Called when collection file is read and submitted as "maps_text"
	// actual parameter into main decoder.
	//
	// Input context: 	game.collections.ix
	//					game.collections[game.collections.ix]
	// Output	:	in case of success: collection.maps_loaded ='success'; 
	//				otherwise simply returns;	
	//=====================================================================
	self.decode=function(game,maps_text){
		var w;

		//one-time-per-map_decoder calculation:
		if(!colorban_decoder_table_finished_flag)do_finish_colorban_decoder_table(game);

		//what is map's family?:
		soko_map = !colorban_match.test(maps_text);

		collection=game.collections[game.collections.ix];
		collection.maps_loaded +='..decoding began..';
		collection.maps=[];

		if(soko_map){
			decoder_table=sokoban_decoder_table;
			board_line_match=sokoban_board_line_match;
		}else{
			// Collection-context
			//pure colorban maps:
			collection.colorban_map=true;
			// These are map_decoder-wide:
			// even framework-wide at the moment:
			collection.symbol2breed=symbol2breed;
			collection.breed2symbol=breed2symbol;

			// Local-context:
			board_line_match=colorban_board_line_match;
			decoder_table=colorban_decoder_table;
		}



		//c onsole.log('file to decode='+maps_text);

		var map=null;
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
		var area_flag=FILE_HEADER;

		collection.map_ix=0; //default
		
		var flines=maps_text.split("\n");
		// Hoping this is a faster way to reserve the memory
		// instead of adding elements to this array while parsing "flines":
		trimmed_lines = maps_text.split("\n");

		var y=-1;
		var map_title=''; //title line above board

		//=========================================
		// main loop through collection file lines
		//=========================================
		for(var yy=0; yy<flines.length; yy++){
			line=flines[yy].replace(/\r/g,'');
			trimmed_lines[yy]=flines[yy].replace(trim_match,'');

			//gio.cons('current line=="'+line+'"'+yy);

			//--------------------
			//detect map areas
			//- - - - - - - - - - 
			var bline=line.replace(/\t/g,'');
			if(board_line_match.test(bline)){


				//oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
				// Board beginning in text
				//------------------------------------------------------------
				if(area_flag!==BOARD){
					//gio.cons('first board line encountered. bline="'+bline+'"');
					if(area_flag!==FILE_HEADER){
						comments.end=yy-1;
						w=finish_the_map(
								game,
								flines, map, mboard,
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
						}else{
							parsed_file_header={};
						}						
					}
					area_flag=BOARD;
					raw_board='';
					map_ix++;
					map=collection.maps[map_ix]={
						// parents:
						game : game,
						collection : collection,
						// children:
						title : map_title,
						cols:[],
						units : [],
						locs : [],
						skin:{},

						mboard : {xsize : 2, ysize : 2}, // do depric.
						size : [2,2,2],

						// maps:
						loc2lid : [],
						pos :	{	uid2lid : [], lid2uid : []
								},
						acting : { cid : -1, cols : [] }
					};
					map.colonies = map.cols; //rid
					mboard=map.mboard;
					comments={start:-1,end:-2};

					targets_count=0;
					boxes_count=0;
					y=-1;
				}
				//------------------------------------------------------------
				// Board beginning in text
				//oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo


				raw_board += flines[yy]+"\n";
				y++;
				w=parse_board_line(y,bline,map);
				if(!w)return; //failed
			}else{
				//else == means not a board line arrived
				if(collection.skip_non_map_lines)continue;
				if(area_flag===BOARD){
					comments={start:yy};
					area_flag=BOARD_COMMENTS; //do switch mode
				}
				//comments.push(line);

				if(trimmed_lines[yy].length>0){
					map_title=trimmed_lines[yy].replace(comment_escape_char,'');
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
				map, mboard, 
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
	var parse_board_line=function(y,line,map){
		var w,i,j,len;
		var game=map.game;
		var mboard=map.mboard; //sizes ..
		var size=map.size;
		var rank;

		line=line.replace(/\s+$/g,''); //clear up the end of line

		//Remove dangerous double space "beautifiers" from the map:
		if(!soko_map)line=line.replace(/\s+/,' ');

		//Apply sugar: slip to sokoban line if no blanks inside the walls:
		var oneSymbolPerCell = soko_map || solid_sokoban_line_match.test(line);

		w	=	oneSymbolPerCell ? '' : ' ';
		line_arr=line.split(w);
		if(size[0]<line_arr.length)size[0]=line_arr.length;
		mboard.xsize = size[0];
		var ll = map.loc2lid;
		

		//===============================
		// Loops via cells
		//-------------------------------
		for(var x=0; x<line_arr.length; x++){
			var locx = ll[x] = ll[x] || [];
			var locy = locx[y] || [];

			var c=line_arr[x];
			var units=[]; //array of units contained in one cell
			//towers[x]=[]; //array, see towers[x].push below ...

			//Here we further generilize (colorban) file format:
			//Commas will separate names which are longer than 1.
			//So, cell (cluster) can be: ab7 or a2,b,7
			//Test for comma first:
			var w= !oneSymbolPerCell && c.indexOf(',')>0 ? ',' : '';
			var cluster =c.split(w); //fe: a1,b,- ...


			//===============================
			// Loops trough cluster (tower)
			//-------------------------------
			for(i=0, len=cluster.length; i<len; i++){
				unit_char=cluster[i];

				//Before look in decoder table, extract unit's rank if any:
				if(cluster[i].length>1){
					rank=parseInt(unit_char.substr(1));
					unit_char=unit_char.charAt(0);
				}				


					w=decoder_table[unit_char]; //.charAt(i)]; //c[i]
					//assume wall. no validation for wrong char
					if(!w){
						w=decoder_table['#'];
					}
					if(typeof w === 'object'){
						//array:
						units=units.concat(w);
					}else{
						// Until map does not really have ranks,
						// this "if" is idle:
						if(cluster[i].length>1)	w=[w,rank];
						units.push(w);
					}
			}
			//-------------------------------
			// Loops trough cluster (tower)
			//===============================



			//===================================================
			//Map sugar ... make 'ground' unnecessary
			//Check if ground is missed and add it ...
			w=true; //means missed
			for(i=0; i<units.length; i++){
				if(ground_check(units[i]))w=false;
				if(!w)break;
			}
			if(w)units.splice(0,0,'ground_x'); //add ground
			//====================================================


			//=================================================
			// Loops trough normalized cluster in single cell.
			// Adds colonies. Builds towers.
			//-------------------------------------------------
			for(var unitz=0; unitz<units.length; unitz++){
				// Do index location:
				var lid=map.locs.length;
				locy[unitz] = lid;
				map.locs[lid]=[x,y,unitz];
				u=units[unitz];

				rank=-1;
				if(typeof u === 'object'){
					rank=u[1];
					u=u[0];
				}

				var colonies=map.colonies;
				var colony = colonies[u];


				//-------------------------
				// Create colony:
				//- - - - - - - - - - - - - 
				if(!colony){
					//TODO redundant:
					colony = colonies[colonies.length]={id:colonies.length};
					colonies[u] = colony;
					colony.nam = u;
					colony.zorder = ground_check(u,game) ? 10 : 200;
					colony.zorder = target_check(u,game) ? 100 : colony.zorder;
					colony.passive = 0; //TODO wis?
					colony.hname = (game.human_name && game.human_name(colony.nam)) || colony.nam;
					colony.uids = [];
					colony.color_ix = game.breed_color_ix[u]; //redundant sugar
					colony.ix=colony.id; //TODO rid
				}
				//-------------------------



				//-------------------------
				// Create unit:
				//- - - - - - - - - - - - - 

				unit_ix=colony.uids.length;
				var unit_id=map.units.length;

				img_path = game.image_decoder[u] || '';
				if(img_path){
					if(rank>0) img_path = rank+'-'+img_path;
					img_path =  game.img_path+'/'+ img_path;
				}

				
				var unit=map.units[unit_id]={
						id : unit_id, //addr in parent
						ix : unit_ix, //addr in colony attr

						rank : rank, //attr
						color_ix : game.breed_color_ix[u],
						base : get_base_type(u,game),

						cid	: colony.id, //rid
						col : colony, 
						cname : colony.nam, //sugar
						lid : lid,
						gm : map,

						// representations:
						src : img_path,
						hname :game.human_name(colony,unit_ix)
				};
				
				map.units[unit_id]=unit;
				colony.uids[unit_ix] = unit_id;
				map.pos.lid2uid[lid] = unit_id;
				map.pos.uid2lid[unit_id]=lid;

				if(!map.acting.cols[colony.id]){
					map.acting.cols[colony.id]={
							uid : unit_id,
							former_uid : -1
					};
				}
				//-------------------------



				//right to do, but no time:
				//colony.units = colony.units || [];
				//colony.units.push({x:x,y:y});
				//colony.nam = u;
				if(u.match(box_name_match)) boxes_count +=1;
				if(game.activity_role[u]==='passive')colony.passive += 1;
				if(game.activity_role[u]==='active' && map.acting.cid < 0){
					map.acting.cid=colony.id;
				}

				if(target_match.test(u))targets_count +=1;

				if(game.activity_role){
					w=game.activity_role[u];
					if(w)colony[w]=true; //TODO bug: must? if(w)....
				}else{
					colony.frozen =	floor_check(u,game);
				}

				//colony.color_ix = game.breed_color_ix[u]; //redundant sugar
				//var tm=colony.tiles_map = colony.tiles_map || [];
				//tm[y] = tm[y] || [];
				//it is VITAL to give empty image src=' ', not '' due to inconsistency of design:
				//tm[y][x]={src: (game.image_decoder[u] ? game.img_path+'/'+game.image_decoder[u] : ' ')};
			}
		}//x loop
		//-------------------------------
		// Loops via cells
		//===============================
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
				flines, map, mboard, cm,
				raw_board, last_y, parsed_file_header, board_came){
		var w,ww;
		var iy;

		mboard.ysize=last_y+1;

		// fix map comments
		cm.end=check_title_lines(flines,cm.end+1);

		//reassembly full raw map
		//w='';

		//==========================================================
		//convert to framework map format
		//----------------------------------------------------------
		map.baton_colonies=[];
		map.target_colonies=[];
		var number_of_active_colonies=0;
			tp.core.each(map.colonies,function(k,v){
				//validator[k]=true;
				//var tm=v.tiles_map;
				//for(iy=0; iy<mboard.ysize; iy++){
				//	tm[iy]=tm[iy] || [];
				//	for(var ix=0; ix<mboard.xsize; ix++){
				//		tm[iy][ix]=tm[iy][ix] || {};
				//	}
				//}
				//transfer
				//map.colonies.push(v);
				if(game.activity_role[v.nam]==='active')number_of_active_colonies++;
				if(target_match.test(k))	map.target_colonies.push(v);
				if(game.baton[v.nam])		map.baton_colonies.push(v);
			});
		map.number_of_active_colonies=number_of_active_colonies;
		//==========================================================


		map.raw_board=raw_board;


		//==========================================================
		//infrastructure: parse comments:
		//----------------------------------------------------------
		map.raw_comments='';

		var playpaths=[];
		var current_pp=null;
		var colorban_pp=false;
		for(var y=cm.start; y<=cm.end; y++){ //...loop through map comments

			var com=line=flines[y].replace(/\r/g,''); //vital for match
			map.raw_comments += com + "\n";
			var com_trimmed=trimmed_lines[y];			


			//----------------------------------------
			//collect palypaths
			//- - - - - - - - - - - - - - - - - - - - 
			var initiate_pp=false;
			var terminate_pp=false;
			var add_to_pp=false;

			if(colorban_pp){
				if(com_trimmed.length === 0){
					// ... only empty line terminates pp
					current_pp=null;
					colorban_pp=false;
				}else{
					current_pp.value +="\n"+com;
				}
				continue;
			}

			pkey=extractKey(com)
			if(pkey[1]===':::' && pkey[2]==='playpath'){
				colorban_pp=true;
				initiate_pp=true;
			}else if(soko_map){
				// ... allow "loosy" pp detection only in soko-maps
				w=com.match(sokoban_playpath_line_match);
				if(w){
					if(!current_pp)	initiate_pp=true;
					add_to_pp=true;
				}else if(current_pp){
					// ... terminating pp
					current_pp=null;
				}
			}

			if(initiate_pp){
				w=playpaths.length;
				current_pp = playpaths[w]=
				{
					title : 'Playpath '+(w+1),
					value : ''
				};
				//c onsole.log('pp begins=',playpaths[w],' com='+com);
			}

			if(add_to_pp)current_pp.value +=com+"\n";
			if(add_to_pp || initiate_pp)continue;


			if(playpaths.length>1){
				// Do link pp to a game, collection, or map:
				if(pkey[1]===':::'){
						if(	pkey[2]==='game_key' ||
							pkey[2]==='collection_key' ||
							pkey[2]==='map_key'){
								playpaths[playpaths.length-1][pkey[2]]=pkey[3];
								continue;
						}
				}
			}
			//- - - - - - - - - - - - - - - - - - - - 
			//collect palypaths
			//----------------------------------------


		//...loop through map comments
		if(pkey[1]===':::' && pkey[2]==='image'){
			//extract picture links
			var reskin=pkey[3].split('=');
			reskin[1]=reskin[1] && reskin[1].replace(trim_match,'');
			if(!reskin[1]){
				return 'Invalid skin assignment '+ pkey[0];
			}
			map.skin[decoder_table[reskin[0]]]=	tp.core.getFileParent(collection.path)+
												'/'+reskin[1];
		}


		//we are following finished board
		//check for key/value
			if(pkey[1]===';'){
				if(	pkey[2]==='author' ){
					map[pkey[2]]=pkey[3];
					continue;
				}
				if(	pkey[2]==='title' ){
					map['parsed_title']=pkey[3];
					continue;
				}
			}
					
			if(pkey[1]===':::'){
				if(	pkey[2]==='game_key' || pkey[2]==='collection_key'){
					map[pkey[2]]=pkey[3];
					continue;
				}
			}

			if(!soko_map){
				if(pkey[1]===':::'){
					if(	pkey[2]==='multiplayer' ){
						if(isNaN(pkey[3]))return 'Invalid map settings. multiplayer='+pkey[3];
						map.multiplayer=parseInt(pkey[3]);
						continue;
					}
				}
			}

			//insert macros:
			//TODm assert: no macros in author and title in comments:
			tp.core.each(parsed_file_header.macros, function(nam,macro){
				com=com.replace('<#'+nam+'#/>',macro);
			});

		}//... loop through map comments


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
		//TODnon-critical validate
		//----------------------------------------------------------
		//==========================================================

		if(playpaths.length>0)map.playpaths=playpaths;
		return '';
	};
	//=============================
	// finish_the_map
	///////////////////////////////



	///////////////////////////////////////////////////
	//check for map's title line from previous board
	//=================================================
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
	//=================================================
	//check for map's title line from previous board
	///////////////////////////////////////////////////



	/////////////////////////////////////////////////
	// Purpose:	finish_file_header
	// Returns:	object named "parsed_file_header"
	//			empty if no data in a header
	//===============================================
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
		if(typeof name === 'object')name=name[0];
		if(name.indexOf('ground_')===0)return true;
		return target_match.test(name);
	};
	var ground_check=function(name,game){
		if(typeof name === 'object')name=name[0];
		if(name.indexOf('ground_')===0)return true;
		return false;
	};
	var target_check=function(name,game){
		if(typeof name === 'object')name=name[0];
		return target_match.test(name);
	};


	var get_base_type=function(name,game){
		if(typeof name === 'object')name=name[0];
		if(name.indexOf('ground_')===0)return 'g';
		if(name.indexOf('wall_')===0)return 'w';
		return ''
	};
	//----------------------------------------------------------
	//helpers
	//==========================================================


	//Does: 
	//	search for ^(;|:::)key=val
	//	if key is found:	returns [x,key,val]
	//						if target is supplied, sets *
	var extractKey=function(line,target,keykey,deb){
		var w=line.match(_key_match);
		if(w && w[2]){
			if(target && keykey && w[1]===keykey && w[3]) target[w[2]]=w[3]; //*
		}
		return w || [];
	};



	return self;
 })();//gio.colorban_maps_decoder=(function(){

})(jQuery);


