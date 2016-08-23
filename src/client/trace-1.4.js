import $ from 'jquery';

/**
 * trace.js 1.4
 * http://www.markuslerner.com
 * 2015-01-08
 *
 * 2014-11-20 (1.3)
 * 2014-09-11 (1.2)
 *
 * Copyright Markus Lerner
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * required: jquery
 * sugguested: jquery.mCustomScrollbar.concat.min.js
 */


const Trace = {
  buffer: [],
  count: 0,
  modified: false,
  defaults: {
    showLineNumbers: false,
    linesNumMax: 1000,
    consoleLog: true,
    width: '300px'
  },
  inited: false,
  div: null
};

Trace.init = function(options) {

  if(!this.inited) {
    this.settings = $.extend({}, this.defaults, options);

    window.trace = function(text) {
      Trace.buffer.push(text);
      Trace.count++;
      Trace.modified = true;
      if(Trace.settings.consoleLog) {
        console.log(text);
      }
    };
    window.log = window.trace;

    window.traceSingle = function(text) {
      Trace.buffer = [text];
      Trace.modified = true;
    };

    $('body').append('<div id="trace"></div>');
    this.div = $('#trace');

    this.div.css('z-index', '100000');
    this.div.css('width', this.settings.width);
    this.div.css('height', '100%');
    this.div.css('position', 'fixed');
    this.div.css('top', '0px');
    this.div.css('left', '10px');
    this.div.css('font-family', 'Arial, Helvetica, sans-serif');
    this.div.css('font-size', '11px');
    this.div.css('line-height', '14px');
    this.div.css('color', '#aaa');
    this.div.css('pointer-events', 'none');
    // this.div.css('border', '1px solid red');

    $('<style type="text/css"> #trace .line { display: block; float: left; clear: left; width: 100%; } </style>').appendTo('head');
    if(this.settings.showLineNumbers) {
      $('<style type="text/css"> #trace .line .count { display: block; float: left; min-width: 20px; text-align: right; padding-right: 5px; color:#666; } </style>').appendTo('head');
    } else {
      $('<style type="text/css"> #trace .line .count { display: none; } </style>').appendTo('head');
    }
    $('<style type="text/css"> #trace .line .text { display: block; float: left; width: calc(100% - 60px); } </style>').appendTo('head');

    if($().mCustomScrollbar) {
      this.div.mCustomScrollbar({
        scrollInertia: 0
      });
    }

    setInterval(function() {
      if(Trace.modified) {
        var s = '';
        for(var i = 0; i < Trace.buffer.length; i++) {
          s = s.concat('<span class="line"><span class="count">' + (Trace.count - Trace.buffer.length + i + 1) + '</span><span class="text">' + Trace.buffer[i] + '</span></span>');
        }

        if(Trace.div.find('.mCSB_container').length > 0) {
          Trace.div.find('.mCSB_container').append(s);

          var l = Trace.div.find('.mCSB_container .line').length;
          if(l > Trace.settings.linesNumMax) {
            Trace.div.find('.mCSB_container .line:lt(' + (l - Trace.settings.linesNumMax) + ')').remove();
          }
          Trace.div.mCustomScrollbar('update');
          Trace.div.mCustomScrollbar('scrollTo', 'bottom');
        } else {
          Trace.div.append(s);

          l = Trace.div.find('.line').length;
          if(l > Trace.settings.linesNumMax) {
            Trace.div.find('.line:lt(' + (l - Trace.settings.linesNumMax) + ')').remove();
          }
        }

        Trace.buffer = [];
        Trace.modified = false;
      }
    }, 16);

    this.inited = true;
  }
};


export default Trace;
