(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='colorban';
	var akey=key+'_abstract';
	gio.config[akey]={
		basekey		:'', //'base_settings' is a default
		nam 		: 'Colorban',
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


})(jQuery);


