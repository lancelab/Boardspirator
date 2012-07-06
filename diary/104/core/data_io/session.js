(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var tclone	=  core.tclone;
					var rman	=  gio.navig.in_session.round;
					var dios	=  gio.data_io.session;


		// Alert:	coll_key is cCOLL_IX, not coll_key addressed in album.
		dios.save = function(){
			var session = {};
			core.each(gio.playalbs, function(gix, playalb){
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
			session = 	{	authenticity_token : gio.session.server.form_authenticity_token,
							jsoned_session : JSON.stringify(session,null,'\t')
						};
			// c onsole.log(session);
			return session;		
		};



		// Alert:	coll_key is cCOLL_IX, not coll_key addressed in album.
		dios.load = function(jsoned_session){
			var session = JSON.parse(jsoned_session);
			var success = true;
			core.each(gio.playalbs, function(gix, playalb){

				if( !session[playalb.key] ) return true;
				core.each(playalb.collections, function(coll_ix, coll){

					var coll_key = 'c'+coll_ix;
					if( !session[playalb.key][coll_key] ) return true;
					if( !coll.maps_loaded ) gio.download_collection(coll);
					if( coll.maps_loaded !== 'success' ) return true;
					core.each(coll.maps, function(mix, gm){

						var map_key = 'm'+mix;
						if( !session[playalb.key][coll_key][map_key] ) return true;
		
						w = session[playalb.key][coll_key][map_key].raw_board;
						if( gm.script.raw_board !== w ){
							gio.cons_add(	'Since session saved, map ' + gm.ix +
											" \"" + gm.title + "\" has been changed.\n" +
											"Former map = \n" + w + "\n"+
											"New map = \n" + gm.script.raw_board + "\n"   );
							return true;
						}
						success = rman.deserialize_rounds(session[playalb.key][coll_key][map_key].rounds,'unjasoned');

					});			
				});			
			});
			return success;
		};


})(jQuery);

