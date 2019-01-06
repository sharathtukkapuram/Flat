/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define([
    'underscore',
    'backbone',
    'views/login',
    'libraries/c',
    'libraries/m',
    'gen'
], function (_, Backbone, loginView, col, mod, gen) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'login': 'login',
            '': 'login',
            'login/:q': 'login',
            ':m': 'list',
            ':m/q/:t': 'list',
            ':m/record/:id': 'record',
            ':m/record/:id/:t': 'record',
            ':m/create': 'create',
            'Administration/:t': 'admin'
        }
    });
    var initialize = function () {
        var that = this;
        this.app_router = new AppRouter;
        this.app_router.on('route:admin', function (t) {
            that.g = new gen();
            that.g.init("Administration", t);
        });
        this.app_router.on('route:list', function (m, t) {
            that.g = new gen();
            that.g.init(m, t);
        });
        this.app_router.on('route:record', function (m, id, t) {
            that.g = new gen();
            that.g.init(m, t, id);
        });
        this.app_router.on('route:create', function (m) {
            that.g = new gen();
            that.g.init(m, "", "create");
        });
        this.app_router.on('route:login', function () {
            if (!_.isEmpty(that.lv)) {
                that.lv.remove();
                that.lv = null;
            }
            that.lv = new loginView({model: that.createModel({})});
            that.lv.render();
        });
        this.createCollection = function (module, model) {
            var c = col.extend({
                module: module
            });
            return new c({model: model});
        };
        this.createModel = function (module, data) {
            var c = mod.extend({
                module: module
            });
            return new c(data);
        };
        Backbone.history.start();
    }
    return {
        initialize: initialize
    }
});