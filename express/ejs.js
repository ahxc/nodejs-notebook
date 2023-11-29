// EJS（Embedded JavaScript）是一种基于 JavaScript 语言的一种模板引擎，
// 它可以将 JavaScript 代码嵌入到 HTML 页面中，用于动态生成 HTML 内容。

/* 
动态生成 HTML：通过在 HTML 中嵌入 EJS 标签和 JavaScript 代码，可以动态生成 HTML 内容。
丰富的标签库：EJS 提供了一系列的标签和过滤器，可以方便地进行数据格式化、条件判断、循环等操作。
高效的性能：EJS 的执行效率比较高，可以快速地生成大量的 HTML 内容。
 */

const ejs = require('ejs');
const fs = require('fs');

const china = '中国';
// ejs模板语法<%= %>，可以写js语句
const result = ejs.render('我爱你，<%= china %>', { china });

// 加载ejs模板
const html = fs.readFileSync('./index.ejs').toString();
const result2 = ejs.render(html, { china });

// ejs 列表渲染
const list = [1, 2, 3, 4, 5];

const result3 = ejs.render(`
<ul>
<%= %>
`)

