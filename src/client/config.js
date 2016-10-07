import * as THREE from 'three';
import Detector from './three/Detector';

const version = '1.2';
const cdnURL = 'http://cdn.markuslerner.com/travelscope/'; // 'http://cdn.markuslerner.com/travelscope/'



const config = {
  usesWebGL: Detector.webgl,
  isTouchDevice: ('ontouchstart' in document.documentElement),
  isMac: navigator.platform.toUpperCase().indexOf('MAC') >= 0,

  logTerminalVisible: false,
  statsVisible: false,

  rendererContainer: '#container',

  // mapDataFile: 'data/all_countries.json',
  // 'all_countries.json', 'all_sovereignties.json'
  // 'ne_50m_admin_0_sovereignty_simplified.json', 'ne_110m_admin_0_sovereignty_simplified.json'
  // 'ne_50m_admin_0_countries_simplified.json', 'ne_110m_admin_0_countries_simplified'
  mapDataFile: IS_DESKTOP && Detector.webgl
    ? cdnURL + 'data/ne_50m_admin_0_countries_simplified.json?v=' + version
    : cdnURL + 'data/all_countries.json?v=' + version,

  // visaRequirementsFile: '/data/visa_requirements.json',
  visaRequirementsFile: cdnURL + VISA_REQUIREMENTS_URL,

  mergeDataFromMapDataFile2: false,
  mapDataFile2: '/data/ne_50m_admin_0_countries_simplified.json', // merge into: ne_110m_admin_0_countries_simplified
  saveMapData: false,
  mergedCountriesFilename: '/data/all_countries.json',

  introRotateDuration: 4000, // 4000
  introWarpDelay: 2000, // 2000
  introWarpDuration: 2500, // 2500

  lineAnimateDuration: 800,
  lineAnimateSpeed: 10.0,
  lineDashOffsetLimit: 5.3,

  updateColorsDuration: 800,

  sourceCountryDefaultText: 'Source country',
  destinationCountryDefaultText: 'Destination country',

  viewSwitchDuration: 800,

  geoScale: 150, // 115
  mapOffsetX: -540, // -500
  mapOffsetY: 200, // 160
  globeRadius: 180,
  globeRotationX: -2.25,
  globeRotationY: 1.7,

  extrudeEnabled: false,
  extrudeDepth: 0.05,

  tesselationEnabled: false,
  tesselationMaxEdgeLength: 5,
  tesselationIterations: 8,

  cameraFOV: 60.0,
  cameraDistance: 500.0,
  cameraDistanceMin2D: 50.0,
  cameraDistanceMin: 250.0,
  cameraDistanceMax: 1000.0,

  sphereEnabled: false,
  sphereVisible: false,

  colorCountryDefault: new THREE.Color(0x777777),
  colorCountryHover: new THREE.Color(0xFFFFFF),
  colorCountrySelected: new THREE.Color(0xFFFFFF),

  colorVisaNotRequired: new THREE.Color(0x6b7e00), // 0xb7c801
  colorVisaOnArrival: new THREE.Color(0xb3c400), // 0xfff000
  colorVisaETA: new THREE.Color(0xfcff00), // 0xff9000
  colorVisaFreeEU: new THREE.Color(0x0055FF), // 0x0055FF
  colorVisaRequired: new THREE.Color(0x777777), // 0xFF0000
  colorVisaSpecial: new THREE.Color(0xa52c6d), // 0xff9000
  colorVisaAdmissionRefused: new THREE.Color(0xaa0000), //
  colorVisaDataNotAvailable: new THREE.Color(0x444444), // 0xFF00FF

  colorZeroDestinations: new THREE.Color(0x242e1d), // 0x65bddd (blue), 0xffde00 (orange), 0x54ff00 (green), 0xffffff, 0xffffcc (yellow), 0x3c2062 (purple), 0x305c00 green
  colorMaxDestinations: new THREE.Color(0xdfeb06), // 0x0035cc (blue), 0xcc0000 (red), 0x555555, 0xffe26c (yellow 2), 0xf2ff00 (yellow 3)

  materialSphere: new THREE.MeshPhongMaterial({ color: 0x888888, transparent: false, opacity: 1.0, wireframe: false, shading: THREE.SmoothShading, side: THREE.DoubleSide }),

  materialMap: new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0xFFFFFF, shininess: 5, transparent: true, opacity: 0.9, side: THREE.DoubleSide, vertexColors: THREE.VertexColors } )

};


// only for non-BufferedGeometries:
config.materialCountryDefault = new THREE.MeshPhongMaterial({ color: config.colorCountryDefault, transparent: false, wireframe: false, shading: THREE.SmoothShading, side: THREE.DoubleSide });

config.materialCountryBorder = new THREE.LineBasicMaterial( { color: 0xFFFFFF, linewidth: 1.5 } );
config.materialLineDefault = new THREE.LineDashedMaterial( { color: config.colorCountryDefault, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaNotRequired = new THREE.LineDashedMaterial( { color: config.colorVisaNotRequired, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaOnArrival = new THREE.LineDashedMaterial( { color: config.colorVisaOnArrival, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaETA = new THREE.LineDashedMaterial( { color: config.colorVisaETA, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaFreeEU = new THREE.LineDashedMaterial( { color: config.colorVisaFreeEU, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaRequired = new THREE.LineDashedMaterial( { color: config.colorVisaRequired, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaSpecial = new THREE.LineDashedMaterial( { color: config.colorVisaSpecial, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaAdmissionRefused = new THREE.LineDashedMaterial( { color: config.colorVisaAdmissionRefused, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
config.materialLineVisaDataNotAvailable = new THREE.LineDashedMaterial( { color: config.colorVisaDataNotAvailable, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending


export default config;
