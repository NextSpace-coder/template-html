const { existsSync } = require("fs");
const { join } = require("path");

const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

module.exports = {
  host: host,
  port: port,
  server: {
    baseDir: "pages", // 你的静态资源目录
  },
  files: "pages/**/*",
  open: false,
  middleware: [
    function (req, res, next) {
      const url = req.url || "";
      // 解析 URL，分离路径和查询参数
      const [pathname, search] = url.split("?");
      
      // 如果已经有文件扩展名或者是根路径，直接继续
      if (pathname === "/" || /\.[a-zA-Z0-9]+$/.test(pathname)) {
        return next();
      }
      
      const pagesDir = join(__dirname, "pages");
      
      // 情况1: 路径以 / 结尾（如 /contact/）
      if (pathname.endsWith("/") && pathname !== "/") {
        // 尝试查找目录下的 index.html
        const indexPath = join(pagesDir, pathname, "index.html");
        if (existsSync(indexPath)) {
          req.url = pathname + "index.html" + (search ? `?${search}` : "");
          return next();
        }
        // 如果目录不存在，尝试去掉尾部斜杠查找 .html 文件
        const htmlPath = join(pagesDir, pathname.slice(0, -1) + ".html");
        if (existsSync(htmlPath)) {
          req.url = pathname.slice(0, -1) + ".html" + (search ? `?${search}` : "");
          return next();
        }
      } else {
        // 情况2: 路径没有扩展名（如 /contact）
        // 首先尝试添加 .html 扩展名
        const htmlPath = join(pagesDir, pathname + ".html");
        if (existsSync(htmlPath)) {
          req.url = pathname + ".html" + (search ? `?${search}` : "");
          return next();
        }
        
        // 如果 .html 文件不存在，尝试添加尾部斜杠并查找 index.html
        const dirIndexPath = join(pagesDir, pathname, "index.html");
        if (existsSync(dirIndexPath)) {
          req.url = pathname + "/index.html" + (search ? `?${search}` : "");
          return next();
        }
      }
      
      // 如果都不匹配，继续下一个中间件
      next();
    },
  ],
};