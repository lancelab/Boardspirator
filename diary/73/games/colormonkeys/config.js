(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='colormonkeys';
	gio.config[key]={
		nam : 'Flocks',
		basekey		: 'colorban_abstract',
		isabstract	: false,
		herd_size		:1, //flag. >0 for flock behaviour

		key			: key,
		path 		: 'games/'+key,
		collections : [
			{	path: key+'/intro/intro.txt',
				title	:'Intro',
				skip_non_map_lines : false
			}
		],
		default_collection_ix	:0,
		links	:	[
		],

		//////////////////////// GUI /////////////////////////////////
		tile	:{ width : 45, height: 45 },
		style	:{	play:{
							backgroundImage:'background.png',
							backgroundColor:''
						},
				},			
		//////////////////////// GUI END /////////////////////////////////

		//////////////////////// INFO /////////////////////////////////
		//Has one macro: <%game.nam%>
		rules	:
			"When fellow is pushed, fellows nearby\n"+
			"mock its move if space allows.\n"+
			"Each breed pushed by own shepherd.\n",

		objective:
			"Fill out all available targets. Each breed has own targets to occupy.",

		story:
			"It was at night when herds of species ran away ...\n"+
			"When shepherds woke up, they found themselves at difficult task ...\n",


		credits:
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

			"For other images, look at map credits\n\n"+

			"This game, #%game.nam%#, skin design, art, and story is Copyright (c) 2011 Landkey.net. All rights reserved.\n",
		
		//////////////////////// INFO END /////////////////////////////////


		//////////////// mask with human names ... ///////////////////////
		hname_table	:{ //optional
			hero_x	: 'klasskeeper',
			hero_a	: 'monkey`s shepherd',
			hero_b	: 'chicken`s shepherd',
			hero_c	: 'rabbit`s shepherd',
			box_a	: 'fellow monkey',
			box_b	: 'fellow chick',
			box_c	: 'fellow rabbit',
			box_x	: 'monkey'
		},
		///////////////////////////////////////////////////////////////////

		img_path	: 'games/'+key+'/img',

		image_decoder	:{
			'hero_x':'portablejim_Man_Standing_OCAL_2008_www.openclipart.org.png',
			'box_x':'shopper_2011_monkey-md.png',
			'wall_x':'wall_674c.png',
			'target_x':'target.png',
			'ground':''
		}

	};


})(jQuery);


