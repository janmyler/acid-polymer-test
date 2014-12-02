// AcID Carousel
//
// Test Polymer element logic

(function (Polymer) {
  'use strict';

  var ANIMATIONS = ['none', 'fade', 'slide'];

  Polymer({
    autoplay: true,
    duration: 5000,
    animation: 'fade',
    height: 500,
    controls: 'true',
    items: []
  });

})(Polymer);
