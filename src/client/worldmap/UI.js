import $ from 'jquery';
import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import Config from '../config';
import { formatNumber } from '../utils';
import * as CountryDataHelpers from '../utils/countryDataHelpers';



export const mouse = new THREE.Vector2();

export function createLegend(worldMap) {
  $('#legend_main .range .box').css('background', '#' + Config.colorMaxDestinations.getHexString());  /* Old browsers */
  $('#legend_main .range .box').css('background', '-moz-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%, #' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* FF3.6+ */
  $('#legend_main .range .box').css('background', '-webkit-gradient(linear,left top,right top,from(#' + Config.colorZeroDestinations.getHexString() + '),to(#' + Config.colorMaxDestinations.getHexString() + '))');  /* Chrome,Safari4+ */
  $('#legend_main .range .box').css('background', '-webkit-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* Chrome10+,Safari5.1+ */
  $('#legend_main .range .box').css('background', '-o-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* Opera 11.10+ */
  $('#legend_main .range .box').css('background', '-ms-linear-gradient(left,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* IE10+ */
  $('#legend_main .range .box').css('background', 'linear-gradient(to right,  #' + Config.colorZeroDestinations.getHexString() + ' 0%,#' + Config.colorMaxDestinations.getHexString() + ' 100%)'); /* W3C */
  $('#legend_main .range .box').css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#' + Config.colorZeroDestinations.getHexString() + '\', endColorstr=\'#' + Config.colorMaxDestinations.getHexString() + '\',GradientType=1 )'); /* IE6-9 */

  $('#legend_main .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaDataNotAvailable.getHexString() + '"></div><div class="text">Data not available</div></div>');

  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorCountrySelected.getHexString() + '"></div><div class="text">Selected country/nationality</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaNotRequired.getHexString() + '"></div><div class="text">Visa not required</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaOnArrival.getHexString() + '"></div><div class="text">Visa on arrival</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaFreeEU.getHexString() + '"></div><div class="text">EU freedom of movement</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaSpecial.getHexString() + '"></div><div class="text">Special regulations</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaRequired.getHexString() + '"></div><div class="text">Visa required</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaAdmissionRefused.getHexString() + '"></div><div class="text">Admission refused</div></div>');
  $('#legend_selected .colors').append('<div class="color no-data"><div class="box" style="background-color: #' + Config.colorVisaDataNotAvailable.getHexString() + '"></div><div class="text">Data not available</div></div>');

};


export function updateLegend(worldMap) {
  var num;

  $('#legend_main .range .min').html('min');

  if(worldMap.mode === 'destinations') {
    $('#legend_main .range .min').html(0);
    $('#legend_main .range .rangelabel').html('Destinations');
    $('#legend_main .range .max').html(worldMap.maxNumDestinationsFreeOrOnArrival);

    $('#last_update_wikipedia').fadeIn(800);
    $('#last_update_naturalearthdata').fadeOut(800);

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

    $('#last_update_wikipedia').fadeIn(800);
    $('#last_update_naturalearthdata').fadeOut(800);

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

    $('#last_update_wikipedia').fadeOut(800);
    $('#last_update_naturalearthdata').fadeIn(800);

    // $('#destination_country_dropdown_container').hide();

  } else if(worldMap.mode === 'gdp-per-capita') {
    $('#legend_main .range .min').html('0 USD');
    $('#legend_main .range .rangelabel').html('GDP/capita');
    num = worldMap.maxGDPPerCapita;
    num = formatNumber(num, 0);
    $('#legend_main .range .max').html(num + ' USD');

    $('#last_update_wikipedia').fadeOut(800);
    $('#last_update_naturalearthdata').fadeIn(800);

    // $('#destination_country_dropdown_container').hide();

  } else if(worldMap.mode === 'population') {
    $('#legend_main .range .min').html(0);
    $('#legend_main .range .rangelabel').html('Population');
    num = Math.round(worldMap.maxPopulation / 1000000);
    num = formatNumber(num, 0);
    $('#legend_main .range .max').html(num + ' m');

    $('#last_update_wikipedia').fadeOut(800);
    $('#last_update_naturalearthdata').fadeIn(800);

    // $('#destination_country_dropdown_container').hide();

  }

};


export function createCountryList(worldMap) {
  $('body').append('<div id="country_list_container"><ul id="country_list"></ul></div>');
  for(var i = 0; i < worldMap.countries.length; i++) {
    var country = worldMap.countries[i];
    var li = $('<li><div class="container"><span class="box"></span><span class="number"></span><span class="text">' + worldMap.countries[i].properties.name_long + '</span></div></li>');
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
  }
  $('#country_list li').click(function(event) {
    var selectedCountryNew = $(this).data('country');

    if(worldMap.selectedCountry !== selectedCountryNew) {
      if(event.ctrlKey || event.altKey || event.metaKey) {
        worldMap.setSelectedDestinationCountry(selectedCountryNew);
        worldMap.trackEvent('destinationCountryListClick', selectedCountryNew.properties.name_long);
      } else {
        worldMap.setSelectedCountry(selectedCountryNew);
        worldMap.trackEvent('sourceCountryListClick', selectedCountryNew.properties.name_long);
      }
    }

    worldMap.updateCountryColorsOneByOne();
    if(Config.usesWebGL) {
      worldMap.updateBufferGeometry();
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
          if(Config.usesWebGL) {
            worldMap.updateBufferGeometry();
          }
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

  if($('#country_list').is(':visible')) {

    if(worldMap.mode === 'destinations') {

      if(worldMap.selectedCountry) {
        worldMap.sortCountryListByCurrentFreeSourcesOrDestinations();
      } else {
        worldMap.sortCountryListByFreeDestinations();
      }

    } else if(worldMap.mode === 'sources') {

      if(worldMap.selectedDestinationCountry) {
        worldMap.sortCountryListByCurrentFreeSourcesOrDestinations();
      } else {
        worldMap.sortCountryListByFreeSources();
      }

    } else if(worldMap.mode === 'gdp') {
      worldMap.sortCountryListByGDP();

    } else if(worldMap.mode === 'gdp-per-capita') {
      worldMap.sortCountryListByGDPPerCapita();

    } else if(worldMap.mode === 'population') {
      worldMap.sortCountryListByPopulation();

    }
  }

  $('#country_list').scrollTop(0);

};


export function initViewSwitch(worldMap) {
  $('#view_switch_flat').click(function(event) {
    $('#view_switch_flat').addClass('active');
    $('#view_switch_spherical').removeClass('active');

    worldMap.controls.enabled = false;

    worldMap.tweenSwitch = new TWEEN.Tween(worldMap.animationProps)
      .to({interpolatePos: 0.0}, Config.viewSwitchDuration)
      .onStart(function() {
      })
      .onUpdate(function() {
        worldMap.geometryNeedsUpdate = true;
        // worldMap.updateLines();
      })
      .onComplete(function() {
        worldMap.controls = worldMap.controlsPinchZoom;
        worldMap.controls.enabled = true;
        worldMap.viewMode = '2d';
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
      })
      .onUpdate(function() {
        worldMap.geometryNeedsUpdate = true;
        // worldMap.updateLines();
      })
      .onComplete(function() {
        worldMap.controls = worldMap.controlsTrackball;
        worldMap.controls.enabled = true;
        worldMap.viewMode = '3d';
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
  console.log('initSourceCountryDropDown()');

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
    collapseNavBar();
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

      collapseNavBar();

      var selectedCountryNew = null;

      for(var i = 0; i < worldMap.countries.length; i++) {
        if(worldMap.countries[i].properties.name_long === value) {
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
          worldMap.trackEvent('sourceCountryDropdownSelect', selectedCountryNew.properties.name_long);
          worldMap.updateCountryHover(selectedCountryNew);
        }

        worldMap.updateCountryColorsOneByOne();
        if(Config.usesWebGL) {
          worldMap.updateBufferGeometry();
        }
      }
    }
  });

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
    collapseNavBar();
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

      collapseNavBar();

      var selectedDestinationCountryNew = null;

      for(var i = 0; i < worldMap.countries.length; i++) {
        if(worldMap.countries[i].properties.name_long === value) {
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
          worldMap.trackEvent('destinationCountryDropdownSelect', selectedDestinationCountryNew.properties.name_long);
          worldMap.updateCountryHover(selectedDestinationCountryNew);
        }

        worldMap.updateCountryColorsOneByOne();
        if(Config.usesWebGL) {
          worldMap.updateBufferGeometry();
        }
      }
    }
  });

};


export function collapseNavBar() {
  if($('#navbar').hasClass('in')) {
    $('#navbar').collapse('hide');
  }
};


export function updateCountryTooltip(worldMap, country) {
  // trace('updateCountryTooltip()');

  if(country.properties.name_long === country.properties.sovereignt) {
    $('#country-info .title').html( country.properties.name_long );
  } else {
    $('#country-info .title').html( country.properties.name_long + ' (' + country.properties.sovereignt + ')' );
  }

  $('#country-info .details').html('');

  if(worldMap.mode === 'destinations') {
    if(worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
      if(country === worldMap.selectedCountry) {
        showCountryHoverInfoVisaFreeDestinations(country);

      } else if(country === worldMap.selectedDestinationCountry) {
        if(worldMap.visaInformationFound) {
          $('#country-info .details').html( CountryDataHelpers.getCountryDetailsByVisaStatus(country) + ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(worldMap.selectedCountry) + '.<br/><div class="notes">' + country.notes + '</div>');
        } else {
          $('#country-info .details').html( 'Data not available.' );
        }
      }

    } else if(worldMap.selectedCountry && !worldMap.selectedDestinationCountry) {
      if(country === worldMap.selectedCountry) {
        showCountryHoverInfoVisaFreeDestinations(country);

      } else {
        if(worldMap.visaInformationFound) {
          $('#country-info .details').html( CountryDataHelpers.getCountryDetailsByVisaStatus(country) + ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(worldMap.selectedCountry) + '.<br/><div class="notes">' + country.notes + '</div>');
        } else {
          $('#country-info .details').html( 'Data not available.' );
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
          $('#country-info .details').html( CountryDataHelpers.getCountryDetailsByVisaStatus(worldMap.selectedDestinationCountry) + ' in ' + worldMap.selectedDestinationCountry.properties.name_long + ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(worldMap.selectedCountry) + '.<br/><div class="notes">' + worldMap.selectedDestinationCountry.notes + '</div>');
        } else {
          $('#country-info .details').html( 'Data not available.' );
        }
      }

    } else if(worldMap.selectedCountry && !worldMap.selectedDestinationCountry) {
      showCountryHoverInfoVisaFreeSources(country);

    } else if(!worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
      if(country === worldMap.selectedDestinationCountry) {
        showCountryHoverInfoVisaFreeSources(country);

      } else {
        if(worldMap.visaInformationFound) {
          $('#country-info .details').html( CountryDataHelpers.getCountryDetailsByVisaStatus(country) + ' in ' + worldMap.selectedDestinationCountry.properties.name_long + ' for nationals from ' + CountryDataHelpers.getCountryNameWithArticle(country) + '.<br/><div class="notes">' + country.notes + '</div>');
        } else {
          $('#country-info .details').html( 'Data not available.' );
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

  $('#country-info').stop().fadeIn(200);

};


export function showCountryHoverInfoVisaFreeDestinations(country) {
  if(country.destinations.length > 0) {
    $('#country-info .details').html( country.numDestinationsFreeOrOnArrival + ' destination countries nationals from ' + CountryDataHelpers.getCountryNameWithArticle(country) + ' can travel to visa-free or with visa on arrival' );
  } else {
    $('#country-info .details').html( 'Data not available.' );
  }
  $('#country-info .details').show();
};


export function showCountryHoverInfoVisaFreeSources(country) {
  $('#country-info .details').html( 'Nationals from ' + country.numSourcesFreeOrOnArrival + ' countries are granted access visa-free or with visa on arrival to ' + country.properties.name_long );
  $('#country-info .details').show();
};


export function showCountryHoverInfoGDP(country) {
  if(country.properties.gdp_md_est > 100) {
    var value = country.properties.gdp_md_est / 1000;
    $('#country-info .details').html( 'GDP: ' + formatNumber(value, 1) + ' Billion USD' );
  } else {
    $('#country-info .details').html( 'Data not available' );
  }
  $('#country-info .details').show();
};


export function showCountryHoverInfoGDPPerCapita(country) {
  if(country.properties.gdp_md_est > 100) {
    var value = Math.round(country.properties.gdp_md_est / country.properties.pop_est * 1000000);
    $('#country-info .details').html( 'GDP per capita: ' + formatNumber(value, 0) + ' USD' );
  } else {
    $('#country-info .details').html( 'Data not available' );
  }
  $('#country-info .details').show();
};


export function showCountryHoverInfoPopulation(country) {
  var value = country.properties.pop_est;
  $('#country-info .details').html( 'Population: ' + formatNumber(value, 0) );
  $('#country-info .details').show();
};


export function updateModeStatement(worldMap) {
  if(worldMap.mode === 'destinations') {
    $('#travelscope').html('This map explores the power of passports: it visualizes the number of countries people with a certain nationality can travel to without a visa or with visa on arrival.');
  } else if(worldMap.mode === 'sources') {
    $('#travelscope').html('This map visualizes the number of sources countries, whose nationals can enter a specific country without a visa or with visa on arrival.');
  } else if(worldMap.mode === 'gdp') {
    $('#travelscope').html('This map visualizes the GDP of all the countries in the world.');
  } else if(worldMap.mode === 'gdp-per-capita') {
    $('#travelscope').html('This map visualizes the GDP-per-capita of all the countries in the world.');
  } else if(worldMap.mode === 'population') {
    $('#travelscope').html('This map visualizes the population of all the countries in the world. Total population (2014): ' + formatNumber(worldMap.totalPopulation, 0));
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


export function centerLoadingPanelToScreen() {
  $('#loading').css('left', ( ($(window).width() - $('#loading').width()) / 2 - 15 ) + 'px');
  $('#loading').css('top', ( ($(window).height() - $('#loading').height()) / 2 - 25 ) + 'px');
};


export function centerCountryHoverInfoToScreen() {
  $('#country-info').css('left', ( ($(window).width() - $('#country-info').width()) / 2 - 15 ) + 'px');
  $('#country-info').css('top', ( ($(window).height() - $('#country-info').height()) / 2 - 25 ) + 'px');
};


export function centerCountryHoverInfoToMouse() {
  $('#country-info').css('left', (mouse.x - $('#country-info').width() / 2) + 'px');
  $('#country-info').css('top', (mouse.y - $('#country-info').height() / 2 - 100) + 'px');
};

