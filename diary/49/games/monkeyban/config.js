//master config template
(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var game=games[gio.game_ix]={};

	game.nam = 'Monkeyban';
	game.title=game.nam; //TODm later
	game.path ='games/monkeyban';
	game.collections=[
		{	path: 'sokoban/kirillov/monkeyban.txt',
			skip_non_map_lines : false //true - to put all maps into one board, optional
		},
		{	path: 'sokoban/grigoriev/grigr2002.txt'
		},
		{	path: 'sokoban/holland/2008_06_29.txt'
		}
	];
	game.collections.ix=0;

	//TODm q&d:
	tp.core.each(game.collections,function(i,v){v.title = v.title || v.path;});

	////////////////////////////////////////////////////
	//s p e c i f y  r u l e s
	//==================================================
	game.DEEPNESS_LIMIT=1; //how many boxes can be pushed
	game.interact=
	{
		hero	: { box : 'push', wall : 'block'},
		box		: { wall : 'block', box : 'push' }
	} 


	//-----------------------------
	//This is a stub: for future:
	//Existing game modes:
	game.rules	={	defaults : 'move',
					reverse	: ['move','pull'] //additive notation, can work sequentially independent
				};
	//game.ruled = tp.ob2arr(game.rules);
	//-----------------------------



	//This function is optional.
	//Test is position winning. Returns eigther 'won' or 'playing'.
	game.won_or_not=function(){ return gio.sokoban_is_game_won(); };

	//==================================================
	//s p e c i f y  r u l e s
	////////////////////////////////////////////////////






	///////////////////////////////////////////////////////////////////////
	//Extra Rules. Make this game "herdy" - dependent on sheep leadership
	//=====================================================================
	game.extra_rules=function(moves,target_pos)
	{
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];

		game.inside_deepnes_ring=null;
		if(moves.length===1)return {pos:target_pos, moves:moves};//no change
		
		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;

		var original_punit=moves[1].punit;
		var colony=gm.colonies[original_punit.colony_ix];

		var neighbour_moves=[];

		//auxiliary:
		var is_in_herd=function(xtest,ytest){ 
			return Math.abs(xtest-original_punit.x)<2 && Math.abs(ytest-original_punit.y)<2;
		};

		//auxiliary:
		game.inside_deepnes_ring=function(colony_ix,unit_ix)
		{
			var pu=pos[colony_ix][unit_ix];
			return is_in_herd(pu.x,pu.y)
		};

			
		var move=moves[1];
		var skipped={};
		skipped[colony.ix+' '+original_punit.ix]=true;

		//look for neighbour peers:
		tp.core.each(pos[colony.ix],function(dummy, npeer){
					if(npeer.ix === original_punit.ix) return true;
					if(skipped[colony.ix+' '+npeer.ix]) return true;


					//=============================================
					//If neighbour is set to be moved, skip it:
					var neighbour_will_be_moved=false;
					tp.core.each(neighbour_moves,function(move_ix,move){
						if(npeer.ix === move.punit.ix){
							neighbour_will_be_moved=true;
							//c onsle.log(	'neigbour '+colony.nam+' '+npeer.ix+
							//				' which is in x,y '+npeer.x+','+npeer.y+
							//				' is already moving. Skip it');
							return false;
						}
					});
					if(neighbour_will_be_moved) return true;
					//=============================================


					//c onsole.log('true peer');
					if(is_in_herd(npeer.x,npeer.y)){

						//peer is a neigbour, try to move it
						//c onsole.log('Trying to move neigbour '+colony.nam+' '+npeer.ix+ ' which is in x,y '+npeer.x+','+npeer.y);

						var new_position={pos:null,moves:[]};
						var msg=gio.check_collision(
								target_pos,colony.ix,npeer.ix,
								move.direction,new_position,1,{}
						);
						if(!msg){
							gio.cons_add(
								gio.human_name(colony,npeer.ix)+
								' (found in '+npeer.x+','+npeer.y+') follows the leader, '+
								gio.human_name(colony,original_punit.ix)+'...');
							neighbour_moves=neighbour_moves.concat(new_position.moves);
							target_pos=new_position.pos;
						}else{
							gio.cons_add(gio.human_name(colony,npeer.ix)+
								' cannot follow the leader, '+
								gio.human_name(colony,original_punit.ix)+
								'. '+msg+'');
						}
						skipped[colony.ix+' '+npeer.ix]=true;
					}
		});//tp.each pos
		game.inside_deepnes_ring=null;
		return {pos:target_pos, moves:moves.concat(neighbour_moves)};
	};
	//=====================================================================
	//Extra Rules. Make this game "herdy" - dependend on box leadership
	///////////////////////////////////////////////////////////////////////



	//////////////////////// GUI /////////////////////////////////
	game.tile	={ width : 30, height: 30 };
	game.style={play:{},control:{},parent:{}}; //template

	game.style.control.backgroundImage='';
	game.style.control.backgroundColor='#000000';

	game.style.play.backgroundImage=game.path+'/img/background.png';
	game.style.play.backgroundColor='';

	game.style.parent.backgroundImage='';
	game.style.parent.backgroundColor='#000000';
	//////////////////////// GUI END /////////////////////////////////





	//////////////////////// INFO /////////////////////////////////
	//Will run after document.ready, hence all gio lib is available here:
	game.init_help=function()
	{
		game.rules=
		"The schoolkeeper can push monkey, but cannot pull.\n"+
		"Schoolkeeper cannot push two monkeys.\n"+
		"Monkeys who are in contact with the pushed fellow\n"+
		"will do the same move whenever possible.\n"+
		"Monkeys can run over chairs and schoolkeeper learned do the same from them.\n";

		game.objective="Put each monkey into class chair";

		game.story=
		"It's hard to take classes in summer time ... this is why these monkeys\n"+
		"are at large ... Help this schoolkeeper to bring these monkeys back\n"+
		"to learning ...\n";

		game.credits=
		"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n\n" +

		"Blue Man Picture. Shared by: OCAL 04-Aug-08,\n"+
		"   profile: www.clker.com/profile-1068.html\n"+
		"   downloaded from: www.clker.com/clipart-man-standing-1.html\n\n"+

		"Monkey Picture. Shared by: Shopper 22-Jul-11,\n"+
		"   profile: www.clker.com/profile-103806.html,\n"+
		"   downloaded from: www.clker.com/clipart-monkey-12.html\n\n"+

		"Sofa Picture. Shared by: OCAL 21-Oct-10,\n"+
		"   profile: www.clker.com/profile-1068.html,\n"+
		"   downloaded from: www.clker.com/clipart-sofa-2.html\n\n"+


		"This game, "+game.nam+ ", skin design, art, and story is Copyright (c) 2011 Landkey.net under MIT license.\n";
	};
	//////////////////////// INFO END /////////////////////////////////







	//////////////// mask with human names ... ///////////////////////
	var hname_table={ //optional
		hero	: 'klasskeeper',
		box		: 'monkey'
	};
	game.human_name=function(internal){	return hname_table[internal] || internal; };
	///////////////////////////////////////////////////////////////////





	/////////////////////////////////////////////////////////////////////////////
	// maps. still "clumzy", but on the way to compact maps ...
	/////////////////////////////////////////////////////////////////////////////

	game.image_decoder={
		'hero':'portablejim_Man_Standing_OCAL_2008_www.openclipart.org.png',
		'box':'shopper_2011_monkey-md.png',
		'wall':'wall_674c.png',
		'target':'target.png',
		'ground':''
	};

	tp.core.each(game.image_decoder, function(k,v){
		if(v) game.image_decoder[k] = game.path+'/img/'+v;
	});


	//default if no file:
	game.default_maps_text=
	"Default Map Test\n"+
	"\n"+
	"\t############\r\n"+
	"#       ...#\n"+
	"#---b$$ ####\n"+
	"# ###@###\n"+
	"#______#\n"+
	"#------#\n"+
	"########";


	game.maps_decoder=function(data){ return gio['sokoban_maps_decoder'].decode(game,data); };
	game.load_maps=function(){ gio.load_maps(game); };

})(jQuery);


