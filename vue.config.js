module.exports = {
    configureWebpack: {
        devServer: {
            proxy: {
                '^/api': {
                    target: 'https://swapi.co/',
                    secure: false,
                    changeOrigin: true
                }
            }
        }
    }
};
