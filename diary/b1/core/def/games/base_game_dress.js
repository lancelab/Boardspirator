(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	





	gio.def.default_dress = 
	{
			title : 'Boxiland',

			credits :
			{
				"author"	: "Konstantin Kirillov",
				//"license"	: "Free for use, distribution, and modification as long as this credit is retained",
				"license"	: "Public Domain",
				"copyright"	: "",
				"web_site"	: "http://landkey.net/gio/gio/play",
				"comments"	: "",
				"date"		: "",
				"email"		: "beaverscript (a) landkey (.) net"
			},



			// //\\ GUI /////////////////////////////////
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
			focuser			: '', // '' causes 'default' in code
			playvigation	:{	
							UNIT_IS_UNSELECTABLE : true // set to false for hanoi towers
			},
			// \\// GUI /////////////////////////////////






			// //\\ INFO /////////////////////////////////
			rules			:	"Hero can push only one box with matching color.\n"+
								"Moved box carries away matching neighbours.\n"+
								"Black, matches any color.\n",
			objective		:	"Put boxes to color-matching targets till all boxes are put or all targets are filled",
			story			:	"",
			hname_table		:	{ hero_x	: 'hero' },
			DIMENSION_NAMES	:	[ 'x', 'y', 'z' ]
			// \\// INFO /////////////////////////////////



	}//	'default'





})();


