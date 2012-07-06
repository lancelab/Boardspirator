(function( $ ){ 	var tp   	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  	=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;
					var rman	=  gio.navig.in_session.round;



	// ============================================
	// Purpose:	to assist playsession upload
	// ============================================
	rman.serialize_rounds = function(gm, no_json){

		if( (!JSON || !JSON.stringify) && !no_json ) return '';

		// Get gui-map-playsession:
		var gm = gm || gio.getgs().gm;
		var rounds = gm.rounds;

		// Rounds' warehouse:
		var stash = {};

		stash.game_key = gm.collection.plalb.key;
		stash.collection_ix = gm.collection.coll_ix;
		stash.map_ix = gm.ix;
		stash.current_round_ix = rounds.ix;
		
		stash.rounds = [];
		for(var rix=0; rix<rounds.length; rix++){
			var round = rounds[rix];
			var sr = stash.rounds[rix]={};
			sr.path = gio.navig.in_session.round.path2text(round);
			var pstate = gm.solver.adapter.createdNode(round.start_pos, null, null, 'make pstate only');
			sr.pstate = tclone(pstate);
			//sr.current_pos_ix = round.current_pos_ix; //TODmm 
		}
		stash.current_round_ix = rounds.ix;

		var result = no_json ? stash : JSON.stringify(stash,null,'\t');

		return result;
	};





	// ========================================
	// Purpose:	to assist playsession download
	// ========================================
	rman.deserialize_rounds = function(rounds_input, already_unjasoned, no_refresh){

		if( !JSON || !JSON.parse) return;

		var des = already_unjasoned ? rounds_input : JSON.parse(rounds_input);
		var result = gio.navig.select_game_and_collection(
				des.game_key,
				des.collection_ix,
				des.map_ix
		);
		if(!result){
			gio.cons_add('Failed to load rounds for game '+des.game_key);
			return false;
		}
		// c onsole.log('map is positioned to',gio.getgs().gm);

		// We have successfully landed on map.
		// Now expand its rounds:
		gm = gio.getgs().gm;

		// c onsole.log('expanding rounds',des.rounds);

		for(var rix=0; rix<des.rounds.length; rix++){
			var dround		= des.rounds[rix];
			var uid2lid		= tclone(dround.start_pos_uid2lid);
			var start_pos	= gm.solver.adapter.doReStorePosition(dround.pstate);
			var round;
			if( rix < gm.rounds.length ){
				gm.rounds.ix = rix;
				round = rman.init_round(gm, 'reset', start_pos);
			}else{
				round = rman.init_round(gm, '', start_pos);
			}
			var path = gio.navig.in_session.round.text2round(dround.path, round);
		}

		// c onsole.log('rounds populated. map=',gio.getgs().gm);
		gm.rounds.ix = des.current_round_ix;

		// ** Removes junk rounds beyond loaded
		for(var rix=gm.rounds.length-1; rix >= des.rounds.length; rix--){
			gm.rounds.pop();
		}

		// Visualize the job:
		if(!no_refresh) {
			// not enough?: gio.gui.procs.refresh()
			// ** at least to reinit rounds:
			gio.session.reinit.rounds();
			// ** try this if above is not enough:
			//gio.navig.select_game_and_collection(
			//	des.game_key,
			//	des.collection_ix,
			//	des.map_ix
			//);
		}
		if(gio.degub) gio.cons_add('Map session load success.');
		return true;
	};


})(jQuery);

