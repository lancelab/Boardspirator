(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

	gio.solver = function(){

		var self={};

		// Index of this array is a radius:
		var stateSpheres;

		// State next to state which has been used as a base
		// before timeout:
		// Used to start from when search is resumed:
		var phase;


		var doMove;

		// via colonies and punits:
		var unitsIterator=

		self.init(initialState_, unitsIterator_, spaceIterator_, doMove_ ){
			currentState=initialState_;

			// TODm Checks solution

			phase={
				sphere : 0,
				angle : 0
			};

			stateSpheres=
			[
				[
					initialState_,
					-1,
					-1,
					0,
					0
				],
				[]
			]
			spaceIterator = spaceIterator_ || spaceIterator;
			doMove=doMove_ || doMove;
			unitsIterator=unitsIterator_;
		};



		self.doSearch = function( timeInterval ){

			var stopTime = (new Date()).getTime()+timeInterval);
			while((new Date()).getTime() < stopTime){
				for(var sp=phase.sphere; sp>-1; sp++){
					for( var an=phase.angle; an < st.length, an++ ){
						phase.angle = an;
						var state=states[phase.sphere][phase.angle][0];
						if(!unitsIterator(state,spaceIterator)) return;
					}
					phase.sphere = sp+1;
					if(states[phase.sphere].length === 0 ){
						// SOLUTION DOES NOT EXIST
						// ....
						return;
					}
					spheres[sp+2]=[];
					phase.angle=0;
				}
			} 	
		};
	


		
		var doMove=function (state,x,y){
				switch(y){
					case -1:	mkey='up';
								break;
					case 1:		mkey='down';
								break;
				}
				switch(x){
					case -1:	mkey='left';
								break;
					case 1:		mkey='right';
								break;
				}
				gio.virtual_move(mkey,true);
		};

		var doHandleMove=function (state,x,y){
			// Validates move
			var newState = doProcessMove(state, x,y);

			if(stateAlreadyExists) return true;

			// Does state bookeeping
			var filledSphere = spheres[phase.sphere+1];
			filledSphere[filledSphere.len]=[
					newState,
					phase.sphere,
					phase.angle,
					x,
					y
			];
					

			// Checks solution
		

		};


		var spaceIterator=function(state){
			for(var x=-1; x<2; x++){
				for(var y=-1; y<2; y++){
					if(x !== 0 && y !== 0 ){
						phase.sphere
						if(!doHandleMove(doMove(state,x,y))) return; 
					}
				}
			}
		};


		return self;
	};//solver = function

	gio.solve = function(){
		alert('This feature is in progress ... ');
		return;

		gio.do_record(null,'to beginning');
		gio.solver.init(initialState_, unitsIterator_);
		//doMove = gio.virtual_move; //(direction, true)
	};


	

})( jQuery );

