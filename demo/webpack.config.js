module.exports = {
    entry: './src/client.ts',
    output: {
        path: __dirname,
        filename: './build/bundle.js',
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
}
