module.exports = {
    configureWebpack: {
        devServer: {
            proxy: {
                '^/api': {
                    target: 'https://swapi.dev/',
                    secure: false,
                    changeOrigin: true
                }
            }
        }
    }
};
