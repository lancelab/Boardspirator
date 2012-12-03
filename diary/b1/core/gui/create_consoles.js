(function(){ 		var tp		=  jQuery.fn.tp$  =  jQuery.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdw		=  gio.domwrap;
					var gde		=  gio.domwrap.elems;





	//===============================================================
	// Makes all-purpose consoles:
	// Composed out of divs: parent and children.
	//			Parent - hides text which does not fit the space
	//			Children:
	//				playvigation console
	//				generic console
	//				debug console
	// Note:	css-ids are set when vital for debug:
	//			Example: con_wrap.setAttribute('id','cons_wrap_deb')
	//===============================================================
	gio.gui.init.create_consoles=function(){

			var dcenter = gio.domwrap.regions.dcenter;
			var cstyle  = gstyle.console;
			var pstyle  = tp.core.paste_style;


			// ** creates wrapper for consoles
			var con_wrap				= document.createElement('div');
			gde.con_div					= con_wrap;
			dcenter.appendChild(		  con_wrap);
			con_wrap.style.position		= 'absolute';
			pstyle(						  con_wrap, cstyle.wrapper );
			if( gio.debug )				  con_wrap.style.overflow = "visible";
			tp.gui.cornerize(			  gstyle.playboard.corners, con_wrap);
			con_wrap.setAttribute(		  'id','cons_wrap_deb');
			// **	it is vital to set zIndex after cornerize(), because apparently
			//		AppleWebkit breaks zIndex:
			//		ss.zIndex = gstyle.controls.zIndex;			



			// ** creates generic console
			var ww					= document.createElement('div');
			gde.con_div_child		= ww;
			con_wrap.appendChild(	  ww );
			ww.style.position		= 'absolute';
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.generic );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			ww.setAttribute(		  'id','gen_cons_deb');




			// ** creates playvigation console
			var ww					= document.createElement('div');
			gde.playvig_cons		= ww;
			con_wrap.appendChild(	  ww );
			ww.style.position		= 'absolute';
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.playvigation );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			ww.setAttribute(		  'id','playvig_cons_deb');




			// ** creates solver console
			var ww					= document.createElement('div');
			gde.solver_cons			= ww;
			con_wrap.appendChild(	  ww );
			ww.style.position		= 'absolute';
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.solver );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			ww.setAttribute(		  'id','solver_cons_deb');





			// ** creates console for debug
			var ww					= document.createElement('div');
			gde.debug_cons			= ww;
			con_wrap.appendChild(	  ww);
			ww.style.position		= 'absolute';
			var ss					= ww.style;
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.debug );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			if(gio.debug)			  ss.display = 'block';
			if(gio.debug)			  ss.visibility = 'visible';
			// * id name is special for debug, don't change it here
			ww.setAttribute(		  'id','tpdebug');

	};


})();
