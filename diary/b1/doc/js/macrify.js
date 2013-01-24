(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var feeder	= gio.config.feeder;
					var conadd	= function ( string ) { gio.cons_add( "Macrify.entry: " + string ); };			
					var deb		= function ( string ) { gio.debly( "Macrify.entry: " + string ); };			

					deb( "Setting Macrify ..." );		





		/// Replaces gaming part of application with readme part.
		gio.session.init.entry = function() {

			deb( "Entering Macrify ..." );		

			var astub			= '<a target="_blank" href="../?akey=';
			var astub_no_alb	= '<a target="_blank" href="../?';
			var bstub			= '<a target="_blank" href="';

			tp.core.rebuild_readme_html(

				gio.description, 
			
				/// Defines tokens to replace
				{
					'Colorban'				: astub + 'colorban">Colorban</a>', 
					'Sokoban'				: astub + 'sokoban">Sokoban</a>', 
					'Flocks'				: astub + 'flocks">Flocks</a>', 
					'Flockmasters'			: astub + 'flockmasters">Flockmasters</a>', 
					'Antimasters'			: astub + 'antimasters&curl=//def/albums/antimasters/collections/default/maps.jwon.txt">Antimasters</a>',
					'Antimasters--script'	: bstub + '../def/albums/antimasters/collections/default/maps.jwon.txt">Script</a>',

					'Monkeyban'				: astub + 'monkeyban">Monkeyban</a>', 
					'Doubleban'				: astub + 'doubleban&aurl=//def/albums/doubleban/album.jwon.txt">Doubleban</a>', 
					'Colortrain'			: astub + 'colortrain">Colortrain</a>', 

					'Bumpy Targets'			: astub_no_alb + 'asingle&curl=//def/albums/standalone/collections/default/bumpy_targets.jwon.txt">Bumpy Targets</a>',
					'Bumpy Targets--script'	: bstub        + '../def/albums/standalone/collections/default/bumpy_targets.jwon.txt">Script</a>',

					'LeapOrPush'			: astub_no_alb + 'asingle&curl=//def/albums/standalone/collections/default/leap_or_push.jwon.txt">Leap or Push</a>',
					'LeapOrPush--script'	: bstub        + '../def/albums/standalone/collections/default/leap_or_push.jwon.txt">Script</a>',

					'PullPush'				: astub + 'pullpush">PullPush</a>', 
					'Co-PullPush'			: astub + 'co_pullpush&curl=//def/albums/pullpush/collections/default/co_maps.txt">Co-PullPush</a>', 

					'LeapPush'				: astub + 'leappush&curl=//collections/default/maps.txt&aurl=//def/albums/leappush/album.json.txt">LeapPush</a>', 
					'Co-LeapPush'			: astub + 'co_leappush&curl=//collections/default/co_maps.txt&aurl=//def/albums/leappush/album.json.txt">Co-LeapPush</a>', 

					'Pull-Swap-Push'		: astub + 'pullswappush&curl=//def/albums/pullswappush/collections/default/maps.txt">Pull-Swap-Push</a>', 
					'Co-Pull-Swap-Push'		: astub + 'co_pullswappush&curl=//def/albums/pullswappush/collections/default/co_maps.txt">Co-Pull-Swap-Push</a>'

					
					//. works but poor CSS
					//'AppDescription'	: gio.description_table
				}					                 
			);

			//. possibly forces all anchors to load different tab
			//$('a').attr('target', '_blank');

			// c cc( "Readme gio=", gio );
		};


})();
