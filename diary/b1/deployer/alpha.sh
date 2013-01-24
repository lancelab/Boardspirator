#!/bin/bash

#  //\\// Deploys alpha version to folder $ALPHA in remote host



#HOST="naladchik@127.0.0.1"
#HOST="konstantin@127.0.0.1"
#HOST="konstantin@192.168.1.101"
#HOST="landkey@landkey.net"
#FOLDER="/var/www/html/gio/gio/"

HOST="landkeyo@landkey.org"
FOLDER="/home1/landkeyo/public_html/whirlio"
FOLDER="/home1/landkeyo/public_html/landkey_net/gio/gio"

ALPHA="a1"

#. deployes only these units
DEPLOYED_UNITS="def doc prod tp core tp google_apps"

#stubs:
#echo "$HOST:$FOLDER"
#echo ${HOST}:${FOLDER}

# * use this if running from occasional place
#cd /var/www/METAP/apps/BOARD/board/public/play/deployer/

ruby collections2mozaic.rb
ruby credits2html.rb
ruby project_files_tree2html.rb


rm -rf ../$ALPHA
mkdir ../$ALPHA
mkdir ../$ALPHA/prod
ruby minifier.rb
#ruby minifier.rb $ALPHA


cd .. 
cp -rf $DEPLOYED_UNITS $ALPHA
cp -f index_prod.htm $ALPHA/index.htm

# * adds feeder feature which is not required for minimum functional site
if [ -d "feeder"  ]; then	cp -rf feeder $ALPHA; fi

rm -f $ALPHA.zip
zip -r $ALPHA $ALPHA
rm -rf $ALPHA

# * exit here if you don't have a remote server to deploy
# exit

scp $ALPHA.zip ${HOST}:${FOLDER}
ssh $HOST <<END_OF_MY_COMMANDS
cd "$FOLDER"
rm -rf w
mkdir w
mv -f $ALPHA.zip w
cd w
unzip $ALPHA.zip
cd ..
rm -rf $ALPHA.bak
#fails on landkey: if [ -d "../$ALPHA"  ]; then mv -f "../$ALPHA" "../$ALPHA.bak"; fi
if [ -d "$ALPHA"  ]; then
   mv -f $ALPHA $ALPHA.bak
fi
mv -f  w/$ALPHA .
END_OF_MY_COMMANDS

rm -f $ALPHA.zip # clean up


#help:
#generic bash: http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html#toc6
#http://stackoverflow.com/questions/4412238/whats-the-cleanest-way-to-ssh-and-run-multiple-commands-in-bash
#http://tldp.org/LDP/abs/html/here-docs.html

#http://www.linuxquestions.org/questions/linux-newbie-8/passing-commands-through-an-ssh-shell-in-a-bash-script-817072/
#cat commands.txt | while read y; do echo $( ssh user@host.host "sudo $y" & )  ; done
#ssh user@host.host < commands.txt
#bash in one line: http://stackoverflow.com/questions/1289026/syntax-for-a-single-line-bash-infinite-while-loop
#bash in one line: http://ubuntuforums.org/showthread.php?t=1375725

#zombie process: http://www.cyberciti.biz/tips/killing-zombie-process.html

