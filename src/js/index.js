"use strict";
/*
    Load plugin and register to global videojs
*/
((window) => {
    window.AnnotationComments = require('./annotation_comments.js');
    /*
    videojs.registerPlugin(
        'annotationComments',
        AnnotationComments(videojs)
    );
    */
})(window);
