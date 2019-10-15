/**
 * 加载所有接口文件中的 init-api方法
 */

const files = require.context('.', false, /\.js$/)

files.keys().forEach(key => {
  if (key === './index.js') return
  let module = files(key);
  for(let k in module){
    if(k.indexOf("init_api") == -1) continue;
    console.info("加载方法", k)
    module[k]();
  }
})

