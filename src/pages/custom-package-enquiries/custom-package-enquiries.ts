import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
declare var google;
let lat;
let lng;

@IonicPage()
@Component({
  selector: 'page-custom-package-enquiries',
  templateUrl: 'custom-package-enquiries.html',
})

export class CustomPackageEnquiriesPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  place: any;

  constructor(public navCtrl: NavController, private menuCtrl: MenuController, public platform: Platform, public geolocation: Geolocation) {
    platform.ready().then(() => {
        this.place="Kolkata, West Bengal, India";
        this.geolocation.getCurrentPosition().then((resp) => {
            lat = resp.coords.latitude
            lng = resp.coords.longitude
           }).catch((error) => {
             console.log('Error getting location', error);
           });
           let watch = this.geolocation.watchPosition();
           watch.subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            lat = data.coords.latitude
            lng = data.coords.longitude
           });
           this.loadMap();
      });
    //   this.loadMap();
  }

  onOpenMenu()
  {
    this.menuCtrl.open();
  }

  ionViewDidLoad(){
    
  }
 
  loadMap(){
    let latLng = new google.maps.LatLng(22.5726, 88.3639);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // console.log(lat+' '+lng);
    //   var map = new google.maps.Map(this.mapElement.nativeElement, {
    //       center: {lat: lat, lng: lng},
    //       zoom: 13
    //   });
    //   var input = this.place;
    //   console.log(this.place)
      let autocomplete = new google.maps.places.Autocomplete(this.place,
       {types: ['geocode'], componentRestrictions: {country: 'in'}});

      // Bind the map's bounds (viewport) property to the autocomplete object,
      // so that the autocomplete requests use the current map bounds for the
      // bounds option in the request.
      autocomplete.bindTo('bounds', this.map);

      autocomplete.addListener('place_changed', function() {

          var place = autocomplete.getPlace();
          console.log(autocomplete.getPlace());
          if (!place.geometry) {
              // User entered the name of a Place that was not suggested and
              // pressed the Enter key, or the Place Details request failed.
              alert("No details available for input: '" + place.name + "'");
              return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
              this.map.fitBounds(place.geometry.viewport);
          }
          else
          {
              this.map.setCenter(place.geometry.location);
              this.map.setZoom(17);  // Why 17? Because it looks good.
          }

      });
      var markers = [];

      this.map.addListener('click', function(e) {
          for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
          }
          placeMarker(e.latLng, this.map);
      });

      function placeMarker(position, map) {
          var marker = new google.maps.Marker({
              position: position,
              map: map
          });
          map.panTo(position);
          markers.push(marker);
      }
  }
}

