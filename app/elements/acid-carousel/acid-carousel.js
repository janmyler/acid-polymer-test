// AcID Carousel
//
// Test Polymer element logic

(function (Polymer, window) {
  'use strict';

  Polymer({
    autoplay: true,
    duration: 5000,
    animation: 'fade',
    controls: 'true',
    animations: ['none', 'fade', 'slide'],
    items: [],
    selected: 0,
    playing: null,
    ready: function() {
      // get titles
      this.$.images.items.forEach(function(elem, ind) {
        this.items.push({
          title: elem.getAttribute('title'),
          index: ind
        });
      }.bind(this));

      // check the animation type and force the default one if needed
      if (this.animations.indexOf(this.animation) < 0) {
        this.animation = 'fade';
      }

      // start autoplay if needed
      if (this.autoplay) {
        this.play();
      }
    },
    nextAction: function() {
      this.next();

      // reset the timer
      if (this.playing) {
        this.play();
      }
    },
    prevAction: function() {
      this.prev();

      // reset the timer
      if (this.playing) {
        this.play();
      }
    },
    seekAction: function(e, detail, target) {
      this.selected = parseInt(target.getAttribute('data-index'), 10);
    },
    pauseAction: function() {
      this.stop();
    },
    continueAction: function() {
      this.play();
    },
    next: function() {
      this.selected = (this.selected + 1) % this.items.length;
    },
    prev: function() {
      if (this.selected === 0) {
        this.selected = this.items.length;
      }
      this.selected -= 1;
    },
    play: function() {
      if (this.playing) {
        this.stop();
      }

      this.playing = window.setInterval(function() {
        this.nextAction();
      }.bind(this), this.duration);
    },
    stop: function() {
      window.clearInterval(this.playing);
    }
  });

})(Polymer, window);
