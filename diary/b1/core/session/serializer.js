(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var tclone	=  core.tclone;
					var rman	=  gio.navig.in_session.round;
					var dios	=  gio.data_io.session;




		// ================================================================
		// Alert:	coll_key is cCOLL_IX, not coll_key addressed in album.
		// ================================================================
		dios.session2db_ready_obj = function(){
			var session = {};
			core.each(gio.session.alist, function(gix, playalb){
				core.each(playalb.collections, function(coll_ix, coll){
					var coll_key = 'c'+coll_ix;
					if( coll.maps_loaded !== 'success' ) return true;
					core.each(coll.maps, function(mix, gm){
						var map_key = 'm'+mix;
						if( !gm.rounds ) return true;
						var sg = session[playalb.key] = session[playalb.key] || {};
						var sgc = sg[coll_key] = sg[coll_key] || {};
						sgc[map_key] = { raw_board : gm.script.raw_board,
										 rounds : rman.serialize_rounds(gm, 'no json')
										}
					});			
				});			
			});
			session = 	{	authenticity_token : gio.session.server.message.form_authenticity_token,
							jsoned_session : JSON.stringify(session,null,'\t')
						};
			// c onsole.log(session);
			return session;		
		};




		// ================================================================
		// Alert:	coll_key is cCOLL_IX, not coll_key addressed in album.
		// ================================================================
		dios.load_jsoned_sess2sess = function(jsoned_session){

			var session = JSON.parse(jsoned_session);
			var success = true;
			var last_gm = null;
			core.each(gio.session.alist, function(gix, playalb){

				if( !session[playalb.key] ) return true;
				core.each(playalb.collections, function(coll_ix, coll){

					var coll_key = 'c'+coll_ix;
					if( !session[playalb.key][coll_key] ) return true;
					if( !coll.maps_loaded ) gio.data_io.download_cfile(coll);
					if( coll.maps_loaded !== 'success' ) return true;
					core.each(coll.maps, function(mix, gm){

						var map_key = 'm'+mix;
						var sess_map = session[playalb.key][coll_key][map_key];
						if( !sess_map ) return true;
		
						var ww = sess_map.raw_board;
						if( gm.script.raw_board !== ww ){
							gio.cons_add(	'Since session saved, map ' + gm.ix +
											" \"" + gm.title + "\" has been changed.\n" +
											"Former map = \n" + ww + "\n"+
											"New map = \n" + gm.script.raw_board + "\n"   );
							return true;
						}
						if(gm.load === 'parsed') gio.session.reinit.landify_map( gm );
						if(gm.load === 'invalid'){
							gio.cons_add('Map ' + gm.ix + ' is invalid and cannot take session rounds.');
							return true;
						}

						if(gio.debug){
							gio.cons_add('Going to deserialize map ' + gm.ix +
										' game.basekey=' + gm.game.basekey  +
										' game.gkey=' + gm.game.gkey +
										' bundle='+gm.collection.ref.list.akey);
						}
						var this_success = rman.deserialize_rounds(
							sess_map.rounds,
							'unjasoned',
							'dont refresh',
							gm
						);
						if(this_success) last_gm = gm;
						if(!this_success) success = false;

					});			
				});			
			});

			if(	last_gm &&
				!gio.navig.validate_coll_map (
								last_gm.collection.ref.list.akey,
								last_gm.collection.ref.list.ix,
								last_gm.ix,
								'do_land'
				)
			){
				gio.cons_add( 'Failed to load rounds for map ' + gm.title );
				return false;
			}

			return success;
		};


})();

