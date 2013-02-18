
( function () {		var tp   		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var core		=  tp.core;
					var gio  		=  tp.gio    =  tp.gio   || {};

					var gworkers	=  gio.gui.procs;


					// //\\//	Prepares handlers which
					//			are common for button-click or key-strike control events.







	var anchor_stub = 	"<a style=\"color:#AAAAFF; text-decoration:none; font-weight:bold;\" " +
						"onmouseover = \"this.style.color = '#FFAAAA';\" " +
						"onmouseout  = \"this.style.color = '#AAAAFF';\" " +
						"target = \"_blank\" " +
						"href=\"";
	var anchor_http = 	anchor_stub + 'http://';



	/// Makes main credits window
	gworkers.toggle_about_pane = function(){

		if(gio.gui.modes.controls_locked) return;

		var gs = gio.getgs();
		var collection = gs.coll;
		var gm = collection.maps[collection.map_ix];

		var shell_div_style =	"position:relative; top:15px; left:10px; " +
								"font-size : 10px; width : 460px; height : 450px; overflow : auto; " +
								"border-radius : 7px; ";

		var about	= "<h1>C r e d i t s</h1>";


		/// Does mining of original collection credits
		if( gm.coll__eff !== collection ) {
			about		+= "<h2>Original Collection:</h2>";
			about		+= gm.coll__eff.credits_table;
			about		+= "<h2>Wrapping Collection:</h2>";
		}

		about		+= collection.credits_table;

		if( !collection.ref.link.ownhost ) {
			about += 		"<br>External contents can be changed unexpectedly and\n" +
							"are out of " + gio.description.title + " control.<br><br>\n";
		}

 		about += gworkers.get_map_credits().credits_table;
		about += gm.game.credits_table;
		about += gm.dresses_wrap.chosen_dress.credits_table;
		about += "<br>" + anchor_stub + gio.config.links.credits + "\"><h2>S k i n s</h2></a><br>\n";
		about += gio.description_table; //TODM move to About Engine button

		if( collection.script.parsed.file_header.raw ) {
			var flines = collection.script.flines;
			var ww = collection.script.parsed.file_header.raw;
			ww = core.joinRange(flines, ww.start, ww.end - ww.start);
			var style = "font-size : 10px; width : 420px; overflow : auto; border-radius : 7px;";
			about +=	"<div style=\"" + style + "\"><pre>" + 
							"\n\nO r i g i n a l   C o l l e c t i o n   H e a d e r:\n\n"+
							core.htmlencode(ww) +
						"</pre></div>";
		}

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;
 
		gio.common_popup.dotoggle({
				owner:'about', innerHTML: "<div style=\"" +
				shell_div_style + "\">" + about + "</div>" });
		gio.gui.procs.prolong_common_popup();

	};






	gworkers.toggle_help=function(){
		var gs=gio.getgs();
		gio.common_popup.dotoggle({
				owner:'help',
				innerHTML:	'<pre>' +
							(  gs.round && gs.round.gm.solver.browser_mode ? gio.solver.config.help : gio.info.help.main  ) +
							"\n"+'</pre>'
		}); //TODM hell. gs.round.gm.solver ... when popup can happen??

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup();
	};



	/// shows all about map including credits
	gworkers.toggle_about_map_pane = function(){

		var res = '';
		var gs = gio.getgs();
		var gm = gs.gm;
		var dsmap = gm.script.data_source_map;

		if( dsmap ) {
			res +=	"<pre>\nO r i g i n a l    B o a r d:\n\n" + 
					core.htmlencode(dsmap.script.raw_board) +
					"</pre>";
		}else{
			if( gm.script.raw_board) {
				res +=	"<pre>\nB o a r d:\n\n" + 
						core.htmlencode(gm.script.raw_board) +
						"</pre>";
			}
		}


		res += gm.metrics.recalculated.text;


		res += gworkers.get_map_credits('with_externals').description_table; //credits_table;


		if( dsmap ) {
			res +=	"<pre>\nO r i g i n a l    M a c r o s - D e c o d e d    P o s t - B o a r d:\n\n" + 
					core.htmlencode(dsmap.parsed.macrosed_postboard) +
					"</pre>";
		}else{
			res +=	"<pre>\nM a c r o s - D e c o d e d     P o s t - B o a r d:\n\n" + 
					core.htmlencode(gm.parsed.macrosed_postboard) +
					"</pre>";
		}


		if( core.get_first_or_null( gm.collection.macros ) ) {
			//. shows raw because macrosed is possibly different
			//	TODM remove board bs it is redundant
			res +=	"<pre>\nR a w    M a p    T e x t:\n\n" + 
					core.htmlencode(gm.script.raw_map) +
					"</pre>";
		}

		if( dsmap ) {
			if( core.get_first_or_null( dsmap.collection.macros ) ) {
				//. shows raw because macrosed is possibly different
				//	TODM remove board bs it is redundant
				res +=	"<pre>\nO r i g i n a l    M a p    R a w    T e x t:\n\n" + 
						core.htmlencode(dsmap.script.raw_map) +
						"</pre>";
			}
		}

		gio.common_popup.dotoggle( { owner:'map_comments', innerHTML : res } );

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};



	/// makes map credits
	gworkers.get_map_credits = function( with_external ) {
		var gs		=	gio.getgs();
		var gm		=	gs.gm;
		
		var original_map = gm.script.data_source_map;
		if( original_map ) {
			var final_credits = core.clone_many( original_map.credits );
			final_credits.credits = [ core.clone_many( gm.credits ) ];
		}else{
			var final_credits = core.clone_many( gm.credits );
		}

		var external = gm.coll__eff.ref.link;
		if( external.link && with_external) {
			final_credits.web_site = gm.coll__eff.credits.web_site;
			final_credits.source = gm.coll__eff.ref.link.link;
		}
		var stub_obj = {};

		core.tooltipify( stub_obj, "Map", final_credits );
		return stub_obj;
	};






	gworkers.show_rules = function () {
		gio.common_popup.dotoggle({
			owner:'help',
			innerHTML:"<pre>R u l e s\n\n" + gio.getgs().gm.dresses_wrap.chosen_dress.rules + '</pre>'
		});

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};

	gworkers.show_objective = function () {
		gio.common_popup.dotoggle({
			owner:'help',
			innerHTML:"<pre>O b j e c t i v e\n\n" + gio.getgs().gm.dresses_wrap.chosen_dress.objective + '</pre>'
		});

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};

	gworkers.show_story = function () {
		gio.common_popup.dotoggle({
			owner:'help',
			innerHTML:"<pre>S t o r y\n\n" + gio.getgs().gm.dresses_wrap.chosen_dress.story + '</pre>'
		});

		//.	TODQ&D Apparently Galaxy, Android player lost zIndex here
		//	by unknown reason ... this line makes a temporary fix
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};




})();
