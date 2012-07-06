(function( $ ){ 	var tp   		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  		=  tp.gio    =  tp.gio   || {};
					var gworkers	=  gio.gui.procs;

	// The purpose of this file is to prepare handlers which
	// are common for button-click or key-strike control events.

	gworkers.toggle_help=function(){
		var gs=gio.getgs();
		var plgam=gs.plgam;
		gio.common_popup.dotoggle({
				owner:'help',
				innerHTML:	'<pre>' + gio.info.help.main +
							"\n\nRules: \n" + gs.gm.dresses_wrap.chosen_dress.rules +
							"\n\nObjective: \n" + gs.gm.dresses_wrap.chosen_dress.objective +
							"\n"+'</pre>'
		});
		gio.gui.procs.prolong_common_popup();
	};


	gworkers.toggle_about_map_pane = function(){
		var gs = gio.getgs();
		var gm = gs.gm;

		w = "<pre>S o u r c e     M a p    T e x t:\n</pre>"+tp.core.pre2html(gm.script.raw_map);
		w += gm.script.original_map ? "<pre>O r i g i n a l    M a p    T e x t:\n</pre>" + 
				tp.core.pre2html(gm.script.original_map.script.raw_map) : '';

		gio.common_popup.dotoggle({owner:'map_comments', innerHTML:w});
		gio.gui.procs.prolong_common_popup(); //don't close now
	};




	gworkers.toggle_about_pane = function(){

		if(gio.gui.modes.controls_locked)return;

		var gs=gio.getgs();
		var collection = gs.coll;
		var gm=collection.maps[collection.map_ix];

		var about = 	"C r e d i t s\n" + gm.dresses_wrap.chosen_dress.get_credits()+"\n\n"+
						"E n g i n e\n";

		//===================================
		// A little bit to respect copyright
		//-----------------------------------
		var external_link_info='';
		if(collection.external){
			external_link_info =
				"C r e d i t s\n"+
				"for external map collection:\n"+
				"You loaded this collection from external source:\n"+
				collection.external.link + "\n"+
				gio.Description.Title + " takes no responsibility for contents of external maps.\n"+
				"This content can be changed unexpectedly.\n";
				if(collection.external.human_readable){
					external_link_info += 
						"Known human-readable page for this link is:\n"+
						collection.external.human_readable +"\n\n";
				}
				about = external_link_info + about;
		}
		//-----------------------------------
		// A little bit to respect copyright
		//===================================


		tp.core.each(gio.Description, function(k,v){
			about += '    '+k+': '+v+"\n";
		});
		if(collection.parsed.file_header.raw){

			var flines = collection.script.flines;
			var w = collection.parsed.file_header.raw;
			w = tp.core.joinRange(flines, w.start, w.end - w.start);

			about += 
				"\n\nO r i g i n a l   C o l l e c t i o n   H e a d e r:\n\n"+
				tp.core.htmlencode(w);
		}
		gio.common_popup.dotoggle({owner:'about', innerHTML:'<pre>'+about+'</pre>'});
		gio.gui.procs.prolong_common_popup();
	};

})(jQuery);
