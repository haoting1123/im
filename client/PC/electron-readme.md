**Electron NeoKylin Loongson Linux（2019-01-31）**

**前言**  
因为loongson CPU对应的内核架构是mips64el，但是Electron从1.8.8版本不再提供对mips64el架构官方预编译环境的支持，查询官网后发现可以根据源码在对应的平台进行编译打包，需要下载chromium、v8和nodejs的源码进行编译，发现electron的高版本依赖的nodejs的版本的都是比较新的，在中标麒麟Linux系统上总是编译失败，然后查询Electron1.8.8版本是2018年8月份更新版本，针对目前的需求基本都能满足，所以先采用1.8.8版本来进行开发，等日后中标麒麟和龙芯CPU跟上Electron更新的步伐后再升级更高的版本。

**环境搭建**  
NodeJs版本：建议8.15或者更高，低于此版本在打包时会出现有些依赖不支持的情况导致打包失败，可以从Node官网下载最新的8.x版本源码编译即可  
编译命令：  
sudo ./configura  （生成要步骤文件）  
sudo make -j 8    （编译源码，-j代表采用8个线程去同步编译，以CPU的核心数目的两倍为宜）  
sudo make install （安装到系统目录，可以在任何地方调用）  
node -v           （查看node版本）  
npm -v            （查看npm版本）  

在项目npm install之前需要先把Electron官方提供的chromedriver放到指定目录，因为npm install的时候找不到这个，需要先提前手动放置  
目录：~/node_modules/chromedriver/bin/  
不存在则手动创建
然后执行npm install即可  
Windows忽略以上步骤，直接npm install

**运行**  
因为linux和windows环境的差异性，所以要进行些修改才能运行  
~/src/main/index.js中  
第16行  
let os = 'window'  
这里修改为linux即可  
主要是用来把一些linux不支持的特性给屏蔽和图标换成png格式的，windows为ico格式的
<div style="color:red;">注意事项：</div>
静态资源都放在static目录中，否则打包后路径会变化导致找不到静态资源文件

然后npm run dev就可以运行了

**打包**  
windows打包直接通过electron-packger生成可执行文件后，通过打包工具打成一个安装包。
linux采用electron-packger生成可执行文件后，通过electron-installer-redhat插件来生成linux可视化界面的运行程序的rpm安装包  
具体步骤：  
* 安装 electron-installer-redhat，如果安装过，忽略此步骤，命令：npm install --save-dev electron-installer-redhat
* 运行npm run package:linux
* 运行npm run installer:linux 
* 时间会比较长，大概15分钟左右，在~/dist目录里可以找到打好的安装包  

<div style="color:red;">注意事项：</div>

* 每次打包都需要修改package.json和config.json里的版本号，最好保持一致，否则系统检测到版本号没变化，将不会进行安装操作
