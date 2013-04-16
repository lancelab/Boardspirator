(function(){	 	var tp		=  jQuery.fn.tp$	=  jQuery.fn.tp$ || {};	
					var gio		=  tp.gio			=  tp.gio   || {};
					var gde		=  gio.domwrap.elems;
					var ggp		=  gio.gui.procs;


					// //\\//	Constructs console procedures.
					//			Does not depend on existence of dom-div-for-consoles.



	///	constructs console function
	var CreatesConsole = function ( name, div_name ) {

		var console_text = '';
		var self = {};

		var basic_cons = self.cons_add = function( msg, doclean ) {

			if( doclean ) console_text = '';
			// tp.core.each(arguments,function(i,msg){					// ABANDONED
			if( window.console && window.console.log && msg !== '' ) {  // ***** safe console
				console.log( msg );                                     // ***** safe console
			}
			console_text += "\n" + msg;
			//. this "if" makes code slow, but is output to screen a rare exception ?
			if( gde[ div_name ] ) {
				gde[ div_name ].innerHTML = '<pre>' + console_text + '</pre>';
			}
		};

		self.cons = ( function( msg ) { basic_cons( msg, 'doclean') } );
		gio[ name ] = self.cons;
		gio[ name + '_add'] = self.cons_add;
		return self;
		
	};

	//:	creates generic, playvigation, solver consoles
	CreatesConsole( 'cons', 'con_div_child' );
	CreatesConsole( 'plcons', 'playvig_cons' );
	CreatesConsole( 'solver_cons', 'solver_cons' );


})();
