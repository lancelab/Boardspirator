(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='tokenban';
	var akey=key+'_abstract';
	gio.config[akey]={
		basekey		:'', //'base_settings' is a default
		nam 		: 'Tokenban',
		key			: akey,

		////////////////////////////////////////////////////
		//s p e c i f y  r u l e s
		//==================================================
		DEEPNESS_LIMIT	:1,	//how many boxes can be pushed
		herd_size		:0, //flag. >0 for flock behaviour
		//interact		:{}, //optional
		activity_role	:{
							ground		: 'frozen'
		},

		interact_rules	:{
			blocking_policy:true,
			non_blocks:{ground : true}
		},
		//==================================================
		//s p e c i f y  r u l e s
		////////////////////////////////////////////////////




		//////////////////////// GUI /////////////////////////////////
		img_path	: 'games/'+key+'/img',
		tile	:{ width : 25, height: 25 },
		style	:{	play:{
							backgroundImage:'',
							backgroundColor:'#666666'
					},
					parent:{
						backgroundImage:'',
						backgroundColor:'#000000'
					}
		}, 
		//////////////////////// GUI END /////////////////////////////////



		//////////////////////// INFO /////////////////////////////////
		//Has one macro: <%game.nam%>
		rules	:
			"the robot can push only one box with matching color\n"+
			"black, grey, white match any color for robot, box, and target\n",

		objective:
			"push all boxes into matched targets until\nno available targets or boxes remains\n",

		story:
			"",

		credits:
			"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
			"Skin design, art, and story of #%game.nam%# is Copyright (c) 2011 Konstantin Kirillov under MIT license.\n"+
			"Any similarity with other games is incidental and not intentional.\n",
		//////////////////////// INFO END /////////////////////////////////


		//////////////// mask with human names ... ///////////////////////
		hname_table	:{ //optional
						hero_x	: 'robot'
		},
		///////////////////////////////////////////////////////////////////


		image_decoder	:{
					'ground':'ground.png'
		}
	};

		(function(){
			var itr=gio.config[akey]
gio.base_settings

game.interact;
			for(var i=0; i<colors.length; i++){
				var c=colors[i];
				var h=hero[i]	='hero_'+ c;		//init color heros
				var b=box[i]	='box_'+ c;			//init color boxes
				var t=target[i]	='target_' + c;		//init color targets
				var llaw=wall[i]	='wall_' + c;	//init color walls
				game.breed_color_ix[h]=i;
				game.breed_color_ix[b]=i;
				game.breed_color_ix[t]=i;
				itr[h]={};							//init color heros interaction
				itr[b]={};							//init color boxes interaction
				itr[h][b]='push';  					//color hero can push boxes only of own color
				itr[b][b]='push';					//color box can push boxes only of own color
				if(i)itr[hero[0]][b]='push';		//blackhero can push every box
				game.interact_rules.non_blocks[t]=true;	//targets block nothing

				game.activity_role[t]='frozen';
				game.activity_role[llaw]='frozen';
				game.activity_role[h]='active';
				game.activity_role[b]='passive';
			}
		})();


})(jQuery);


