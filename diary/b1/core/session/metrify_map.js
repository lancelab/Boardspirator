
( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};




	///	Calculates:	boredom of parameter a and adds it into summary.
	//	Output:		factorizes summary.boredom with y,
	//				y = 1 + penalty.
	//	Input:		range: amin and asense.
	//				if a less amin,	boredom is neglected,
	//				if a ~more asense,	boredom is taken into account.
	//				Initial summary must be: { boredom : 1, message : '' };
	var do_boredomize = function ( a, amin, asense, name_str, summary )
	{
		var x = a / asense;
		if( x < 1 ) 
		{
			var x2		= x*x;
			var min		= amin / asense;
			var min2	= min * min;
			var y		= x2 - min2;
			if( y < 0 )
			{	
				y = 1;
			}else{

				y =  1 + y / ( 1 - min2 );  
			}
		}else{

			var y = 1 + x;
		}


		message =		"    " + name_str + " factor = " + y +
						" ( number, min, sense = " + a + ", " +
						amin + ", " +  asense + " )\n"; 
		summary.boredom *= y;
		summary.message += message; 
	};




	gio.session.reinit.metrify = function ( gm )
	{ 

		var returner	= gm.metrics.recalculated;
		returner.text	= '';

		var config		= gio.solver.config;
		var EU			= gio.config.metrics.EXPECTED_USER;
		var UB			= EU.BOREDOM;

		if( !gm.game.boredom ) return returner;

		var uu		= gm.dynamic_units.length;
		var nni		= gm.metrics.internal_cells_number;

		//.	walls
		var aww		= gm.metrics.internal_blocking_units;
		var uuss	= nni - aww;
		var ss		= uuss - uu;
		var density = Math.min( 1, uu / Math.max( 1, ss ) );


		var result	=	"<pre>Parameters:\n";
		result		+=	"  Internal cells     = " + nni + "\n"; 
		result		+=	"  Blocks (walls),  w = " + aww + "\n"; 
		result		+=	"  Empty cells,     s = " + ss	+ "\n";  
		result		+=	"  Dynamic units,   u = " + uu	+ "\n"; 
		result		+=	"  Density ... u/s, g = " + density + "\n"; 
		result		+=	"\n\n</pre>"; 


		// //\\ Counting boredoms /////////////////////
		//		from excessive crowds.

		var summary	= { boredom : 1, message : '' };

		//. Crowd of breeds if grey grounds and walls are removed
		var bb		=	gm.cols.length - 2;
		do_boredomize( bb, UB.MIN_BREEDS, UB.BREEDS, 'breeds', summary );


		//. Crowd of cells
		var nn		=	uuss + aww * 0.5;
		do_boredomize( nn, UB.MIN_CELLS, UB.CELLS, 'cells', summary );


		//. Crowd of rules
		var rr		=	gm.game.boredom;
		do_boredomize( rr, UB.MIN_RULES, UB.RULES, 'rules', summary );

		result		+=	"<pre>E x p e c t e d    A u d i e n c e    P a r a m e t e r s\n\n";
		result		+=	"    Volumability, v = rules * breeds * cells = " + summary.boredom + "\n";
		result		+=	summary.message;
		result		+=	"\n</pre>"; 

		returner.text = result;
		// \\// Counting boredoms /////////////////////





		// //\\ Creativities /////////////////
		var mmet = gm.metrics.optpath;
		if( !mmet ) return returner;

		var pp				= mmet.p;
		var ii				= mmet.i;
		var re_int			= mmet.r;

		//: Not convincing.
		// var reint		 	= reparts + Math.min( ( ii - reparts ), reparts );
		// if( ii && !reint )	rint = 1;

		//: Not convincing either, but simple: in "best" maps ii ~ re_int, so reint ~ 4/3, ... worst 2/3, so
		//	range is +- 30%
		var reint		 	= ( re_int + ii ) / 1.5;


		var flat_diff			= ii		+ density * ( pp - ii );
		var abs_diff			= reint		+ density * ( pp - ii );
		var creativity_metric	= cm = abs_diff / summary.boredom;
		var estimation			= ( mmet.estimation === 'solpath' ) ? ' /= ' : ' = ';

		result		+=	"<pre>\n"; 

		result		+=	"    Path, Inter, ReInter: p, i, ri  = "	+ pp + ", " + ii + ", " + re_int + " (i,ri estimated)\n"; 
		result		+=	"    Flat Diff,   fd = i+g(p-i)     "		+ estimation + flat_diff + "\n"; 
		result		+=	"    reint           = 2(ri+i)/3     = "	+ reint + "\n"; 
		result		+=	"    Difficulty,   d = reint+g(p-i) "		+ estimation + abs_diff + "\n"; 
		result 		+=	"    Creativity,   c = d/v          "		+ estimation + cm + "\n"; 

		var maxc			=	EU.MAX_KNOWN_CREATIVITY.SCORE;
		var relative		=	cm * 100.0 / maxc;


		// //\\ FORMATTINGS ////////////////////////////////////////////////////
		var relative_str	=	relative + '';
		relative_str		=	relative_str.substr(0,4) + '%';

		var ten_rounded		=	Math.max( Math.ceil( relative - 0.5 ), 1 );
		var ten_str			=	'' + ten_rounded;
		ten_str				=	ten_str.length === 1 ? '0' + ten_str : ten_str;
		var ww				=	ten_str.length - 1;
		ten_str				=	ten_str.substr( 0, ww)  + '.' + ten_str.substr( ww, 1);
		// \\// FORMATTINGS ////////////////////////////////////////////////////

		result 				+=	"    Soko-style,   c/maxc           "		+  estimation + ten_str + "\n"; 

		result 				+=	"    Whirlitivity, c/maxc           "		+  estimation + relative_str + "\n\n"; 
		result 				+=	"    <a style=\"color:#FFFFFF;\" href=" + 
								tp.core.app_webpath_noindex + "/?" +					
								EU.MAX_KNOWN_CREATIVITY.QUERY + ">Known maxc, " + maxc + ".</a>\n\n</pre>"; 
		// \\// Creativities /////////////////

		returner.text			= result;
		returner.ten_rounded	= ten_str;
		returner.relative		= relative;
		return returner;

	};


})();
