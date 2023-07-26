const path = require('path')

module.exports = {
    entry: './frontend/index.js',
    module: {
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.(js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'bundle.js',
    },
    
}