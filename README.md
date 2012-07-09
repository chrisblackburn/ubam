# <a name="title"></a> ubam

## <a name="description"></a> Description

UBAM, or User Break Active Module is a jQuery plugin that interrupts the user's activity on a website at pre-defined intervals. A typical use-case for this may be where local laws or guidelines specify the maximum amount of time that certain demographics (typically children and teens) can interact with a website (typically a website with entertainment content such as games).

## <a name="usage"></a> Usage

### <a name="requirements"></a> Requirements

The plugin has been built against jQuery 1.7.2, though it's likely to work with previous versions.

### <a name="requirements"></a> Installation

1. Copy the `js/ubam.js` file to your plugins directory, or copy the contents in to your plugin file.

2. Copy the `css/ubam.css` file to your CSS directory, or add the contents to an existing CSS file.

3. Copy the `ubam.html` file somewhere that is web accessible or create another URL that will return the content you wish to show in the overlay.

4. Add the UBAM code to every page, or external javascript file, on which you want the overlay to be active:

    `$(window).ubam();`

## <a name="configuration"></a> Configuration

It is possible to configure a number of aspects of the plugin:

### overlay_page

Default: `ubam.html`. Specifies the URL that is loaded in to the overlay container.

### timeout

Default: `900`. Specifies the number of seconds the user is allowed to use the website in a single session before the overlay is shown.

### check_interval

Default: `10000`. Specifies the number of milliseconds between checking whether the timeout has been reached.

###  cookie_name

Default: `ubam_timer`. Specifies the name of the cookie.

### close_class

Default `.ubam-close`. Specifies the class of the element that is used to close the overlay and reset the timer.

### after_dialog_shown

Default: `null`. Specifies a callback function that is invoked after the dialog box is shown.

### styles
The following styles are defined in `css/ubam.css` and can be overriden to work with your local design.

    #ubam-overlay

This specifies the styles that are applied to the page overlay. This element is scaled to 100% width and height of the browser viewport.

    #ubam-content

This specifies the styles that are applied to the overlay container. This element is centred on the page.

## Resetting the timer
The example `ubam.html` file that is included in the distribution contains a link (`<a href="#" class="ubam-close">Continue</a>`) that will close the overlay and reset the timer. The className can be override using the `close_class` configuration setting.

## <a name="example-config"></a> Example with configuration

    $(window).ubam({
      'overlay_page'       : '/path/to/overlay-page/',
      'timeout'            : 1500,
      'check_interval'     : 5000,
      'cookie_name'        : 'my_custom_ubam_timer',
      'closer_class'       : '.my-custom-close-class',
      'after_dialog_shown' : function() {
      	alert('dialog box shown');
      }
    });