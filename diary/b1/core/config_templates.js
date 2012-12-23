
(function(){		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var gdef	= gio.def;
					var cpaste	= tp.core.paste_non_arrays;


	// //\\//	Sets Templates


	var tt = gio.def.templates = 
	{

		def :
		{
			coll :
			{
				ref :
				{
					folder :
					{
						
					},
					link :
					{
						
					}
				},
				credits :
				{
				}
			},

			album :
			{
				collections : [],
				dresses : {}
			}
		}, /// def

		play :
		{
		}

	};

	//: defines templates for play-time objects	
	cpaste( tt.play, tt.def );
	cpaste( tt.play.coll,
		{
			//maps : [], // TODM put maps in script
			script : { state : {}, parsed : {}, proc : {}, heap_json : {} }
		}
	);

})();


