一．项目概述
本项目是一个基于 Vue 3 + Express + CloudBase 的医生端数据管理平台，用于管理患者信息、康复数据等。技术栈如下。
层级	技术	版本
前端	Vue 3	^3.4.0
前端构建	Vite	^5.4.19
UI 框架	Element Plus	^2.10.3
路由	Vue Router	^4.3.0
HTTP 客户端	Axios	^1.10.0
后端	Express	^4.18.2
数据库	腾讯云 CloudBase	
部署平台	腾讯云 CloudBase	
二．环境准备
工具	版本要求
Node.js	== 18.15.0
npm	>= 8.0.0
CloudBase CLI	== 3.0.1
三．本地开发
//进入后端目录   cd server
//下载依赖       npm install
//打开后端       node index.js
//切换到前端目录 cd web\web_doctor
//下载依赖       npm install
//启动           npm run dev
启动后访问http://localhost:5173
四．腾讯云部署
采用腾讯云静态网站托管部署前端，HTTP型云函数部署后端。
//构建前端       
cd web\web_doctor
npm run build
生成产物将输出到dist文件夹中	
//部署到 CloudBase
//登录           
tcb login
//部署后端       
cd server
tcb fn deploy doctor -e 环境ID
//部署前端
cd web\web_doctor
tcb hosting deploy ./dist -e 环境ID
部署成功后访问https://cloud1-0gkrmbmj8a3a8eb4-1380573880.tcloudbaseapp.com
