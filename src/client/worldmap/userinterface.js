import $ from 'jquery';
import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import Config from '../config';
import { formatNumber, cleanURLString } from '../utils';
import * as CountryDataHelpers from '../utils/countryDataHelpers';
import { worldMap } from './index.js';
import * as Panels from './panel';
// import { log } from '../LogTerminal';



export const mouse = new THREE.Vector2();
export const mouseNormalized = new THREE.Vector3( 0, 0, 1 );
export const mouseNormalizedTouchStart = new THREE.Vector3( 0, 0, 1 );

var selectCountryOnTouchEnd = true;
var isMouseDown = false;
var countryListSorting = '';
var focus = 'source';



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


export function createLegend(worldMap) {
  $('#legend-main .range .box').css('background', '#' + Config.colorMaxDestinations.getHexString());  /* Old browsers */
  $('#legend-main .range .box').css('background', '-moz-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%, #' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* FF3.6+ */
  $('#legend-main .range .box').css('background', '-webkit-gradient(linear,left top,right top,from(#' + Config.colorZeroDestinations.getHexString() + '),to(#' + Config.colorMaxDestinations.getHexString() + '))');  /* Chrome,Safari4+ */
  $('#legend-main .range .box').css('background', '-webkit-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* Chrome10+,Safari5.1+ */
  $('#legend-main .range .box').css('background', '-o-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* Opera 11.10+ */
  $('#legend-main .range .box').css('background', '-ms-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* IE10+ */
  $('#legend-main .range .box').css('background', 'linear-gradient(to right,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* W3C */
  $('#legend-main .range .box').css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#' + Config.colorZeroDestinations.getHexString() + '\', endColorstr=\'#' + Config.colorMaxDestinations.getHexString() + '\',GradientType=1 )'); /* IE6-9 */

  $('#legend-main .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaDataNotAvailable.getHexString() + '"></div><div class="text">Special status/data not available</div></div>');

  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorCountrySelected.getHexString() + '"></div><div class="text">Selected country/nationality</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaNotRequired.getHexString() + '"></div><div class="text">Visa not required</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaOnArrival.getHexString() + '"></div><div class="text">Visa on arrival</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaETA.getHexString() + '"></div><div class="text">Electronic Travel Authorization</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaFreeEU.getHexString() + '"></div><div class="text">EU freedom of movement</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaSpecial.getHexString() + '"></div><div class="text">Special regulations</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaAdmissionRefused.getHexString() + '"></div><div class="text">Admission refused</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaRequired.getHexString() + '"></div><div class="text">Visa required</div></div>');
  $('#legend-selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaDataNotAvailable.getHexString() + '"></div><div class="text">Data not available</div></div>');

  $('.btn-legend').click(function(event) {
    if($('.legend-container').is(':visible')) {
      $('.legend-container').slideToggle();
      $(this).removeClass('open');

    } else {
      $('.legend-container').slideToggle();
      $(this).addClass('open');
    }
  });
};


export function updateLegend(worldMap) {
  var num;

  $('#legend-main .range .min').html('min');

  if(worldMap.mode === 'destinations') {
    $('#legend-main .range .min').html(0);
    $('#legend-main .range .rangelabel').html('Destinations');
    $('#legend-main .range .max').html(worldMap.maxNumDestinationsFreeOrOnArrival);

  } else if(worldMap.mode === 'sources') {
    $('#legend-main .range .min').html(0);
    $('#legend-main .range .rangelabel').html('Sources');
    $('#legend-main .range .max').html(worldMap.maxNumSourcesFreeOrOnArrival);

  } else if(worldMap.mode === 'gdp') {
    $('#legend-main .range .min').html('0 USD');
    $('#legend-main .range .rangelabel').html('GDP');
    num = Math.round(worldMap.maxGDP / 1000);
    num = formatNumber(num, 0);
    $('#legend-main .range .max').html(num + ' b USD');

  } else if(worldMap.mode === 'gdp-per-capita') {
    $('#legend-main .range .min').html('0 USD');
    $('#legend-main .range .rangelabel').html('GDP/capita');
    num = worldMap.maxGDPPerCapita;
    num = formatNumber(num, 0);
    $('#legend-main .range .max').html(num + ' USD');

  } else if(worldMap.mode === 'population') {
    $('#legend-main .range .min').html(0);
    $('#legend-main .range .rangelabel').html('Population');
    num = Math.round(worldMap.maxPopulation / 1000000);
    num = formatNumber(num, 0);
    $('#legend-main .range .max').html(num + ' m');

  }

};


export function showMainLegend() {
  $('#legend-selected').fadeOut();
  $('#legend-main').fadeIn();
};


export function showSelectedLegend() {
  $('#legend-selected').fadeIn();
  $('#legend-main').fadeOut();
};


export function createCountryList(worldMap) {
  $('body').append('<ul id="country-list"></ul>');

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
      $('#country-list').append(li);

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
  $('#btn-country-list .title').html('Countries (' + count + ')');

  $('#country-list li').click(function(event) {
    var selectedCountryNew = $(this).data('country');

    if(worldMap.mode === 'sources') {
      if(worldMap.selectedDestinationCountry !== selectedCountryNew) {
        var sourceFocus = focus === 'source';

        if(event.ctrlKey || event.altKey || event.metaKey || sourceFocus) {
          worldMap.setSelectedCountry(selectedCountryNew);
          worldMap.trackEvent('sourceCountryListClick', selectedCountryNew.name);
        } else {
          worldMap.setSelectedDestinationCountry(selectedCountryNew);
          worldMap.trackEvent('destinationCountryListClick', selectedCountryNew.name);
        }
      }

    } else {
      if(worldMap.selectedCountry !== selectedCountryNew) {
        var destinationFocus = focus === 'destination';

        if(event.ctrlKey || event.altKey || event.metaKey || destinationFocus) {
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
    $('#country-list li').hover(function() {
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

  $('#btn-country-list').click(function(event) {
    if($('#country-list').is(':visible')) {
      $('#country-list').slideToggle();
      $(this).removeClass('open');

    } else {
      $('#country-list').show();
      updateCountryList(worldMap);
      $('#country-list').hide();
      $('#country-list').slideToggle();
      $(this).addClass('open');
    }
  });

};


export function updateCountryList(worldMap) {
  // log('updateCountryList()');

  if($('#country-list').is(':visible')) {

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

  $('#country-list').scrollTop(0);

};


export function showCountryList(worldMap) {
  if($(window).width() > 480 && IS_DESKTOP) {
    if(!$('#country-list').is(':visible')) {
      updateCountryList(worldMap);
      $('#country-list').slideToggle();
      $('#btn-country-list').addClass('open');
    }
  }
};


// function sortCountryListByName() {
//   var newSorting = 'name';
//   if(countryListSorting !== newSorting) {
//     countryListSorting = newSorting;
//
//     var li = $('#country-list').children('li');
//     li.sort(function(a, b) {
//       var aName = $(a).data('country').name;
//       var bName = $(b).data('country').name;
//       return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
//     });
//     repositionCountryList(li);
//   }
// }


function sortCountryListByFreeDestinations() {
  var newSorting = 'destinations';
  if(countryListSorting !== newSorting) {
    countryListSorting = newSorting;

    var li = $('#country-list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').numDestinationsFreeOrOnArrival;
      var bName = $(b).data('country').numDestinationsFreeOrOnArrival;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country-list').removeClass('numberhidden');
    $('#country-list').addClass('narrownumbers');
    $('#country-list').removeClass('widenumbers');

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

  var li = $('#country-list').children('li');
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

  $('#country-list').addClass('numberhidden');
  $('#country-list').removeClass('narrownumbers');
  $('#country-list').removeClass('widenumbers');

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

    var li = $('#country-list').children('li');
    // li.detach();
    li.sort(function(a, b) {
      var aName = $(a).data('country').numSourcesFreeOrOnArrival;
      var bName = $(b).data('country').numSourcesFreeOrOnArrival;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country-list').removeClass('numberhidden');
    $('#country-list').addClass('narrownumbers');
    $('#country-list').removeClass('widenumbers');

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

    var li = $('#country-list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').gdp;
      var bName = $(b).data('country').gdp;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country-list').removeClass('numberhidden');
    $('#country-list').removeClass('narrownumbers');
    $('#country-list').addClass('widenumbers');

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

    var li = $('#country-list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').gdpPerCapita;
      var bName = $(b).data('country').gdpPerCapita;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country-list').removeClass('numberhidden');
    $('#country-list').removeClass('narrownumbers');
    $('#country-list').addClass('widenumbers');

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

    var li = $('#country-list').children('li');
    li.sort(function(a, b) {
      var aName = $(a).data('country').population;
      var bName = $(b).data('country').population;
      return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    });

    $('#country-list').removeClass('numberhidden');
    $('#country-list').removeClass('narrownumbers');
    $('#country-list').addClass('widenumbers');

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

  if($('#country-list').is(':visible')) {
    $('#country-list li').css('transition', 'top 0.5s ease-out');
    li.each(function(i) {
      $(this).css('top', top + 'px');
      $(this).data('height', $(this).height());
      top += $(this).data('height');
    });
  } else {
    $('#country-list li').css('transition', 'none');
    li.each(function(i) {
      $(this).css('top', top + 'px');
      top += $(this).data('height');
    });
  }

}


export function initViewSwitch(worldMap) {
  $('#view-switch-flat').click(function(event) {
    $('#view-switch-flat').addClass('active');
    $('#view-switch-spherical').removeClass('active');

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

  $('#view-switch-spherical').click(function(event) {
    $('#view-switch-spherical').addClass('active');
    $('#view-switch-flat').removeClass('active');

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
  $('#country-list').hide();

  $(document.body).on('click', '.dropdown-menu li', function(event) {

    var $target = $( event.currentTarget );

    $target.closest( '.dropdown' )
      .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
      .children( '.dropdown-toggle' ).dropdown( 'toggle' );

    return false;

  });

  $('#map_mode').on('show.bs.dropdown', function() {
    $(this).find('.caret').css('transform', 'rotate(180deg)');
    // return false;
  }).on('hide.bs.dropdown', function() {
    $(this).find('.caret').css('transform', 'rotate(0deg)');
    // return false;
  });

  $('#map_mode .mode').click(function(event) {
    worldMap.setMode($(this).data('mode'));
  });

  if(!Config.isTouchDevice) {
    $('#view-switch-flat').tipsy({gravity: 's', fade: true, offset: 10});
    $('#view-switch-spherical').tipsy({gravity: 's', fade: true, offset: 10});
    $('#btn-country-list').tipsy({gravity: 'n', fade: true, offset: 10});

    $('#zoom-slider').slider({
      min: 0,
      max: 100,
      value: 0,
      slide: function(event, ui) {
        worldMap.camera.position.setLength( ( 100 - ui.value) / 100 * (worldMap.controls.maxDistance - worldMap.controls.minDistance) + worldMap.controls.minDistance);
      }
    });

    $('#zoom-slider').tipsy({gravity: 's', fade: true, offset: 10});

    updateZoomSlider(worldMap);
  }

};


export function updateZoomSlider(worldMap) {
  var z = (worldMap.camera.position.length() - worldMap.controls.minDistance) / (worldMap.controls.maxDistance - worldMap.controls.minDistance);
  z = (1 - z) * 100;
  $('#zoom-slider').slider('value', z);
};


export function initSourceCountryDropDown(worldMap) {
  // console.log('initSourceCountryDropDown()');

  $('#country-dropdown').prop('disabled', false);

  $('#country-dropdown-container').css('pointer-events', 'auto');
  $('#country-dropdown-container').css('opacity', '1');

  $('#country-dropdown').immybox({
    choices: worldMap.countryDropdownChoices,
    maxResults: 300,
    filterFn: function(query) {
      return function(choice) {
        return cleanURLString(choice.text).toLowerCase().indexOf(cleanURLString(query).toLowerCase()) >= 0;
      };
    },
  });

  $('#country-dropdown-container form').bind('submit', function(e) {
    e.preventDefault();
    collapseNavBar();
  });

  $('#country-dropdown-container .cancel').bind('click', function() {
    $('#country-dropdown').focus();
    focus = 'source';
    worldMap.clearSelectedSourceCountry();
  });
  $('#country-dropdown').bind('keyup', function() {
    if($('#country-dropdown').val() === '') {
      $('#country-dropdown-container .cancel').fadeOut();
    } else {
      $('#country-dropdown-container .cancel').fadeIn();
    }
  });

  $('#country-dropdown').on( 'update', function(event, value) {
    if(!worldMap.introRunning) {
      // $('#country-dropdown').blur();
      //
      // window.setTimeout(function() {
      //   $('#country-dropdown').blur();
      // }, 100);

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
            $('#country-dropdown').immybox('setValue', '');
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
  $('#country-dropdown').val(value);
  $('#country-dropdown').addClass('filled');
  $('#country-dropdown-container .cancel').fadeIn();

  // Set with timeout, so that focus gets re-set when clicking item in country dropdown:
  setTimeout(function() {
    $('#destination-country-dropdown').focus();
    focus = 'destination';
  }, 17);
};


export function clearSourceCountryDropDown() {
  $('#country-dropdown').immybox('setValue', '');
  $('#country-dropdown').removeClass('filled');
  $('#country-dropdown-container .cancel').fadeOut();
};


export function initDestinationCountryDropDown(worldMap) {
  $('#destination-country-dropdown').prop('disabled', false);

  $('#destination-country-dropdown-container').css('pointer-events', 'auto');
  $('#destination-country-dropdown-container').css('opacity', '1');

  $('#destination-country-dropdown').immybox({ choices: worldMap.countryDropdownChoices, maxResults: 300 });

  $('#destination-country-dropdown-container form').bind('submit', function(e) {
    e.preventDefault();
    collapseNavBar();
  });

  $('#destination-country-dropdown-container .cancel').bind('click', function() {
    $('#destination-country-dropdown').focus();
    focus = 'destination';
    worldMap.clearSelectedDestinationCountry();
  });

  $('#destination-country-dropdown').bind('keyup', function() {
    if($('#destination-country-dropdown').val() === '') {
      $('#destination-country-dropdown-container .cancel').fadeOut();
    } else {
      $('#destination-country-dropdown-container .cancel').fadeIn();
    }
  });

  $('#destination-country-dropdown').on( 'update', function(event, value) {
    if(!worldMap.introRunning) {
      // $('#destination-country-dropdown').blur();
      //
      // window.setTimeout(function() {
      //   $('#destination-country-dropdown').blur();
      // }, 100);

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
            $('#destination-country-dropdown').immybox('setValue', '');
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
  $('#destination-country-dropdown').val(value);
  $('#destination-country-dropdown').addClass('filled');
  $('#destination-country-dropdown-container .cancel').fadeIn();

  // Set with timeout, so that focus gets re-set when clicking item in country dropdown:
  setTimeout(function() {
    $('#destination-country-dropdown').focus();
    focus = 'destination';
  }, 100);
};


export function clearDestinationCountryDropDown() {
  $('#destination-country-dropdown').immybox('setValue', '');
  $('#destination-country-dropdown').removeClass('filled');
  $('#destination-country-dropdown-container .cancel').fadeOut();
};


export function blurBothCountryDropDowns() {
  $('#country-dropdown').blur();
  $('#destination-country-dropdown').blur();
  focus = '';
};


export function setModeDropdownValue(value) {
  $('#map_mode .dropdown-menu li a').filter('[data-mode=' + value + ']').trigger('click');
  $('#map_mode.open .dropdown-toggle').dropdown('toggle');
};


export function collapseNavBar() {
  // log('collapseNavBar()');

  if($('#navbar').hasClass('in')) {
    $('#navbar').collapse('hide');
  }
};


export function updateCountryTooltip(worldMap, country) {
  // console.log('updateCountryTooltip()');

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
          if(worldMap.visaInformationFound && country.visa_required !== '') {
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
            if(worldMap.visaInformationFound && country.visa_required !== '') {
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

  if(!$('#travelscope').hasClass('visible')) {
    $('#travelscope').addClass('visible');

    $('#legend-main').fadeIn(800);
    $('#zoom-slider').fadeIn(800);
    $('#view-switch').fadeIn(800);
    $('.btn-legend').fadeIn(800);
    $('#btn-country-list').fadeIn(800);
  }

};


export function createLoadingInfo() {
  $('#country-dropdown').val('Loading ...');
  $('#destination-country-dropdown').val('Loading ...');
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

  $('#zoom-slider').css('left', (viewportWidth - $('#zoom-slider').width()) / 2 + 'px');

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

    worldMap.render();
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

  // $('#country-dropdown').blur();
  // $('#destination-country-dropdown').blur();
  $('#zoom-slider .ui-slider-handle').blur();

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
