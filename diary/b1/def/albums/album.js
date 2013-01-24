( function( ) { 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	
			// //\\// Adds album to postponed load

			var wrap = gio.data_io.add_defions;
			gio.data_io.add_defions = function ()
			{
				wrap();
				arg		=	{};
				arg.url	=	tp.core.app_webpath_noindex + '/' +
							gio.config.defpaths.ALBUMS_DEF_PATH +
							'/album.jwon.txt',
				gio.data_io.download_defion ( arg );
			};


})();


