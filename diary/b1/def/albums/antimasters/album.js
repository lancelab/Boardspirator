(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
gio.def.albums['antimasters']={

	gkey : 'antimasters',

	
	collections : 
			[
				{ credits : { title	:'Beginner' } },

			],
	

	/// dresses
	dresses  :{

			"default" :
			{ rules : "Heros pull boxes of matching color and \npush boxes of alien color.\nBlack matches any color ...\nBoxes are sticky: moved box involves its neighbours ...\n" },


		/// farm_flocks
		farm_flocks :{ 

			skin_key : 'farm_flocks',
			chosen	: true,
			credits : { title : "Home Yard", "date" : "January 2, 2013" },
			tile	: {	width : 90, height: 90 },
			"style"	:
			{			"play" :
						{	"backgroundImage" : "background.png",
							"backgroundColor" : ""
						}
			},			
			focuser : '',

			rules	:
				"Mother Duck pulls its children and Rooster pulls own ...\nChildren push away form non-own parents.\n",


			objective : "Bring baby ducks to pools and chicken to eggs",

			story : "This is a time for family union ... Breeds must gather together",

			hname_table	:{
				hero_x	: 'Father-Decoy',
				hero_a	: 'Rooster',
				hero_b	: 'Mother Duck',
				hero_c	: 'Farmer',
				box_a	: 'Chicken',
				box_b	: 'Duck',
				box_c	: 'Boy',
				box_x	: 'Real monkey'
			}
		}
		/// farm_flocks
	}
};

})();


