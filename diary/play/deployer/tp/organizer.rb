
# //\\//	module TPDirParser - general type of directory traversal
#			Copyright (c) 2010 - 2012 Konstantin Kirillov
#			MIT License
#			As of December 4, 2012 is almost identical to tp.Organizer::Scanner
#			in more complex package



  #//	Simple directory tree traverser.
  #		Yields depth and found file name components to a block:
  #			absolute and relative. Full path name = "absolute/relative".
  #			depth is a deepness of a file relative to tree's root.
  #     Input:	&block - cannot modify contents of tree
  #             If modifications (like creations of files) is required use different version of TPDirParser.
  module TPDirParser

    def self.scan(absolute, relative, depth, verbose, &block)
      puts absolute + "/" + relative if depth == 0 and verbose
      indent = "  " * ( depth + 1 )
      d = relative.empty? ? absolute : absolute + "/" + relative
      dd = Dir.new(d)
      list = dd.entries
      list.each do |e|
        next if e == ".." or e == "."
        ee = d +"/" + e
        new_relative =  relative.empty?  ?  e  : relative + "/" + e
        puts indent + e if verbose
		result = {}
        if File.directory?(ee)
			isdir = true
			yield(absolute, new_relative, e, isdir, result, depth)
            scan(absolute, new_relative, depth+1, verbose, &block) if !result['dostop']
        else
			isdir = false
			#TODO correct? are block and yield "the same?"
        	yield(absolute, new_relative, e, isdir, result, depth) if block
        end
      end  
    end

=begin
	#??? block arg should not be given ....
    def self.scan_once(absolute, relative, depth, verbose, &block)
      puts absolute + "/" + relative if depth == 0 and verbose
      indent = "  " * ( depth + 1 )
      d = relative.empty? ? absolute : absolute + "/" + relative
      dd = Dir.new(d)
      list = dd.entries
      list.each do |e|
        next if e == ".." or e == "."
        ee = d +"/" + e
        new_relative =  relative.empty?  ?  e  : relative + "/" + e
        puts indent + e if verbose
		#??? block arg should not be given ....
		yield(absolute, new_relative, e, File.directory?(ee), depth, &block)
      end  
    end
=end

  end #module TPDirParser

