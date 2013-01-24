#!/bin/bash

######################################################
#
echo "Deploys BETA version from ALPHA in remote host"
#
######################################################


#HOST="konstantin@127.0.0.1"
#HOST="konstantin@192.168.1.101"
#HOST="landkey@landkey.net"
#FOLDER="/var/www/html/gio/gio"

HOST="landkeyo@landkey.org"
FOLDER="/home1/landkeyo/public_html/whirlio"
FOLDER="/home1/landkeyo/public_html/landkey_net/gio/gio"

#in respect to FOLDER:
ALPHA="a1"
BETA="diary/a1"



ssh $HOST <<END_OF_MY_COMMANDS
echo ">>=>> Remote job started."
cd $FOLDER
if [ -d "$ALPHA"  ]; then 
	if [ -d "$FOLDER/$BETA"  ]; then
		rm -rf "$FOLDER/$BETA.bak"
		mv -f "$FOLDER/$BETA" "$FOLDER/$BETA.bak"
		echo "  did: backed if any : $FOLDER/$BETA to $FOLDER/$BETA.bak"
	fi
	echo 	"  did: moved $ALPHA to $BETA"
	mv -f $ALPHA $BETA
fi
echo "<<=<< Remote job finished"
END_OF_MY_COMMANDS

