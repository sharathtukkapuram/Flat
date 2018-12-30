/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//'use strict';

require.config({
    paths: {
        jquery: 'libraries/jquery.min',
        underscore: 'libraries/underscore-min',
        backbone: 'libraries/backbone',
        gen: 'views/general',
        text: 'libraries/text',
        "jquery-datetime": 'libraries/jquery.datetimepicker.full.min',
        "jquery-mousewheel": 'libraries/jquery-mousewheel',
        'backbone_upload': 'libraries/backboneupload',
    },
    shim: {
        "jquery-datetime": {
            exports: "$",
            deps: ['jquery', 'jquery-mousewheel']
        },
        'backbone_upload': {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Backbone'
        }
    },
//    urlArgs: "v=2",
    waitSeconds: 0,
    urlArgs: "v=" + (new Date()).getTime()
});

require(['router'], function (router) {
    window.Veon.router = new router.initialize();
});