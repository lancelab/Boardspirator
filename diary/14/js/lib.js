
(function( $ ){					//addition to $.fn.tp$.game

	//secure names:
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gm=tp.game = tp.game || {};

		//=================================================
		//modes
		//-------------------------------------------------
		//flipping modes:
		tp.bindEvents('keydown', function(a)
		{
			if(		a.event.ctrlKey && a.event.shiftKey && 
					( a.keyName === 'left' || a.keyName === 'right')
			){ 
				var ix=gm.colony_ix;
				ix=(ix+1)%gm.colonies.length;
				gm.colony_ix=ix;
				gm.show_status();
				return false;				
			}
			return true;
		});

		gm.show_status=function()
		{ 
			gm.status_div.innerHTML=
					'<pre>Colony: '+
					gm.colonies[gm.colony_ix].nam+
					'</pre>';
		};
		//-------------------------------------------------
		//modes
		//=================================================


		gm.init_colony = function(colony)
		{

			var zorder=colony.zorder;
			var tiles_map=colony.tiles_map;
			var nam=colony.nam;

			var w=gm.tile.width;
			var h=gm.tile.height;
			var board = gm.board;
			var units = [];
			var selected_unit=0;

			if(!gm.colony_ix)gm.colony_ix=0;

			var count=0;

			$.each(tiles_map, function(y,row)
			{
				$.each(row, function(x, tile_from_map)
				{
					if( !tile_from_map.src ) return true;
					
					//make tile:
					var tile={};
					tile.x=x;
					tile.y=y;
					if(tile.selected) selected_unit = count; //position

					var t = document.createElement('div');
					t.style.position = 'absolute';
					var s=t.style;
					s.left = (w * x) + 'px';
					s.top = (h * y) + 'px';
					s.width=w+'px';
					s.height=h+'px';
					s.overflow='hidden';
					s.zIndex=''+zorder;


					board.appendChild(t);
					tile.div=t;
								
					//make image:
					var img = document.createElement('img');
					img.src=tile_from_map.src;
					img.width=w;
					img.height=h;
					t.appendChild(img);
					tile.img=img;

					units.push(tile);
					count++;
				});						
			});
			colony.units=units;
			units.selected = selected_unit;
		}; //gm.init_colony


		gm.init_colonies = function()
		{
			tp.core.each(gm.colonies, function(ix,colony)
			{
				gm.init_colony(colony);
			});
		};


		//Tile navigation
		gm.init_navigation=function()
		{
			tp.bindEvents('keydown', function(arg)
			{
				
				var colony=gm.colonies[gm.colony_ix];
				var units=colony.units;

				if(arg.event.ctrlKey) //selecting a unit
				{
					if(!arg.event.shiftKey)
					{
						var ix=units.selected;
						switch(arg.keyName)
						{
							case 'left':	if( ix>0 ) ix=ix-1;
											break;
							case 'right':	if( ix<units.length-1 ) ix=ix+1;
											break;
							default:		return true; //skip event
						}
						units[units.selected].img.style.border='none';
						units.selected=ix;
						units[units.selected].img.style.border='2px solid blue';
						return false;
					}
					return true;
				}else{	//moving a unit
					var u=units[units.selected];
					var xnew=x=u.x;
					var ynew=y=u.y;
					switch(arg.keyName)
					{
						case 'left':	if( x>0 ) xnew=x-1;
										break;
						case 'right':	//if( x<gm.master_board.xsize-1 )
										xnew=x+1;
										break;
						case 'up'	:	if( y>0 ) ynew=y-1;
										break;
						case 'down':	if( y<gm.master_board.ysize-1 ) ynew=y+1;
										break;
						default:		return true; //skip event
					}
//console.log('tile',units);
//console.log('x,y',[x,y]);

					var msg=gm.check_collision(colony.nam,x,y,xnew,ynew,arg.keyName);
					if(msg)
					{
						console.log(msg);
					}else{
						u.x=xnew;
						u.y=ynew;
						u.div.style.top=(ynew*gm.tile.height)+'px';
						u.div.style.left=(xnew*gm.tile.width)+'px';
					}	
				return false;
				}
			});
		}; //init_navigation

		//collision rules
		gm.check_collision=function(actor,x,y,xnew,ynew,direction)
		{
			//console.log(arguments);
			var new_colonies=$.extend(true,{},gm.colonies); //NOTE: jQ converts [] to {}?
			var colony=new_colonies[gm.colony_ix];
			var units=colony.units;
			var u=units[units.selected];
			u.x=xnew;
			u.y=ynew;
			//console.log('gm.colonies',gm.colonies);
			//console.log('new_colonies',new_colonies);

			var msg='';
			tp.core.each(gm.interact[actor], function(peer_nam,val)
			{
				//console.log('peer=',peer_nam,val);
				if(val==='block')
				{
					//find blocker if any:
					var punits=gm.colonies[peer_nam].units;
					tp.core.each(punits, function(peer_unit,val)
					{
						//console.log(peer_unit,val);
						if(val.x === xnew && val.y === ynew)
						{
							msg=	'Blocking '+peer_nam+' on the way ... in pos = '+
									xnew+','+ynew+'...';
							return false;
						}
					});
					if(msg)return false;
				}
			});
			return msg;
		};

})(jQuery);
