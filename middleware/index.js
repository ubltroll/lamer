module.exports = {
    initCommonMiddleware:function(app){
        app.use(require('./hbs')(app));
        app.use(require('./responses'));
    },
    auth: require('./auth')
}