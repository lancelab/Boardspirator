
( function () { 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};




	gio.gui.inject_playpath = function ( ix, gm )
	{
		var ppath = gm.playpaths[ ix ];
		if( !ppath ) return;
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
		gio.gui.procs.lock_controls( 'Validating playpath text ...' );
		if( ppath.pos ) gio.navig.in_session.round.init_round( gm, 'doreset', ppath.pos );

		var validator_err = gio.navig.in_session.round.text2round( ppath.value );
		if( validator_err )
		{
			gio.cons_add( validator_err );
		}else{
			gio.gui.procs.do_manage_round( null, 'to beginning' );
		}
		gio.gui.procs.draw_status_and_scene();
		//TODm must use own unlocker, not generic:
		gio.gui.procs.unlock_controls();
		return validator_err;
	};



	///	Resets:		gm.playpaths control on GUI and 
	//				lands on cursor_ix if it is supplied.
	//	Purpose:	reset when gm.playpaths changed
	//	Input:		cursor_ix - opt
	gio.gui.reset_playpaths_select_el = function ( cursor_ix )
	{

		var gm = gio.getgs().gm;
		var validator_err = '';

		//TODm check this ... we should be ready to set bundled playpaths now:
		if( gm.playpaths ) {

				gio.domwrap.cpanel.cont_rols.playpaths.reset(

					{r:{
						options		: gm.playpaths,
						callback	: function ( ix, vvdummy ) { gio.gui.inject_playpath ( ix, gm ); }
					},
					c:{	dont_reset_styles	:false,
						choice_ix			: ( cursor_ix || 0 )  //,
						//gui					:{style:{wrapper:{display:'block'}}}
					}}
				);
			if( cursor_ix || cursor_ix === 0  )
			{
				var validator_err = gio.gui.inject_playpath ( cursor_ix, gm );
			}
		}
		//else{
		//	gio.domwrap.cpanel.cont_rols.playpaths.reset(
		//		{c:{gui:{style :{wrapper:{display:'none'}}}}});
		//}

		return validator_err;

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
