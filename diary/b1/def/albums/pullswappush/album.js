(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	




	gio.def.albums['pullswappush'] = {

		dresses  :
		{ 
			"default" :
			{
				tile		: { width : 30, height: 30 },
				rules		: "The heros push boxes of matching color, pull boxes of lower color\nand swap with higher colors.",
				objective	: "Fill available targets",
			},


			"busytable" :
			{

					skin_key : 'pullswappush',
					chosen	: true,
					title	: 'Busy Table',
					tile	: { width : 50, height: 50 },

					// //\\ GUI
					tile	:{ width : 60, height: 60 },
					style	:{	play:{
										backgroundImage:'background.png',
										backgroundColor:''
								},
						},			
					// \\// GUI


					// //\\ INFO
					rules		: "The heros push food of matching color, pull food of lower color\nand swap with higher colors.",
					objective	: "Put food on plate of own color",
					story		: 'It is already evening and heros are hungry. Help them to serve a dinner.',
					// \\// INFO


					/// masks with human names
					hname_table	:{
						hero_b	: 'rabbit',
						box_b	: 'cabbage',
						box_c	: 'carrot',
						wall_x	: 'vase'
					}

			},



			"pullswappush" :
			{

					skin_key : 'pullpush',
					chosen	: true,
					title	: 'Dinner',
					tile	: { width : 50, height: 50 },

					// //\\ GUI
					tile	:{ width : 60, height: 60 },
					style	:{	play:{
										backgroundImage:'background.png',
										backgroundColor:''
								},
						},			
					// \\// GUI


					// //\\ INFO
					rules		: "The heros push food of matching color, pull food of lower color\nand swap with higher colors.",
					objective	: "Put food on plate of own color",
					story		: 'It is already evening and heros are hungry. Help them to serve a dinner.',
					// \\// INFO


					/// masks with human names
					hname_table	:{
						hero_b	: 'rabbit',
						box_b	: 'cabbage',
						box_c	: 'carrot',
						wall_x	: 'vase'
					}

			}

		}// dresses

	};



	gio.def.albums['co_pullswappush'] = {

		dress_parent_akey	: "pullswappush",

		dresses  :
		{ 
			"default" :
			{
				rules	: "The heros push boxes of matching color, pull boxes of lower color\nand swap with higher colors."
			},
			"pullswapppush" :
			{
					"rules"	: "The heros pull food of matching color, push food of lower color\nand swap with higher colors.",
			}

		}

	};



})();


