<?php

?>
<!DOCTYPE html>
<html>
    <?php include 'layouts/header.htm'; ?>
    <body>
      
        <div data-trb-thirdpartynav></div>
        
        <div id="lightbox">
          <div class="img-wrapper">
            <i id="compress" class="text-shadow fa fa-compress fa-2x"></i>
            <img src="" alt=""/>
          </div>
        </div>

        <div id="results" class="box-shadow">
          <div id="results-body">
            <p><img src="img/colt-factory-dome-color.png" alt="colt factory dome"/></p>
            <p class="kicker">Coltsville</p>
            <h3>National Historic Landmark Proposal</h3>
            <p class="intro">Years in the making, Coltsville National Historical Park could be established by the end of this year.  One day, visitors will be able to tour the East Armory’s iconic, onion-shaped blue dome. Or wander past  Armsmear, Samuel and Elizabeth Colt’s home. In the meantime, take a tour of the new park’s highlights through our interactive graphic.</p>
            <i id="start" class="fa fa-chevron-circle-right fa-3x"></i>
            <a id="start-link">Start</a>
          </div>
        </div>
        
        <div id="overlay" class="box-shadow">
          <div id="overlay-body">
            <p class="dates"></p>
            <h3></h3>
            <p class="address"></p>
            <div class="img-wrapper">
              <i id="expand" class="text-shadow fa fa-expand fa-2x"></i>
              <img src="" alt=""/>
            </div>
            <p class="credit"></p>
            <p class="content"></p>
            <a id="close-button">Close</a>
          </div>
          <i id="close-box" class="fa fa-times-circle fa-2x"></i>
        </div>
        
        <!-- The google map goes here -->
        <div id="map-canvas"></div>
        
        <?php include ('layouts/scripts.htm'); ?>
        <?php include ('layouts/analytics.htm'); ?>
    </body>
</html>