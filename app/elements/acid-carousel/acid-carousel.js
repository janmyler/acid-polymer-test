// AcID Carousel
//
// Test Polymer element logic

(function (Polymer, window) {
  'use strict';

  Polymer({
    // defaults
    autoplay: true,
    duration: 5000,
    controls: true,
    animation: 'fade',

    // internal values
    animations: ['none', 'fade', 'slide'],
    items: [],
    selected: 0,
    interval: {
      playing: null,
      started: 0,
      progress: 0,
      paused: false
    },
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

      // check the boolean defs
      if (typeof this.autoplay === 'string') {
        this.autoplay = this.autoplay === 'true';
      }
      if (typeof this.controls === 'string') {
        this.controls = this.controls === 'true';
      }

      // start autoplay if needed
      if (this.autoplay) {
        this.play();
      }
    },
    nextAction: function() {
      var step = (this.selected + 1) % this.items.length;
      this.go(step);
    },
    prevAction: function() {
      var step = this.selected;

      if (step === 0) {
        step = this.items.length;
      }
      step -= 1;
      this.go(step);
    },
    seekAction: function(e, detail, target) {
      var step = parseInt(target.getAttribute('data-index'), 10);
      this.go(step);
    },
    pauseAction: function() {
      this.interval.paused = true;
      this.stop();
    },
    continueAction: function() {
      this.interval.paused = false;
      this.play();
    },
    go: function(n) {
      this.selected = n;
      this.play();
    },
    play: function() {
      if (this.interval.paused) {
        return;
      }

      this.stop();
      this.interval.playing = window.setInterval(function() {
        this.initProgress();
        this.nextAction();
      }.bind(this), this.duration);
      this.initProgress();
    },
    stop: function() {
      window.clearInterval(this.interval.playing);
      this.interval.playing = null;
    },
    initProgress: function() {
      this.interval.started = Date.now();
      this.onProgress();
    },
    onProgress: function() {
      if (this.interval.playing) {
        window.requestAnimationFrame(function() {
          this.onProgress();
        }.bind(this));

        this.interval.progress = (Date.now() - this.interval.started) / this.duration * 100;
      } else {
        this.interval.progress = 0;
      }
    }
  });

})(Polymer, window);
