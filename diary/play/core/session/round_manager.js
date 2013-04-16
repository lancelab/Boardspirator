(function(){	 	var tp   	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  	=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;
					var rman	=  gio.navig.in_session.round;






	/// Purpose:	to assist playsession upload
	//	Used:		at. ver 1.143 Oct. 24.
	//				Saving map-session
	//				Saving session to db_ready_obj
	rman.serialize_rounds = function(gm, no_json){

		// Get gui-map-playsession:
		var gm = gm || gio.getgs().gm;
		var rounds = gm.rounds;

		// Rounds' warehouse:
		var stash = {};

		stash.akey = gm.collection.ref.list.akey;
		stash.ckey = gm.collection.ckey;
		stash.map_ix = gm.ix;
		stash.current_round_ix = rounds.ix;
		
		stash.rounds = [];
		for(var rix=0; rix<rounds.length; rix++){
			var round = rounds[rix];
			var sr = stash.rounds[rix]={};
			sr.path = gio.navig.in_session.round.path2texts(round).path;

			//.	Apparently bug: refers to nodes-repository, but supplies string instead of repository
			//var pstate = gm.solver.adapter.createdNode(round.start_pos, null, null, 'make pstate only');

			var pstate = gm.solver.adapter.createdNode( round.start_pos );
			//.	Converts to string in case if pstate is an array.
			if( typeof pstate === 'object' ) pstate = gm.solver.adapter.canon2str( pstate );
			sr.pstate = pstate; //tclone(pstate);
			//sr.current_pos_ix = round.current_pos_ix; //TODmm 
		}
		stash.current_round_ix = rounds.ix;

		var result = no_json ? stash : JSON.stringify(stash,null,'\t');

		return result;
	};





	///	Does:		selects album, collection, and map and
	//				replaces rounds in map with
	//				rounds supplied from rounds_input
	//	Purpose:	to assist playsession download
	//	Input:		Optionals: gm, no_refresh, already_unjasoned,
	//				gm must be finalized
	//	Used:		at. ver 1.143 Oct. 24.
	//				Loading map-session
	//				Loading session from db_ready_obj
	rman.deserialize_rounds = function( rounds_input, already_unjasoned, no_refresh, gm){

		var success_flag = false;

		var des = already_unjasoned ? rounds_input : JSON.parse( rounds_input );

		if(!gm){
			if(gio.debug){
				gio.cons_add('Deserializing rounds. Going to select game and collection.');
			}
			var result = gio.navig.validate_coll_map(
				des.akey,
				des.ckey,
				des.map_ix
				// not yet: 'do_load'
			);
			if( !result )
			{
				gio.cons_add( 'Failed to load rounds for game ' + des.akey );
				return false;
			}
			gm = gio.getgs().gm;
		}


		if(gio.debug){
			gio.cons_add('We have successfully positioned on map ix = ' + 
					gm.ix + ' game.basekey=' + gm.game.basekey +
					' game.gkey=' + gm.game.gkey +
					' akey=' + gm.collection.ref.list.akey );
			gio.cons_add('Beginning loop of expanding round(s). Number of rounds = '+des.rounds.length);
		}
		// c onsole.log('expanding rounds',des.rounds);


		var successfully_restored_round = -1;
		var dsuccess_flag = true;
		for(var rix=0; rix<des.rounds.length; rix++){
			var dround		= des.rounds[rix];
			var pstate		= gm.solver.adapter.str2canon( dround.pstate );
			var start_pos	= gm.solver.adapter.doReStorePosition( pstate ); // TODO No validation? Do it. Needs separate converter to avoid hurting a speed.
			var round;
			if( rix < gm.rounds.length ){
				gm.rounds.ix = rix;
				round = rman.init_round(gm, 'reset', start_pos);
			}else{
				round = rman.init_round(gm, '', start_pos);
			}
			var validationError = gio.navig.in_session.round.text2round(dround.path, round);
			if(validationError){
				dsuccess_flag = false;
				gio.cons_add('Round restoration failed: ' + validationError);
			}else if( successfully_restored_round < 0 || rix === des.current_round_ix ){
				successfully_restored_round = rix;
			}
		}

		if(successfully_restored_round > -1){
			// c onsole.log('rounds populated. map=',gio.getgs().gm);
			gm.rounds.ix = successfully_restored_round;

			// ** Removes junk rounds beyond loaded
			//for(var rix=gm.rounds.length-1; rix >= des.rounds.length; rix--){
			//	gm.rounds.pop();
			//}
			// visualizes the job
			if( !no_refresh ) {
				dsuccess_flag = gio.navig.validate_coll_map( null, null, null, 'do_land' );
			}
		}

		if(gio.debug){
			gio.cons_add( 'Map session load ' + ( dsuccess_flag ? 'success' : 'falure' ) ) + '.';
		}
		return dsuccess_flag;
	};


})();

