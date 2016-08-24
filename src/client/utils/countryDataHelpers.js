import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import Config from '../config';



export function matchDestinationToCountryName(destination, country) {
  if(destination === country) return true;

  if(destination === 'Brunei') {
    destination = 'Brunei Darussalam';
  } else if(destination === 'People\'s Republic of China') {
    destination = 'China';
  } else if(destination === 'Republic of the Congo') {
    destination = 'Republic of Congo';
  } else if(destination === 'Ivory Coast') {
    destination = 'Côte d\'Ivoire';
  } else if(destination === 'Gambia') {
    destination = 'The Gambia';
  } else if(destination === 'North Korea') {
    destination = 'Dem. Rep. Korea';
  } else if(destination === 'South Korea') {
    destination = 'Republic of Korea';
  } else if(destination === 'Laos') {
    destination = 'Lao PDR';
  } else if(destination === 'Burma') {
    destination = 'Myanmar';
  } else if(destination === 'Russia') {
    destination = 'Russian Federation';
  } else if(destination === 'São Tomé and Príncipe') {
    destination = 'São Tomé and Principe';
  } else if(destination === 'Vatican City') {
    destination = 'Vatican';
  } else if(destination === 'United States of America') {
    destination = 'United States';
  } else if(destination === 'Republic of Serbia') {
    destination = 'Serbia';
  }

  return country === destination;
};

export function getCountryNameWithArticle(country) {
  var name = country.properties.name_long;
  var nameFormatted = '<b>' + name + '</b>';
  if(name === 'Republic of the Congo') {
    return 'the ' + nameFormatted;
  } else if(name === 'Russia Federation') {
    return 'the ' + nameFormatted;
  } else if(name === 'Vatican') {
    return 'the ' + nameFormatted;
  } else if(name === 'United States') {
    return 'the ' + nameFormatted;
  } else if(name === 'British Indian Ocean Territory') {
    return 'the ' + nameFormatted;
  } else if(name === 'British Virgin Islands') {
    return 'the ' + nameFormatted;
  }
  return nameFormatted;
};

export function getCountryByName(countries, name) {
  for(var c = 0; c < countries.length; c++) {
    if(matchDestinationToCountryName(countries[c].properties.name_long, name) || matchDestinationToCountryName(name, countries[c].properties.name_long)) {
      return countries[c];
    }
  }
  return null;
};

export function getAllCountriesWithSameSovereignty(countries, sov) {
  var countriesMatched = [];
  for(var c = 0; c < countries.length; c++) {
    if(countries[c].properties.sovereignt === sov) {
      countriesMatched.push(countries[c]);
    }
  }
  return countriesMatched;
};

export function correctCenter(country) {
  if(country.properties.name === 'France') {
    country.center2D.x = -55;
    country.center2D.y = 89;
  } else if(country.properties.name === 'Netherlands') {
    country.center2D.x = -47;
    country.center2D.y = 104;
  } else if(country.properties.name === 'Norway') {
    country.center2D.x = -35;
    country.center2D.y = 140;
  } else if(country.properties.name === 'United States') {
    country.center2D.x = -300;
    country.center2D.y = 65;
  } else if(country.properties.name === 'Canada') {
    country.center2D.x = -290;
    country.center2D.y = 130;
  } else if(country.properties.name === 'Denmark') {
    country.center2D.x = -38;
    country.center2D.y = 114;
  } else if(country.properties.name === 'India') {
    country.center2D.x = 145;
    country.center2D.y = 20;
  } else if(country.properties.name === 'Russia') {
    country.center2D.x = 135;
    country.center2D.y = 132;
  } else if(country.properties.name === 'Brazil') {
    country.center2D.x = -190;
    country.center2D.y = -78;
  } else if(country.properties.name === 'United Kingdom') {
    country.center2D.x = -64;
    country.center2D.y = 107;
  } else if(country.properties.name === 'Spain') {
    country.center2D.x = -67;
    country.center2D.y = 70;
  } else if(country.properties.name === 'Portugal') {
    country.center2D.x = -79;
    country.center2D.y = 67;
  }
};

export function getCountryColorByVisaStatus(country) {
  var c;
  if(country.visa_required === 'no') {
    c = Config.colorVisaNotRequired;

  } else if(country.visa_required === 'on-arrival') {
    c = Config.colorVisaOnArrival;

  } else if(country.visa_required === 'free-eu') {
    c = Config.colorVisaFreeEU;

  } else if(country.visa_required === 'yes') {
    c = Config.colorVisaRequired;

  } else if(country.visa_required === 'admission-refused') {
    c = Config.colorVisaAdmissionRefused;

  } else if(country.visa_required === '') {
    c = Config.colorVisaDataNotAvailable;

  } else { // special
    c = Config.colorVisaSpecial;

  }
  return c;
};

export function getCountryColorByFreeDestinations(numDestinations, maxNumDestinationsFreeOrOnArrival) {
  var m = numDestinations / maxNumDestinationsFreeOrOnArrival;
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  return color;
};

export function getCountryColorByFreeSources(numSources, maxNumSourcesFreeOrOnArrival) {
  var m = numSources / maxNumSourcesFreeOrOnArrival;
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  return color;
};

export function getCountryColorByGDP(country, maxGDP) {
  var m = country.properties.gdp_md_est / maxGDP;
  m = TWEEN.Easing.Exponential.Out(m);
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  return color;
};

export function getCountryColorByGDPPerCapita(country, maxGDPPerCapita) {
  var m = (country.properties.gdp_md_est / country.properties.pop_est * 1000000) / maxGDPPerCapita;
  m = TWEEN.Easing.Exponential.Out(m);
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  return color;
};

export function getPopulationRatio(country, maxPopulation) {
  return parseFloat(country.properties.pop_est) / maxPopulation;    // 1 166 079 220.0;
};

export function getCountryColorByPopulation(country, maxPopulation) {
  var m = getPopulationRatio(country, maxPopulation);
  m = TWEEN.Easing.Exponential.Out(m);
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  // color.copyLinearToGamma(color);
  return color;
};
