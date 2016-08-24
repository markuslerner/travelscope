import $ from 'jquery';
import * as TWEEN from 'tween.js';

import * as UI from './ui';



var activePanel = null;

export function initPanels() {
  $('#button_about').click(function(event) {
    if(!$('#about').is( ':visible' )) {
      showPanel($('#about'));
    } else {
      hidePanel($('#about'));
      $(this).blur();
    }
    UI.collapseNavBar();
  });
  $('#about .panel-close').click(function(event) {
    hidePanel($('#about'));
  });
  $('#button_disclaimer').click(function(event) {
    if(!$('#disclaimer').is( ':visible' )) {
      showPanel($('#disclaimer'));
    } else {
      hidePanel($('#disclaimer'));
      $(this).blur();
    }
    UI.collapseNavBar();
  });
  $('#disclaimer .panel-close').click(function(event) {
    hidePanel($('#disclaimer'));
  });

};


function showPanel(panel) {
  if(activePanel) {
    hidePanel(activePanel);
  }

  if(!panel.is( ':visible' )) {
    panel.css('left', ( ($(window).width() - panel.width() - 2 ) / 2 ) + 'px');
    panel.css('top', -panel.height() + 'px');
    panel.show();

    new TWEEN.Tween({ top: -panel.height() })
    .to({ top: ( ($(window).height() - panel.height()) / 2 - 25 ) }, 500)
    .onStart(function() {
    })
    .onUpdate(function() {
      panel.css('top', this.top);
    })
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

    activePanel = panel;
  }
};


export function hidePanel(panel) {
  if(panel.is( ':visible' )) {
    new TWEEN.Tween({top: panel.position().top})
      .to({top: -panel.height() - 50}, 300)
      .onUpdate(function() {
        panel.css('top', this.top);
      })
      .onComplete(function() {
        panel.hide();
      })
      .easing(TWEEN.Easing.Cubic.In)
      .start();

    activePanel = null;
  }
};


export function centerPanelToScreen() {
  var panel = activePanel;
  if(panel && panel.is( ':visible' )) {
    panel.css('left', ( ($(window).width() - panel.width() - 2 ) / 2 ) + 'px');
    panel.css('top', ( ($(window).height() - panel.height()) / 2 - 25 ) + 'px');
  }
};
