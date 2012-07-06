(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums['hello_album']={

		game	:{ basekey		: 'flocks' },
		bundle	:
		{
			album_name					: 'Hello Album',
			collections : 
			[
				{	address	:
					{
						file_key: 'hello_collection.txt'
					},
					title	:'Hello Collection'
				}
			]
		},// bundle



		dresses  : {

			'default'  : {},

			'hello_dress' :
			{

				title	:	'Hello Album Dress ',
				chosen	:	true,
				links	:	[],

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
					"My Rules\n",

				objective:
					"My Objective",

				story:
					"My Story\n",


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
	
					"For game #%game.nam%#, skin design, art, and story is Copyright (c) 2011 Landkey.net. All rights reserved.\n",

			}// default
		}// dresses


	};


})();


