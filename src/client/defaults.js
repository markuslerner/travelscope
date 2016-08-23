import * as THREE from 'three';
import Detector from './three/Detector';



function Defaults() {
  this.supportsWebGL = Detector.webgl;

  this.traceVisible = false;
  this.statsVisible = false;

  this.mapDataFile = 'data/all_countries.json';
  // 'all_countries.json', 'all_sovereignties.json'
  // 'ne_50m_admin_0_sovereignty_simplified.json', 'ne_110m_admin_0_sovereignty_simplified.json'
  // 'ne_50m_admin_0_countries_simplified.json', 'ne_110m_admin_0_countries_simplified'

  this.visaRequirementsFile = '/data/visa_requirements.json';

  this.mergeDataFromMapDataFile2 = false;
  this.mapDataFile2 = '/data/ne_50m_admin_0_countries_simplified.json'; // merge into: ne_110m_admin_0_countries_simplified
  this.saveMapData = false;
  this.mergedCountriesFilename = '/data/all_countries.json';

  this.introRotateDuration = 4000; // 4000, 100
  this.introWarpDelay = 2000; // 2000, 500
  this.introWarpDuration = 2500; // 2500, 100

  this.interpolatePos = 0.0;

  this.lineAnimateDuration = 800;
  this.lineAnimateSpeed = 10.0;
  this.lineAnimatePos = 0.0;
  this.lineAnimateOffset = 0.0;

  this.updateColorsDuration = 800;

  this.sourceCountryDefaultText = 'Source country';
  this.destinationCountryDefaultText = 'Destination country';

  this.viewSwitchDuration = 800;

  this.geoScale = 150; // 115
  this.mapOffsetX = -540; // -500
  this.mapOffsetY = 200; // 160
  this.globeRadius = 180;
  this.globeRotationX = -2.25;
  this.globeRotationY = 1.7;

  this.extrudeEnabled = false;
  this.extrudeDepth = 0.05;

  this.tesselationEnabled = false;
  this.tesselationMaxEdgeLength = 5;
  this.tesselationIterations = 8;

  this.cameraFOV = 60.0;
  this.cameraDistance = 500.0;
  this.cameraDistanceMin2D = 50.0;
  this.cameraDistanceMin = 250.0;
  this.cameraDistanceMax = 1000.0;

  this.sphereEnabled = false;
  this.sphereVisible = false;
  this.sphereOpacity = 1.0;

  this.colorChangeID = 0;

  this.colorCountryDefault = new THREE.Color(0x777777);
  this.colorCountryHover = new THREE.Color(0xFFFFFF);
  this.colorCountrySelected = new THREE.Color(0xFFFFFF);

  this.colorVisaNotRequired = new THREE.Color(0xb7c801); // 0x73c400
  this.colorVisaOnArrival = new THREE.Color(0xfff000); // 0xfff000
  this.colorVisaFreeEU = new THREE.Color(0x0055FF); // 0x0055FF
  this.colorVisaRequired = new THREE.Color(this.colorCountryDefault); // 0xFF0000
  this.colorVisaSpecial = new THREE.Color(0xff7200); // 0xff9000
  this.colorVisaAdmissionRefused = new THREE.Color(0xaa0000); //
  this.colorVisaDataNotAvailable = new THREE.Color(0x444444); // 0xFF00FF

  this.colorZeroDestinations = new THREE.Color(0x242e1d); // 0x65bddd (blue), 0xffde00 (orange), 0x54ff00 (green), 0xffffff, 0xffffcc (yellow), 0x3c2062 (purple), 0x305c00 green
  this.colorMaxDestinations = new THREE.Color(0xdfeb06); // 0x0035cc (blue), 0xcc0000 (red), 0x555555, 0xffe26c (yellow 2), 0xf2ff00 (yellow 3)

  this.materialSphere = new THREE.MeshPhongMaterial({ color: 0x888888, transparent: false, opacity: this.sphereOpacity, wireframe: false, shading: THREE.SmoothShading, side: THREE.DoubleSide });

  this.mapMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, specular: 0xFFFFFF, shininess: 5, transparent: true, opacity: 0.9, side: THREE.DoubleSide, vertexColors: THREE.VertexColors } );
  // this.mapMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.9, side: THREE.DoubleSide, vertexColors: THREE.VertexColors } );

  // only for non-BufferedGeometries:
  this.materialCountryDefault = new THREE.MeshPhongMaterial({ color: this.colorCountryDefault.getHex(), transparent: false, wireframe: false, shading: THREE.SmoothShading, side: THREE.DoubleSide });

  this.materialCountryBorder = new THREE.LineBasicMaterial( { color: 0xFFFFFF, linewidth: 1.5 } );
  this.materialLineDefault = new THREE.LineDashedMaterial( { color: this.colorCountryDefault, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaNotRequired = new THREE.LineDashedMaterial( { color: this.colorVisaNotRequired, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaOnArrival = new THREE.LineDashedMaterial( { color: this.colorVisaOnArrival, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaFreeEU = new THREE.LineDashedMaterial( { color: this.colorVisaFreeEU, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaRequired = new THREE.LineDashedMaterial( { color: this.colorVisaRequired, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaSpecial = new THREE.LineDashedMaterial( { color: this.colorVisaSpecial, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaAdmissionRefused = new THREE.LineDashedMaterial( { color: this.colorVisaAdmissionRefused, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending
  this.materialLineVisaDataNotAvailable = new THREE.LineDashedMaterial( { color: this.colorVisaDataNotAvailable, linewidth: 1.2, dashSize: 3, gapSize: 2, opacity: 0.5, transparent: true } ); // blending: THREE.AdditiveBlending

  this.lineDashOffsetLimit = 5.3;

}

export default Defaults;
