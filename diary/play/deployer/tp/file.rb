#?/usr/bin/ruby
#replace ? with ! and set permissions to executable to run this file standalone as ./file-name

require 'json'


class FileLib < File

	#no real need. just for fun:
	class Exception < ::Exception
	end

=begin
	#This seems like better alternative:
	#Module: Thor::Actions
	#Included in:
    #DaemonKit::Generators::Base, DaemonKit::Generators::CucumberGenerator
	# File railties/lib/rails_generator/commands.rb, line 92
          def gsub_file(relative_destination, regexp, *args, &block)
            path = destination_path(relative_destination)
            content = File.read(path).gsub(regexp, *args, &block)
            File.open(path, 'wb') { |file| file.write(content) }
          end
=end

	#TODm pattern, not puttern
	def self.gsub!(file_name,puttern,replacement)
		begin
			x=File.open(file_name,'r+') do |f|
				input=f.read.gsub(puttern,replacement)
				f.rewind
				f.write(input)
				#puts 'Substituted in file '+file_name
				#NO need for close statement
			end
		rescue ::Exception => e
			raise Exception, "Substitution #{puttern} problems in file #{file_name}. #{e}"
		end
	end

	def self.save(file_name, text)
	    File.open( file_name, 'w' ){ |f| f.write(text) }
		#puts 'Saved to file '+file_name
	end


	# Returns:	object generated from json text from given file.
	#			if silently and failed, returns {} silently
	def self.json2object(file_name, silently='silently')
		obj = {};
		begin
		    File.open( file_name, 'r' ){ |f| t=f.read; obj=::JSON.parse(t); }
		rescue ::Exception => e
			if silently != 'silently'
				raise Exception, "Cannot do json2object from file #{file_name}. #{e}"
			end
		end
		return obj
	end		

end #class FileLib

=begin
#test:
begin
	FileLib.gsub!('test.txt', 'o', 'O')
	p "Contents="+File.read('test.txt')
rescue FileAux::Exception => e
    puts "Test: #{e}"
end
=end





	
