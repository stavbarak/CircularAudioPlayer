<!DOCTYPE html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="stylesheet" type="text/css" href="stylesheets/style.css" />
	<script src="js/raphael-min.js"></script>
	<script src="js/player-ui.js"></script>
	<script src="js/websitejs.js"></script>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded',function() { buildPlayerUI(); });
    </script>
<link rel="stylesheet" media="all"  type="text/css"  href="../css/main.css"/> 
<!-- <link rel="stylesheet" media="all"  type="text/css"  href="http://burragorang.org/css/main.css"/>  -->

<!-- live view http://burragorang.org/mediaplayer/index.php -->
</head>
<body id="bimblebox">

	<div id="content">
		<header>
			<ul class="yellowbox">
				<li><h1>Alison Clouston &amp; Boyd</h1></li>
				<li><h1>Coalface 2014</h1></li>
			</ul>
		</header>

		<nav>

			<ul>
				<li id="our">The Media Player testing unit</a></li>
			</ul>
		</nav>

		<div id="main">

			<div class="left">
				<?php perch_podcasts_shows(array('template'=>'shows_list_nolink.html',)); ?>
			</div>
			<div class="right">
				<h3 class="light">Babblers, Chats, Robins & Sitella</h3>
				<ul class="works">
					<? perch_podcasts_episodes('babblers-chats-robins', array(
						'template'=>'playme.html',
						'sort'=>'episodeNumber',
						'sort-order'=>'ASC',
						'count'=>9,
						)); ?>
				</ul>
				<h3 class="light">Birds of Prey</h3>
				<ul class="works">
					<? perch_podcasts_episodes('birds-of-prey', array(
						'template'=>'playme.html',
						'sort'=>'episodeNumber',
						'sort-order'=>'ASC',
						'count'=>9,
						)); ?>
				</ul>
				<h3 class="light">Birds of Prey 2</h3>
				<ul class="works">
					<? perch_podcasts_episodes('birds-of-prey-2', array(
							'template'=>'playme.html',
							'sort'=>'episodeNumber',
							'sort-order'=>'ASC',
							'count'=>9,
							)); ?>
				</ul>
				<h3 class="light">Bowerbirds, Larks, Pipit, Sparrows & Finches</h3>
				<ul class="works">
						<? perch_podcasts_episodes('bowerbirds-larks-pipit', array(
							'template'=>'playme.html',
							'sort'=>'episodeNumber',
							'sort-order'=>'ASC',
							'count'=>9,
							)); ?>
				</ul>
				<h3 class="light">Brolga Crakes Rails Bustard Button-Quails & Wader</h3>
				<ul class="works">
					<? perch_podcasts_episodes('brolga-crakes-rails', array(
						'template'=>'playme.html',
						'sort'=>'episodeNumber',
						'sort-order'=>'ASC',
						'count'=>9,
						)); ?>
				</ul>
				<h3 class="light">Cockatoos & Parrots</h3>
				<ul class="works">
					<? perch_podcasts_episodes('cockatoos-parrots', array(
						'template'=>'playme.html',
						'sort'=>'episodeNumber',
						'sort-order'=>'ASC',
						'count'=>9,
						)); ?>
				</ul>
				<h3 class="light">Cormorants & Pelicans</h3>
				<ul class="works">
					<? perch_podcasts_episodes('cormorants-pelicans', array(
							'template'=>'playme.html',
							'sort'=>'episodeNumber',
							'sort-order'=>'ASC',
							'count'=>9,
							)); ?>
				</ul>
				<h3 class="light">Cuckoo-Shrikes & Orioles</h3>
				<ul class="works">
						<? perch_podcasts_episodes('cuckoo-shrikes-orioles', array(
							'template'=>'playme.html',
							'sort'=>'episodeNumber',
							'sort-order'=>'ASC',
							'count'=>9,
							)); ?>
				</ul>
				<h3 class="light">Cuckoos</h3>
				<ul class="works">
					<? perch_podcasts_episodes('cuckoos', array(
						'template'=>'playme.html',
						'sort'=>'episodeNumber',
						'sort-order'=>'ASC',
						'count'=>9,
						)); ?>
				</ul>
				<h3 class="light">Emus, Mound Builders & Quail</h3>
				<ul class="works">
					<? perch_podcasts_episodes('emus-mound-builders-and-quail', array(
						'template'=>'playme.html',
						'sort'=>'episodeNumber',
						'sort-order'=>'ASC',
						'count'=>9,
						)); ?>
				</ul>
				<h3 class="light">Herons Ibis & Spoonbills</h3>
				<ul class="works">
					<? perch_podcasts_episodes('herons-ibis-spoonbills', array(
							'template'=>'playme.html',
							'sort'=>'episodeNumber',
							'sort-order'=>'ASC',
							'count'=>9,
							)); ?>
				</ul>
				<h3 class="light">Honeyeaters</h3>
				<ul class="works">
						<? perch_podcasts_episodes('honeyeaters', array(
							'template'=>'playme.html',
							'sort'=>'episodeNumber',
							'sort-order'=>'ASC',
							'count'=>9,
							)); ?>
				</ul>			
			</div>
		</div>
	</div> <!-- end content -->

	<script src="../js/min/bimble_script-ck.js"></script>