

class SourceFilesScanner

	# =================================
	# passive scanner
	# scans once when called
	# gets token from given position 
	# ---------------------------------
	def scan_once(string, *args,&b)
		#default parameters:
		start	= args[0] || 0
		seps	= args[1] || [/\s+/]

		pos				= string.size
		chosen_index	=nil;

		chosen_match = nil
		seps.each_with_index do |s,i|
			pos2=string.index(s,start)
			if pos2 and pos2 < pos
				pos = pos2
				chosen_index=i
				chosen_match = $~
			end
		end
		s=chosen_index ? seps[chosen_index] : '' 
		if s.kind_of?(Regexp)
			s=chosen_match[0]
		end
		p=pos+s.size
		t=string.slice(start,pos-start)

		# good debug: {:seps => seps, :p => p,:t => t,:s=>s}.dig
		yield p,t,s,chosen_index,chosen_match if b

		return {:p=>p, :t=>t, :s=>s, :i => chosen_index, :m => chosen_match}
	end
	# ---------------------------------
	# passive scanner:
	# scans once when called:
	# =================================




	# =======================================================
	# active scanner
	# continuously scans until position is in string limits
	# =======================================================
	def scan_infinitely(string, *args , &b)
		p = args[0] || 0
		while p<string.size
			p=self.scan_once(string, p, args[1], &b)[:p]
		end
	end


end

=begin #parsers' demo
	p "separated  by \n\t reg exp".follow

	"granulated by \n\t reg exp".lead(0,[" ","\n","\t","\r"])do |p,t,s|
		puts "#{p} #{t} \"#{s}\""
	end

	"scanned    by \n\t reg exp".lead(0,[/\s+/]) do |p,t,s|
		puts "#{p} #{t} \"#{s}\""
	end
=end

