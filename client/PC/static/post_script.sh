export username=`who | cut -d' ' -f1 | uniq | head -1`
cp /usr/share/applications/IM.desktop /home/$username/桌面
chmod 777 /home/$username/桌面/IM.desktop
cp /usr/share/applications/IM.desktop /root/桌面
chmod 777 /root/桌面/IM.desktop

mkdir /home/$username/桌面/即时通文件
chmod 777 /home/$username/桌面/即时通文件
chmod -R 777 /usr/lib/IM
