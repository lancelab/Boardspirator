(function( ){	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	///	Resets gm.playpaths control on GUI.
	//	Apparently does nothing to change "round.path"
	gio.gui.reset_playpaths_select_el = function () {

		var gm = gio.getgs().gm;

		//TODm check this ... we should be ready to set bundled playpaths now:
		if( gm.playpaths ) {

				gio.domwrap.cpanel.cont_rols.playpaths.reset(

					{r:{
						options		:gm.playpaths,
						callback	:function(i,v){

										/// makes it free for now
										/*
										/// suggests curious people to login
										if(	!gio.session.server.message.loggedin && 
											!gio.config.query.luckedin &&
											gm.ix &&
											!gm.collection.ref.link.link &&
											!gio.getgs().playalb.ref.link.link){ //TODM messy gm, gs ... get them at once inside of callback
											alert('Available for logged-in users');
											return false;
										}
										*/

										//TODnon-critical lockers while conversion ... takes long?
										gio.gui.procs.lock_controls('Validating playpath text ...');
										if(v.pos) gio.navig.in_session.round.init_round(gm, 'doreset', v.pos)

										var validator_err = gio.navig.in_session.round.text2round(v.value);
										if( validator_err ){
											gio.cons_add(validator_err);
										}else{
											gio.gui.procs.do_manage_round(null,'to beginning');
										}
										gio.gui.procs.draw_status_and_scene();
										//TODm must use own unlocker, not generic:
										gio.gui.procs.unlock_controls();
									}
					},
					c:{	dont_reset_styles	:false,
						choice_ix			:0  //,
						//gui					:{style:{wrapper:{display:'block'}}}
					}}
				);
		}
		//else{
		//	gio.domwrap.cpanel.cont_rols.playpaths.reset(
		//		{c:{gui:{style :{wrapper:{display:'none'}}}}});
		//}
	};//reset_playpaths




	var do_reset_rounds_select_el = function(){
		var gm = gio.getgs().gm;

		gio.domwrap.cpanel.cont_rols.rounds.reset(
					{r:{
						options		:gm.rounds,
						callback	:function(i,v){
										gm.rounds.ix = i;
										gio.gui.procs.draw_status_and_scene();
									}
						},
					c:{	dont_reset_styles	:false,
						choice_ix			:gm.rounds.ix,
						gui					:{style:{wrapper:{display:'block'}}}
						}
					}
		);
	};
	



	gio.gui.reset_rounds_select_el=function(){

		var gm = gio.getgs().gm;
		if(gm.rounds.length > 1){

			do_reset_rounds_select_el();
		}else{

			gio.domwrap.cpanel.cont_rols.rounds.reset(
				{c:{gui:{style :{wrapper:{display:'none'}}}}});
		}
	};//reset_rounds



})();
