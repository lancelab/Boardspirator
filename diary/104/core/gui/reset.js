(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	// Action: does reset in gameplay context:
	gio.gui.reset_playpaths=function(){
		var gm = gio.getgs().gm;
		//TODm check this ... we should be ready to set bundled playpaths now:
		if(gm.playpaths){
				gio.domwrap.cpanel.controls.bundles_path_select_el.reset(
					{r:{
						options		:gm.playpaths,
						callback	:function(i,v){

										//TODnon-critical lockers while conversion ... takes long?
										gio.gui.procs.lock_controls('Validating playpath text ...');
										if(v.pos) gio.navig.in_session.round.init_round(gm, 'doreset', v.pos)

										var validator_err = gio.navig.in_session.round.text2round(v.value);
										if( validator_err ){
											gio.cons_add(validator_err);
										}else{
											gio.gui.procs.do_manage_round(null,'to beginning');
										}
										gio.gui.procs.refresh();
										//TODm must use own unlocker, not generic:
										gio.gui.procs.unlock_controls();
									}
					},
					c:{	dont_reset_styles	:false,
						choice_ix			:0,
						gui					:{style:{wrapper:{display:'block'}}}
					}}
				);
		}else{
			gio.domwrap.cpanel.controls.bundles_path_select_el.reset(
				{c:{gui:{style :{wrapper:{display:'none'}}}}});
		}
	};//reset_playpaths

	

	gio.gui.reset_rounds_select_el=function(){
		var gm = gio.getgs().gm;
		if(gm.rounds.length > 1){
			gio.domwrap.cpanel.controls.rounds_select_el.reset(
					{r:{
						options		:gm.rounds,
						callback	:function(i,v){
										gm.rounds.ix = i;
										gio.gui.procs.refresh();
									}
					},
					c:{	dont_reset_styles	:false,
						choice_ix			:gm.rounds.ix,
						gui					:{style:{wrapper:{display:'block'}}}
					}}
				);
		}else{
			gio.domwrap.cpanel.controls.rounds_select_el.reset(
				{c:{gui:{style :{wrapper:{display:'none'}}}}});
		}
	};//reset_rounds



})(jQuery);
