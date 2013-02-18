( function( ) { 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	
			// //\\// Adds album to postponed load

			var wrap = gio.data_io.add_gafions;
			gio.data_io.add_gafions = function ()
			{
				wrap();
				gio.data_io.download_gamion (
				{
					galfinition :
					{	penetrate_asingle	: true, 
						gafion				: true
					},
					common :
					{	link :	tp.core.app_webpath_noindex + '/' +
								gio.config.defpaths.ALBUMS_DEF_PATH +
								'/album.jwon.txt'
					}
				});
			};


})();


