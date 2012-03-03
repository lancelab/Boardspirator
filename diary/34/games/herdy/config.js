(function( $ ){
	var tp  = $.fn.tp$ = $.fn.tp$ || {};	
	var gio = tp.gio   = tp.gio   || {};

	var games=tp.gio.games = tp.gio.games || [];
	gio.game_ix = (gio.game_ix || gio.game_ix === 0) ?  (gio.game_ix+1) : 0;
	var gm=games[gio.game_ix]={};
    var colonies=gm.colonies=[];

	gm.nam = 'Herdy';
	gm.path ='games/herdy';

	//s p e c i f y  r u l e s :
	gm.DEEPNESS_LIMIT=2;
	gm.interact=
	{
		hero	: { box : 'push', wall : 'block'},
		box		: { wall : 'block', box : 'block' }
	} 

	//Rules which make this game "herdy" - dependend on box leadership:
	gm.extra_rules=function(moves,target_pos)
	{
		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;
		var neighbour_moves=[];

		tp.core.each(moves,function(ix,move){
			var punit=move.punit;
			var colony=gm.colonies[punit.colony_ix];
			
			if(colony.nam==='box'){

			
				var original_x=punit.x;
				var original_y=punit.y;
				//console.log('original box: ix,x,y',punit.ix, punit.x, punit.y);

				//look for neighbour peers:
				tp.core.each(pos[colony.ix],function(dummy, npeer){


					if(npeer.ix === punit.ix) return true;

					//console.log('true peer');

					if(Math.abs(npeer.x-original_x)<2 && Math.abs(npeer.y-original_y)<2){
						//peer is a neigbour, try to move it
						//console.log('true neigbour= ix,x,y',npeer.ix, npeer.x, npeer.y);


						var new_position={pos:null,moves:[]};
						var skipped={};
						skipped[colony.ix+' '+punit.ix,  colony.ix+' '+npeer.ix]=true;
						var msg=gio.check_collision(
							target_pos,colony.ix,npeer.ix,
							move.direction,new_position,1,skipped
						);
						if(!msg){
							gio.console(	'Unit '+punit.ix+','+npeer.x+','+npeer.y+
											' follows the leader '+punit.ix+'...');
							neighbour_moves.push(new_position.moves[0]);
							target_pos=new_position.pos;
						}else{
							gio.console('Cannot follow the leader ... "'+msg+'"');
						}
					}
				});//tp.each pos
			};//if...
		});//tp... moves
		return {pos:target_pos, moves:moves.concat(neighbour_moves)};
	};


	//Test is position winning.
	//Returns eigther 'won' or 'playing'
	gm.doreport=function()
	{
		var test='won';
		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;
		var targets_ix=gm.colonies['target'].ix;
		var boxes_ix=gm.colonies['box'].ix;
		tp.core.each(pos[targets_ix], function(target_ix,target){
			var filled=false;
			tp.core.each(pos[boxes_ix], function(box_ix,box){
				if(box.x===target.x && box.y===target.y){
					filled=true;
					return false;
				}
			});
			if(!filled){
				test='playing';
				return false;
			}				
		});
		return test;
	};


	//gm.colony_ix=1; //optional. set default colony


	//s p e c i f y  m a p s :
	gm.master_board={xsize : 14, ysize : 7};

	src =gm.path+'/img/Gerald_G_Dog_on_leash_(Cartoon).gif';
	colonies.push(
	{
		nam			: 'hero',
		zorder		: 10,
		tiles_map	:
		[
			[{}],
			[{}],
			[{}],
			[{},{},{},{},{},{src:src}]
		]
	});



	src =gm.path+'/img/ArtFavor_Cartoon_Sheep.gif';
	colonies.push(
	{
		nam			: 'box',
		zorder		: 10,
		passive		: true,
		tiles_map	:
		[
			[{}],
			[{}],
			[{},{},{},{},{src:src},{src:src},{src:src}]
		]
	});



	src	=gm.path+'/img/wall_674c.gif';
	colonies.push(
	{
		nam			: 'wall',
		zorder		: 2,
		frozen		: true,  //moving only in edit
		tiles_map	:
		[
			[{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src}, {src:src},       {src:src}],
			[{src:src},{},{},       {},       {},       {},{},       {},       {},       {},   {},          {src:src}],
			[{src:src},{},{},       {},       {},       {},{},       {},{src:src},{src:src},          {src:src},			{src:src},],
			[{src:src},{},{src:src},{src:src},{src:src},{},{src:src},{src:src},   {src:src}],
			[{src:src},{},{},       {},       {},       {}, {},             {src:src}],
			[{src:src},{},{},       {},       {},       {},  {},            {src:src}],
			[{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},{src:src},       {src:src}]
		]
	});

	src	=gm.path+'/img/target.png';
	colonies.push(
	{
		nam			: 'target',
		zorder		: 2,
		frozen		: true,  //moving only in edit
		tiles_map	:
		[
			[{}],
			[{},{},{},       {},       {},       {},  {}, {},       {src:src},       {src:src}, {src:src}]
		]
	});

	//g u i:	 
	gm.tile	={ width : 30, height: 30 };
	gm.style={play:{},control:{},parent:{}}; //template

	//rid:
	gm.style.control.backgroundImage='';
	gm.style.control.backgroundColor='#000000';

	gm.style.play.backgroundImage=gm.path+'/img/background.png';
	gm.style.play.backgroundColor='';

	gm.style.parent.backgroundImage='';
	gm.style.parent.backgroundColor='#000000';

	gm.init_help=function()
	{
		//Will run after document.ready, hence all gio lib is available here:
		gm.story=
		"\"This sheeps better be not so smart ... \" thinks the dog sometimes ...";


		gm.rules=
		"The objective of the game is to push all sheeps into black cells.\n" +
		"The dog can push seeps but cannot pull.\n"+
		"When sheep is being pushed, it becomes a leader."+
		"Sheeps which are toching the leader follow leader in the same direction ...\n"+
		"but only if there is unoccupied cell just before the leader starts to move.\n";


		gm.credits=
		"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
		"Dog picture credit: http://www.openclipart.org/detail/8519/dog-on-leash-%28cartoon%29-by-gerald_g-8519\n" +
		"Dog picture credit: http://www.openclipart.org/detail/929/cartoon-sheep-by-artfavor\n"+
		"This game skin design, art, and story is Copyright (c) 2011 Landkey.net under MIT license.\n" +
		"This game game framework and engine has separate copyright described here: " +
		gio.Description.Copyright + '. License: ' + gio.Description.License;
	};



})(jQuery);


