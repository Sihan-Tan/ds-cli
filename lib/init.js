const shell = require('shelljs');
const { logWithSpinner, stopSpinner } = require('./spinner');
const { error, warning, upperFirst } = require('./tool');
const path = require('path');
const fs = require('fs');
const cwd = shell.pwd().stdout;

async function view(viewName, options) {
  // console.log(viewName, options);
  const { api, route, component } = options;
  const isInRoot = fs.existsSync(path.relative('.', 'package.json'));
  if (!isInRoot) {
    // 请在vue项目的根目录使用此命令
    console.log(error('请在vue项目的根目录使用此命令'));
  }
  // 创建目录
  if (!createView(viewName)) return false;

  // 创建组件目录
  if (!createComponent(viewName)) return false;

  // 创建路由文件
  if (!createRoute(viewName)) return false;

  // 创建接口文件
  // if (!createApi(viewName)) return false;

  // 创建状态文件
  if (!createStore(viewName)) return false;
}

// 创建目录方法
async function createView(viewName) {
  const fileFolder = path.resolve(cwd, `src/views/${viewName}`);
  const fileName = path.resolve(fileFolder, 'index.vue');
  const exist = fs.existsSync(fileFolder);
  if (exist) {
    console.log(warning('检测到已存在该目录，退出创建'));
    return false;
  }
  logWithSpinner('⏰ 正在创建视图文件......');
  shell.mkdir('-p', fileFolder);
  shell.touch(fileName);
  const { vue } = require('./template');
  fs.writeFileSync(fileName, vue);
  shell.sed('-i', 'Index', `${viewName}`, fileName);
  logWithSpinner('⏰ 创建视图文件成功......');
  stopSpinner(true);
  return true;
}

// 创建组件目录
async function createComponent(name) {
  const fileFolder = path.resolve(cwd, `src/components/${name}`);
  const fileName = path.resolve(fileFolder, 'Index.vue');
  const exist = fs.existsSync(fileFolder);
  if (exist) {
    console.log(warning('检测到已存在该组件目录，退出创建'));
    return false;
  }
  logWithSpinner('⏰ 正在创建组件文件......');
  shell.mkdir('-p', fileFolder);
  shell.touch(fileName);
  const { vue } = require('./template');
  fs.writeFileSync(fileName, vue);
  shell.sed('-i', 'Index', `${name}Common`, fileName);
  logWithSpinner('⏰ 创建组件文件成功......');
  stopSpinner(true);
  return true;
}

// 创建路由目录
async function createRoute(name) {
  const routeRoot = path.resolve(cwd, `src/routes/index.js`);
  const fileFolder = path.resolve(cwd, `src/routes/modules`);
  const fileName = path.resolve(fileFolder, `${name}.js`);
  const exist = fs.existsSync(fileName);
  if (exist) {
    console.log(warning('检测到已存在该路由文件，退出创建'));
    return false;
  }
  logWithSpinner('⏰ 正在创建路由文件......');
  shell.mkdir('-p', fileFolder);
  shell.touch(fileName);
  const { route, importRoute, loadRoute } = require('./template');
  fs.writeFileSync(fileName, route);
  shell.sed('-i', 'holder', `${name}`, fileName);
  shell.sed('-i', 'Holder', `${upperFirst(name)}`, fileName);
  logWithSpinner('⏰ 创建路由文件成功......');
  logWithSpinner('⏰ 正在引入路由文件......');
  shell.sed('-i', '// importRouteHolder', `${importRoute(name)}`, routeRoot);
  shell.sed('-i', '// loadRouteHolder', `${loadRoute(name)}`, routeRoot);
  logWithSpinner('⏰ 引入路由文件成功......');
  stopSpinner(true);
  return true;
}

// 创建状态目录
async function createStore(name) {
  const routeRoot = path.resolve(cwd, `src/store/index.js`);
  const fileFolder = path.resolve(cwd, `src/store/modules`);
  const fileName = path.resolve(fileFolder, `${name}.js`);
  const exist = fs.existsSync(fileName);
  if (exist) {
    console.log(warning('检测到已存在该状态文件，退出创建'));
    return false;
  }
  logWithSpinner('⏰ 正在创建状态文件......');
  shell.mkdir('-p', fileFolder);
  shell.touch(fileName);
  const { store, importStore, loadStore } = require('./template');
  fs.writeFileSync(fileName, store);
  shell.sed('-i', 'holder', `${name}`, fileName);
  logWithSpinner('⏰ 创建状态文件成功......');
  logWithSpinner('⏰ 正在引入状态文件......');
  shell.sed('-i', '// importStoreHolder', `${importStore(name)}`, routeRoot);
  shell.sed('-i', '// loadStoreHolder', `${loadStore(name)}`, routeRoot);
  logWithSpinner('⏰ 引入状态文件成功......');
  stopSpinner(true);
  return true;
}

module.exports = (...args) => {
  return view(...args).catch((err) => {
    stopSpinner(false); // do not persist
    error(err);
  });
};
