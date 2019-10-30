# Create React App
> https://facebook.github.io/create-react-app/
Welcome to the Create React App documentation!
## Getting Started

### Quick Start

```CMD
npx create-react-app my-app

rem update npm
rem npm install -g npm
rem npm cache verify

rem redux
rem yarn add redux
rem 安装react-redux 依赖于redux
rem yarn add react-redux
rem 安装react-router-dom 依赖于react-router
rem yarn add react-router-dom

rem ant-design
rem npm install antd --save

rem immutable
rem npm install --save immutable
rem redux-immutable
rem npm install --save redux-immutable
rem css-moduleyar
rem npm install --save postcss-loader postcss-modules-values


cd my-app

npm start

rem 运行编译
rem npm run build
```

### npm run eject
如果运行 eject报错
```
npm run eject
```
则
```
//首先
git add .
//然后(注意这里是 am)
git commit -am "Save before ejecting"
```
### Folder Structure
初始化文件内容如下：
```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```
项目构建必须的文件如下：
- public/index.html 模板文件
- src/index.js 入口文件

**务必将JavaScript文件和CSS文件放入src文件夹。**

## Development
### VS code 调试配置
首先，安装Debugger for Chrome
> https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome

Then add the block below to your launch.json file and put it inside the .vscode folder in your app’s root directory.
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

运行`npm start`，然后在VS code中 运行F5进行调试。

### 推荐插件
- prettier
- lint-staged
- husky

安装
```
yarn add husky lint-staged prettier
```
配置 `package.json`
```
"husky": {
    "hooks": {
        "pre-commit": "lint-staged"
    }
},
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
        "prettier --single-quote --write",
        "git add"
    ]
}
```
也可以手动执行命令：
```
./node_modules/.bin/prettier --single-quote --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"
```

### source-map-explorer
source-map-explorer 利用 source maps 分析 bundles 的size，帮助我们理解是什么让我们的代码膨胀。

安装
```
yarn add source-map-explorer
```

然后修改package.json
```
"scripts": {
//+  "analyze": "source-map-explorer build/static/js/main.*",
     "start": "react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test",
```

然后执行：
```
npm run build
npm run analyze
```

## Styles and Assets

### CSS Modules
如果要应用CSS Modules，需要应用如下命名规则：
```
xxx.module.css
```
如：
```
Button.module.css
```

### 添加 LESS 支持
1. 添加LESS
```
yarn add less less-loader
```
2. 修改config\webpack.config.js
```
const lessRegex = /\.less$/;
const lessModuleRegex = /(?=.*src)(?=.*.less)^.*$/;
module.exports = function(webpackEnv) {
    //...
    const lessLoaderOptions = {
        javascriptEnabled: true
    };
    //...
}
//增加less-loader
// less
{
    test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders(
        {
            importLoaders: 2,
            sourceMap:
                isEnvProduction && shouldUseSourceMap
        },
        'less-loader',
        lessLoaderOptions
    ),
    sideEffects: true
},
// less module
{
    test: lessModuleRegex,
    use: getStyleLoaders(
        {
            importLoaders: 2,
            sourceMap:
                isEnvProduction && shouldUseSourceMap,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent
        },
        'less-loader',
        lessLoaderOptions
    )
},
```

### 动态import
This project setup supports code splitting via dynamic import(). Its proposal is in stage 3. The import() function-like form takes the module name as an argument and returns a Promise which always resolves to the namespace object of the module.
```
//moduleA.js
const moduleA = 'Hello';

export { moduleA };

//App.js
import React, { Component } from 'react';

class App extends Component {
  handleClick = () => {
    import('./moduleA')
      .then(({ moduleA }) => {
        // Use moduleA
      })
      .catch(err => {
        // Handle failure
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
  }
}

export default App;
```


## other
- Storybook 
> https://www.learnstorybook.com/
- React Styleguidist
> https://react-styleguidist.js.org/
- flow
> https://flow.org/