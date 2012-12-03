
		/// MAKING GLOBALS
		var tp$		= $.fn.tp$;
		var gio		= tp$.gio;
		var feeder	= gio.config.feeder;

		gio.session.init.entry = function() {


			var astub = '<a target="_blank" href="../?akey=';
			tp$.core.rebuild_readme_html(
				gio.description, 

			
				/// Defines tokens to replace
				{
					'Colorban'			: astub + 'colorban">Colorban</a>', 
					'Sokoban'			: astub + 'sokoban">Sokoban</a>', 
					'Flocks'			: astub + 'flocks">Flocks</a>', 
					'Monkeyban'			: astub + 'monkeyban">Monkeyban</a>', 
					'Doubleban'			: astub + 'doubleban">Doubleban</a>', 
					'Colortrain'		: astub + 'colortrain">Colortrain</a>', 

					'Bumpy Targets'		: astub + 'bumpytargets&curl=//def/albums/bumpytargets/collections/intro/maps.txt">Bumpy Targets</a>', 

					'PullPush'			: astub + 'pullpush">PullPush</a>', 
					'Co-PullPush'		: astub + 'co_pullpush&curl=//def/albums/pullpush/collections/default/co_maps.txt">Co-PullPush</a>', 

					'LeapPush'			: astub + 'leappush&curl=//collections/default/maps.txt&aurl=//def/albums/leappush/album.json.txt">LeapPush</a>', 
					'Co-LeapPush'		: astub + 'co_leappush&curl=//collections/default/co_maps.txt&aurl=//def/albums/leappush/album.json.txt">Co-LeapPush</a>', 

					'Pull-Swap-Push'	: astub + 'pullswappush&curl=//def/albums/pullswappush/collections/default/maps.txt">Pull-Swap-Push</a>', 
					'Co-Pull-Swap-Push'	: astub + 'co_pullswappush&curl=//def/albums/pullswappush/collections/default/co_maps.txt">Co-Pull-Swap-Push</a>',
				}					                 
			);

			//. possibly forces all anchors to load different tab
			//$('a').attr('target', '_blank');
		};

