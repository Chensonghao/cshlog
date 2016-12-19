# cshlog
> 在项目根目录生成log目录，里面生成.log日志文件，每天生成一份文件，命名规则如：20161212.log


安装
```
    sudo npm install cshlog --save
```
引用
```
    const log = require('cshlog');
```
API
```
log.error('error message');
log.info('information');
log.warn('warning');
log.debug('debug message');
/*
删除多少天以外的log文件，不传参数则删除目录下所有.log文件
*/
log.clear(30);

```
