import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import Config from '../config';



export function isCountry(country) {
  // return country.type === 'Sovereign country';

  if(country.name === 'Taiwan') {
    return false;
  }

  const isCountry = country.type === 'Sovereign country' ||
    (country.type === 'Country' && (country.sovereignt === country.name || country.sovereignt === country.nameSort)) ||
    country.name === 'Hong Kong' ||
    country.name === 'Macao'
    ;

  // if(country.name.includes('Hong')) {
  //   console.log(country, isCountry);
  // }

  return isCountry;

};


export function matchDestinationToCountryName(destination, country) {
  if(destination === country) return true;

  if(destination === 'Brunei') {
    destination = 'Brunei Darussalam';
  } else if(destination === 'People\'s Republic of China') {
    destination = 'China';
  } else if(destination === 'Czech Republic') {
    destination = 'Czechia';
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
  } else if(destination === 'Macau') {
    destination = 'Macao';
  } else if(destination === 'Burma') {
    destination = 'Myanmar';
  } else if(destination === 'Russia') {
    destination = 'Russian Federation';
  } else if(destination === 'Vatican City') {
    destination = 'Vatican';
  } else if(destination === 'United States of America') {
    destination = 'United States';
  } else if(destination === 'Republic of Serbia') {
    destination = 'Serbia';
  } else if(destination === 'eSwatini') {
    destination = 'Swaziland';
  } else if(destination === 'São Tomé and Príncipe') {
    destination = 'São Tomé and Principe';
  } else if(destination === 'São Tomé and Principe') {
    destination = 'Sao Tome and Principe';
  } else if(destination === 'Cape Verde') {
    destination = 'Republic of Cabo Verde';
  }

  return country === destination;
};


export function getCountryNameWithArticle(country) {
  var name = country.name;
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
    if(matchDestinationToCountryName(countries[c].name, name) || matchDestinationToCountryName(name, countries[c].name)) {
      return countries[c];
    }
  }
  return null;
};


export function getAllCountriesWithSameSovereignty(countries, sov) {
  var countriesMatched = [];
  for(var c = 0; c < countries.length; c++) {
    if(countries[c].sovereignt === sov) {
      countriesMatched.push(countries[c]);
    }
  }
  return countriesMatched;
};


export function correctCenter(country) {
  var offset = { x: Config.mapOffsetX + 540, y: Config.mapOffsetY - 200 };

  if(country.name === 'France') {
    country.center2D.x = -55 + offset.x;
    country.center2D.y = 89 + offset.y;
  } else if(country.name === 'Netherlands') {
    country.center2D.x = -47 + offset.x;
    country.center2D.y = 104 + offset.y;
  } else if(country.name === 'Norway') {
    country.center2D.x = -35 + offset.x;
    country.center2D.y = 140 + offset.y;
  } else if(country.name === 'United States') {
    country.center2D.x = -300 + offset.x;
    country.center2D.y = 65 + offset.y;
  } else if(country.name === 'Canada') {
    country.center2D.x = -290 + offset.x;
    country.center2D.y = 130 + offset.y;
  } else if(country.name === 'Denmark') {
    country.center2D.x = -38 + offset.x;
    country.center2D.y = 114 + offset.y;
  } else if(country.name === 'India') {
    country.center2D.x = 145 + offset.x;
    country.center2D.y = 20 + offset.y;
  } else if(country.name === 'Russia') {
    country.center2D.x = 135 + offset.x;
    country.center2D.y = 132 + offset.y;
  } else if(country.name === 'Brazil') {
    country.center2D.x = -190 + offset.x;
    country.center2D.y = -78 + offset.y;
  } else if(country.name === 'United Kingdom') {
    country.center2D.x = -64 + offset.x;
    country.center2D.y = 107 + offset.y;
  } else if(country.name === 'Spain') {
    country.center2D.x = -67 + offset.x;
    country.center2D.y = 70 + offset.y;
  } else if(country.name === 'Portugal') {
    country.center2D.x = -79 + offset.x;
    country.center2D.y = 67 + offset.y;
  }
};


export function getCountryColorByVisaStatus(country) {
  var c;
  if(country.visa_required === 'no') {
    c = Config.colorVisaNotRequired;

  } else if(country.visa_required === 'on-arrival') {
    c = Config.colorVisaOnArrival;

  } else if(country.visa_required === 'eta') {
    c = Config.colorVisaETA;

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


export function getLineMaterial(country) {
  var material = Config.materialLineDefault;

  if(country.visa_required === 'no') {
    material = Config.materialLineVisaNotRequired;

  } else if(country.visa_required === 'on-arrival') {
    material = Config.materialLineVisaOnArrival;

  } else if(country.visa_required === 'eta') {
    material = Config.materialLineVisaETA;

  } else if(country.visa_required === 'free-eu') {
    material = Config.materialLineVisaFreeEU;

  } else if(country.visa_required === 'yes') {
    material = Config.materialLineVisaRequired;

  } else if(country.visa_required === 'admission-refused') {
    material = Config.materialLineVisaAdmissionRefused;

  } else if(country.visa_required === '') {
    material = Config.materialLineVisaDataNotAvailable;

  } else { // special
    material = Config.materialLineVisaSpecial;
  }
  return material;
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
  var m = country.gdp / maxGDP;
  m = TWEEN.Easing.Exponential.Out(m);
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  return color;
};


export function getCountryColorByGDPPerCapita(country, maxGDPPerCapita) {
  // var m = (country.gdp / country.population * 1000000) / maxGDPPerCapita;
  var m = country.gdpPerCapita / maxGDPPerCapita;
  m = TWEEN.Easing.Exponential.Out(m);
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  return color;
};


export function getPopulationRatio(country, maxPopulation) {
  return parseFloat(country.population) / maxPopulation;    // 1 166 079 220.0;
};


export function getCountryColorByPopulation(country, maxPopulation) {
  var m = getPopulationRatio(country, maxPopulation);
  m = TWEEN.Easing.Exponential.Out(m);
  var color = new THREE.Color(Config.colorZeroDestinations);
  color.lerp(Config.colorMaxDestinations, m);
  // color.copyLinearToGamma(color);
  return color;
};


export function getCountryVisaTitle(country) {
  if(country.visa_title === '') {
    return 'Special regulations';
  } else {
    return country.visa_title;
  }
};


export function getCountryDetailsByVisaStatus(country) {
  var details = '';

  if(country.visa_required === 'no') {
    details = 'Visa not required';

  } else if(country.visa_required === 'on-arrival') {
    details = 'Visa on arrival';

  } else if(country.visa_required === 'free-eu') {
    details = 'Visa not required (EU)';

  } else if(country.visa_required === 'yes') {
    details = 'Visa required';

  } else if(country.visa_required === 'admission-refused') {
    details = 'Admission refused';

  } else if(country.visa_required === 'special') {
    details = 'Special regulations';

  } else if(country.visa_required === '') { // data not available
    details = 'Data not available';

  } else { // special
    details = country.visa_required;

  }
  return details;
};
