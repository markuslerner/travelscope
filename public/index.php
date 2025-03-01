<?php
    // error_reporting(E_ALL);

    $brand                    = "Travelscope";
    $title                    = $brand . " – Interactive worldmap of visa-free travel – A Chrome Experiment";
    $description              = "A visual exploration of the travel freedom attached to passports";
    $visa_requirements_folder = "data/visa_requirements";

    require __DIR__ . '/../vendor/autoload.php';
    $dotenv = new Dotenv\Dotenv(__DIR__ . '/../');
    $dotenv->load();

    define('URL', getenv('URL'));
    define('CDN_URL', getenv('CDN_URL'));

    $package = file_get_contents('../package.json');
    $package = json_decode($package, true);
    define('VERSION', $package['version']);

    $detect    = new Mobile_Detect;
    $isDesktop = ! $detect->isMobile() && ! $detect->isTablet();

    // get most recent visa requirements filename:
    function getLatestVisaRequirementsFilename($path)
    {
        $latest_ctime    = 0;
        $latest_filename = '';
        $d               = dir($path);
        while (false !== ($entry = $d->read())) {
            $filepath = "{$path}/{$entry}";
            // could do also other checks than just checking whether the entry is a file
            if (is_file($filepath) && filectime($filepath) > $latest_ctime) {
                $latest_ctime    = filectime($filepath);
                $latest_filename = $entry;
            }
        }
        return [$latest_ctime, $latest_filename];
    }

    $data                              = getLatestVisaRequirementsFilename($visa_requirements_folder);
    $latest_visa_requirements_filename = $visa_requirements_folder . "/" . $data[1];

?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo $title ?></title>

    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  	<meta http-equiv="expires" content="0" />
  	<meta http-equiv="Content-Language" content="en" />

  	<meta name="description" content="<?php echo $description ?>" />
  	<meta name="keywords" content="travel, scope, power, passport, pass, reisepass, visa, visa-free, country, world, freedom, movement" />

  	<meta name="language" content="english, en" />
  	<meta name="revisit-after" content="1 day" />

  	<meta name="robots" content="index, follow" />

  	<meta http-equiv="X-UA-Compatible" content="chrome=1">

  	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
  	<meta name="apple-mobile-web-app-capable" content="yes">
  	<meta name="apple-mobile-web-app-status-bar-style" content="black">

  	<meta property="og:site_name" content="<?php echo $brand ?>" />
  	<meta property="og:description" content="<?php echo $title ?>" />
  	<meta property="og:type" content="website" />
  	<meta property="og:image" content="//cdn.markuslerner.com/wordpress/wp-content/uploads/2016/04/travelscope_4k_1_cropped-640x400@2x.png" />

    <link rel="canonical" href="<?php echo URL ?>" />

    <link rel="shortcut icon" href="<?php echo CDN_URL ?>favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo CDN_URL ?>apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo CDN_URL ?>favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo CDN_URL ?>favicon-16x16.png">
    <link rel="manifest" href="<?php echo CDN_URL ?>site.webmanifest">

    <link rel="preload" href="<?php echo CDN_URL ?>assets/fonts/fonts.css?v=<?php echo VERSION ?>" as="style" />
    <link rel="preload" href="<?php echo CDN_URL ?>css/main.css?v=<?php echo VERSION ?>" as="style" />

    <link rel="preload" href="<?php echo CDN_URL ?>js/client.js?v=<?php echo VERSION ?>" as="script" />

    <link rel="stylesheet" type="text/css" href="<?php echo CDN_URL ?>assets/fonts/fonts.css?v=<?php echo VERSION ?>" />
    <link rel="stylesheet" type="text/css" href="<?php echo CDN_URL ?>css/main.css?v=<?php echo VERSION ?>" />

    <script language="JavaScript" type="text/javascript">
      var IS_DESKTOP = <?echo $isDesktop ? 'true' : 'false'; ?>;
      var CDN_URL = '<?php echo CDN_URL ?>';
      var VISA_REQUIREMENTS_URL = '<?php echo $latest_visa_requirements_filename; ?>';
    </script>

    <script type="text/javascript" src="<?php echo CDN_URL ?>js/client.js?v=<?php echo VERSION ?>"></script>

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
        <a class="navbar-brand" href="#">Travelscope</a>
      </h1>
    </div><!-- /.navbar-header -->

    <div id="navbar-search">
      <ul class="nav navbar-nav">
        <li id="country-dropdown-container" class="country-dropdown-container">
          <form action="#" autocomplete="off">
            <input type="text" name="country-dropdown" id="country-dropdown" class="country-dropdown" autocomplete="off" placeholder="Source country" disabled />
            <span class="glyphicon glyphicon-search"></span>
            <span class="cancel"></span>
          </form>
        </li>

        <div id="src-dest-arrow-right" class="glyphicon glyphicon-arrow-right loading"></div>

        <li id="destination-country-dropdown-container" class="country-dropdown-container">
          <form action="#" autocomplete="off">
            <input type="text" name="destination-country-dropdown" id="destination-country-dropdown" class="country-dropdown" autocomplete="off" placeholder="Dest. country" disabled />
            <span class="glyphicon glyphicon-search"></span>
            <span class="cancel"></span>
          </form>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->

    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
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
      </ul>

      <ul class="nav navbar-nav navbar-right">
        <li><a href="#" id="button_about">About</a></li>

        <li><a href="#" id="button_disclaimer">Disclaimer</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->

    </div><!-- /.container-fluid -->
  </nav>

	<div id="top-overlay">
		<div class="background"></div>
		<h2 id="travelscope"></h2>
	</div>

	<button type="button" id="btn-country-list" class="btn btn-default btn-sm" title="Toggle country list"><span class="title">Countries</span><span class="caret"></span></button>

	<div class="slider" id="zoom-slider" title="Zoom"></div>

	<div id="view-switch" class="btn-group">
		<button type="button" id="view-switch-flat" class="btn btn-default active" title="Flat view"><span class="icon-worldmap-flat"></span> </button>
		<button type="button" id="view-switch-spherical" class="btn btn-default" title="Spherical view"><span class="glyphicon glyphicon-globe"></span> </button>
	</div>

  <div id="legend">
    <button type="button" class="btn btn-default btn-legend" title="Toggle legend"><span class="title">Legend</span><span class="caret"></span></button>

    <div class="legend-container">
      <div id="legend-main" class="legend">
        <div class="range">
          <div class="box"></div>
          <div class="min"></div>
          <div class="rangelabel"></div>
          <div class="max"></div>
        </div>
        <div class="colors"></div>
      </div>

      <div id="legend-selected" class="legend">
        <div class="colors"></div>
      </div>

      <div class="last-update">
        Sources:
        <a href="http://www.naturalearthdata.com/" target="_blank">Natural Earth Data</a> (5.1.1, 2022-05-09),
        <a href="http://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality" target="_new">Wikipedia</a> (<?php
                                                                                                                          if (file_exists($latest_visa_requirements_filename)) {
                                                                                                                              date_default_timezone_set('Europe/Berlin');
                                                                                                                              echo date("Y-m-d", filemtime($latest_visa_requirements_filename));
                                                                                                                      }
                                                                                                                      ?>)</div>
    </div>
  </div>

	<div id="country-tooltip">
		<div class="title"></div>
		<div class="details"></div>
	</div>

	<div id="about" class="panel">
		<h2 class="title">About</h2>
		<div class="panel-close"></div>
    <?php if (file_exists('content/about.inc.php')) {
            require_once 'content/about.inc.php';
        }
    ?>
	</div>

	<div id="disclaimer" class="panel">
		<h2 class="title">Disclaimer</h2>
		<div class="panel-close"></div>
    <?php if (file_exists('content/disclaimer.inc.php')) {
            require_once 'content/disclaimer.inc.php';
        }
    ?>
	</div>

	<div id="loading">
		<div class="title">Loading world map and visa data</div>
		<div class="details"></div>
	</div>

  <?php if (file_exists('content/before-body-closing.inc.php')) {
          require_once 'content/before-body-closing.inc.php';
      }
  ?>

  </body>
</html>
