import * as THREE from 'three';
import * as TWEEN from 'tween.js';

import Config from '../config';
import * as CountryDataHelpers from '../utils/countryDataHelpers';
import { transformSVGPath } from '../three/d3-threeD';
import { log } from '../LogTerminal';



export function createCountriesGeometry(worldMap) {
  var data = worldMap.dataCountries;
  var start = Date.now();
  var globalPointCount = 0;
  var numVisaRequirementsFound = 0;

  worldMap.countriesObject3D = new THREE.Object3D();
  worldMap.countries = [];
  worldMap.trianglesNumTotal = 0;
  worldMap.countryDropdownChoices = [];

  // features = countries
  var i;
  var destinations;
  for(i = 0; i < data.features.length; i++) {
    var feature = data.features[i];
    destinations = [];

    // log( feature.properties.name );
    // log( feature.properties.name_long );
    // log( feature.properties.name_sort );

    if(feature.properties.name !== 'Antarctica') { //  && feature.properties.name === 'Germany'
      for(var r = 0; r < worldMap.visaRequirements.countries.length; r++) {
        // 199 nationalities travelling to 240 (?) countries, assuming nationals from a country don't need a visa to the sovereignty's main country:
        // if(CountryDataHelpers.matchDestinationToCountryName(feature.properties.name_long, worldMap.visaRequirements.countries[r].name) || CountryDataHelpers.matchDestinationToCountryName(worldMap.visaRequirements.countries[r].name, feature.properties.name_long)) {
        if(CountryDataHelpers.matchDestinationToCountryName(feature.properties.sovereignt, worldMap.visaRequirements.countries[r].name) || CountryDataHelpers.matchDestinationToCountryName(worldMap.visaRequirements.countries[r].name, feature.properties.sovereignt)) {
          // log('Loading visa requirements for: ' + feature.properties.name);
          destinations = worldMap.visaRequirements.countries[r].destinations;
          numVisaRequirementsFound++;
        }
      }

      // convert SVG data to three.js Shapes array (all shapes in one country):
      var t = worldMap.geo.path(feature);

      if(t !== undefined) {
        var shapes = transformSVGPath( t );

        var pointCount = 0;
        for(var p = 0; p < shapes.length; p++) {
          pointCount += shapes[p].getPoints().length;
        }
        globalPointCount += pointCount;

        worldMap.countries.push({
          properties: feature.properties,
          shapes: shapes,
          destinations: destinations,
          numDestinationsFreeOrOnArrival: 0,
          numSourcesFreeOrOnArrival: 0,
          color: new THREE.Color(Config.colorCountryDefault),
          colorLast: new THREE.Color(Config.colorCountryDefault)
        });

        if(destinations.length === 0) {
          // log("Geometry: No visa requirements found for: " + feature.properties.name);
        }

        worldMap.countryDropdownChoices.push({text: feature.properties.name_long, value: feature.properties.name_long});

        // log("Geometry" + feature.properties.name + " | shapes: " + shapes.length + ", total points: " + pointCount);

      }
    }
  }

  var d;
  var country;
  // remove destinations who's country doesn't exist:
  for(i = 0; i < worldMap.countries.length; i++) {
    destinations = worldMap.countries[i].destinations;
    var destinationsNew = [];
    for(d = 0; d < destinations.length; d++) {
      country = CountryDataHelpers.getCountryByName(worldMap.countries, destinations[d].d_name);
      if(country !== null) {
        destinationsNew.push(destinations[d]);
      }
    }
    worldMap.countries[i].destinations = destinationsNew;

  }

  // count visa-free destinations:
  for(i = 0; i < worldMap.countries.length; i++) {
    destinations = worldMap.countries[i].destinations;

    worldMap.countries[i].numDestinationsFreeOrOnArrival = 0;
    for(d = 0; d < destinations.length; d++) {
      if(destinations[d].visa_required === 'no' || destinations[d].visa_required === 'on-arrival' || destinations[d].visa_required === 'free-eu'
         // || destinations[d].visa_required === 'evisa' || destinations[d].visa_required === 'evisitor' || destinations[d].visa_required === 'eta'
        ) {
        worldMap.countries[i].numDestinationsFreeOrOnArrival++;
      }

    }

    // add main sovereignty, if exists:
    var mainCountry = CountryDataHelpers.getCountryByName(worldMap.countries, worldMap.countries[i].properties.sovereignt);
    if(mainCountry && mainCountry.properties.sovereignt !== worldMap.countries[i].properties.name_long) {
      worldMap.countries[i].numDestinationsFreeOrOnArrival++;
    }

    if(worldMap.countries[i].numDestinationsFreeOrOnArrival > worldMap.maxNumDestinationsFreeOrOnArrival) {
      worldMap.maxNumDestinationsFreeOrOnArrival = worldMap.countries[i].numDestinationsFreeOrOnArrival;
    }

  }

  // count countries from where people can come without a visa > find most open countries:
  for(i = 0; i < worldMap.countries.length; i++) {
    destinations = worldMap.countries[i].destinations;
    for(d = 0; d < destinations.length; d++) {
      if(destinations[d].visa_required === 'no' || destinations[d].visa_required === 'on-arrival' || destinations[d].visa_required === 'free-eu') {
        country = CountryDataHelpers.getCountryByName(worldMap.countries, destinations[d].d_name);
        if(country !== null) {
          country.numSourcesFreeOrOnArrival++;
        }
      }
    }
  }

  for(i = 0; i < worldMap.countries.length; i++) {
    if( worldMap.countries[i].numSourcesFreeOrOnArrival > worldMap.maxNumSourcesFreeOrOnArrival ) {
      worldMap.maxNumSourcesFreeOrOnArrival = worldMap.countries[i].numSourcesFreeOrOnArrival;
    }
    if( worldMap.countries[i].properties.gdp_md_est > worldMap.maxGDP ) {
      worldMap.maxGDP = worldMap.countries[i].properties.gdp_md_est;
    }
    if( worldMap.countries[i].properties.pop_est > worldMap.maxPopulation ) {
      worldMap.maxPopulation = worldMap.countries[i].properties.pop_est;
    }
    worldMap.totalPopulation += worldMap.countries[i].properties.pop_est;
    worldMap.countries[i].properties.gdp_per_capita = worldMap.countries[i].properties.gdp_md_est / worldMap.countries[i].properties.pop_est * 1000000;
    if( worldMap.countries[i].properties.gdp_per_capita > worldMap.maxGDPPerCapita ) {
      if(worldMap.countries[i].properties.gdp_md_est > 100) {
        worldMap.maxGDPPerCapita = worldMap.countries[i].properties.gdp_md_est / worldMap.countries[i].properties.pop_est * 1000000;
        // log( worldMap.countries[i].properties.name_long );
        // log( 'population: ' + worldMap.countries[i].properties.pop_est );
        // log( 'gdp: ' + worldMap.countries[i].properties.gdp_md_est );
        // log( 'gdp per capita: ' + worldMap.maxGDPPerCapita );
      }
    }
  }

  worldMap.countryDropdownChoices.sort((a, b) => {
    var aName = a.text.toLowerCase();
    var bName = b.text.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
  });

  var stringLoaded = worldMap.countries.length + ' countries loaded (' + globalPointCount + ' points total) from \'' + Config.mapDataFile + '\'';
  if(Config.mergeDataFromMapDataFile2) {
    stringLoaded += ' and \'' + Config.mapDataFile2 + '\'';
  }
  log('Geometry: ' + stringLoaded);

  log('Geometry: visa requirements loaded for ' + numVisaRequirementsFound + ' countries from \'' + Config.visaRequirementsFile + '\'');
  // log('Max number of visa-free destinations: ' + worldMap.maxNumDestinationsFreeOrOnArrival);
  // log('Max number of visa-free sources: ' + worldMap.maxNumSourcesFreeOrOnArrival);
  // log('Total population: ' + worldMap.totalPopulation.formatNumber(0));

  var m = new THREE.Matrix4();
  var m1 = new THREE.Matrix4();
  var m2 = new THREE.Matrix4();
  m1.makeRotationX( Config.globeRotationX );
  m2.makeRotationY( Config.globeRotationY );
  m.multiplyMatrices( m1, m2 );

  for(i = 0; i < worldMap.countries.length; i++) {
    worldMap.countries[i].colorByFreeDestinations = CountryDataHelpers.getCountryColorByFreeDestinations(worldMap.countries[i].numDestinationsFreeOrOnArrival, worldMap.maxNumDestinationsFreeOrOnArrival);
    worldMap.countries[i].colorByFreeSources = CountryDataHelpers.getCountryColorByFreeSources(worldMap.countries[i].numSourcesFreeOrOnArrival, worldMap.maxNumSourcesFreeOrOnArrival);
    worldMap.countries[i].colorByGDP = CountryDataHelpers.getCountryColorByGDP(worldMap.countries[i], worldMap.maxGDP);
    worldMap.countries[i].colorByGDPPerCapita = CountryDataHelpers.getCountryColorByGDPPerCapita(worldMap.countries[i], worldMap.maxGDPPerCapita);
    worldMap.countries[i].colorByPopulation = CountryDataHelpers.getCountryColorByPopulation(worldMap.countries[i], worldMap.maxPopulation);

    if(Config.extrudeEnabled) {
      // create extruded geometry from path Shape:
      worldMap.countries[i].geometry = new THREE.ExtrudeGeometry( worldMap.countries[i].shapes, {
        // amount: Config.extrudeDepth * 10,
        // amount: 0.5 + worldMap.getPopulationRatio(worldMap.countries[i].properties) * 100,
        amount: worldMap.countries[i].numDestinationsFreeOrOnArrival / worldMap.maxNumDestinationsFreeOrOnArrival * 100,
        bevelEnabled: false
      } );
    } else {
      // create flat ShapeGeometry from path Shape:
      worldMap.countries[i].geometry = new THREE.ShapeGeometry( worldMap.countries[i].shapes );
    }


    // subtesselate surface:
    if(Config.tesselationEnabled) {
      var tessellateModifier = new THREE.TessellateModifier( Config.tesselationMaxEdgeLength ); // 2
      for( var n = 0; n < Config.tesselationIterations; n++ ) { // 10
        tessellateModifier.modify( worldMap.countries[i].geometry );
      }
    }

    // 2D Geometry:
    var k;
    worldMap.countries[i].geometry2D = worldMap.countries[i].geometry.clone();
    for(k = 0; k < worldMap.countries[i].geometry2D.vertices.length; k++) {
      worldMap.countries[i].geometry2D.vertices[k].x += Config.mapOffsetX;
      worldMap.countries[i].geometry2D.vertices[k].y = -worldMap.countries[i].geometry2D.vertices[k].y + Config.mapOffsetY;
      // worldMap.countries[i].geometry2D.vertices[k].z += 0;
    }

    worldMap.trianglesNumTotal += worldMap.countries[i].geometry.faces.length;

    // 2D points meshes
    worldMap.countries[i].pointsMesh2D = new THREE.Object3D();
    worldMap.countries[i].center2D = new THREE.Vector3();
    var vertexCount = 0;
    for(var s = 0; s < worldMap.countries[i].shapes.length; s++) {
      var pointsGeometry = worldMap.countries[i].shapes[s].createPointsGeometry();
      for(k = 0; k < pointsGeometry.vertices.length; k++) {
        pointsGeometry.vertices[k].x += Config.mapOffsetX;
        pointsGeometry.vertices[k].y = -pointsGeometry.vertices[k].y + Config.mapOffsetY;
        pointsGeometry.vertices[k].z += 0.2;

        worldMap.countries[i].center2D.add(pointsGeometry.vertices[k]);
        vertexCount++;
      }
      var line = new THREE.Line( pointsGeometry, Config.materialCountryBorder );
      worldMap.countries[i].pointsMesh2D.add(line);
    }
    worldMap.countries[i].center2D.divideScalar(vertexCount);

    CountryDataHelpers.correctCenter(worldMap.countries[i]);

    // 3D Geometry:
    worldMap.countries[i].geometry3D = worldMap.countries[i].geometry.clone();
    for(k = 0; k < worldMap.countries[i].geometry.vertices.length; k++) {
      var spherical = worldMap.geo.projection.invert([worldMap.countries[i].geometry.vertices[k].x, worldMap.countries[i].geometry.vertices[k].y]);
      spherical[0] = THREE.Math.degToRad(spherical[0]);
      spherical[1] = THREE.Math.degToRad(spherical[1]);

      // worldMap.countries[i].geometry3D.vertices[k].x = Config.globeRadius * Math.cos(spherical[0]) * Math.cos(spherical[1]);
      // worldMap.countries[i].geometry3D.vertices[k].y = - Config.globeRadius * Math.sin(spherical[1]);
      // worldMap.countries[i].geometry3D.vertices[k].z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);

      worldMap.countries[i].geometry3D.vertices[k].x = Config.globeRadius * Math.cos(spherical[0]) * Math.cos(spherical[1]);
      worldMap.countries[i].geometry3D.vertices[k].y = -Config.globeRadius * Math.sin(spherical[1]);
      if(worldMap.countries[i].geometry.vertices[k].z < Config.extrudeDepth) {
        worldMap.countries[i].geometry3D.vertices[k].z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);
        // worldMap.countries[i].geometry3D.vertices[k].multiplyScalar(0.5);
      } else {
        worldMap.countries[i].geometry3D.vertices[k].z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);
        worldMap.countries[i].geometry3D.vertices[k].multiplyScalar(1.002);
        if(Config.extrudeEnabled) {
          worldMap.countries[i].geometry3D.vertices[k].multiplyScalar( 1 + worldMap.countries[i].numDestinationsFreeOrOnArrival / worldMap.maxNumDestinationsFreeOrOnArrival * 0.5);
        }
      }
    }
    // rotate and bake transform into vertices:
    worldMap.countries[i].geometry3D.applyMatrix(m);

    worldMap.countries[i].center3D = new THREE.Vector3();
    vertexCount = 0;
    for(k = 0; k < worldMap.countries[i].geometry3D.vertices.length; k++) {
      worldMap.countries[i].center3D.add(worldMap.countries[i].geometry3D.vertices[k]);
      vertexCount++;
    }
    worldMap.countries[i].center3D.divideScalar(vertexCount);

    // worldMap.countries[i].center3D.copy(worldMap.countries[i].center2D);
    spherical = worldMap.geo.projection.invert([worldMap.countries[i].center2D.x - Config.mapOffsetX, -worldMap.countries[i].center2D.y + Config.mapOffsetY]);
    spherical[0] = THREE.Math.degToRad(spherical[0]);
    spherical[1] = THREE.Math.degToRad(spherical[1]);
    worldMap.countries[i].center3D.x = Config.globeRadius * Math.cos(spherical[0]) * Math.cos(spherical[1]);
    worldMap.countries[i].center3D.y = -Config.globeRadius * Math.sin(spherical[1]);
    worldMap.countries[i].center3D.z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);
    worldMap.countries[i].center3D.applyMatrix4(m);


    // 3D points meshes
    worldMap.countries[i].pointsMesh3D = new THREE.Object3D();
    for(s = 0; s < worldMap.countries[i].shapes.length; s++) {
      pointsGeometry = worldMap.countries[i].shapes[s].createPointsGeometry();
      for(k = 0; k < pointsGeometry.vertices.length; k++) {
        spherical = worldMap.geo.projection.invert([pointsGeometry.vertices[k].x, pointsGeometry.vertices[k].y]);

        spherical[0] = THREE.Math.degToRad(spherical[0]);
        spherical[1] = THREE.Math.degToRad(spherical[1]);

        pointsGeometry.vertices[k].x = Config.globeRadius * Math.cos(spherical[0]) * Math.cos(spherical[1]);
        pointsGeometry.vertices[k].y = -Config.globeRadius * Math.sin(spherical[1]);
        pointsGeometry.vertices[k].z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);

        pointsGeometry.vertices[k].multiplyScalar(1.004);

      }

      line = new THREE.Line( pointsGeometry, Config.materialCountryBorder );
      worldMap.countries[i].pointsMesh3D.add(line);
    }
    // rotate and bake transform into vertices:
    worldMap.countries[i].pointsMesh3D.applyMatrix(m);


    worldMap.countries[i].mesh = new THREE.Mesh(worldMap.countries[i].geometry, Config.materialCountryDefault); // worldMap.countries[i].material // worldMap.materialCountryDefault
    worldMap.countries[i].mesh.name = worldMap.countries[i].properties.name_long;
    worldMap.countries[i].mesh.countryObject = worldMap.countries[i];
    if(!Config.usesWebGL) {
      worldMap.countries[i].mesh.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0xFF0000),
        transparent: false,
        wireframe: false,
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
        overdraw: true
      });
    }

    worldMap.countriesObject3D.add(worldMap.countries[i].mesh);

  } // for worldMap.countries.length initial geometry creation end

  if(!Config.usesWebGL) {
    worldMap.scene.add(worldMap.countriesObject3D);
  }

  log('Geometry: ' + worldMap.trianglesNumTotal + ' triangles total');

  var scaleStart = 0.0;
  worldMap.countriesObject3D.scale.set(scaleStart, scaleStart, scaleStart);
  worldMap.countriesObject3D.rotation.y = -Math.PI * 6.0;

  log('Geometry: creating meshes took ' + (Date.now() - start) + ' ms');

};


export function updateCountriesGeometry(worldMap, computeFaceNormals) {
  // log('Geometry.updateCountriesGeometry()');

  var i;
  var k;
  for(i = 0; i < worldMap.countries.length; i++) {
    for(k = 0; k < worldMap.countries[i].geometry.vertices.length; k++) {
      worldMap.countries[i].geometry.vertices[k].copy(worldMap.countries[i].geometry2D.vertices[k]);
      worldMap.countries[i].geometry.vertices[k].mix(worldMap.countries[i].geometry3D.vertices[k], worldMap.animationProps.interpolatePos);
    }
    // worldMap.countries[i].geometry.verticesNeedUpdate = true; // required to update mesh, also for picking to work

    /*
    worldMap.countries[i].geometry.normalsNeedUpdate = true;
    worldMap.countries[i].geometry.uvsNeedUpdate = true;
    worldMap.countries[i].geometry.elementsNeedUpdate = true;
    worldMap.countries[i].geometry.tangentsNeedUpdate = true;
    worldMap.countries[i].geometry.lineDistancesNeedUpdate = true;
    worldMap.countries[i].geometry.colorsNeedUpdate = true;
    worldMap.countries[i].geometry.buffersNeedUpdate = true;
    */

    worldMap.countries[i].geometry.computeBoundingSphere(); // required for picking to work after updating vertices
    if(computeFaceNormals) worldMap.countries[i].geometry.computeFaceNormals(); // required for shading to look correct

  }

  // transform sphere:
  if(worldMap.sphere) {
    for(k = 0; k < worldMap.sphere.geometry.vertices.length; k++) {
      worldMap.sphere.geometry.vertices[k].copy(worldMap.sphereGeometry2D.vertices[k]);
      worldMap.sphere.geometry.vertices[k].mix(worldMap.sphereGeometry3D.vertices[k], worldMap.animationProps.interpolatePos * worldMap.animationProps.interpolatePos);
    }
    worldMap.sphere.geometry.verticesNeedUpdate = true; // required to update mesh

    worldMap.sphere.geometry.computeBoundingSphere(); // required for picking to work after updating vertices
    worldMap.sphere.geometry.computeFaceNormals(); // required for shading to look correct
  }
};


export function createCountriesBufferGeometry(worldMap) {
  worldMap.bufferGeometry = new THREE.BufferGeometry();

  var positions = new Float32Array( worldMap.trianglesNumTotal * 3 * 3 );
  var normals = new Float32Array( worldMap.trianglesNumTotal * 3 * 3 );
  var colors = new Float32Array( worldMap.trianglesNumTotal * 3 * 3 );

  var color = new THREE.Color();
  color.set(Config.colorCountryDefault);

  var index = 0;
  var i, f;
  for(i = 0; i < worldMap.countries.length; i++) {
    var vertices = worldMap.countries[i].geometry.vertices;

    for(f = 0; f < worldMap.countries[i].geometry.faces.length; f++) {
      var face = worldMap.countries[i].geometry.faces[f];

      // positions

      positions[ index ] = vertices[ face.a ].x;
      positions[ index + 1 ] = vertices[ face.a ].y;
      positions[ index + 2 ] = vertices[ face.a ].z;

      positions[ index + 3 ] = vertices[ face.b ].x;
      positions[ index + 4 ] = vertices[ face.b ].y;
      positions[ index + 5 ] = vertices[ face.b ].z;

      positions[ index + 6 ] = vertices[ face.c ].x;
      positions[ index + 7 ] = vertices[ face.c ].y;
      positions[ index + 8 ] = vertices[ face.c ].z;

      // normals

      normals[ index ] = face.normal.x;
      normals[ index + 1 ] = face.normal.y;
      normals[ index + 2 ] = face.normal.z;

      normals[ index + 3 ] = face.normal.x;
      normals[ index + 4 ] = face.normal.y;
      normals[ index + 5 ] = face.normal.z;

      normals[ index + 6 ] = face.normal.x;
      normals[ index + 7 ] = face.normal.y;
      normals[ index + 8 ] = face.normal.z;

      // colors

      colors[ index ] = color.r;
      colors[ index + 1 ] = color.g;
      colors[ index + 2 ] = color.b;

      colors[ index + 3 ] = color.r;
      colors[ index + 4 ] = color.g;
      colors[ index + 5 ] = color.b;

      colors[ index + 6 ] = color.r;
      colors[ index + 7 ] = color.g;
      colors[ index + 8 ] = color.b;

      index += 9;

    }
  } // for worldMap.countries.length buffer geometry creation end

  worldMap.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  worldMap.bufferGeometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
  worldMap.bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

  worldMap.bufferGeometry.verticesNeedUpdate = true;
  worldMap.bufferGeometry.computeBoundingSphere();
  // worldMap.bufferGeometry.computeVertexNormals();

  var mesh = new THREE.Mesh( worldMap.bufferGeometry, Config.materialMap );
  worldMap.scene.add( mesh );

};


export function updateCountriesBufferGeometry(worldMap) {
  // log('Geometry.updateCountriesBufferGeometry()');

  var positions = worldMap.bufferGeometry.getAttribute( 'position' ).array;
  var normals = worldMap.bufferGeometry.getAttribute( 'normal' ).array;
  var colors = worldMap.bufferGeometry.getAttribute( 'color' ).array;

  var m = new THREE.Matrix4();
  var m1 = new THREE.Matrix4();
  var m2 = new THREE.Matrix4();
  m1.makeRotationY( worldMap.countriesObject3D.rotation.y );
  m2.makeScale( worldMap.countriesObject3D.scale.x, worldMap.countriesObject3D.scale.y, worldMap.countriesObject3D.scale.z );
  m.multiplyMatrices( m1, m2 );

  var color = new THREE.Color();
  var v = new THREE.Vector3();

  var index = 0;
  var i, f;
  for(i = 0; i < worldMap.countries.length; i++) {
    var vertices = worldMap.countries[i].geometry.vertices;

    // log( worldMap.countries[i].properties.name_long );
    // log( worldMap.countries[i].visa_required );

    color.set(worldMap.countries[i].color);

    for(f = 0; f < worldMap.countries[i].geometry.faces.length; f++) {
      var face = worldMap.countries[i].geometry.faces[f];

      // positions

      v.copy( vertices[ face.a ] );
      v.applyMatrix4(m);

      positions[ index ] = v.x;
      positions[ index + 1 ] = v.y;
      positions[ index + 2 ] = v.z;

      v.copy( vertices[ face.b ] );
      v.applyMatrix4(m);

      positions[ index + 3 ] = v.x;
      positions[ index + 4 ] = v.y;
      positions[ index + 5 ] = v.z;

      v.copy( vertices[ face.c ] );
      v.applyMatrix4(m);

      positions[ index + 6 ] = v.x;
      positions[ index + 7 ] = v.y;
      positions[ index + 8 ] = v.z;

      // normals

      normals[ index ] = face.normal.x;
      normals[ index + 1 ] = face.normal.y;
      normals[ index + 2 ] = face.normal.z;

      normals[ index + 3 ] = face.normal.x;
      normals[ index + 4 ] = face.normal.y;
      normals[ index + 5 ] = face.normal.z;

      normals[ index + 6 ] = face.normal.x;
      normals[ index + 7 ] = face.normal.y;
      normals[ index + 8 ] = face.normal.z;

      // colors

      colors[ index ] = color.r;
      colors[ index + 1 ] = color.g;
      colors[ index + 2 ] = color.b;

      colors[ index + 3 ] = color.r;
      colors[ index + 4 ] = color.g;
      colors[ index + 5 ] = color.b;

      colors[ index + 6 ] = color.r;
      colors[ index + 7 ] = color.g;
      colors[ index + 8 ] = color.b;

      index += 9;

    }
  } // for worldMap.countries.length buffer geometry update end

  worldMap.bufferGeometry.attributes.position.needsUpdate = true;
  worldMap.bufferGeometry.attributes.normal.needsUpdate = true;
  worldMap.bufferGeometry.attributes.color.needsUpdate = true;

  // worldMap.bufferGeometry.colorsNeedUpdate = true;
  worldMap.bufferGeometry.computeBoundingSphere();
  // worldMap.bufferGeometry.computeVertexNormals();

};


export function updateCountriesBufferGeometryColors(worldMap) {
  // log('Geometry.updateCountriesBufferGeometryColors()');

  var colors = worldMap.bufferGeometry.getAttribute( 'color' ).array;

  var color = new THREE.Color();

  var index = 0;
  var i, f;
  for(i = 0; i < worldMap.countries.length; i++) {
    color.set(worldMap.countries[i].color);

    for(f = 0; f < worldMap.countries[i].geometry.faces.length; f++) {
      colors[ index ] = color.r;
      colors[ index + 1 ] = color.g;
      colors[ index + 2 ] = color.b;

      colors[ index + 3 ] = color.r;
      colors[ index + 4 ] = color.g;
      colors[ index + 5 ] = color.b;

      colors[ index + 6 ] = color.r;
      colors[ index + 7 ] = color.g;
      colors[ index + 8 ] = color.b;

      index += 9;

    }
  } // for worldMap.countries.length buffer geometry update end

  worldMap.bufferGeometry.attributes.color.needsUpdate = true;

};


export function createSphere(worldMap) {
  worldMap.sphere = new THREE.Mesh( new THREE.PlaneGeometry( 700, 700, 24, 96 ), Config.materialSphere );
  worldMap.sphere.name = 'sphere';
  worldMap.scene.add( worldMap.sphere );
  worldMap.sphere.visible = Config.sphereVisible;

  worldMap.sphereGeometry2D = worldMap.sphere.geometry.clone();
  var k;
  for(k = 0; k < worldMap.sphereGeometry2D.vertices.length; k++) {
    worldMap.sphereGeometry2D.vertices[k].x -= 20;
    worldMap.sphereGeometry2D.vertices[k].y -= 90;
    worldMap.sphereGeometry2D.vertices[k].z -= Config.extrudeDepth * 2.0;
  }

  worldMap.sphereGeometry3D = worldMap.sphere.geometry.clone();

  for(k = 0; k < worldMap.sphere.geometry.vertices.length; k++) {
    var spherical = worldMap.geo.projection.invert([ -worldMap.sphere.geometry.vertices[k].x, worldMap.sphere.geometry.vertices[k].y * 2.0 + 250 ]); //  * 2.0 + 260

    spherical[0] = THREE.Math.degToRad(spherical[0]);
    spherical[1] = THREE.Math.degToRad(spherical[1]);

    worldMap.sphereGeometry3D.vertices[k].x = (Config.globeRadius - 1) * Math.cos(spherical[0]) * Math.cos(spherical[1]);
    worldMap.sphereGeometry3D.vertices[k].y = -(Config.globeRadius - 1) * Math.sin(spherical[1]);
    worldMap.sphereGeometry3D.vertices[k].z = (Config.globeRadius - 1) * Math.sin(spherical[0]) * Math.cos(spherical[1]);

    /*
    if(worldMap.sphereGeometry3D.vertices[k].z < 0.0) {
      worldMap.sphereGeometry3D.vertices[k].z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);
      //worldMap.sphereGeometry3D.vertices[k].multiplyScalar(0.5);
    } else {
      worldMap.sphereGeometry3D.vertices[k].z = Config.globeRadius * Math.sin(spherical[0]) * Math.cos(spherical[1]);
      //worldMap.sphereGeometry3D.vertices[k].multiplyScalar(1.04);
    }
    */

  }
  // rotate and bake transform into vertices:
  var m = new THREE.Matrix4();
  m.makeRotationX( THREE.Math.degToRad(45) );
  worldMap.sphereGeometry3D.applyMatrix(m);

};


export function getIntersects(worldMap, mouse) {
  var vector = new THREE.Vector3();
  vector.copy(mouse);
  vector.unproject( worldMap.camera );

  worldMap.raycaster.set( worldMap.camera.position, vector.sub( worldMap.camera.position ).normalize() );

  var intersects = worldMap.raycaster.intersectObjects( worldMap.countriesObject3D.children );
  intersects.sort( function( a, b ) { return a.distance - b.distance; } );

  return intersects;
};


export function createLines(worldMap) {
  // log('Geometry.createLines()');

  if(worldMap.mode !== 'destinations' && worldMap.mode !== 'sources') {
    return;
  }

  if(worldMap.selectedCountry || worldMap.selectedDestinationCountry) {
    var points2D;
    var points3D;
    var line;
    var c;

    deleteLinesObject(worldMap);

    worldMap.linesObject = new THREE.Object3D();
    worldMap.scene.add(worldMap.linesObject);

    if(worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
      points2D = [];
      points3D = [];

      if(worldMap.mode === 'destinations') {
        points2D.push( worldMap.selectedCountry.center2D );
        points2D.push( worldMap.selectedDestinationCountry.center2D );

        points3D.push( worldMap.selectedCountry.center3D );
        points3D.push( worldMap.selectedDestinationCountry.center3D );
      } else {
        points2D.push( worldMap.selectedDestinationCountry.center2D );
        points2D.push( worldMap.selectedCountry.center2D );

        points3D.push( worldMap.selectedDestinationCountry.center3D );
        points3D.push( worldMap.selectedCountry.center3D );
      }

      worldMap.selectedDestinationCountry.spline2D = new THREE.Spline( points2D );
      worldMap.selectedDestinationCountry.spline3D = new THREE.Spline( points3D );

      worldMap.selectedDestinationCountry.splineLength = points2D[0].distanceTo(points2D[1]);
      worldMap.selectedDestinationCountry.splineHeight = worldMap.selectedDestinationCountry.splineLength * 0.25;
      worldMap.selectedDestinationCountry.geometrySpline = new THREE.Geometry();

      line = new THREE.Line( worldMap.selectedDestinationCountry.geometrySpline, getLineMaterial(worldMap.selectedDestinationCountry), THREE.LineStrip );
      worldMap.linesObject.add(line);

    } else if(worldMap.selectedCountry && !worldMap.selectedDestinationCountry) {
      if(worldMap.mode === 'destinations') {
        for(c = 0; c < worldMap.countries.length; c++) {
          if(worldMap.countries[c].visa_required === 'no' || worldMap.countries[c].visa_required === 'on-arrival' || worldMap.countries[c].visa_required === 'free-eu') {
            points2D = [];
            points2D.push( worldMap.selectedCountry.center2D );
            points2D.push( worldMap.countries[c].center2D );
            worldMap.countries[c].spline2D = new THREE.Spline( points2D );

            points3D = [];
            points3D.push( worldMap.selectedCountry.center3D );
            points3D.push( worldMap.countries[c].center3D );
            worldMap.countries[c].spline3D = new THREE.Spline( points3D );

            worldMap.countries[c].splineLength = points2D[0].distanceTo(points2D[1]);
            worldMap.countries[c].splineHeight = worldMap.countries[c].splineLength * 0.25;
            worldMap.countries[c].geometrySpline = new THREE.Geometry();

            line = new THREE.Line( worldMap.countries[c].geometrySpline, getLineMaterial(worldMap.countries[c]), THREE.LineStrip );
            worldMap.linesObject.add(line);
          }
        }
      }

    } else if(!worldMap.selectedCountry && worldMap.selectedDestinationCountry) {
      if(worldMap.mode === 'sources') {
        for(c = 0; c < worldMap.countries.length; c++) {
          if(worldMap.countries[c].visa_required === 'no' || worldMap.countries[c].visa_required === 'on-arrival' || worldMap.countries[c].visa_required === 'free-eu') {
            points2D = [];
            points2D.push( worldMap.selectedDestinationCountry.center2D );
            points2D.push( worldMap.countries[c].center2D );
            worldMap.countries[c].spline2D = new THREE.Spline( points2D );

            points3D = [];
            points3D.push( worldMap.selectedDestinationCountry.center3D );
            points3D.push( worldMap.countries[c].center3D );
            worldMap.countries[c].spline3D = new THREE.Spline( points3D );

            worldMap.countries[c].splineLength = points2D[0].distanceTo(points2D[1]);
            worldMap.countries[c].splineHeight = worldMap.countries[c].splineLength * 0.25;
            worldMap.countries[c].geometrySpline = new THREE.Geometry();

            line = new THREE.Line( worldMap.countries[c].geometrySpline, getLineMaterial(worldMap.countries[c]), THREE.LineStrip );
            worldMap.linesObject.add(line);
          }
        }
      }
    }

    worldMap.animationProps.lineAnimatePos = 0;
    worldMap.animationProps.lineAnimateOffset = 0;

    worldMap.tweenLines = new TWEEN.Tween(worldMap.animationProps)
      .to({lineAnimatePos: 1}, Config.lineAnimateDuration)
      .onStart(function() {
      })
      .onUpdate(function(time) {
        // worldMap.updateLines(time);
      })
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();
  }

};


export function updateLines(worldMap) {
  // log('Geometry.updateLines()');

  worldMap.animationProps.lineAnimateOffset += Config.lineAnimateSpeed * worldMap.clock.getDelta();
  worldMap.animationProps.lineAnimateOffset %= Config.lineDashOffsetLimit;

  if(worldMap.selectedCountry || worldMap.selectedDestinationCountry) {

    for(var c = 0; c < worldMap.countries.length; c++) {
      var offset = worldMap.animationProps.lineAnimateOffset / worldMap.countries[c].splineLength;

      // if(worldMap.countries[c].visa_required === 'no' || worldMap.countries[c].visa_required === 'on-arrival' || worldMap.countries[c].visa_required === 'free-eu') {
      if(worldMap.countries[c].geometrySpline) {
        var subdivisions = 30;
        for(var i = 0; i < subdivisions; i++) {
          var index;
          index = i / subdivisions * worldMap.animationProps.lineAnimatePos;
          index += offset;
          if(worldMap.mode === 'sources') {
            index = 1 - index;
          }
          index = Math.min(index, 1);
          index = Math.max(index, 0);

          var position2D = worldMap.countries[c].spline2D.getPoint( index );
          var position3D = worldMap.countries[c].spline3D.getPoint( index );

          var z = 0;

          if(index < 0.5) {
            z = TWEEN.Easing.Sinusoidal.Out( index * 2 ) * worldMap.countries[c].splineHeight;
          } else {
            z = TWEEN.Easing.Sinusoidal.Out( 1 - (index - 0.5) * 2 ) * worldMap.countries[c].splineHeight;
          }

          worldMap.countries[c].geometrySpline.vertices[ i ] = new THREE.Vector3( position2D.x, position2D.y, position2D.z );
          worldMap.countries[c].geometrySpline.vertices[ i ].z += z;

          var v3D = new THREE.Vector3( position3D.x, position3D.y, position3D.z );
          v3D.setLength(Config.globeRadius + z);

          worldMap.countries[c].geometrySpline.vertices[ i ].lerp(v3D, worldMap.animationProps.interpolatePos);

        }
        worldMap.countries[c].geometrySpline.verticesNeedUpdate = true;
        worldMap.countries[c].geometrySpline.lineDistancesNeedUpdate = true;
        worldMap.countries[c].geometrySpline.computeLineDistances();
      }
    }
  }
};


export function deleteLinesObject(worldMap) {
  // log('Geometry.deleteLinesObject()');

  if(worldMap.linesObject) {
    worldMap.scene.remove(worldMap.linesObject);
    worldMap.linesObject = null;
  }
};


function getLineMaterial(country) {
  var material = Config.materialLineDefault;
  if(country.visa_required === 'no') {
    material = Config.materialLineVisaNotRequired;
  } else if(country.visa_required === 'on-arrival') {
    material = Config.materialLineVisaOnArrival;
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


export function toScreenXY(camera, pos3D) {
  var v = pos3D.project( camera );
  var percX = (v.x + 1) / 2;
  var percY = (-v.y + 1) / 2;

  var left = percX * window.innerWidth;
  var top = percY * window.innerHeight;

  return new THREE.Vector2(left, top);
};


