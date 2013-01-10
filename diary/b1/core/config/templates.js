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
				script :
				{	presc :
					{ 			//album or coll to mark an intent
								env		:
								{			//akey_master : query.akey,
											//akey_advice : first_album.key,
											//query		: query
								},
								link :
								{
											//link : query.aurl
								},
								list :
								{			//exclusive : query.asingle,
											//chosen : true,
											//title : "External",
											//selected : true
								}
					}
				},

				ref :
				{

					//	env is an intention
					//		dgkey - where to drink for game and dress
					//		dkey - TODM
					//		gkey - TODM
					//		akey - overridden with dgkey
					//			 - stems to list.akey
					env :
					{
					},
					// list.exclusive - block other collections whenever possible
					list :
					{
					},
					folder :
					{
						
					},
					link :
					{
						
					}
				},
				credits :
				{
				},
				state : {}
			},

			album :
			{
				collections : [],
				dresses : {},
				ref : 
				{
					env :
					{
						 //dgkey : 
					},
					link :
					{
						//outhost :
						//ownhost :
					},
					list :
					{
						//display_preordered
						//lkey	for derived_albums
						//ix	for gui-list
					}
				}
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

			//	list - last list owner
			//		aix - index in albums
			//		akey - akey in stemmed albums
			//		cix - index in own album
			
			script : { state : {}, parsed : {}, proc : {}, heap_json : {} }
		}
	);

})();


