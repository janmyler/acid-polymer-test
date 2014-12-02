// AcID Carousel
//
// Test Polymer element logic

(function (Polymer) {
  'use strict';

  Polymer({
    autoplay: true,
    duration: 5000,
    animation: 'fade',
    controls: 'true',
    animations: ['none', 'fade', 'slide'],
    items: [],
    selected: 0,
    ready: function() {
      // get titles
      this.$.images.items.forEach(function(elem, ind) {
        this.items.push({
          title: elem.getAttribute('title'),
          index: ind
        })
      }.bind(this));

      // check the animation type and force the default one if needed
      if (this.animations.indexOf(this.animation) < 0) {
        this.animation = 'fade';
      }
    },
    nextAction: function() {
      this.selected = (this.selected + 1) % this.items.length;
    },
    prevAction: function() {
      if (this.selected === 0) {
        this.selected = this.items.length;
      }

      this.selected -= 1;
    },
    seekAction: function(e, detail, target) {
      this.selected = parseInt(target.getAttribute('data-index'), 10);
    }
  });

})(Polymer);
