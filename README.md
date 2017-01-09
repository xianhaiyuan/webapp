#A Webapp Template
###1. 环境
- nodejs

###2. 运行
####2.1克隆项目

	git clone https://github.com/xianhaiyuan/webapp.git

####2.2安装依赖

	npm install gulp
	npm install
	
####2.3启动项目

 开发pc端项目

	gulp dev

生成最终项目（根目录运行）

	./build
	
开发移动端项目

	将gulpfile.js末尾代码：
	server('pc', pcdev_server, pcsrc);
	改为：
	server('m', mdev_server, msrc);
	
	运行：
	gulp dev
	
生成最终项目（根目录运行）

	将gulpfile.js末尾代码：
	build('pc');
	改为：
	build('m');
	
	运行：
	./build
	
###3. 目录

desktop和mobile的目录结构一样，以desktop为例

	.
	├── src
	│   └── desktop
	│       ├── css
	│       │   └── fonts
	│       │       ├── font
	│       │       └── iconfont
	│       ├── img
	│       │   └── icon
	│       ├── js
	│       │   └── common
	│       ├── sass
	│       │   └── common
	│       └── view
	│       ├── index.html
	├── dist
	│   └── desktop
	│       ├── css
	│       │   ├── common
	│       │   └── fonts
	│       │       ├── font
	│       │       └── iconfont
	│       ├── img
	│       │   └── icon
	│       ├── js
	│       │   └── common
	│       └── view
	│       ├── index.html
	├── tmp
	│   └── desktop
	│       ├── css
	│       │   ├── common
	│       │   └── fonts
	│       │       ├── font
	│       │       └── iconfont
	│       ├── img
	│       │   └── icon
	│       ├── js
	│       │   └── common
	│       └── view
	│       ├── index.html
	├── build.sh
	├── gulpfile.js
	├── package.json
	├── README.md


####注意：

- view目录放html文件
- src/css下不放css文件，只放font和iconfont（用sass做预处理器）
- img/icon目录放的小图标将会被合成雪碧图
- common存放公共的scss或js文件（引入的框架、自己写的公共模块等）
- 运行guip-dev后，将在tmp目录下生成临时项目，并启动服务器（127.0.0.1:3000）
- 运行./build后，将tmp下的项目生成到dist目录，并且删除tmp目录
- package.json自己做修改
- 开发项目时根据以上目录树自己新建webapp/src，tmp和dist不用新建

css和js引入格式

a和b为公共模块（在最终项目中将会压缩合成一个common.min.css或common.min.js文件
c和私有模块（在最终项目中会压缩成一个c.min.css或c.min.js文件）

	<!-- build:css css/common/common.min.css -->
	<link rel="stylesheet" type="text/css" href="css/common/a.css">
	<link rel="stylesheet" type="text/css" href="css/common/b.css">
	<!-- endbuild -->
	<!-- build:css css/c.min.css -->
	<link rel="stylesheet" type="text/css" href="css/c.css">
	<!-- endbuild -->


	<!-- build:js js/common/common.min.js-->
	<script type="text/javascript" src="js/common/a.js"></script>
	<script type="text/javascript" src="js/common/b.js"></script>
	<!-- endbuild -->
	<!-- build:js js/c.min.js-->
	<script type="text/javascript" src="js/c.js"></script>
	<!-- endbuild -->