#dig			and other extensions to Object
#Purpose		debug recursive objects nicely
#Dependencies	added automatically only once. See "require" below
#License		Ruby license. Copyright (C) 2012 Konstantin Kirillov
#Test cases		uncomment below	


# Version 0.0.5 Jun. 19. 2012

# Diary
#	Version 0.0.4	shows own methods
#	Version 0.0.3	returns self
#	Version 0.0.2	option to convert escapified string into multiline string


#TODm add option to output into variable instead of puts 


if !Object.new.respond_to?('dig') #to avoid double compilation

class Object


  #==========================
  # Wrappers for digg
  #--------------------------
  #Input: see digg:
  #	a[0] -	title or indent,
  # a[1] -	max level to dig out object tree,
  # a[2] -	limit of traveled objects. To prune infinite loop.
  # a[3] -	control object's methods to show them or run
  #			.....
  def dig(*a)
	digg self, a[0],0, a[1], a[2], false, (a[3] || false)
    return self
  end

  #Multiline: strings do not converted to one line
  def digl(*a)
	digg self, a[0],0, a[1], a[2], true, (a[3] || false)
    return self
  end

  # Show methods
  # Method digging depth is 1 by default: s1
  def digm(*a)
	digg self, a[0],0, a[1], a[2], false, 's1'
    return self
  end

  # Run methods
  # Method digging depth is 1 by default: r1
  def digr(*a)
	digg self, a[0],0, a[1], a[2], false, 'r1'
    return self
  end

  #Candidate for default digger:
  #If &b is submitted, processes array of tokens,
  # to be evaluated element by element:
  def dige(*a,&b)
	if b
		e={}
		self.map do |v|
			e[v]=b.call(v.to_s)	
		end
		digg e,		a[0],0, a[1], a[2], true
	else
		digg self,	a[0],0, a[1], a[2], true
	end
    return self
  end
  #--------------------------
  # Wrappers for digg
  #==========================




  #==========================
  # Core method
  #--------------------------
  #Input: multiline - 	don't escape \n and display each line on separate output line
  #						with proper indent
  def digg(ob, *a, multiline, show_methods)
	#meaning of input variables:
	indent				=a[0] || ''
	level				=a[1] || 0
	max_level			=a[2] || 2000000000
	objects_traveled	=a[3] || {} 	#protects from infinite recursion
	if level==0
		#get title and emptify indent
		title			= indent != '' ? indent + '=' : ''
		indent			= ' '*title.size
		print title
	end

	#more print-sugar: dotted vertical lines for wide printout:
	indentp = (indent and indent != '')    ?    indent.slice(0,indent.size-1)+'|'    :     ''

	#TODm why this result is different when ob is passed to digg as circular?:
	ob_to_s		=ob.to_s

	ob_id_to_s	=' obj-id='+ob.__id__.to_s # + '=' + ob.__id__.to_s(16)
	ob_instance_variables_empty = !ob.respond_to?('instance_variables') || ob.instance_variables.empty?
	ob_own_public_methods_empty = !ob.respond_to?('public_methods') || ob.public_methods(false).empty?

	#look inside of the list of traveled objects, objects_traveled ... 
	if objects_traveled.has_key?(ob.__id__)
		puts 'c i r c u l a r:'+ ob_id_to_s + ' ' + ob_to_s.strip.slice(0,50) + '...'   #ob.inspect.slice(0,50)+'...'
		return
	end

	if level > max_level
		puts 'd i g g e d   to '+ max_level.to_s
		#print indentp
		return
	end			

	count = 0
	isshown = false

	if nil.===(ob) 	#note: fails: if ob == nil for @digest in ROR
		puts 'nil'
		isshown = true
	elsif ob.kind_of?(Array) and !ob.empty?
			objects_traveled[ob.__id__]=true
			ob.each_with_index do |v,i|
				marker='['+i.to_s+'] ' #][ are vital. don't "loose" clarity
				ind=indentp + ' '*marker.size
				print indentp if count > 0			
				print marker
				digg(v, ind, level+1, max_level, objects_traveled, multiline, show_methods)
				count+=1
			end
			isshown = true
	elsif ob.kind_of?(Hash) and !ob.empty?
		objects_traveled[ob.__id__]=true
		ob.each do |i,v|
			marker=i.to_s+' => '
			marker=':'+marker if i.kind_of?(Symbol)
			ind=indentp + ' '*marker.size
			print indentp if count > 0
			print marker
			digg(v, ind, level+1, max_level, objects_traveled,multiline,show_methods)
			count+=1
		end
		isshown = true
	elsif ob.kind_of?(Symbol)
		ob_to_s=':'+ob_to_s.escapify
		puts ob_to_s
		count+=1
		isshown = true
	elsif ob.kind_of?(String)
		if multiline
			ob_to_s=('"'+ob_to_s+'"').gsub("\n", "\n"+indent+'|')
		else
			ob_to_s='"'+ob_to_s.escapify + '"'
		end
		puts ob_to_s
		count+=1
		isshown = true
	end

	if !ob_instance_variables_empty
		objects_traveled[ob.__id__]=true

		#puts 'here instance. level='+level.to_s

		print ob_to_s	if !isshown #count == 0 and
		print indent	if isshown #if count > 0
		#print ob_id_to_s +"\n"
		print "\n"

		vars = ob.instance_variables

		indent_ob=indent+'   ' #more practical than ' '*ob_to_s.size
		isshown = true
		for i in 0..(vars.length() - 1)
			marker = i.to_s + ' ' + vars[i].to_s + " = " 
			ind=indent_ob + ' '
			print ind+marker
			v = ob.instance_variable_get(vars[i])
			digg(v,  ind+' '*marker.size, level+1, max_level, objects_traveled, multiline, show_methods)
			count+=1
		end
	end

	# We usually don't need basic objects' methods
	if	show_methods and !ob.kind_of?(Symbol) and !ob.kind_of?(String) and
		!ob.kind_of?(Hash) and !ob.kind_of?(Array) and !ob.kind_of?(TrueClass)

		show_methods_control = show_methods[0]
		methods_deepness = show_methods.slice(1, show_methods.size-1).to_i
		methods_deepness = 1000000 if methods_deepness == 0 

		if	!ob_own_public_methods_empty and level < methods_deepness

			objects_traveled[ob.__id__]=true
			#puts 'here instance. level='+level.to_s

			print ob_to_s	if !isshown #count == 0 and
			print indent	if isshown #if count > 0
			#print indent	if count > 0
			#print ob_id_to_s +"\n"
			print "\n"

			meths = ob.public_methods(false)

			indent_ob=indent+'   ' #more practical than ' '*ob_to_s.size
			isshown = true
			for i in 0..(meths.length() - 1)
				marker = i.to_s + ' #' + meths[i].to_s 
				ind=indent_ob + ' '
				v = show_methods_control == 'r' ? '() = "' + ob.send(meths[i]).to_s + '"' : '';
				#v += ' Test: level/lim='+level.to_s + '/' + methods_deepness.to_s
				print ind+marker + v + "\n"
				count+=1
			end
		end
	end # show_methods

	if !isshown
		if ob_to_s.strip == ''
			puts ('>'+ob.inspect+'<')
		elsif ob.kind_of?(TrueClass)
			puts (ob ? 'true' : 'false')
		else
			puts ')'+ob_to_s +'('
		end
		count+=1
		isshown = true
	end


	#Must be redundant:
	#to ease garbage collection ... TODO? can it do this?
	objects_traveled=nil if level==0 
	
	return ob if level==0
  end #digg
  #--------------------------
  # Core method
  #==========================



end #Object

# Dependency adder:
require File.expand_path('../string.rb',__FILE__)



#=begin # Testings

	# One-line-polluter-self-test
	{:digger => :included}.dig('selftest')

	#"line1\nline2\n\line3\n".digm('multiline test string')
	#"line1\nline2\n\line3\n".dig('single line test string')

=begin #test
	class T
		def initialize
			@t=['element one. test instance variable','element two','element three']
			@t2={'element one' => 1, 'element two' => 2}
		end
	end

	digg([{:a=>'aa', :b=>'bb'},{:a=>'aa', :b=>'bb', :c=>['x','y']}])

	#complex cases:
	t=T.new
	tt=['x','y',t]
	tt << tt
	tt.dig('circular dependence')
=end
=begin #do test dige
	x='xx'
	y={ :a => 'aa', :b => Object}
	local_variables.dige('locals',2) {|v| eval(v)}
=end

end #if !Object.new.respond_to?('dig')
