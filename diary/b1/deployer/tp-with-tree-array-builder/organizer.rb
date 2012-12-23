
# //\\//	module TPDirParser - general type of directory traversal
#			Copyright (c) 2010 - 2012 Konstantin Kirillov
#			MIT License
#			As of December 4, 2012 is almost identical to tp.Organizer::Scanner
#			in more complex package



  #//	Simple directory tree traverser.
  #		Yields depth and found file name components to a block:
  #			absolute and relative. Full path name = "absolute/relative".
  #			depth is a deepness of a file relative to tree's root.
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
        if File.directory?(ee)
          scan(absolute, new_relative, depth+1, verbose, &block)
        else
			#TODO correct? are block and yield "the same?"
          yield(absolute, new_relative, depth) if block
        end
      end  
    end



    #//		Creates and returns tree based on directory recursive traversal results.
    #		Tree format:	[ level0, level1, .... ] where
    #   		           	levelX = [ node, node, ... ] - nodes with equal deepness, where
    #   		           	node = [ parent, name, first_child ], where
    #   		           	parent and first_child - indices in level.
    def self.scan_as_top_tree(absolute, relative, verbose)
      @tree = [ [[-1,"null",-1]]  ]
      scan_as_tree(absolute, relative, 1, verbose) do |abs, rel, depth|
      end
      #remove_zero_node_and_fix_references(node)
      fixed_tree = []
      for i in 1..@tree.length-1
        fixed_tree << @tree[i]
      end
      wlevel = fixed_tree[0]
      wlevel.each do |v|
        v[0]=-1  
      end
      return [ fixed_tree, pa(fixed_tree,0, "", 0) ] 
    end 


    #//	Core program for "self.scan_as_top_tree"
    #	Does necessary recursion.
    def self.scan_as_tree(absolute, relative, depth, verbose, &block)
      puts absolute + "/" + relative if depth == 0 and verbose
      indent = "  " * ( depth + 1 )
      d = relative.empty? ? absolute : absolute + "/" + relative
      #puts "dir=" + d
      dd = Dir.new(d)
      #puts "new dd=" + dd.to_s
      list = dd.entries
      #puts "list=" + list.to_s
      list.each do |e|
        next if e == ".." or e == "."
        ee = d +"/" + e
        new_relative =  relative.empty?  ?  e  : relative + "/" + e
        puts indent + e if verbose

        node = [ -1, e, -1 ]
        @tree[depth] ||= []
        @tree[depth] << node
        prelevel = @tree[depth-1]
        parent = prelevel[ prelevel.length - 1 ]
        node[0] = prelevel.length - 1
        parent[2] = ( @tree[depth].length - 1 ) if parent[2] < 0

        if File.directory?(ee)
          scan_as_tree(absolute, new_relative, depth+1, verbose, &block)
        else
          yield(absolute, new_relative, depth)
        end
      end  
    end



    #//	Double Sugar:
    #	Nice printing of nested arrays:
    def self.pa(arr,depth,result, put_in_one_line_depth)
       indent = "   " * depth
       new_line = (( put_in_one_line_depth >= depth ) ? "\n"+indent : "" )
       if arr.length == 0
         result += "[]"+new_line
       else
         result += " [ "
         for i in 0..arr.length - 1
           #result += indent if i != 0
           if arr[i].kind_of?(Array)
             result = pa(arr[i],depth+1,result,put_in_one_line_depth)
           else
             result += arr[i].inspect
           end
           result += (","+new_line) if i < arr.length - 1
         end
         result += " ]"
       end
       return result
    end

  end #module TPDirParser

