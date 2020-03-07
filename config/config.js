var config = {
    VERSION: 1.0,
    BUILD: 1,
    URL: 'http://127.0.0.1',
    PORT: 5000,
    API_PATH: '/api',
    ENV: 'development',
    LANG:  'FR',

    getHTTPUrl: function(){
        return this.URL + ':' + this.PORT;
    }
};

module.exports = config;