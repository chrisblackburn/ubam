/**
 * jQuery Ubam plugin
 *
 * Jasmine test specs.
 * 
 * Copyright 2012, Chris Blackburn <christopher.blackburn@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('The session timer', function() {
  beforeEach(function() {
    jasmine.Clock.useMock();
    helper.resetState();
  });

  afterEach(function() {
    helper.destroy();
  });  

  it('is set to 15 minutes by default', function() {
    expect(ubam.settings.timeout).toEqual(15 * 60);
  });

  it('can be set when instantiating the plugin', function() {
    var override_time = 1027;
    helper.createWithOptions({
      'timeout': override_time
    });
    expect(ubam.settings.timeout).toEqual(override_time);
  });

  it('will set a cookie identifying when the user first arrived at the website in a single session', function() {
    ubam.deleteCookie();

    expect($.cookie(ubam.settings.cookie_name)).toEqual(null);
    ubam.setCookie();
    expect($.cookie(ubam.settings.cookie_name)).toNotEqual(null);
  });

  it('will not set a cookie if there is an existing timer cookie', function() {
    ubam.setCookie(); 
    existingCookie = $.cookie('ubam_timer');
    expect(existingCookie).toNotEqual(null);
    
    ubam.setCookie();
    expect($.cookie(ubam.settings.cookie_name)).toEqual(existingCookie);
  });  

  it('will delete the cookie when the user leaves the website', function() {
    expect(ubam.getCookieString()).not.toContain('expires');
  });

  it('will check every 10 seconds to ascertain if the timer has expired', function() {
    spyOn(ubam, 'checkTimer');
    jasmine.Clock.tick(10000);
    expect(ubam.checkTimer).toHaveBeenCalled();
  });

  it('will show the message overlay if the timer has expired', function() {
    spyOn(ubam, 'showOverlay');
    spyOn(ubam, 'getCurrentTime').andReturn(
      Math.round(new Date().getTime()) + (15.1 * 60 * 1000)
    );

    jasmine.Clock.tick(10000);
    expect(ubam.showOverlay).toHaveBeenCalled();
  });
});

describe('The message overlay', function() {
  beforeEach(function() {
    helper.resetState();
  });

  afterEach(function() {
    helper.destroy();
  });  

  it('is set to load the page "ubam.html" by default', function() {
    expect(ubam.settings.overlay_page).toEqual('ubam.html');
  });

  it('can configure the page to load when instantiating the plugin', function() {
    var overridePage = 'override.html';
    helper.createWithOptions({
      'overlay_page': overridePage
    });

    expect(ubam.settings.overlay_page).toEqual(overridePage);   
  });

  it('will display a helpful message if the overlay page cannot be found', function() {
    var missingPage = 'does_not_exist.html';
    helper.createWithOptions({
      'overlay_page': missingPage
    });

    spyOn(ubam, 'addResponseToOverlay');
    ubam.showOverlay();

    waitsFor(function() {
        return ubam.addResponseToOverlay.calls.length > 0;
    });
    runs(function() {
        expect(ubam.addResponseToOverlay).toHaveBeenCalled();
        expect(ubam.addResponseToOverlay.mostRecentCall.args[0])
          .toContain('HTTP response code: 404');
    });
  });

  it('will allow the user to reset the timer', function() {
    var initialTime = $.cookie('ubam_timer');

    ubam.acceptAndClose();

    expect($.cookie('ubam_timer')).toNotEqual(initialTime);
  });

  it('will provide the option to specify a callback function after it is shown', function() {
    var callbackFunction = function() {
      alert('test');
    };
    helper.createWithOptions({
      'after_dialog_shown': callbackFunction
    });
    expect(ubam.settings.after_dialog_shown).toEqual(callbackFunction);
  });

  it('will call the callback function if one is provided', function() {
    var callbackFunction = jasmine.createSpy('callbackFunction');
    helper.createWithOptions({
      'after_dialog_shown': callbackFunction
    });
    ubam.showOverlay();
    waitsFor(function() {
        return callbackFunction.calls.length > 0;
    });
    runs(function() {
        expect(callbackFunction).toHaveBeenCalled();
    });
  });
});
