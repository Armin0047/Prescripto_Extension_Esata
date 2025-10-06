const path = require('path');

module.exports = {
  mode: 'production',
  entry: './content/content.js', // نقطه ورود به پروژه
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // خروجی نهایی
  },
  devtool : false
};