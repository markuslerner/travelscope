<?php
  // error_reporting(E_ALL);

  $brand = "Travelscope";
	$title = $brand . " – Interactive worldmap of visa-free travel – A Chrome Experiment";
	$description = "A visual exploration of the travel freedom attached to passports";
  $visa_requirements_folder = "data/visa_requirements";


  require __DIR__ . '/../vendor/autoload.php';
  $dotenv = new Dotenv\Dotenv(__DIR__ . '/../');
  $dotenv->load();

  define('URL', getenv('URL'));
	define('CDN_URL', getenv('CDN_URL'));

  $package = file_get_contents('../package.json');
  $package = json_decode($package, true);
	define('VERSION', $package['version']);

	$detect = new Mobile_Detect;
	$isDesktop = !$detect->isMobile() && !$detect->isTablet();

	// get most recent visa requirements filename:
	function getLatestVisaRequirementsFilename($path) {
		$latest_ctime = 0;
		$latest_filename = '';
		$d = dir($path);
		while (false !== ($entry = $d->read())) {
		  $filepath = "{$path}/{$entry}";
		  // could do also other checks than just checking whether the entry is a file
		  if (is_file($filepath) && filectime($filepath) > $latest_ctime) {
		    $latest_ctime = filectime($filepath);
		    $latest_filename = $entry;
		  }
		}
		return [$latest_ctime, $latest_filename];
	}

	$data = getLatestVisaRequirementsFilename($visa_requirements_folder);
	$latest_visa_requirements_filename = $visa_requirements_folder . "/" . $data[1];

?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?=$title?></title>

    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  	<meta http-equiv="expires" content="0" />
  	<meta http-equiv="Content-Language" content="en" />

  	<meta name="description" content="<?=$description?>" />
  	<meta name="keywords" content="travel, scope, power, passport, pass, reisepass, visa, visa-free, country, world, freedom, movement" />

  	<meta name="language" content="english, en" />
  	<meta name="revisit-after" content="1 day" />

  	<meta name="robots" content="index, follow" />

  	<meta http-equiv="X-UA-Compatible" content="chrome=1">

  	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
  	<meta name="apple-mobile-web-app-capable" content="yes">
  	<meta name="apple-mobile-web-app-status-bar-style" content="black">

  	<meta property="og:site_name" content="<?=$brand?>" />
  	<meta property="og:description" content="<?=$title?>" />
  	<meta property="og:type" content="website" />
  	<meta property="og:image" content="//cdn.markuslerner.com/wordpress/wp-content/uploads/2016/04/travelscope_4k_1_cropped-640x400@2x.png" />

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script>
      (function(){
        var ef = function(){};
        window.console = window.console || {log:ef,warn:ef,error:ef,dir:ef};
      }());
    </script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-sham.js"></script>
    <script src="//oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link rel="canonical" href="<?=URL?>" />

    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
  	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />

    <link rel="preload" href="//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,600,400" as="style" />
    <link rel="preload" href="<?=CDN_URL?>assets/fonts/fonts.css?v=<?=VERSION?>" as="style" />
    <link rel="preload" href="<?=CDN_URL?>css/main.css?v=<?=VERSION?>" as="style" />

    <link rel="preload" href="<?=CDN_URL?>js/client.js?v=<?=VERSION?>" as="script" />

    <link rel='stylesheet' type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,600,400" />
    <link rel="stylesheet" type="text/css" href="<?=CDN_URL?>assets/fonts/fonts.css?v=<?=VERSION?>" />
    <link rel="stylesheet" type="text/css" href="<?=CDN_URL?>css/main.css?v=<?=VERSION?>" />

    <script language="JavaScript" type="text/javascript">
      var IS_DESKTOP = <? echo $isDesktop ? 'true' : 'false'; ?>;
      var CDN_URL = '<?=CDN_URL?>';
      var VISA_REQUIREMENTS_URL = '<?=$latest_visa_requirements_filename;?>';
    </script>

    <script type="text/javascript" src="<?=CDN_URL?>js/client.js?v=<?=VERSION?>"></script>

  </head>

  <body scroll="no">

	<div id="background"></div>

  <div id="container"></div>

	<nav class="navbar navbar-default navbar-fixed-top">
	  <div class="container-fluid">
		<div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>

			<h1>
				<a class="navbar-brand" href="#"><?=$brand?></a>
			</h1>
		</div><!-- /.navbar-header -->

		<!-- Collect the nav links, forms, and other content for toggling -->
		<div id="navbar" class="navbar-collapse collapse">
			<ul class="nav navbar-nav">

			<li id="country_dropdown_container" class="country_dropdown_container">
				<form action="#" autocomplete="off">
					<input type="text" name="country_dropdown" id="country_dropdown" class="country_dropdown" autocomplete="off" disabled />
					<span class="glyphicon glyphicon-search"></span>
					<span class="cancel"></span>
				</form>
			</li>

			<div id="arrow_right" class="glyphicon glyphicon-arrow-right"></div>

			<li id="destination_country_dropdown_container" class="country_dropdown_container">
				<form action="#" autocomplete="off">
					<input type="text" name="destination_country_dropdown" id="destination_country_dropdown" class="country_dropdown" autocomplete="off" disabled />
					<span class="glyphicon glyphicon-search"></span>
					<span class="cancel"></span>
				</form>
			</li>

			<li id="map_mode" class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
					 <span class="mode">Mode: </span><span data-bind="label" class="dropdown-label"> Visa-free destinations</span>&nbsp;<span class="caret"></span>
				</a>
				 <ul class="dropdown-menu" role="menu">
				   <li><a href="#" class="mode" data-mode="destinations">Visa-free destinations</a></li>
				   <li><a href="#" class="mode" data-mode="sources">Visa-free sources</a></li>
				   <li><a href="#" class="mode" data-mode="gdp">GDP</a></li>
				   <li><a href="#" class="mode" data-mode="gdp-per-capita">GDP per Capita</a></li>
				   <li><a href="#" class="mode" data-mode="population">Population</a></li>
				 </ul>
			</li>

			<li class="divider"></li>

			</ul>

			<ul class="nav navbar-nav navbar-right">
				<li><a href="#" id="button_about">About</a></li>

				<li><a href="#" id="button_disclaimer">Disclaimer</a></li>

				<li id="logo_ml">
					<a href="https://www.markuslerner.com/" target="_blank">
						<span class="text">Concept/development:</span>
						<img alt="Markus Lerner Design" src="assets/img/ml-white.svg"/>
					</a>
				</li>
			</ul>

		</div><!-- /.navbar-collapse -->

	  </div><!-- /.container-fluid -->
	</nav>

	<div id="top-overlay">
		<div class="background"></div>
		<h2 id="travelscope"></h2>
	</div>

	<button type="button" id="button_country_list" class="btn btn-default btn-sm" title="Toggle country list"><span class="title">Countries</span><span class="caret"></span></button>

	<div class="slider" id="slider_zoom" title="Zoom"></div>

	<div id="view_switch" class="btn-group">
		<button type="button" id="view_switch_flat" class="btn btn-default active" title="Flat view"><span class="icon-worldmap-flat"></span> </button>
		<button type="button" id="view_switch_spherical" class="btn btn-default" title="Spherical view"><span class="glyphicon glyphicon-globe"></span> </button>
	</div>


	<div id="legend_main" class="legend">
		<div class="range">
			<div class="box"></div>
			<div class="min"></div>
			<div class="rangelabel"></div>
			<div class="max"></div>
		</div>
		<div class="colors"></div>
	</div>

	<div id="legend_selected" class="legend">
		<div class="colors"></div>
	</div>

	<div id="country-tooltip">
		<div class="title"></div>
		<div class="details"></div>
	</div>

	<div id="about" class="panel">
		<h2 class="title">About</h2>
		<div class="panel-close"></div>
		<div class="inside">
			<div class="details">
				<div class="section">
					<h3>Idea</h3>
					<p>
					The weight and the travel freedom attached to a passport vary drastically across nationalities. International visa-regulations are very complex and often non-transparent. They reflect the economical and geopolitical situations as well as the relationships of countries.
					</p>
					<p>
					This project aims to cast some light on these structures. The default <i>Visa-free destinations</i> mode shows a <a href="https://en.wikipedia.org/wiki/Choropleth_map" target=“_blank”>choropleth map</a>, which is shaded based on the number of destination countries/territories an individual of a certain nationality can travel to without a visa or with visa on arrival.
					</p>
					<p>
					In order to display the visa regulations for a certain nationality, the source country/territory can be intuitively selected by clicking/tapping the map, via the live search field or by choosing it from the country list. In the <i>Visa-free sources</i> mode, you can alternatively explore the number of countries/territories whose nationals can enter a specific country without a visa or with visa on arrival. The <i>GDP</i> and <i>population</i> modes are added for reference. Other modes can be implemented in the future.
					</p>
					<p>
					For certain passport holders like certain special <a href="https://www.gov.uk/types-of-british-nationality/overview" target=“_blank”>types of british nationalities</a> it can be more complicated. For this visualization, some simplifications had to be made, ie. only the most common citizenships are used as a data reference.
					</p>
				</div>

				<div class="section">
					<h3>Source Code</h3>
					<p>
						The source code of this project is available on GitHub: <a href="https://github.com/markuslerner/travelscope" target="_blank">https://github.com/markuslerner/travelscope</a>
           				<br/><br/>
            			When I started coding in 2014, I used jQuery and jquery-UI for all the interactions and UI updates. Nowadays I would rather use a libray like <a href="https://facebook.github.io/react/" target="_blank">React</a> for that.
					</p>
				</div>

				<div class="section">
					<h3>News</h3>
					<p>
						<small>16 July 2018</small><br/>
						Disputed areas from <a href="http://www.naturalearthdata.com/" target="_blank">Natural Earth Data</a> are now integrated to highlight unrevolved conflicts.
					</p>
					<p>
						<small>29 August 2016</small><br/>
						Upon many requests, I decided to publish the source code if this project on GitHub: <a href="https://github.com/markuslerner/travelscope" target="_blank">https://github.com/markuslerner/travelscope</a>
					</p>
          <p>
            <small>5 April 2016</small><br/>
            Travelscope just got selected as an Official Honoree at <a href="https://pv.webbyawards.com/2016/websites/general-website/netart/honorees" target="_new">The 20th Annual Webby Awards</a> in the Web: NetArt category.
          </p>
					<p>
						<small>5 Oct 2015</small><br/>
						Canvas mode for browsers that don't support WebGL is now supported.
					</p>
					<p>
						<small>4 Oct 2015</small><br/>
						The flat map now uses the <a href="https://en.wikipedia.org/wiki/Robinson_projection" target=“_blank”>Robinson projection</a>, which is more appropriate for <a href="https://en.wikipedia.org/wiki/Choropleth_map" target=“_blank”>choropleth maps</a>. Thanks to <a href="https://twitter.com/zerglingone">Zorko Sostaric</a> for the suggestion.
					</p>
					<p>
						<small>5 May 2015</small><br/>
						Travelscope is now featured at <a href="https://www.chromeexperiments.com/experiment/travelscope" target=“_blank”>Chrome Experiments</a>.
					</p>
					<p>
						<small>12 March 2015</small><br/>
						Lauch of the first version of Travelscope.
					</p>
				</div>


				<div class="section">
					<h3>Design &amp; technology</h3>
					<p>
					This single page web application features a responsive design which works across browsers, platforms and screen sizes. Since WebGL is now supported by iOS, it performs well on recent iOS devices running iOS 8+. Recent Android versions are also supported.
					</p>
					<p>
					One of the main goals was to be able to render the map in real-time, so that live transformations (spherical to flat) are possible. To achieve this, the powerful <a href="http://threejs.org/" target="_blank">Three.js</a> library and its WebGLRenderer are used for display of the map. To keep the map reponsive and save computing power, the map is created as one large BufferGeometry object. The map data are sourced from <a href="http://www.naturalearthdata.com/" target="_blank">Natural Earth Data</a>, then <a href="http://converter.mygeodata.eu/" target="_blank">converted to Geo JSON format</a> and <a href="http://www.mapshaper.org/" target="_blank">simplified</a> to reduce it's complexity. It is loaded with <a href="http://d3js.org/" target="_blank">D3.js</a> and then transformed to be used in Three.js.
					</p>
				</div>


				<div class="section">
					<h3>Data sources</h3>
					<p>
					Map, GDP and population data: <a href="http://www.naturalearthdata.com/" target="_blank">Natural Earth Data</a>, <a href="http://converter.mygeodata.eu/" target="_blank">converted to Geo JSON format</a> and then <a href="http://www.mapshaper.org/" target="_blank">simplified</a>.
					</p>
					<p>
					Visa requirements: <a href="http://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality" target="_new">Wikipedia</a>
					</p>
				</div>


				<div class="section">
					<h3>Credits</h3>
					<p>
					Powered by: <a href="http://threejs.org/" target="_blank">Three.js</a>,
	<a href="http://d3js.org/" target="_blank">D3.js</a>,
  <a href="https://github.com/asutherland/d3-threeD" target="_blank">d3.js hooked up to three.js</a>,
	<a href="https://github.com/ftorghele/worldMap" target="_blank">D3 world map in Three.js (Franz Torghele)</a>,
	<a href="http://getbootstrap.com/" target="_blank">Bootstrap</a>,
	<a href="http://jquery.com/" target="_blank">jQuery</a>,
	<a href="https://github.com/tweenjs/tween.js" target="_blank">tween.js</a>,
	<a href="http://www.google.com/fonts" target="_blank">Google Webfonts</a> (<a href="http://www.google.com/fonts/specimen/Open+Sans" target="_blank">Open Sans</a>),
	<a href="https://github.com/immense/immybox" target="_blank">Immybox</a>,
	<a href="http://onehackoranother.com/projects/jquery/tipsy/" target="_blank">Tipsy</a>
					</p>

					<p>
					Concept, design &amp; coding: <a href="https://www.markuslerner.com/" target="_blank">Markus Lerner</a>
					</p>

					<p>
					Feedback: <script type="text/javascript"><!--
	var rsypgei = ['m','=','p','r','e','c','l','t','a','"','s','s','e','c','t','s','.','a','r','@','o','r','e','a','k','e','m','s','m','c',' ','m','l','u','e','@','l','e','"','s','u','o','a','n','l',' ','<','c','v','m','a','l','p','e','m','s','/','.','c','r','n','>','a','r','=','<','e','o','>','f','e','"','v','r','a','l','t','r','a','k','e','a','o','o','r','l','"','i',':','h','i','r'];var bfhbexp = [28,7,25,61,64,46,78,60,10,8,49,66,20,41,13,50,84,29,17,27,42,36,79,18,31,70,43,22,87,67,2,72,47,76,82,71,34,35,44,77,32,86,90,37,21,45,88,23,19,9,1,12,69,5,54,33,89,40,85,80,81,59,62,83,51,0,38,14,91,6,26,52,63,39,73,65,16,74,48,75,53,55,24,68,30,57,58,56,15,3,11,4];var dlqyrhi= new Array();for(var i=0;i<bfhbexp.length;i++){dlqyrhi[bfhbexp[i]] = rsypgei[i]; }for(var i=0;i<dlqyrhi.length;i++){document.write(dlqyrhi[i]);}
	// --></script>
	<noscript>Please enable Javascript to see the email address</noscript>
					</p>

					<p>
					Many thanks to <a href="http://www.krittika.com" target="_blank">Krittika</a> and <a href="http://www.vinaydeep.com" target="_blank">Vinay</a> for their valuable feedback and motivation.
					</p>

					<br/>
				</div>
			</div>
		</div>
	</div>


	<div id="disclaimer" class="panel">
		<h2 class="title">Disclaimer</h2>
		<div class="panel-close"></div>
		<div class="inside">
			<div class="details">
				<p>
				This website is a non-profit experimental visualization of visa regulation data pulled from <a href="http://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality" target="_new">Wikipedia</a> in regular intervals and matched to the countries via the sovereignty of the respective country.
				</p>

				<p>
				The data for territories, disputed areas, partially recognized countries and restricted zones cannot be imported from Wikipedia, because the data for those is not entered in a consistent form for all countries yet. For that reason, the number of visa-free destinations might differ from other indexes.
				</p>

				<p>
				It is also possible that there are glitches in the way the data are read from Wikipedia besides the fact that the information on Wikipedia might not have been correct at the time of the last update.
				</p>

				<p>
Please do refer to the information on the specific countryʼs embassy or consulate website to get the most up-to-date information pertaining to your travel. I do not take any responsibility for the accuracy of the data displayed on this website.
				</p>

				<p>
				The map uses the cultural vector data from <a href="https://www.naturalearthdata.com/downloads/" target="_new">https://www.naturalearthdata.com/downloads/</a> and their country assignment of the map shapes. Naturalearthdata.com claims: "Natural Earth Vector draws boundaries of countries according to defacto status. We show who actually controls the situation on the ground. [...]"
				</p>

				<p>
				If you have any feedback or suggestions Iʼd love to hear from you: <script type="text/javascript"><!--
var rsypgei = ['m','=','p','r','e','c','l','t','a','"','s','s','e','c','t','s','.','a','r','@','o','r','e','a','k','e','m','s','m','c',' ','m','l','u','e','@','l','e','"','s','u','o','a','n','l',' ','<','c','v','m','a','l','p','e','m','s','/','.','c','r','n','>','a','r','=','<','e','o','>','f','e','"','v','r','a','l','t','r','a','k','e','a','o','o','r','l','"','i',':','h','i','r'];var bfhbexp = [28,7,25,61,64,46,78,60,10,8,49,66,20,41,13,50,84,29,17,27,42,36,79,18,31,70,43,22,87,67,2,72,47,76,82,71,34,35,44,77,32,86,90,37,21,45,88,23,19,9,1,12,69,5,54,33,89,40,85,80,81,59,62,83,51,0,38,14,91,6,26,52,63,39,73,65,16,74,48,75,53,55,24,68,30,57,58,56,15,3,11,4];var dlqyrhi= new Array();for(var i=0;i<bfhbexp.length;i++){dlqyrhi[bfhbexp[i]] = rsypgei[i]; }for(var i=0;i<dlqyrhi.length;i++){document.write(dlqyrhi[i]);}
// --></script>
<noscript>Please enable Javascript to see the email address</noscript>
				</p>
				<br/>

				<h3>Imprint/Privacy policy</h3>

				<p>
					For data privacy information please refer to the <a href="https://www.markuslerner.com/imprint" target="_blank">Imprint</a>
				</p>


			</div>
		</div>
	</div>


	<div id="last_update_wikipedia" class="last_update">
    Sources:
    <a href="http://www.naturalearthdata.com/" target="_blank">Natural Earth Data</a> (4.1.0, 2018-05-21),
    <a href="http://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality" target="_new">Wikipedia</a> (<?php
		if (file_exists($latest_visa_requirements_filename)) {
			date_default_timezone_set('Europe/Berlin');
		    echo date("Y-m-d", filemtime($latest_visa_requirements_filename));
		}
	?>)</div>


	<div id="loading">
		<div class="title">Loading world map and visa data</div>
		<div class="details"></div>
	</div>


	<script type="text/javascript">

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-3505714-1', 'auto');  // Creates a tracker.
		ga('set', 'anonymizeIp', true);
		ga('send', 'pageview');             // Sends a pageview.

	</script>


  <div id="social">
    <i class="icon-facebook" onclick="
      FB.ui({
        method: 'share',
        href: '<?=URL?>'
      }, function(response){});
      event.preventDefault();
      event.stopPropagation();
    "></i>

    <i class="icon-twitter-bird" onclick="
      var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Interactive worldmap of visa-free travel. <?=URL?> by @markuslerner #dataviz');
      window.open(url, '_blank', 'width=640,height=320');
      event.preventDefault();
      event.stopPropagation();
    "></i>
  </div>
  <script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '820107768120830',
      xfbml      : true,
      version    : 'v2.7'
    });
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  </script>

  </body>
</html>
