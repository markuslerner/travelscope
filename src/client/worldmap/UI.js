import $ from 'jquery';

import Config from '../config';
import { formatNumber } from '../utils';



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
        // centerCountryHoverInfoToScreen();
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
};


