;(function($) {
  $.fn.ubam = function(options) {
    settings = $.extend({
      'overlay_page'       : 'ubam.html',
      'timeout'            : 900,
      'check_interval'     : 10000,
      'cookie_name'        : 'ubam_timer',
      'closer_class'       : '.ubam-close',
      'after_dialog_shown' : null
    }, options);

    return new Ubam(settings);
  };

  function Ubam(options) {
    this.settings = options;
    this.init();

    return this;
  }

  Ubam.prototype = {
    init: function() {
      this.interval_id = null;

      this.setCookie();
      this.startTimer();
      this.attachOverlayCloser();

      $(window).resize(this.resizeAndPositionOverlay);
    },

    destroy: function() {
      this.deleteCookie();

      window.clearInterval(this.interval_id);
    },

    setCookie: function(force) {
      if (!this.getCookie() || force) {
        document.cookie = this.getCookieString();
      }
    },

    deleteCookie: function() {
      document.cookie = this.settings.cookie_name
        + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    },

    getCookieString: function() {
      return cookieString = this.settings.cookie_name + '='
          + this.getCurrentTime() + '; path=/'      
    },

    getCookie: function() {
      var cookieName = this.settings.cookie_name + '='

      if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(cookieName)
        if (offset != -1) { 
          offset += cookieName.length
          end = document.cookie.indexOf(';', offset);
          if (end == -1) {
            end = document.cookie.length;
          }

          return unescape(document.cookie.substring(offset, end));
        }
      }

      return false;
    },

    startTimer: function() {
      if (typeof(this.interval_id) != null) {
        window.clearInterval(this.interval_id);
      }

      this.interval_id = setInterval((function(self) {
        return function() {
          self.checkTimer();
        } 
      })(this), this.settings.check_interval);
    },

    checkTimer: function() {
      var cookie = this.getCookie();
      if (!cookie) {
        this.setCookie();
        return false;
      }

      var timeSessionStarted = parseInt(cookie);
      var timeDifference = this.getCurrentTime() - timeSessionStarted;

      if (timeDifference > this.settings.timeout*1000) {
        this.showOverlay();
      }
    },

    getCurrentTime: function() {
      return Math.round(new Date().getTime());
    },

    showOverlay: function() {
      if ($('#ubam-overlay').length > 0) {
        return false;
      }

      $('body').append('<div id="ubam-overlay">' + 
        '<div id="ubam-container"></div></div>');

      var self = this;
      $.get(this.settings.overlay_page, function(response) {
        self.addResponseToOverlay(response)
      }).error(function(response) {
        self.addResponseToOverlay(self.getErrorContent(response));
      });

      this.resizeAndPositionOverlay();
    },

    addResponseToOverlay: function(data) {
      $('#ubam-container').html(data);

      if (this.settings.after_dialog_shown != null) {
        this.settings.after_dialog_shown();
      }
    },

    getErrorContent: function(response) {
      return '<p>Error retrieving page: ' + this.settings.overlay_page + 
        '</p><p>HTTP response code: ' + response.status + '</p>';
    },

    attachOverlayCloser: function() {
      self = this;
      $(this.settings.closer_class).live('click', function() {
        self.acceptAndClose();
        return false;
      });
    },

    acceptAndClose: function() {
      $('#ubam-overlay').remove();

      this.setCookie(true);
    },

    resizeAndPositionOverlay: function() {
      if ($('#ubam-container').length < 1) {
        return false;
      }

      var left = ($(window).width() - $('#ubam-container').width()) / 2;

      $('#ubam-overlay').width($(window).width()).height($(window).height());
      $('#ubam-container').css({
        'left': left + 'px'
      });
    }
  }
})(jQuery);
