(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	


	gio.def.default_dress = 
	{

			title		:   'Boxiland',

			// ////////////////////// GUI /////////////////////////////////
			skin_key	:	'default',
			tile		:{	width : 25, height: 25 },
			style		:{	
							play:{
									backgroundImage:'', //background.png',
									backgroundColor:'transparent'
							},
		
							parent:{
									backgroundImage:'',
									backgroundColor:'#000000'
							}
						}, 
			image_decoder	:{ 'ground_x':'ground_x.png' },
			// /////////////////// GUI END /////////////////////////////////




			//////////////////////// INFO /////////////////////////////////
			// Has one macro: <%game.nam%>
			rules	:
				"actors can push only one box with matching color\n"+
				"black, matches any color for actor, box, and target\n",
			objective:
				"push all boxes into matched targets until\nno available targets or boxes remains\n",
			story:
				"",
			credits:
				"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
				"Skin design, art, and story of #%game.nam%# is Copyright (c) 2011 Konstantin Kirillov.\n"+
				"Any similarity with other games is incidental and not intentional.\n",

			hname_table	:{ //optional
							hero_x	: 'actor'
			},

			story:
				"Our Hero, thr robot, walks through the maze and pushes the boxes to dark cells.",
			//////////////////////// INFO END /////////////////////////////////


			image_decoder	:{
						'ground_x':'ground_x.png'
			}
	}//	'default'





})(jQuery);


