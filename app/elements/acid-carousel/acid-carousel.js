// AcID Carousel
//
// Test Polymer element logic

(function (Polymer, window) {
  'use strict';

  // Detects browser's support of CSS3 transitions
  function supportsCSS3Transition() {
    return window.document.body.style.transition !== undefined;
  }

  // Fallback fade animation
  function fadeAnim(elemFrom, elemTo) {
    var config = {
        duration: 400,
        easing: [0.03, 0.56, 0.7, 0.98]
      },
      stateFrom = { opacity: 0 },
      stateTo = { opacity: 1 };

    window.Velocity(elemFrom, stateFrom, config);
    window.Velocity(elemTo, stateTo, config);
  }

  // Fallback zoom animation
  function zoomAnim(elemFrom, elemTo) {
    var config = {
        duration: 600,
        easing: [0.03, 0.56, 0.7, 0.98]
      },
      stateFrom = {
        translateZ: 0,
        translateY: '10%',
        scale: 1.2,
        opacity: 0
      },
      stateTo = {
        translateZ: 0,
        translateY: 0,
        scale: 1,
        opacity: 1
      };

    // FIXME: init style state for elements

    window.Velocity(elemFrom, stateFrom, config);
    window.Velocity(elemTo, stateTo, config);
  }

  // Fallback slide animation
  // function slideAnim(elemFrom, elemTo, forward) {
  //   var config = {
  //       duration: 600,
  //       easing: [0.03, 0.56, 0.7, 0.98]
  //     },
  //     stateFrom = {

  //     },
  //     stateTo = {

  //     };

  //   window.Velocity(elemFrom);
  //   window.Velocity(elemTo);
  // }

  // Fallback animation provider
  function animate(elemFrom, elemTo, forward, animation) {
    switch (animation) {
      case 'fade':
        fadeAnim(elemFrom, elemTo);
        break;
      case 'zoom':
        zoomAnim(elemFrom, elemTo);
        break;
      // case 'slide':
      //   slideAnim(elemFrom, elemTo, forward);
      //   break;
    }
  }

  Polymer({
    // defaults
    autoplay: true,
    duration: 5000,
    controls: true,
    animation: 'fade',

    // internal values
    animations: [
      'none',
      'fade',
      'zoom',
      'slide'
    ],
    selected: 0,
    supportsAnim: false,
    created: function() {
      // init here to prevent the 'shared between instances' behavior
      this.items = [];
      this.interval = {
        playing: null,
        started: 0,
        progress: 0,
        paused: false
      };

      // dummy detect CSS3 support
      this.supportsAnim = supportsCSS3Transition();
    },
    ready: function() {
      // set the fallback class is CSS3 is not supported
      if (!this.supportsAnim) {
        this.$.images.className += ' anim-fallback';
      }

      // get titles
      // TODO: support for showing titles
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

    // Go to next image action handler
    nextAction: function() {
      var step = (this.selected + 1) % this.items.length;
      this.go(step);
    },

    // Go to previous image action handler
    prevAction: function() {
      var step = this.selected;

      if (step === 0) {
        step = this.items.length;
      }
      step -= 1;
      this.go(step);
    },

    // Go to specific image action handler
    seekAction: function(e, detail, target) {
      var step = parseInt(target.getAttribute('data-index'), 10);

      // don't run if we're staying on the same image
      if (this.selected !== step) {
        this.go(step);
      }
    },

    // Pause on mouseenter handler
    pauseAction: function() {
      this.interval.paused = true;
      this.stop();
    },

    // Animate on mouseout handler
    continueAction: function() {
      this.interval.paused = false;
      this.play();
    },

    // Change image to selected one
    go: function(n) {
      var elemFrom = this.$.images.items[this.selected],
          elemTo = this.$.images.items[n],
          forward = n > this.selected;

      // trigger the fallback JS animation if CSS3 is not supported
      if (!this.supportsAnim) {
        animate(elemFrom, elemTo, forward, this.animation);
      }

      this.selected = n;
      this.play();
    },

    // Initiate the autoplay interval
    play: function() {
      if (this.interval.paused || !this.autoplay) {
        return;
      }

      this.stop();

      // set the new interval for image change
      this.interval.playing = window.setInterval(function() {
        this.nextAction();
      }.bind(this), this.duration);

      this.initProgress();
    },

    // Cancel the ongoing interval
    stop: function() {
      window.clearInterval(this.interval.playing);
      this.interval.playing = null;
    },

    // Init the progress bar
    initProgress: function() {
      this.interval.started = Date.now();
      this.onProgress();
    },

    // Update the progress bar
    onProgress: function() {
      var p = this.$.progress.style;

      if (this.interval.playing) {
        window.requestAnimationFrame(function() {
          this.onProgress();
        }.bind(this));

        this.interval.progress = (Date.now() - this.interval.started) /
                                    this.duration * 100;
      } else {
        this.interval.progress = 0;
      }

      p.width = this.interval.progress + '%';
    }
  });

})(Polymer, window);
