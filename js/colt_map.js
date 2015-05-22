// global vars
var DLAT = 41.751628;   //hartford
var DLNG = -72.669072;  //hartford

var map;                //the map object
var initIcon = {
    url: 'img/colt-factory-dome-gray.png',
    size: new google.maps.Size(25, 28),
    scaledSize: new google.maps.Size(25, 28)
};
var selectedIcon = {
    url: 'img/colt-factory-dome-color.png',
    size: new google.maps.Size(25, 28),
    scaledSize: new google.maps.Size(25, 28)
};
var currentMarker = "";         // the marker currently selected
var currentImage = "";          //
var pos_markers = [];           // array of position markers
var zoom_level = 16;            // initial zoom level of map
var options = {                 // map config
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
var click_start = false         // has user clicked the start button
var results;
var overlay;

$(document).ready(function(){
  results_box = $("#results");
  overlay_box = $("#overlay");

  if(viewportSize.getWidth() < 768){
    zoom_status = false;  
  }else{
    zoom_status = true;
  }
  //
  initialize(results[0].lat,results[0].lng,zoom_status);
  //
  results_box.delay(2000).toggle("slide");

});

/*
 * Initialize map
 * @param lat the user's lat
 * @param lng the user's lng
 */
function initialize(lat,lng,zoom_status) {

  mapOptions = {
    center: new google.maps.LatLng(lat,lng),
    zoom: zoom_level,
    disableDefaultUI: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: zoom_status,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.DEFAULT,
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    streetViewControl: false,
    panControl: false,
    //styles: [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}]
    styles: [{"featureType": "poi.place_of_worship","stylers": [{ "visibility": "off" }]}]
  };
  
  // assign map to container 
  map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
  
  // build each input marker
  $.each(results, function(row){
    var center = new google.maps.LatLng(results[row].lat,results[row].lng)
    var pos_marker_options = {
      position: center,
      icon: initIcon,
      clickable:true,
      map: map,
      title: results[row].id
    };
    addMarker(pos_marker_options);

  });
  // alert to console what lat lng you clicked on
  google.maps.event.addListener(map, 'click', function(evt) {
    console.log(evt.latLng.lat(),evt.latLng.lng());
  });

}

/* ******************************* */
/* FUNCTIONS
/* ******************************* */

// Add info window.
function addInfoWindow(newWindow) {
  info_windows.push(newWindow);
}
// Add a marker to the map and push to the array.
function addMarker(options) {
  pos_marker = new google.maps.Marker(options);
  pos_markers.push(pos_marker); 

  // CLICK EVENT FOR MARKER
  google.maps.event.addListener(pos_marker, 'click', function() {
    if(currentMarker != ""){
      currentMarker.setIcon(initIcon);
    }
    currentMarker = this;
    this.setIcon(selectedIcon);
    id = this.title;
    //fade out the current one
    $("#overlay-body").fadeOut("fast", function(){
      buildOverlay(id,options.position);
    });
    
  });
  google.maps.event.addListener(pos_marker, 'mouseover', function() {
    if(this.title != currentMarker.title){
      this.setIcon(selectedIcon);
    }
  });
  google.maps.event.addListener(pos_marker, 'mouseout', function() {
    if(this.title != currentMarker.title){
      this.setIcon(initIcon);
    }
  });
}
/*
 * Offset the centerpoint of the map
 * @param latlng the centerpoint
 * @param offsetx the x offset
 * @param offsety the y offset
 */
function mapRecenter(latlng,offsetx,offsety) {
    var point1 = map.getProjection().fromLatLngToPoint(
        (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
    );
    var point2 = new google.maps.Point(
        ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
        ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
    );  
    map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
        point1.x - point2.x,
        point1.y + point2.y
    )));
}
/*
 * Get the offset x for the recenter
 * @param 
 */
function getOffsetX(){
  if(viewportSize.getWidth() > 768){
    //width of map
    map_width = $("#map-canvas").width();
    //width of overlay
    overlay_width = $("#overlay").width();
    //viewport center
    return ((map_width / 2) - ((map_width - overlay_width) / 2) - 12);
  }
}

/*
 * Build infoboxes
 * @param id the marker that was clicked
 */
function buildOverlay(id,center){
  
  //update content with new one
  $.each(results, function(row){
    if(id == results[row].id){
      $("#overlay p.dates").html(results[row].year);
      $("#overlay h3").html(results[row].name);
      $("#overlay p.address").html(results[row].address);
      $("#overlay img").attr("src",results[row].slug);
      $("#overlay p.credit").html(results[row].credit);
      $("#overlay p.content").html(results[row].body);
    }
    $("#overlay-body").fadeIn("fast");
  });
  // did not click start and the intro is open
  if(click_start == false && results_box.css("display")!="none"){
    results_box.toggle("slide", function(){
      overlay_box.toggle("slide");
      //$("#overlay-body").fadeIn("slow");
    });
  }
  else if(overlay_box.css("display") == "none"){
    overlay_box.toggle("slide");
    //$("#overlay-body").fadeIn("slow");
  }
  mapRecenter(center, getOffsetX(), 0);
  //map.panTo(center);
  
}

/*
 * Open inital infobox
 */ 
function initOverlay(){
  $("#overlay p.dates").html(results[0].year);
  $("#overlay h3").html(results[0].name);
  $("#overlay p.address").html(results[0].address);
  $("#overlay img").attr("src",results[0].slug);
  $("#overlay p.credit").html(results[0].credit);
  $("#overlay p.content").html(results[0].body);
  overlay_box.toggle("slide");
  currentMarker = pos_markers[0];
  currentMarker.setIcon(selectedIcon);
}

/*
 * Get the town name
 * @param lat the latitude
 * @param lng the longitude
 */
function getTown(lat,lng){
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat,lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]){
        geo_town = results[1].formatted_address;
        geo_town = geo_town.replace("CT ", "");
        geo_town = geo_town.replace(", USA", "");
        town_display.html(geo_town);
        town_input.val(geo_town);
      } 
      else{
        return 'Town name could not be located';
      }
    } 
    else{
      console.log('Geocoder failed due to: ' + status)
    }
  });
}

/* ******************************* */
/* EVENTS
/* ******************************* */

//close start box, open first infobox 
$("#start, #start-link").click(function(){
  click_start = true;
  results_box.toggle("slide", function(){
    if(viewportSize.getWidth() > 768){
      initOverlay();
    }
  });
});
//close info box
$("#close-box, #close-button").click(function(){
  overlay_box.toggle("slide");
});
//
$("#expand").click(function(){
  console.log($("#lightbox"));
  $("#lightbox .img-wrapper img").attr("src", "img/" + currentMarker.title + ".jpg");
  $("#lightbox").fadeIn("fast");
});
//
$("#compress").click(function(){
  $("#lightbox").fadeOut("fast");
});

//get window size on resize
$(window).resize(function(){
  console.log(viewportSize.getWidth());
  console.log(viewportSize.getHeight());
});