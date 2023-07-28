const path = require('path')

module.exports = {
    entry: {
        mainPage:'./frontend/mainPage/index.js',
        statPage:'./frontend/statPage/index.js',
    },
    module: {
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.(js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: '[name].js',
    },
    mode: "production"
    
}