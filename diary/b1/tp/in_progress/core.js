(function( $ ){



		//////////////////////////////////////////////////////////////////////////
		// Cloners
		//========================================================================
		//Action:			paste trees of objects' sequence into first oblect
		//		 			undefined, nulls, non-objects are igonred
		//					all properties are copied overridingly
		//Implementation:	based on jQuery
		//Note:				TODm is protected against circular loop?
		//					... it relies on jQuery
		//Input:			arguments[0]===true => tree_mode is on (deep copy)
		//					Checking against circular object loop is
		//					responcibility of a caller.
		//					Restrictions: nulls, undefines, ... are allowed
		//Usage:			tpaste(false,wall,paster1,paster2,...)
		//					tpaste(wall,paster1,paster2,...)
		//========================================================================

		// ... version using jQuery features ... non-tree parser

		self.tpaste=function(){
			var len=arguments.length; 

			
		    var tree_mode=arguments[0]; //was a bug. was ...[i]

			var arg_shift=1;
						
			if(typeof tree_mode === 'boolean'){
				arg_shift=2;
			}else{
				tree_mode=true;					
			}
			
			var wall={};
			if(len<=arg_shift) return wall;
			wall=arguments[arg_shift-1] || wall; //TODO if ob is arr but wall not

			for(var i=arg_shift; i<len; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				if(tree_mode){
					$.extend(true,wall,ob);
				}else{
					$.extend(wall,ob);
				}
			}
			return wall;
		};



