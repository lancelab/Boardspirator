//jQuery subplugin for form
(function( $ ){var tp  =  $.fn.tp$;	

	//Name:				$.fn.tp$.form
	//Date:				December 03, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 



	var self_name='gui';
	if(!tp)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');


	//Attach subplugin to jQuery:
	$.fn.tp$[self_name]=(function(){
		var self={};
		var core=tp.core;

		self.create_triangle=function(arg_){
			var arg={
				direction: 'down',
				style		:{
					width			: 20,
					height			: 20,
					//top			: 0,//legal
					//left			: 0,//legal
					backgroundColor	:'#AAAAAA'
				},
				parent		:document.body
			};
			tp.core.tpaste(arg,arg_);

			var slf={};


			var nstyle=normalize_style(arg.style);
			if(!nstyle.top && !nstyle.bottom)arg.style.top=0;
			if(!nstyle.left && !nstyle.right)arg.style.left=0;
			nstyle=normalize_style(arg.style);

			var borderBg=arg.style.backgroundColor;

			var triangle=document.createElement('div');
			triangle.style.position='absolute';

			nstyle.width='1px';
			nstyle.height='1px';
			nstyle.backgroundColor='transparent';

			var halfw=Math.ceil(arg.style.width/2);
			var halfh=Math.ceil(arg.style.height/2);


			if(arg.direction==='down' || arg.direction==='up'){
				nstyle.borderLeft=halfw+'px solid transparent';
				nstyle.borderRight=halfw+'px solid transparent';
				if(arg.direction==='down'){
					if(nstyle.bottom)nstyle.bottom=(arg.style.bottom-1)+'px';
					nstyle.borderTop=arg.style.height+'px solid '+borderBg;
					nstyle.borderBottm='none';
				}else{
					if(nstyle.top)nstyle.top=(arg.style.top-1)+'px';
					nstyle.borderBottom=arg.style.height+'px solid '+borderBg;
					nstyle.borderTop='none';
				}
			}else{
				nstyle.borderTop=halfh+'px solid transparent';
				nstyle.borderBottom=halfh+'px solid transparent';
				if(arg.direction==='left'){
					if(nstyle.left)nstyle.left=(arg.style.left-1)+'px';
					nstyle.borderRight=arg.style.width+'px solid '+borderBg;
					nstyle.borderLeft='none';
				}else{
					if(nstyle.right)nstyle.right=(arg.style.right-1)+'px';
					nstyle.borderLeft=arg.style.width+'px solid '+borderBg;
					nstyle.borderRight='none';
				}
			}
			tp.core.rpaste(triangle.style,nstyle);
			arg.parent.appendChild(triangle);
			return {div:triangle, arg:arg};
		};//self.make_triangle


		//Add 'px' to dimensional properties of a style
		var normalize_style=function(style){
			var nstyle={};
			tp.core.each(style,function(k,v){
				switch(k){
					case 'width':
					case 'height':
					case 'top':
					case 'left':
					case 'bottom':
					case 'right': v=v+'px';
				}
				nstyle[k]=v;
			});
			return nstyle;
		};



		/////////////// cornerize //////////////////////////////////
		// Set corners to element.
		// Works only once, cannot modify corners already set.
		// credit: http://www.the-art-of-web.com/css/border-radius/
		////////////////////////////////////////////////////////////
		self.cornerize=function(arg,el){
			var style=el.style;
			if(!style)return false;
			var cssText=style.cssText;
			if(!cssText)return false;

			var addition='';
			tp.core.each(arg,function(k,val){
				var v=val+'px; ';
				switch(k){
					case 'tl': addition +=' border-top-left-radius:'			
									+v+' -moz-border-radius-topleft:'		
									+v+' -webkit-border-top-left-radius:'+v;
						break;
					case 'br': addition +=' border-bottom-right-radius:'
									+v+' -moz-border-radius-bottomright:'
									+v+' -webkit-border-bottom-right-radius:'+v;
						break;
					case 'bl': addition +=' border-bottom-left-radius:'
									+v+' -moz-border-radius-bottomleft:'
									+v+' -webkit-border-bottom-left-radius:'+v;
						break;
					case 'tr': addition +=' border-top-right-radius:'
									+v+' -moz-border-radius-topright:'
									+v+' -webkit-border-top-right-radius:'+v;
						break;
					case 'r': addition +=' border-radius:'
									+v+' -moz-border-radius:'
									+v+' -webkit-border-radius:'+v;
				}
			});		
			//c onsole.log(addition);
			if(addition)style.cssText=cssText+addition;
		};


		/////////////// gradientize //////////////////////////////////
		// Set gradients to element.
		// Works only once, cannot modify gradients already set.
		////////////////////////////////////////////////////////////
		//Input		example: direction={start:['left','bottom'], theend : ['right','bottom']}
		self.gradientizeOnce=function(lightColor, range, lightSide, el){
			var style=el.style;
			if(!style)return false;
			var cssText=style.cssText;
			if(typeof cssText!=='string')return false;

			var darkColor=self.scaleColor(range,lightColor);

			var webkit='';
			var mozilla=lightSide;
			var ie='';
			switch(lightSide){
				case 'left':	webkit='left top, right top';
								break;
				case 'right':	webkit='right top, left top';
								break;
				case 'top'	:	webkit='left top, left bottom';
								ie=lightColor+"', endColorstr='"+darkColor;
								break;
				case 'bottom':	webkit='left bottom, left top';
								ie=darkColor+"', endColorstr='"+lightColor;
								break;
			}
		
			ie=" filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='"+ie+"'); "
			webkit=" background: -webkit-gradient(linear, "+webkit+", from("+lightColor+"), to("+darkColor+")); "
			mozilla=" background: -moz-linear-gradient("+mozilla+",  "+lightColor+", "+darkColor+"); "
			var add=ie + webkit + mozilla;

			//c onsole.log('added ='+add);
			style.cssText=cssText+add;
		};



		////////////////////////////////////////////////////
		//Action		multiplies color
		//Input			color in #XXXXXX notation,
		//				scale - float number
		//Return		scale*color in #XXXXXX
		////////////////////////////////////////////////////
		self.scaleColor=function(scale, color){
			var red = parseInt( color.substr(1,2), 16 );
			var green = parseInt( color.substr(3,2), 16 );
			var blue = parseInt( color.substr(5,2), 16 );
			var newRed = core.num2hexstr( Math.min( scale * red, 255) );
			var newGreen = core.num2hexstr(  Math.min( scale * green, 255) );
			var newBlue = core.num2hexstr( Math.min( scale * blue, 255) );
			if( newRed.length < 2 ) newRed = "0" + newRed;
			if( newGreen.length < 2 ) newGreen = "0" + newGreen;
			if( newBlue.length < 2 ) newBlue = "0" + newBlue;
			return color = "#"+newRed + newGreen + newBlue;  
		};

		return self; //tp return
	})(); //$.fn.tp$[self_name] end
})( jQuery );


