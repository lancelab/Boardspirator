if !'x'.respond_to?('escapify') #to avoid double compilation
#see dependencies which are put after class definition

class String

	#Convert \->\\, \n->\\n, \r ... " to help multiline-quoted string
	#to exist inside one line:
	def escapify
		self.gsub('\\','\\\\').gsub("\n",'\\n').gsub("\r",'\\r').gsub('"','\"')
		#test: p "line feed=\n qm=\""
	end

	#passive scanner: scans once when called:
	#get token from given position 
	def follow(*x,&b)
		#default parameters:
		start	= x[0] || 0
		seps	= x[1] || [/\s+/]

		pos				= self.size
		chosen_index	=nil;

		seps.each_with_index do |s,i|
			pos2=self.index(s,start)
			if pos2 and pos2 < pos
				pos = pos2
				chosen_index=i
			end
		end
		s=chosen_index ? seps[chosen_index] : '' 
		if s.kind_of?(Regexp)
			s=$~[0]
		end
		p=pos+s.size
		t=self.slice(start,pos-start)

		#good debug: {:seps => seps, :p => p,:t => t,:s=>s}.dig
		yield p,t,s if b

		#if chosen_index
		return {:p=>p,:t=>t,:s=>s}
	end


	w='lead'
	if	self.public_method_defined?(w) or
		self.protected_method_defined?(w) 
		raise "Method #{self}##{w} is already defined "
	end

	#active scanner: continuously scans until position is in string limits:
	def lead(*x,&b)
		p = x[0] || 0
		while p<self.size
			p=self.follow(p,x[1],&b)[:p]
		end
	end

	#Input			$smart=0 - simple style, 1 - complex, 2 - default.
	#Description	follow demos
	def decamelize(smart=2)
		if smart==2 
			#TODm do it in one RegEx or with block
			return self.gsub(   /(([A-Z]*)([A-Z]+[^A-Z]*))|([^A-Z]*)/,'_\2_\3_\4_'   ).gsub(/_+/,'_').gsub(/^_|_$/,'').downcase
		elsif smart ==1
			return self.gsub(	/((^[A-Z]+[^A-Z]+)|(^[^A-Z]+)|([^A-Z]))([A-Z]+)/,		'\1_\5').downcase
		else
			return self.gsub(	/((^.[^A-Z]*)|([^A-Z]*))([A-Z])/,						'\1_\4').downcase
		end
	end

	def camelize
		#research: return self.gsub /((^|_)_*)([^_])/, '=====0\0.1\1.2\2.3\3.4\4====='.upcase
		return self.gsub(/((^|_)_*)([^_])/){|s| $3.upcase}
	end

	#Web aware function: escapes 3 dangerous html chars: <,>,&
	# it seems worth to make this simple function ourself than always depend
	# on-hard-to-find ruby docs and on-line-help
	# TODm protect from name conflict with other libraries
	# TODm speed up by using $1, $2, ...
	def dohtmlesc( issafe=false )
		if !issafe
			return	(	self.gsub!(/<|>|&/) do |m|
							case m
							when '<'
								'&lt;'
							when '>'
								'&gt;'
							else 
								'&amp;'
							end
						end
					)
		else
			return self
		end
	end

=begin

	#possibly unsafely iterates through directory tree
	#"unsafely" means if submitted block deletes directory entry, this can case a confilict
	#safe operations are: not-deleting or adding files or directories, ....
	def fsub(glob_pattern, &b)
		Dir.glob(glob_pattern


	end
=end


end

require File.expand_path('../dig.rb',__FILE__)

=begin #parsers' demo
	p "separated  by \n\t reg exp".follow

	"granulated by \n\t reg exp".lead(0,[" ","\n","\t","\r"])do |p,t,s|
		puts "#{p} #{t} \"#{s}\""
	end

	"scanned    by \n\t reg exp".lead(0,[/\s+/]) do |p,t,s|
		puts "#{p} #{t} \"#{s}\""
	end
=end
=begin #decamelize demo:
	'HTMLSupportHTMLSupport'.decamelize(1).dig 'HTMLSupportHTMLSupport smart=1'
	'HTMLSupportHTMLSupport'.decamelize(2).dig 'HTMLSupportHTMLSupport smart=2'
	'123SupportHTMLSupport'.decamelize(1).dig '123SupportHTMLSupport smart=1'
	'123SupportHTMLSupport'.decamelize(2).dig '123SupportHTMLSupport smart=2'
	'useGood123Support'.decamelize(1).dig 'useGood123Support smart=1'
	'useGood123Support'.decamelize(2).dig 'useGood123Support smart=2'

	puts "\ninvalid camel-case => invalid conversion:"
	'HTMLSupportHTMLsupport'.decamelize(1).dig 'HTMLSupportHTMLsupport smart=1'
	'HTMLSupportHTMLsupport'.decamelize(2).dig 'HTMLSupportHTMLsupport smart=2'

	puts "\nplain conversion:"
	'HTMLSupportHTMLSupport'.decamelize(0).dig 'HTMLSupportHTMLSupport smart=0'
	'123SupportHTMLSupport'.decamelize(0).dig '123SupportHTMLSupport smart=0'
	'useGood123Support'.decamelize(0).dig 'useGood123Support smart=0'
=end
=begin #camelize demo:
	'works_well'.camelize.dig 'works_well'
	'_hard_cAse'.camelize.dig '_hard_cAse'
=end


end #if !'x'.respond_to?('escapify')
