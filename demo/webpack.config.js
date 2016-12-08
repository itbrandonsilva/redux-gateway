module.exports = {
    entry: './client.ts',
    output: {
        path: './',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    }
}