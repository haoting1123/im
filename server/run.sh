#!/bin/sh

###  ------------------------------- ###
###  leo-im-server launcher script   ###
###  ------------------------------- ###

cd `dirname $0`
# cd ../
if [ -z "$JAVA_OPS" ]; then
  JAVA_OPS="-Dfile.encoding=utf-8 -Dio.netty.noUnsafe=true -Xms1024M -Xmx1024M -Xss256K"
fi
# java $JAVA_OPTS -cp ./lib org.springframework.boot.loader.PropertiesLauncher -DprocessName=syntoim.mc  >logs/immc.log   2>&1 &
java $JAVA_OPTS -jar target/imservice-0.0.1-SNAPSHOT.jar >logs/immc.log   2>&1 &
