( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};

					var gdef	= gio.def;
					var cpaste	= tp.core.paste_non_arrays;
					var clone	= tp.core.clone_many;




					// //\\//	Sets Templates

	var tt = gio.def.templates = 
	{

		def :
		{

			metag :
			{ 
								galfinition :
								{
									//overdefine;
									//penetrate_asingle
									//derive_at_download
									//listify_on_top
								},
								mapfinition : {},
								common : {}
			},

			coll :
			{
				script :
				{
					metag : {}	
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
				coll_ref : {},
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
						//listify_on_top
						//lkey	for derived_albums
						//ix	for gui-list
					}
				}
			}
		}, /// def

		play :
		{
			//: There is no album.
			coll : {}
		}

	};

	cpaste( tt.def.coll.script.metag, tt.def.metag );

	//: defines templates for play-time objects	
	cpaste( tt.play.coll, tt.def.coll );
	cpaste( tt.play.coll,
		{
			//	maps : [], is defined in parser
			script : { state : {}, parsed : {}, proc : {}, heap_json : {} }
		}
	);


	//. Normalizes existing metag, seed, or creates a new one.
	tt.normalize_metag	= function ( seed ) { return cpaste( cpaste( seed, tt.def.metag ), seed ); };

	//. Normalizes existing coll, seed, or creates a new one.
	tt.normalize_coll	= function ( seed ) { return cpaste( cpaste( seed, tt.def.coll ), seed ); };

	//. Normalizes existing album, seed, or creates a new one.
	tt.normalize_album	= function ( seed ) { return cpaste( cpaste( seed, tt.def.album ), seed ); };



})();


