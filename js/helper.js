function UbamHelper() {
  this.resetState();

  return this;
}

UbamHelper.prototype = {
  destroy: function() {
    if (typeof(ubam) != 'undefined') {
      ubam.destroy();
      delete ubam;
    }
  },

  resetState: function() {
  	this.destroy();

    ubam = $.fn.ubam();
  },

  createWithOptions: function(options) {
    this.destroy();

    ubam = $.fn.ubam(options);
  }
}

var helper = new UbamHelper();