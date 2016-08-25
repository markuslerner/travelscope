import $ from 'jquery';

/**
 * LogTerminal.js 1.5
 * Window overlay log terminal
 * http://www.markuslerner.com
 * 2016-08-25
 *
 * 2015-01-08 (1.4)
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


const LogTerminal = {
  buffer: [],
  count: 0,
  modified: false,
  defaults: {
    showLineNumbers: true,
    linesNumMax: 1000,
    consoleLog: true,
    width: '300px'
  },
  inited: false,
  div: null
};

LogTerminal.init = function(options = {}) {

  if(!this.inited) {
    this.settings = $.extend({}, this.defaults, options);

    $('body').append('<div id="logterminal"></div>');
    this.div = $('#logterminal');

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

    $('<style type="text/css"> #logterminal .line { display: block; float: left; clear: left; width: 100%; } </style>').appendTo('head');
    if(this.settings.showLineNumbers) {
      $('<style type="text/css"> #logterminal .line .count { display: block; float: left; min-width: 20px; text-align: right; padding-right: 5px; color:#666; } </style>').appendTo('head');
    } else {
      $('<style type="text/css"> #logterminal .line .count { display: none; } </style>').appendTo('head');
    }
    $('<style type="text/css"> #logterminal .line .text { display: block; float: left; width: calc(100% - 60px); } </style>').appendTo('head');

    if($().mCustomScrollbar) {
      this.div.mCustomScrollbar({
        scrollInertia: 0
      });
    }

    setInterval(function() {
      if(LogTerminal.modified) {
        var s = '';
        for(var i = 0; i < LogTerminal.buffer.length; i++) {
          s = s.concat('<span class="line"><span class="count">' + (LogTerminal.count - LogTerminal.buffer.length + i + 1) + '</span><span class="text">' + LogTerminal.buffer[i] + '</span></span>');
        }

        if(LogTerminal.div.find('.mCSB_container').length > 0) {
          LogTerminal.div.find('.mCSB_container').append(s);

          var l = LogTerminal.div.find('.mCSB_container .line').length;
          if(l > LogTerminal.settings.linesNumMax) {
            LogTerminal.div.find('.mCSB_container .line:lt(' + (l - LogTerminal.settings.linesNumMax) + ')').remove();
          }
          LogTerminal.div.mCustomScrollbar('update');
          LogTerminal.div.mCustomScrollbar('scrollTo', 'bottom');
        } else {
          LogTerminal.div.append(s);

          l = LogTerminal.div.find('.line').length;
          if(l > LogTerminal.settings.linesNumMax) {
            LogTerminal.div.find('.line:lt(' + (l - LogTerminal.settings.linesNumMax) + ')').remove();
          }
        }

        LogTerminal.buffer = [];
        LogTerminal.modified = false;
      }
    }, 16);

    this.inited = true;
  }
};

LogTerminal.hide = function() {
  if(!LogTerminal.inited) LogTerminal.init();

  LogTerminal.div.css('display', 'none');
};



export default LogTerminal;

export function log(text) {
  if(!LogTerminal.inited) LogTerminal.init();

  LogTerminal.buffer.push(text);
  LogTerminal.count++;
  LogTerminal.modified = true;
  if(LogTerminal.settings.consoleLog) {
    console.log(text);
  }
};

export function clearLog(text = '') {
  if(!LogTerminal.inited) LogTerminal.init();

  LogTerminal.buffer = [text];
  LogTerminal.modified = true;
};
