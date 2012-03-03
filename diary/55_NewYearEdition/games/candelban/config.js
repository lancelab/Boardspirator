(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	
	var key='candelban';
	gio.config[key]={
		nam : 'Candelban',
		basekey		: 'colorban_abstract',
		isabstract	: false,
		key			: key,
		path 		: 'games/'+key,
		collections : [
			{	path: key+'/lastweek/colorban_long_flight_one_per_cell.txt',
				title:	'Long Flight',
				map_title_source	:'title'
			},
			{	path: key+'/lastweek/white_flight.txt',
				title:	'White Flight',
				map_title_source	:'title'
			}
		],
		default_collection_ix	:0,

		//////////////////////// GUI /////////////////////////////////
		img_path : 'games/'+key+'/img',

		tile	:{ width : 20, height: 20 },
		style	:{	play:{
								backgroundImage:'Chrisdesign_Tree_silhouettes_3.svg.med.png',
								backgroundColor:'transparent'
				}
		}, 
		//////////////////////// GUI END /////////////////////////////////


		//////////////////////// INFO /////////////////////////////////
		//Has one macro: <%game.nam%>
		rules	:
			"candelban can push only one lightball;\n"+
			"lightballs and candelban can move through candels, but cannot through balls",

		objective:
			"light up the remining candels;\n"+
			"if candel has a color, lightball color must match it",
		story:
			"once upon dark and snowy night ...",


		credits:
		"Sokoban game has been invented by Hiroyuki Imabayashi in 1981. Look in Wikipedia for detailed history.\n" +
		"#%game.nam%# skin design, art, and story is Copyright (c) 2011 Konstantin Kirillov. All rights reserved.\n"+
		"Background image credit: Originally_downloaded_image_Chrisdesign_Tree_silhouettes_3.svg.med.png\n"+
		"                         Source site: http://www.clker.com/clipart-13122.html\n"+
		"                         Shared by: OCAL 07-Dec-07 20:46:45 PST\n"+
		"                         Profile: http://www.clker.com/profile-1068.html\n"+
		"                         Web Site: http://www.openclipart.org\n"+
		"Image:           originally_downloaded_candle-md.png\n"+
		"Shared by:       OCAL, 13-Feb-11 12:16:42 PST\n"+
		"Downloaded from: http://www.clker.com/clipart-candle-7.html\n"+
		"Profile:         http://www.clker.com/profile-1068.html\n"+
		"Web site:            http://www.openclipart.org\n"+

		"Image:           12597010101231510197mbtwms_Smily_face.svg.med.png\n"+
		"Shared by:       Iyo 01-Dec-09 12:56:54 PST\n"+
		"Downloaded from: http://www.clker.com/clipart-43425.html\n"+
		"Profile:         http://www.clker.com/profile-2187.html\n"+
		"Web site:        http://www.stripinfo.be\n",
		//////////////////////// INFO END /////////////////////////////////


		//////////////// mask with human names ... ///////////////////////
		hname_table	:{ //optional
			hero_x		: 'candelban',
			box_x		: 'lightball',
			target_x	: 'candel',
			wall_a		: 'blue_ball',
			wall_b		: 'red_ball',
			wall_x		: 'invisible_wall'
		}
		///////////////////////////////////////////////////////////////////
	};


})(jQuery);


