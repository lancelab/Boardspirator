(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums['bumpytargets'] = {

		gkey	: 'bumpytargets',
		album_name	: 'Bumpy',

		//	collections	: { },

		dresses  :{

			'default' :{	tile	:{	width : 45, height: 45 }  },

			bumpy :{
			
				skin_key : 'flocks',


				credits : {
						"title"		: "Bumpy",
						"license"	: "host-based",
						"date"		: "November 2 2012"
				},


			
				links	:	[],

				//////////////////////// GUI /////////////////////////////////
				tile	:{	width : 45, height: 45 },
				style	:{	play:{
							backgroundImage : 'background.png'
						},
				},			
				//////////////////////// GUI END /////////////////////////////////


				rules	:
					"When fellow is pushed, fellows nearby\n"+
					"mock its move if space allows.\n"+
					"Each breed pushed by own shepherd.\n"+
					"Monkeys can climb chairs. Chickens cannot.\n"+
					".\n",

				objective:
					"Fill out all available targets. Each breed has own targets to occupy.",

				story: "",



				// ** mask with human names ... 
				hname_table	:{ //optional
					hero_x	: 'klasskeeper',
					hero_a	: 'monkey`s shepherd',
					hero_b	: 'chicken`s shepherd',
					box_a	: 'fellow monkey',
					box_b	: 'fellow chick',
					box_x	: 'monkey'
				},


				// ** mask with human images ... 
				image_decoder	:{
					'ground':'' //'transparent.png'
				}

			}
		}//dresses
	};


})();


