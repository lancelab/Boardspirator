(function( $ ){		var tp		= $.fn.tp$ = $.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var smode	= gio.modes.sta_tic;

	gio.Description={
		Title			:'Boardspirator',
		Description		:'Boardpuzzle Framework',
		Version			:'0.0.104',
		Date			:'July 6 2012',
		Copyright		:'(c) 2011-2012 Konstantin Kirillov',
		License			:"Dual licensed under the MIT or GPL Version 2 licenses except folders " +
						"\"play/def/collectinos\" and \"play/def/albums\"\n"+
						"\t\t\t\t\t\twhich have own licenses.",
		Language		:'JavaScript',
		SystemRequirements	:"\t\tTo play: FireFox 3.6+, IE 8+, any decent browser or mobile device.\n"+
							"\t\t\t\t\t\tTo deploy: FireFox 3.6+ and IE 8+: no server needed; Chrome and Opera? request a server.",
		Usage			:'See "SystemRequirements"',
		WebSite			:'landkey.net/gio/',
		Contact			:'e m a i l:  b e a v e r s c r i p t   a t   l a n d k e y . n e t',
		Diary			:"\n"+
						"	0.0.104		minor fixes to 102\n"+
						"	0.0.103		minor fixes to 102\n"+
						"	0.0.101		dress code fixes\n"+
						"	0.0.100		in map script, dresses can be inherited and images chosen from common\n"+
						"	      		repository or from collections\n"+
						"	0.0.99		collection maps can mix games and other collections\n"+
						"	0.0.98		colorban map format and parser changed\n"+
						"	0.0.97		game defs, albs, colls loads from db\n"+
						"	0.0.94		text editor works in Android\n"+
						"	0.0.93		playsession saves/loads, defs restructured \n"+
						"	0.0.89		game/album inheritance refactored\n"+
						"	0.0.87		object tree is refactored\n"+
						"	0.0.85		buttons are context-sensetive\n"+
						"	0.0.85		towerban def improved\n"+
						"	0.0.84		color rules corrected: black dynamic units can push any color\n"+
						"	0.0.82		solver can start from any pos\n"+
						"               solver browser imports path to playsession\n"+
						"	0.0.80		corners began\n"+
						"	0.0.79		adding session save-load features\n"+
						"	0.0.78		folder restructured\n"+
						"	0.0.77		folder restructured\n"+
						"	0.0.75		solver added and workable for position-states number <~ 400 000\n"+
						"				select_el is available in form.js in item and button callbacks,\n"+
						"	0.0.67		Buttons on map editor.\n"+
						"				New maps.\n"+
						"				Empty collection header bug fix.\n"+
						"				Sokoban maps recognized better.\n"+
						"				Touch control is better.\n"+
						"				Playpath format bug fix.\n"+
						"	0.0.73 and below: see versions in Diary folder\n"
	};





	gio.session.init.entry =	function(){ // TODm gio.session.init

		var w;
		var title=gio.Description.Title;

		// Get parameters from URL query string:
		gio.debug= gio.debug || core.getQueryPar('debug');

		if(!ggi.entry()){alert(title +' cancelled'); return;}

		// ** finalizes base definitions
		gdef.procs.spawn_base_game_and_dress();



		// ===========================================
		// Establish database session if requested
		// -------------------------------------------
		w = core.getQueryPar('db');
		if(w){
			if( typeof w === 'string'){
				smode.db = w === 'no' ? '' : w;
			}else{
				smode.db = 
						window.location.protocol+'//'+
						window.location.host;
			}
		}
		if( !JSON || !JSON.stringify || !JSON.parse ){
			if(smode.db) alert('Your browser does not support JSON and cannot communicate with database.');
			smode.db = '';
		}
		// c onsole.log('database flag='+smode.db);
		// -------------------------------------------
		// Establish database session if requested
		// ===========================================






		// Data download begins ...
		if( smode.db ){
				// ** Get form_authenticity_token
				w = gio.session.server;
				gio.data_io.core.load.object(	
						smode.db + '/albums?form_authenticity_token=yes',
						w, 'form_authenticity_token'
				);
				w.form_authenticity_token = w.form_authenticity_token.form_authenticity_token;
				// c onsole.log('form_authenticity_token= ',w.form_authenticity_token);
		}


		// ** Load games definitions
		if( smode.db ){	
				// **	Loads all available game defs from database at once
				gio.data_io.core.load.object(
						smode.db + '/games',
						gdef, 'games'
				);
		}else{
				gio.data_io.core.load.object( 
					gio.config.defpaths.GAMES_DEF_PATH+'/list.json.txt',
					gdef,
					'games'
				);
		}


		// ** Loads album definitions
		if( smode.db ){	
				// **	Loads all available album_defs from database at once and 
				//		overrides loaded by <script> from page header
				gio.data_io.core.load.object(	
						smode.db + '/albums', //?json=yes',
						gdef, 'albums'
				);
		}



		// ** Finally, instantiate albums:
		core.each(gdef.albums, function(album_key,album_def){
			gdef.procs.derive_album(album_key);
		});
		if(!gio.playalbs || gio.playalbs.length===0){
			gio.cons_add('No album definitions are found.');
			return;
		}

		ggi.controls_and_game_list();



		//This is ? a good place to release messages stashed in debug, while
		//<body> did not exist yet:
		//tp$.deb('init done');




		// ** Establish at least one map:
		gio.game_ix = 0;
		var zero_plgam = gio.playalbs[gio.game_ix];
		if(!gio.download_collection(  zero_plgam.collections[0]  )){
			gio.cons_add(title + ' is not loaded.');
			return;
		};

		// TODm seems does twice: dont waste time: rid of this: next URL-way overrides this:
		gio.navig.select_game_and_collection( //TODm gio.session.select.game_and_collection
				gio.game_ix,
				zero_plgam.collections.ix,
				0,
				'allow default map'
		);



		// ** Do select startup indices as user requested
		var album_key=core.getQueryPar('game_key');
		var collection_ix=core.getIntegerQueryPar('collection_ix');
		var map_ix=core.getIntegerQueryPar('map_ix');
		gio.navig.select_game_and_collection(album_key, collection_ix, map_ix);


		ggi.control_events();
		ggi.step_events();

		// Doc: Good way to see app tree:
		// c onsole.log('application object tree',gio);
	};
	gio.session.init.wrap =	function(){	gio.session.init.entry(); };


})(jQuery);

$('document').ready( $.fn.tp$.gio.session.init.wrap );

