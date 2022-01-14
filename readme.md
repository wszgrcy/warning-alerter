# 使用说明

- 开发于 windows10 系统,所以做了 linux 与 mac 的测试,从导出和行数上来看大概一致(未详细比较)
- windows10 系统上与 warning.log 比较完全一样

## 直接使用

- yarn start
  > 或 npm start

## 构建后使用

- npm run build
- node ./dist/index.js ./build.log
  > 可以通过管道将日志导出到 Json 文件中
