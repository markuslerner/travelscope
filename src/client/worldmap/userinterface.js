import $ from 'jquery';
import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import Config from '../config';
import { formatNumber } from '../utils';
import * as CountryDataHelpers from '../utils/countryDataHelpers';
import { worldMap } from './index.js';
import * as Panels from './panel';
import { log } from '../LogTerminal';



export const mouse = new THREE.Vector2();
export const mouseNormalized = new THREE.Vector3( 0, 0, 1 );
export const mouseNormalizedTouchStart = new THREE.Vector3( 0, 0, 1 );

var selectCountryOnTouchEnd = true;
var isMouseDown = false;
var countryListSorting = '';
var uiReady = false;



export function init(worldMap) {
  createLegend(worldMap);
  updateLegend(worldMap);

  createCountryList(worldMap);
  updateCountryList(worldMap);

  initViewSwitch(worldMap);

  initGeneralElements(worldMap);

  bindEventHandlers();

  closeLoadingInfo();
};


export function completeInit() {
  uiReady = true;
};


export function createLegend(worldMap) {
  $('#legend_main .range .box').css('background', '#' + Config.colorMaxDestinations.getHexString());  /* Old browsers */
  $('#legend_main .range .box').css('background', '-moz-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%, #' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* FF3.6+ */
  $('#legend_main .range .box').css('background', '-webkit-gradient(linear,left top,right top,from(#' + Config.colorZeroDestinations.getHexString() + '),to(#' + Config.colorMaxDestinations.getHexString() + '))');  /* Chrome,Safari4+ */
  $('#legend_main .range .box').css('background', '-webkit-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* Chrome10+,Safari5.1+ */
  $('#legend_main .range .box').css('background', '-o-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* Opera 11.10+ */
  $('#legend_main .range .box').css('background', '-ms-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* IE10+ */
  $('#legend_main .range .box').css('background', 'linear-gradient(to right,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* W3C */
  $('#legend_main .range .box').css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#' + Config.colorZeroDestinations.getHexString() + '\', endColorstr=\'#' + Config.colorMaxDestinations.getHexString() + '\',GradientType=1 )'); /* IE6-9 */

  $('#legend_main .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaDataNotAvailable.getHexString() + '"></div><div class="text">Special status/data not available</div></div>');

  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorCountrySelected.getHexString() + '"></div><div class="text">Selected country/nationality</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaNotRequired.getHexString() + '"></div><div class="text">Visa not required</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaOnArrival.getHexString() + '"></div><div class="text">Visa on arrival</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaETA.getHexString() + '"></div><div class="text">Electronic Travel Authorization</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaFreeEU.getHexString() + '"></div><div class="text">EU freedom of movement</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaSpecial.getHexString() + '"></div><div class="text">Special regulations</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaAdmissionRefused.getHexString() + '"></div><div class="text">Admission refused</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaRequired.getHexString() + '"></div><div class="text">Visa required</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaDataNotAvailable.getHexString() + '"></div><div class="text">Data not available</div></div>');

};


export function updateLegend(worldMap) {
  var num;

  $('#legend_main .range .min').html('min');

  if(worldMap.mode === 'destinations') {
    $('#legend_main .range .min').html(0);
    $('#legend_main .range .rangelabel').html('Destinations');
    $('#legend_main .range .max').html(worldMap.maxNumDestinationsFreeOrOnArrival);

    // $('#last_update_wikipedia').fadeIn(800);
    // $('#last_update_naturalearthdata').fadeOut(800);

    /*
    if(worldMap.selectedDestinationCountry) {
      var s = worldMap.selectedDestinationCountry;
      worldMap.clearSelectedDestinationCountry();
      worldMap.setSelectedCountry(s);
    }
    */
    // $('#destination_country_dropdown_container').show();

  } else if(worldMap.mode === 'sources') {
    $('#legend_main .range .min').html(0);
    $('#legend_main .range .rangelabel').html('Sources');
    $('#legend_main .range .max').html(worldMap.maxNumSourcesFreeOrOnArrival);

    // $('#last_update_wikipedia').fadeIn(800);
    // $('#last_update_naturalearthdata').fadeOut(800);

    /*
    if(worldMap.selectedCountry) {
      var s = worldMap.selectedCountry;
      worldMap.clearSelectedSourceCountry();
      worldMap.setSelectedDestinationCountry(s);
    }
    */
    // $('#destination_country_dropdown_container').show();

  } else if(worldMap.mode === 'gdp') {
    $('#legend_main .range .min').html('0 USD');
    $('#legend_main .range .rangelabel').html('GDP');
    num = Math.round(worldMap.maxGDP / 1000);
    num = formatNumber(num, 0);
    $('#legend_main .range .max').html(num + ' b USD');

    // $('#last_update_wikipedia').fadeOut(800);
    // $('#last_update_naturalearthdata').fadeIn(800);

    // $('#destination_country_dropdown_container').hide();

  } else if(worldMap.mode === 'gdp-per-capita') {
    $('#legend_main .range .min').html('0 USD');
    $('#legend_main .range .rangelabel').html('GDP/capita');
    num = worldMap.maxGDPPerCapita;
    num = formatNumber(num, 0);
    $('#legend_main .range .max').html(num + ' USD');

    // $('#last_update_wikipedia').fadeOut(800);
    // $('#last_update_naturalearthdata').fadeIn(800);

    // $('#destination_country_dropdown_container').hide();

  } else if(worldMap.mode === 'population') {
    $('#legend_main .range .min').html(0);
    $('#legend_main .range .rangelabel').html('Population');
    num = Math.round(worldMap.maxPopulation / 1000000);
    num = formatNumber(num, 0);
    $('#legend_main .range .max').html(num + ' m');

    // $('#last_update_wikipedia').fadeOut(800);
    // $('#last_update_naturalearthdata').fadeIn(800);

    // $('#destination_country_dropdown_container').hide();

  }

};


export function showMainLegend() {
  $('#legend_selected').fadeOut();
  $('#legend_main').fadeIn();
};


export function showSelectedLegend() {
  $('#legend_selected').fadeIn();
  $('#legend_main').fadeOut();
};


export function createCountryList(worldMap) {
  $('body').append('<div id="country_list_container"><ul id="country_list"></ul></div>');

  var count = 0;
  for(var i = 0; i < worldMap.countries.length; i++) {
    var country = worldMap.countries[i];
    var name = country.name;

    // if(name === 'United States') {
      // console.log(country.properties, CountryDataHelpers.isCountry(country), country.type === 'Country', country.sovereignt);
      // console.log(country.type);
    // }

    // add only proper countries:
    if(CountryDataHelpers.isCountry(country)) {
      var li = $('<li><div class="container"><span class="box"></span><span class="number"></span><span class="text">' + name + '</span></div></li>');
      $('#country_list').append(li);

      li.data('height', li.height());

      /*
      var width = parseInt(country.numDestinationsFreeOrOnArrival / worldMap.maxNumDestinationsFreeOrOnArrival * 200);
      var num = country.numDestinationsFreeOrOnArrival;
      if(country.destinations.length === 0) {
        num = "?";
      }
      li.find('.box').css('width', width + 'px');
      li.find('.box').css('background-color', '#' + country.colorByFreeDestinations.getHexString());
      li.find('.number').html(num);
      */

      li.data('country', country);
      country.listItem = li;

      count++;
    }
  }
  $('#button_country_list .title').html('Countries (' + count + ')');

  $('#country_list li').click(function(event) {
    var selectedCountryNew = $(this).data('country');

    if(worldMap.mode === 'sources') {
      if(worldMap.selectedDestinationCountry !== selectedCountryNew) {
        if(event.ctrlKey || event.altKey || event.metaKey) {
          worldMap.setSelectedCountry(selectedCountryNew);
          worldMap.trackEvent('sourceCountryListClick', selectedCountryNew.name);
        } else {
          worldMap.setSelectedDestinationCountry(selectedCountryNew);
          worldMap.trackEvent('destinationCountryListClick', selectedCountryNew.name);
        }
      }

    } else {
      if(worldMap.selectedCountry !== selectedCountryNew) {
        if(event.ctrlKey || event.altKey || event.metaKey) {
          worldMap.setSelectedDestinationCountry(selectedCountryNew);
          worldMap.trackEvent('destinationCountryListClick', selectedCountryNew.name);
        } else {
          worldMap.setSelectedCountry(selectedCountryNew);
          worldMap.trackEvent('sourceCountryListClick', selectedCountryNew.name);
        }
      }

    }

  });

  if(!Config.isTouchDevice) {
    $('#country_list li').hover(function() {
      if(!worldMap.introRunning) {
        var country = $(this).data('country');

        worldMap.listHover = true;
        worldMap.updateCountryHover(country);
        if(!worldMap.geometryNeedsUpdate && (worldMap.intersectedObjectBefore !== worldMap.intersectedObject) ) {
          worldMap.updateAllCountryColors();
        }
      }

    }, function() {
      worldMap.listHover = false;

    });
  }

  $('#button_country_list').click(function(event) {
    if($('#country_list').is(':visible')) {
      $('#country_list').slideToggle();
      $('#button_country_list .caret').css('-webkit-transform', 'rotate(0deg)');

    } else {
      $('#country_list').show();
      updateCountryList(worldMap);
      $('#country_list').hide();
      $('#country_list').slideToggle();
      $('#button_country_list .caret').css('-webkit-transform', 'rotate(180deg)');
    }
  });

};


export function updateCountryList(worldMap) {
  // log('updateCountryList()');

  if($('#country_list').is(':visible')) {

    if(worldMap.mode === 'destinations') {

      if(worldMap.selectedCountry) {
        // sortCountryListByCurrentFreeSourcesOrDestinations();
      } else {
        sortCountryListByFreeDestinations();
      }

    } else if(worldMap.mode === 'sources') {

      if(worldMap.selectedDestinationCountry) {
        // sortCountryListByCurrentFreeSourcesOrDestinations();
      } else {
        sortCountryListByFreeSources();
      }

    } else if(worldMap.mode === 'gdp') {
      sortCountryListByGDP();

    } else if(worldMap.mode === 'gdp-per-capita') {
      sortCountryListByGDPPerCapita();

    } else if(worldMap.mode === 'population') {
      sortCountryListByPopulation();

    }
  }

  $('#country_list').scrollTop(0);

};


export function showCountryList(worldMap) {
  if($(window).width() > 480 && IS_DESKTOP) {
    if(!$('#country_list').is(':visible')) {
      updateCountryList(worldMap);
      $('#country_list').slideToggle();
      $('#button_country_list .caret').css('-webkit-transform', 'rotate(180deg)');
    }
  }
};


function sortCountryListByName() {
  var newSorting = 'name';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country_list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').name;
      var bName = $(b).data('country').name;
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    });
    repositionCountryList(li);
  }
}


function sortCountryListByFreeDestinations() {
  var newSorting = 'destinations';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country_list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').numDestinationsFreeOrOnArrival;
      var bName = $(b).data('country').numDestinationsFreeOrOnArrival;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country_list').removeClass('numberhidden');
    $('#country_list').addClass('narrownumbers');
    $('#country_list').removeClass('widenumbers');

    var destinationsNum = 100000;
    var rank = 0;
    li.each(function(index) {
      var country = $(this).data('country');
      // var width = parseInt(country.numDestinationsFreeOrOnArrival / worldMap.maxNumDestinationsFreeOrOnArrival * 200);
      var num = country.numDestinationsFreeOrOnArrival;
      if(country.destinations.length === 0) {
        num = '?';
        rank = '?';
      } else {
        if(num < destinationsNum) {
          rank++;
          destinationsNum = num;
        }
      }

      // $(this).find('.box').data('width', width);
      // $(this).find('.box').css('width', width + 'px');
      $(this).find('.box').css('background-color', '#' + country.colorByFreeDestinations.getHexString());
      $(this).find('.number').html(num);

      $(this).find('.text').html( rank + '. ' + $(this).data('country').name );

    });

    repositionCountryList(li);
  }
}


function sortCountryListByCurrentFreeSourcesOrDestinations() {
  var newSorting = 'sources-or-destinations';
  // if(countryListSorting !== newSorting || countrySelectionChanged) {
  countryListSorting = newSorting;

  var li = $('#country_list').children('li');
  li.sort(function(a, b) {
    var aCountry = $(a).data('country');
    var bCountry = $(b).data('country');

    var aName = 3 + aCountry.name;
    if(aCountry.visa_required === 'no' || aCountry.visa_required === 'on-arrival') {
      aName = 2 + aCountry.name;
    } else if(aCountry.visa_required === 'free-eu') {
      aName = 1 + aCountry.name;
    } else if(aCountry === worldMap.selectedCountry) {
      aName = 0 + aCountry.name;
    }
    var bName = 3 + bCountry.name;
    if(bCountry.visa_required === 'no' || bCountry.visa_required === 'on-arrival') {
      bName = 2 + bCountry.name;
    } else if(bCountry.visa_required === 'free-eu') {
      bName = 1 + bCountry.name;
    } else if(bCountry === worldMap.selectedCountry) {
      bName = 0 + bCountry.name;
    }

    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
  });

  $('#country_list').addClass('numberhidden');
  $('#country_list').removeClass('narrownumbers');
  $('#country_list').removeClass('widenumbers');

  li.each(function(index, element) {
    $(this).find('.text').html( $(this).data('country').name );
  });

  /*
  li.each(function() {
    var t = new TWEEN.Tween({ temp: 0, box: $(this).find('.box'), country: $(this).data('country') })
      .to({ temp: 0 }, 1000)
      .onUpdate(function() {
        this.box.css('background-color', '#' + this.country.color.getHexString());
      })
      .start();

  });
  */

  repositionCountryList(li);
  // }
}


function sortCountryListByFreeSources() {
  var newSorting = 'sources';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country_list').children('li');
    // li.detach();
    li.sort(function(a, b) {
      var aName = $(a).data('country').numSourcesFreeOrOnArrival;
      var bName = $(b).data('country').numSourcesFreeOrOnArrival;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country_list').removeClass('numberhidden');
    $('#country_list').addClass('narrownumbers');
    $('#country_list').removeClass('widenumbers');

    var sourcesNum = 100000;
    var rank = 0;
    li.each(function(index) {
      var country = $(this).data('country');
      // var width = parseInt(country.numSourcesFreeOrOnArrival / worldMap.maxNumSourcesFreeOrOnArrival * 200);
      var num = country.numSourcesFreeOrOnArrival;
      // $(this).find('.box').data('width', width);
      // $(this).find('.box').css('width', width + 'px');

      if(num < sourcesNum) {
        rank++;
        sourcesNum = num;
      }

      $(this).find('.box').css('background-color', '#' + country.colorByFreeSources.getHexString());
      $(this).find('.number').html(num);

      $(this).find('.text').html( rank + '. ' + $(this).data('country').name );

    });

    repositionCountryList(li);
  }
}


function sortCountryListByGDP() {
  var newSorting = 'gdp';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country_list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').gdp;
      var bName = $(b).data('country').gdp;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country_list').removeClass('numberhidden');
    $('#country_list').removeClass('narrownumbers');
    $('#country_list').addClass('widenumbers');

    li.each(function(index) {
      var country = $(this).data('country');
      var num = Math.round(country.gdp);
      if(num > 1000) {
        num /= 1000;
        num = formatNumber(num, 0) + ' b USD';
      } else {
        num = formatNumber(num, 0) + ' m USD';
      }
      $(this).find('.number').html(num);

      $(this).find('.text').html( (index + 1) + '. ' + $(this).data('country').name );

    });

    repositionCountryList(li);
  }
}


function sortCountryListByGDPPerCapita() {
  var newSorting = 'gdp-per-capita';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country_list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').gdpPerCapita;
      var bName = $(b).data('country').gdpPerCapita;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country_list').removeClass('numberhidden');
    $('#country_list').removeClass('narrownumbers');
    $('#country_list').addClass('widenumbers');

    li.each(function(index) {
      var country = $(this).data('country');
      var num = Math.round(country.gdpPerCapita);
      num = formatNumber(num, 0) + ' USD';
      $(this).find('.number').html(num);

      $(this).find('.text').html( (index + 1) + '. ' + $(this).data('country').name );

    });

    repositionCountryList(li);
  }
}


function sortCountryListByPopulation() {
  var newSorting = 'population';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country_list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').population;
      var bName = $(b).data('country').population;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country_list').removeClass('numberhidden');
    $('#country_list').removeClass('narrownumbers');
    $('#country_list').addClass('widenumbers');

    li.each(function(index) {
      var country = $(this).data('country');
      var num = country.population;
      if(num > 1000000) {
        num = Math.round(num / 1000000) + ' m';
      } else {
        num = formatNumber(num, 0);
      }
      $(this).find('.number').html(num);

      $(this).find('.text').html( (index + 1) + '. ' + $(this).data('country').name );

    });

    repositionCountryList(li);
  }
}


function repositionCountryList(li) {
  var top = 0;

  if($('#country_list').is(':visible')) {
    $('#country_list li').css('transition', 'top 0.5s ease-out');
    li.each(function(i) {
      $(this).css('top', top + 'px');
      $(this).data('height', $(this).height());
      top += $(this).data('height');
    });
  } else {
    $('#country_list li').css('transition', 'none');
    li.each(function(i) {
      $(this).css('top', top + 'px');
      top += $(this).data('height');
    });
  }

}


export function initViewSwitch(worldMap) {
  $('#view_switch_flat').click(function(event) {
    $('#view_switch_flat').addClass('active');
    $('#view_switch_spherical').removeClass('active');

    worldMap.controls.enabled = false;

    worldMap.tweenSwitch = new TWEEN.Tween(worldMap.animationProps)
      .to({interpolatePos: 0.0}, Config.viewSwitchDuration)
      .onStart(function() {
        worldMap.hideDisputedAreasBorders();
      })
      .onUpdate(function() {
        worldMap.geometryNeedsUpdate = true;
        // worldMap.updateLines();
      })
      .onComplete(function() {
        worldMap.controls = worldMap.controlsPinchZoom;
        worldMap.controls.enabled = true;
        worldMap.viewMode = '2d';
        worldMap.showDisputedAreasBorders();
      })
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    worldMap.tweenCameraPosition = new TWEEN.Tween(worldMap.camera.position)
      .to({ x: 0, y: 0, z: Config.cameraDistance }, Config.viewSwitchDuration)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    worldMap.tweenCameraUp = new TWEEN.Tween(worldMap.camera.up)
      .to({ x: 0, y: 1, z: 0 }, Config.viewSwitchDuration)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

  });

  $('#view_switch_spherical').click(function(event) {
    $('#view_switch_spherical').addClass('active');
    $('#view_switch_flat').removeClass('active');

    worldMap.controls.enabled = false;

    worldMap.tweenSwitch = new TWEEN.Tween(worldMap.animationProps)
      .to({interpolatePos: 1.0}, Config.viewSwitchDuration)
      .onStart(function() {
        worldMap.hideDisputedAreasBorders();
      })
      .onUpdate(function() {
        worldMap.geometryNeedsUpdate = true;
        // worldMap.updateLines();
      })
      .onComplete(function() {
        worldMap.controls = worldMap.controlsTrackball;
        worldMap.controls.enabled = true;
        worldMap.viewMode = '3d';
        worldMap.showDisputedAreasBorders();
      })
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    worldMap.tweenCameraPosition = new TWEEN.Tween(worldMap.camera.position)
      .to({ x: 0, y: 0, z: Config.cameraDistance }, Config.viewSwitchDuration)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();
  });
};


export function initGeneralElements(worldMap) {
  $('#country_list').hide();

  $(document.body).on('click', '.dropdown-menu li', function(event) {

    var $target = $( event.currentTarget );

    $target.closest( '.dropdown' )
      .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
      .children( '.dropdown-toggle' ).dropdown( 'toggle' );

    return false;

  });

  $('#map_mode').on('show.bs.dropdown', function() {
    $(this).find('.caret').css('-webkit-transform', 'rotate(180deg)');
    // return false;
  }).on('hide.bs.dropdown', function() {
    $(this).find('.caret').css('-webkit-transform', 'rotate(0deg)');
    // return false;
  });

  $('#map_mode .mode').click(function(event) {
    worldMap.setMode($(this).data('mode'));
  });

  if(!Config.isTouchDevice) {
    $('#view_switch_flat').tipsy({gravity: 's', fade: true, offset: 10});
    $('#view_switch_spherical').tipsy({gravity: 's', fade: true, offset: 10});
    $('#button_country_list').tipsy({gravity: 'n', fade: true, offset: 10});

    $('#slider_zoom').slider({
      min: 0,
      max: 100,
      value: 0,
      slide: function(event, ui) {
        worldMap.camera.position.setLength( ( 100 - ui.value) / 100 * (worldMap.controls.maxDistance - worldMap.controls.minDistance) + worldMap.controls.minDistance);
      }
    });

    $('#slider_zoom').tipsy({gravity: 's', fade: true, offset: 10});

    updateZoomSlider(worldMap);
  }

};


export function updateZoomSlider(worldMap) {
  var z = (worldMap.camera.position.length() - worldMap.controls.minDistance) / (worldMap.controls.maxDistance - worldMap.controls.minDistance);
  z = (1 - z) * 100;
  $('#slider_zoom').slider('value', z);
};


export function initSourceCountryDropDown(worldMap) {
  // console.log('initSourceCountryDropDown()');

  $('#country_dropdown').prop('disabled', false);

  $('#country_dropdown_container').css('pointer-events', 'auto');
  $('#country_dropdown_container').css('opacity', '1');

  $('#country_dropdown').immybox({ choices: worldMap.countryDropdownChoices, maxResults: 300 });

  $('#country_dropdown_container form').bind('submit', function(e) {
    e.preventDefault();
    collapseNavBar();
  });

  $('#country_dropdown').val(Config.sourceCountryDefaultText);

  $('#country_dropdown').on('click', function(event, value) {
    if($(this).val() === Config.sourceCountryDefaultText) {
      $(this).val('');
    }
  });
  $('#country_dropdown').focusout( function(event, value) {
    // $('#country_dropdown').immybox('hideResults', '');
    // collapseNavBar();
    if( $('#country_dropdown').val() === '') {
      $('#country_dropdown').val(Config.sourceCountryDefaultText);
    }
  });
  $('#country_dropdown_container .cancel').bind('click', function() {
    $('#country_dropdown').focus();
    worldMap.clearSelectedSourceCountry();
  });
  $('#country_dropdown').bind('keyup', function() {
    if($('#country_dropdown').val() === '') {
      $('#country_dropdown_container .cancel').fadeOut();
    } else {
      $('#country_dropdown_container .cancel').fadeIn();
    }
  });

  $('#country_dropdown').on( 'update', function(event, value) {
    if(!worldMap.introRunning) {
      $('#country_dropdown').blur();

      window.setTimeout(function() {
        $('#country_dropdown').blur();
      }, 100);

      if(value !== null) collapseNavBar();

      var selectedCountryNew = null;

      for(var i = 0; i < worldMap.countries.length; i++) {
        if(worldMap.countries[i].name === value) {
          selectedCountryNew = worldMap.countries[i];
          break;
        }
      }

      if(selectedCountryNew !== null) {
        if(worldMap.selectedDestinationCountry === selectedCountryNew) {
          if(worldMap.selectedCountry) {
            worldMap.clearSelectedCountry();
          } else {
            $('#country_dropdown').immybox('setValue', '');
            $('#country_dropdown').val(Config.sourceCountryDefaultText);
          }
          return;
        }

        if(worldMap.selectedCountry !== selectedCountryNew) {
          worldMap.setSelectedCountry(selectedCountryNew);
          worldMap.trackEvent('sourceCountryDropdownSelect', selectedCountryNew.name);
          worldMap.updateCountryHover(selectedCountryNew);
        }

      }
    }
  });

};


export function setSourceCountryDropdownValue(value) {
  $('#country_dropdown').val(value);
  $('#country_dropdown').addClass('filled');
  $('#country_dropdown_container .cancel').fadeIn();
};


export function clearSourceCountryDropDown() {
  $('#country_dropdown').immybox('setValue', '');
  $('#country_dropdown').val(Config.sourceCountryDefaultText);
  $('#country_dropdown').removeClass('filled');
  $('#country_dropdown_container .cancel').fadeOut();
};


export function initDestinationCountryDropDown(worldMap) {
  $('#destination_country_dropdown').prop('disabled', false);

  $('#destination_country_dropdown_container').css('pointer-events', 'auto');
  $('#destination_country_dropdown_container').css('opacity', '1');

  $('#destination_country_dropdown').immybox({ choices: worldMap.countryDropdownChoices, maxResults: 300 });

  $('#destination_country_dropdown_container form').bind('submit', function(e) {
    e.preventDefault();
    collapseNavBar();
  });

  $('#destination_country_dropdown').val(Config.destinationCountryDefaultText);

  $('#destination_country_dropdown').on( 'click', function(event, value) {
    if($(this).val() === Config.destinationCountryDefaultText) {
      $(this).val('');
    }
  });

  $('#destination_country_dropdown').focusout( function(event, value) {
    // $('#destination_country_dropdown').immybox('hideResults', '');
    // collapseNavBar();
    if( $('#destination_country_dropdown').val() === '') {
      $('#destination_country_dropdown').val(Config.destinationCountryDefaultText);
    }
  });

  $('#destination_country_dropdown_container .cancel').bind('click', function() {
    $('#destination_country_dropdown').focus();
    worldMap.clearSelectedDestinationCountry();
  });

  $('#destination_country_dropdown').bind('keyup', function() {
    if($('#destination_country_dropdown').val() === '') {
      $('#destination_country_dropdown_container .cancel').fadeOut();
    } else {
      $('#destination_country_dropdown_container .cancel').fadeIn();
    }
  });

  $('#destination_country_dropdown').on( 'update', function(event, value) {
    if(!worldMap.introRunning) {
      $('#destination_country_dropdown').blur();

      window.setTimeout(function() {
        $('#destination_country_dropdown').blur();
      }, 100);

      if(value !== null) collapseNavBar();

      var selectedDestinationCountryNew = null;

      for(var i = 0; i < worldMap.countries.length; i++) {
        if(worldMap.countries[i].name === value) {
          selectedDestinationCountryNew = worldMap.countries[i];
          break;
        }
      }

      if(selectedDestinationCountryNew !== null) {
        if(worldMap.selectedCountry === selectedDestinationCountryNew) {
          if(worldMap.selectedDestinationCountry) {
            worldMap.clearSelectedDestinationCountry();
          } else {
            $('#destination_country_dropdown').immybox('setValue', '');
            $('#destination_country_dropdown').val(Config.destinationCountryDefaultText);
          }
          return;
        }

        if(worldMap.selectedCountry !== selectedDestinationCountryNew && worldMap.selectedDestinationCountry !== selectedDestinationCountryNew) {
          worldMap.setSelectedDestinationCountry(selectedDestinationCountryNew);
          worldMap.trackEvent('destinationCountryDropdownSelect', selectedDestinationCountryNew.name);
          worldMap.updateCountryHover(selectedDestinationCountryNew);
        }

      }
    }
  });

};


export function setDestinationCountryDropdownValue(value) {
  $('#destination_country_dropdown').val(value);
  $('#destination_country_dropdown').addClass('filled');
  $('#destination_country_dropdown_container .cancel').fadeIn();
};


export function clearDestinationCountryDropDown() {
  $('#destination_country_dropdown').immybox('setValue', '');
  $('#destination_country_dropdown').val(Config.destinationCountryDefaultText);
  $('#destination_country_dropdown').removeClass('filled');
  $('#destination_country_dropdown_container .cancel').fadeOut();
};


export function collapseNavBar() {
  // log('collapseNavBar()');

  if($('#navbar').hasClass('in')) {
    $('#navbar').collapse('hide');
  }
};


export function updateCountryTooltip(worldMap, country) {
  // log('updateCountryTooltip()');

  $('#country-tooltip .details').html('');

  // if(country.name === country.sovereignt) {
  if(country.disputed) {
    $('#country-tooltip .title').html( country.name );
    // $('#country-tooltip .details').html(country.noteBrk);

  } else if(country.type === 'Sovereign country') {
    $('#country-tooltip .title').html( country.name );

  } else {
    $('#country-tooltip .title').html( country.name + ' (' + country.sovereignt + ')' );

  }

  if(!country.disputed) {
    if(worldMap.mode === 'destinations') {
      if(worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
        if(country === worldMap.selectedCountry) {
          showCountryHoverInfoVisaFreeDestinations(country);

        } else if(country === worldMap.selectedDestinationCountry) {
          if(worldMap.visaInformationFound) {
            $('#country-tooltip .details').html(
              // CountryDataHelpers.getCountryDetailsByVisaStatus(country) +
              '<span class="visa-title">' + CountryDataHelpers.getCountryVisaTitle(country) + '</span> ' +
              ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(worldMap.selectedCountry) +
              '.<br/>' +
              '<div class="notes">' + country.notes + '</div>');
          } else {
            $('#country-tooltip .details').html( 'Data not available.' );
          }
        }

      } else if(worldMap.selectedCountry && !worldMap.selectedDestinationCountry) {
        if(country === worldMap.selectedCountry) {
          showCountryHoverInfoVisaFreeDestinations(country);

        } else {
          if(worldMap.selectedCountry.disputed) {
            $('#country-tooltip .details').html('');

          } else {
            if(worldMap.visaInformationFound) {
              $('#country-tooltip .details').html(
                // CountryDataHelpers.getCountryDetailsByVisaStatus(country) +
                '<span class="visa-title">' + CountryDataHelpers.getCountryVisaTitle(country) + '</span> ' +
                ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(worldMap.selectedCountry) +
                '.<br/>' +
                '<div class="notes">' + country.notes + '</div>');
            } else {
              $('#country-tooltip .details').html( 'Data not available.' );
            }
          }
        }

      } else if(!worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
        showCountryHoverInfoVisaFreeDestinations(country);

      } else {
        // nothing selected:
        showCountryHoverInfoVisaFreeDestinations(country);
      }

    } else if(worldMap.mode === 'sources') {
      if(worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
        if(country === worldMap.selectedDestinationCountry) {
          showCountryHoverInfoVisaFreeSources(country);

        } else if(country === worldMap.selectedCountry) {
          if(worldMap.visaInformationFound) {
            $('#country-tooltip .details').html(
              '<span class="visa-title">' + CountryDataHelpers.getCountryVisaTitle(worldMap.selectedDestinationCountry) + '</span> ' +
              // CountryDataHelpers.getCountryDetailsByVisaStatus(worldMap.selectedDestinationCountry) +
              ' in ' + worldMap.selectedDestinationCountry.name +
              ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(worldMap.selectedCountry) +
              '.<br/><div class="notes">' + worldMap.selectedDestinationCountry.notes + '</div>');
          } else {
            $('#country-tooltip .details').html( 'Data not available.' );
          }
        }

      } else if(worldMap.selectedCountry && !worldMap.selectedDestinationCountry) {
        showCountryHoverInfoVisaFreeSources(country);

      } else if(!worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
        if(country === worldMap.selectedDestinationCountry) {
          showCountryHoverInfoVisaFreeSources(country);

        } else {
          if(worldMap.visaInformationFound) {
            $('#country-tooltip .details').html(
              // CountryDataHelpers.getCountryDetailsByVisaStatus(country) +
              '<span class="visa-title">' + CountryDataHelpers.getCountryVisaTitle(country) + '</span> ' +
              ' in ' + worldMap.selectedDestinationCountry.name +
              ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(country) +
              '.<br/><div class="notes">' + country.notes + '</div>');
          } else {
            $('#country-tooltip .details').html( 'Data not available.' );
          }
        }

      } else {
        // nothing selected:
        showCountryHoverInfoVisaFreeSources(country);
      }

    } else if(worldMap.mode === 'gdp') {
      showCountryHoverInfoGDP(country);

    } else if(worldMap.mode === 'gdp-per-capita') {
      showCountryHoverInfoGDPPerCapita(country);

    } else if(worldMap.mode === 'population') {
      showCountryHoverInfoPopulation(country);

    }
  }

  $('#country-tooltip').stop().fadeIn(200);

};


export function hideCountryTooltip() {
  $('#country-tooltip').stop().fadeOut(100);
};


export function showCountryHoverInfoVisaFreeDestinations(country) {
  if(country.destinations.length > 0) {
    $('#country-tooltip .details').html( country.numDestinationsFreeOrOnArrival + ' destination countries nationals from ' + CountryDataHelpers.getCountryNameWithArticle(country) + ' can travel to visa-free or with visa on arrival' );
  } else {
    $('#country-tooltip .details').html( 'Data not available.' );
  }
  $('#country-tooltip .details').show();
};


export function showCountryHoverInfoVisaFreeSources(country) {
  $('#country-tooltip .details').html( 'Nationals from ' + country.numSourcesFreeOrOnArrival + ' countries are granted access visa-free or with visa on arrival to ' + country.name );
  $('#country-tooltip .details').show();
};


export function showCountryHoverInfoGDP(country) {
  if(country.gdp > 100) {
    var value = country.gdp / 1000;
    $('#country-tooltip .details').html( 'GDP: ' + formatNumber(value, 1) + ' Billion USD' );
  } else {
    $('#country-tooltip .details').html( 'Data not available' );
  }
  $('#country-tooltip .details').show();
};


export function showCountryHoverInfoGDPPerCapita(country) {
  if(country.gdp > 100) {
    var value = Math.round(country.gdp / country.population * 1000000);
    $('#country-tooltip .details').html( 'GDP per capita: ' + formatNumber(value, 0) + ' USD' );
  } else {
    $('#country-tooltip .details').html( 'Data not available' );
  }
  $('#country-tooltip .details').show();
};


export function showCountryHoverInfoPopulation(country) {
  var value = country.population;
  $('#country-tooltip .details').html( 'Population: ' + formatNumber(value, 0) );
  $('#country-tooltip .details').show();
};


export function setHeadline(html) {
  $('#travelscope').html(html);
};


export function updateModeStatement(worldMap) {
  if(worldMap.mode === 'destinations') {
    setHeadline('This map explores the power of passports: it visualizes the number of countries people with a certain nationality can travel to without a visa or with visa on arrival.');
  } else if(worldMap.mode === 'sources') {
    setHeadline('This map visualizes the number of sources countries, whose nationals can enter a specific country without a visa or with visa on arrival.');
  } else if(worldMap.mode === 'gdp') {
    setHeadline('This map visualizes the GDP of all the countries in the world.');
  } else if(worldMap.mode === 'gdp-per-capita') {
    setHeadline('This map visualizes the GDP-per-capita of all the countries in the world.');
  } else if(worldMap.mode === 'population') {
    setHeadline('This map visualizes the population of all the countries in the world. Total population (2014): ' + formatNumber(worldMap.totalPopulation, 0));
  }

  if(IS_DESKTOP) {
    var keyboardhint;
    if(worldMap.mode === 'destinations') {
      keyboardhint = 'Click map to select source country,<br/>';
      if(Config.isMac) {
        keyboardhint += 'CMD + Click';
      } else {
        keyboardhint += 'CTRL + Click';
      }
      keyboardhint += ' to select destination county.';

      $('#travelscope').append('<div class="notes">' + keyboardhint + '</div>');

    } else if(worldMap.mode === 'sources') {
      keyboardhint = 'Click map to select destination country,<br/>';
      if(Config.isMac) {
        keyboardhint += 'CMD + Click';
      } else {
        keyboardhint += 'CTRL + Click';
      }
      keyboardhint += ' to select source county.';

      $('#travelscope').append('<div class="notes">' + keyboardhint + '</div>');
    }

  }

  if(!$('#travelscope').is( ':visible' )) {
    // $('#travelscope').fadeIn(600);

    $('#travelscope').css('top', '50px');
    $('#travelscope').css('display', 'block');
    $('#travelscope').css('opacity', '0');

    var top = '70px';
    if($(window).width() <= 1100) {
      top = '60px';
    }
    $('#travelscope').animate({
      top: top,
      opacity: 1
    }, {
      easing: 'easeOutCubic',
      duration: 800
    });

    $('#legend_main').fadeIn(800);
    $('#slider_zoom').fadeIn(800);
    if($(window).width() > 860) {
      $('#social').fadeIn(800);
    }
    $('#view_switch').fadeIn(800);
    $('#last_update_wikipedia').fadeIn(800);
    if($(window).width() > 480) {
      $('#button_country_list').fadeIn(800);
    }
  }

};


export function createLoadingInfo() {
  $('#country_dropdown').val('Loading ...');
  $('#destination_country_dropdown').val('Loading ...');
  $('#loading .details').html('Loading Visa requirements ...');
  centerLoadingPanelToScreen();
};


export function updateLoadingInfo(details) {
  $('#loading .details').html(details);
}


export function closeLoadingInfo() {
  $('#loading .details').html('Done.');
  // $('#loading').delay(0).fadeOut(1000);
  $({s: 1}).stop().delay(0).animate({s: 0}, {
    duration: 800,
    easing: 'easeOutCubic',
    step: function() {
      var t = 'scale(' + this.s + ', ' + this.s + ')';
      $('#loading').css('-webkit-transform', t);
      $('#loading').css('-moz-transform', t);
      $('#loading').css('-ms-transform', t);
    },
    complete: function() {
      $('#loading').hide();
    }
  });
}


export function centerLoadingPanelToScreen() {
  $('#loading').css('left', ( ($(window).width() - $('#loading').width()) / 2 - 15 ) + 'px');
  $('#loading').css('top', ( ($(window).height() - $('#loading').height()) / 2 - 25 ) + 'px');
};


export function centerCountryHoverInfoToScreen() {
  $('#country-tooltip').css('left', ( ($(window).width() - $('#country-tooltip').width()) / 2 - 15 ) + 'px');
  $('#country-tooltip').css('top', ( ($(window).height() - $('#country-tooltip').height()) / 2 - 25 ) + 'px');
};


export function centerCountryHoverInfoToMouse() {
  $('#country-tooltip').css('left', (mouse.x - $('#country-tooltip').width() / 2) + 'px');
  $('#country-tooltip').css('top', (mouse.y - $('#country-tooltip').height() / 2 - 100) + 'px');
};


export function bindWindowResizeHandler() {
  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
}


export function bindEventHandlers() {
  var container = $(Config.rendererContainer);

  // container.bind('click', onMouseClick);
  container.single_double_click(onMouseClick, onMouseDoubleClick);

  container.bind('mousedown', onMouseDown);
  container.bind('mousemove', onMouseMove);
  container.bind('mouseup', onMouseUp);
  container.bind('mousewheel', onMouseWheel);
  container.bind('DOMMouseScroll', onMouseWheel); // firefox

  container.bind('touchstart', onTouchStart);
  container.bind('touchmove', onTouchMove);
  // container.bind('touchend', onTouchEnd);

  container.single_double_tap(onTouchEnd, onDoubleTap);

  onWindowResize();

};


function onWindowResize() {
  // log('onWindowResize()');

  // $('#log').css('height', ($(window).height() - 200) + 'px');

  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  var container = $(Config.rendererContainer);

  container.css('width', viewportWidth + 'px');
  container.css('height', viewportHeight + 'px');

  $('#slider_zoom').css('left', (viewportWidth - $('#slider_zoom').width()) / 2 + 'px');

  if(worldMap && worldMap.renderer && worldMap.renderer.setSize) {
    worldMap.renderer.setSize( viewportWidth, viewportHeight );

    if(Config.usesWebGL) {
      worldMap.renderer.setViewport(0, 0, viewportWidth, viewportHeight);
    }
    worldMap.camera.aspect = viewportWidth / viewportHeight;
    worldMap.camera.updateProjectionMatrix();

    if(worldMap.controls) {
      worldMap.controls.screen.width = viewportWidth;
      worldMap.controls.handleResize();
    }

    if(worldMap.inited && !worldMap.introRunning) {
      if($(window).width() > 480) {
        $('#button_country_list').show();
      } else {
        $('#button_country_list').hide();
        $('#country_list').hide();
      }
      if($(window).width() > 860) {
        $('#social').show();
      } else {
        $('#social').hide();
      }
    }

    worldMap.render();

    if(uiReady) {
    }
  }

  centerCountryHoverInfoToScreen();
  centerLoadingPanelToScreen();

  Panels.centerPanelToScreen();

}

function onMouseDown(event) {
  // log('onMouseDown()');

  isMouseDown = true;

  mouseNormalizedTouchStart.copy(mouseNormalized);
  selectCountryOnTouchEnd = true;

}

function onMouseMove(event) {
  // log('onMouseMove()');

  event.preventDefault();

  mouse.x = event.clientX;
  mouse.y = event.clientY;

  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  mouseNormalized.x = ( event.clientX / viewportWidth ) * 2 - 1;
  mouseNormalized.y = -( event.clientY / viewportHeight ) * 2 + 1;

  if(isMouseDown) {
    selectCountryOnTouchEnd = mouseNormalized.distanceTo(mouseNormalizedTouchStart) < 0.005;
  }

  if(!worldMap.listHover) {
    centerCountryHoverInfoToMouse();
  }

}

function onMouseUp(event) {
  isMouseDown = false;
}

function onMouseClick(event) {
  // log('onMouseClick()');

  $('#country_dropdown').blur();
  $('#destination_country_dropdown').blur();
  $('#slider_zoom .ui-slider-handle').blur();

  if(selectCountryOnTouchEnd) {
    worldMap.selectCountryFromMap(event);
  }

}

function onMouseDoubleClick(event) {
  // log('onMouseDoubleClick()');
}

function onMouseWheel(event) {
  updateZoomSlider(worldMap);
}

function onTouchStart(event) {
  // log('onTouchStart');
  event.preventDefault();

  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
  mouseNormalized.x = ( touch.pageX / viewportWidth ) * 2 - 1;
  mouseNormalized.y = -( touch.pageY / viewportHeight ) * 2 + 1;

  mouseNormalizedTouchStart.copy(mouseNormalized);

  selectCountryOnTouchEnd = true;

}

function onTouchMove(event) {
  // log('onTouchMove');
  event.preventDefault();

  var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

  mouse.x = touch.pageX;
  mouse.y = touch.pageY;

  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  mouseNormalized.x = ( touch.pageX / viewportWidth ) * 2 - 1;
  mouseNormalized.y = -( touch.pageY / viewportHeight ) * 2 + 1;

  if(mouseNormalized.distanceTo(mouseNormalizedTouchStart) > 0.03) {
    selectCountryOnTouchEnd = false;
  }

}

function onTouchEnd(event) {
  // log('onTouchEnd');
  event.preventDefault();

  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
  mouseNormalized.x = ( touch.pageX / viewportWidth ) * 2 - 1;
  mouseNormalized.y = -( touch.pageY / viewportHeight ) * 2 + 1;

  if(selectCountryOnTouchEnd) {
    worldMap.selectCountryFromMap(event);
  }

}

function onDoubleTap(event) {
  // log('onDoubleTap()');
}
