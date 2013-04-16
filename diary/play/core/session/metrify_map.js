
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
		var tt				= mmet.r;


		//: Not convincing.
		// var t		 	= reparts + Math.min( ( ii - reparts ), reparts );
		// if( ii && !t )	rint = 1;

		var It			 	= ( tt + ii ) / 1.5;

		//.	was:
		//	var flat_diff			= ii		+ density * ( pp - ii );
		var flat_diff			= pp + ii + tt;
		var progressive_diff	= ( pp + 2.0 * ii + 3.0 * tt ) / 6.0;
		var abs_diff			= It + density * ( pp - ii );
		var creativity_metric	= cm = abs_diff / summary.boredom;

		//. it was /= to indicate high degree of uncertainty
		//	var estimation			= ( mmet.estimation === 'solpath' ) ? ' /= ' : ' = ';

		//. now we use "=" to decrease reader's confusion
		var estimation			= ( mmet.estimation === 'solpath' ) ? ' = ' : ' = ';

		result		+=	"<pre>\n"; 

		result		+=	"    Path, Inter, ReInter: p, i, t "		+ estimation + pp + ", " + ii + ", " + tt + "\n"; 
		result		+=	"    Flat Diff.,   F = p+i+t       "		+ estimation + flat_diff + "\n"; 
		result		+=	"    Progr. Diff., P = (p+2i+3t)/6 "		+ estimation + progressive_diff + "\n"; 
		result		+=	"    Effective Int., I = 2(t+i)/3  "		+ estimation	+ It + "\n"; 
		result		+=	"    Difficulty,  d = I+g(p-i)     "		+ estimation + abs_diff + "\n"; 
		result 		+=	"    Flat Creativity,       F/v     ~ "	+ flat_diff / summary.boredom + "\n"; 
		result 		+=	"    Creativity Metric, C = d/v     ~ "	+ cm + "\n"; 

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

		result 				+=	"    Whirps =  C/maxc ( 10-scale )  ~ "	+ ten_str + "\n"; 

		result 				+=	"    Whirps =  C/maxc ( %        )  ~ "	+ relative_str + "\n\n"; 
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
