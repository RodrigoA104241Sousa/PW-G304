let map;
let marker;
let geocoder;
let searchBox;
window.latitude = null;
window.longitude = null;

function initMap() {
  const braga = { lat: 41.5454, lng: -8.4265 };
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: braga,
    mapTypeId: "roadmap",
    streetViewControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"]
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    scaleControl: true,
    fullscreenControl: true
  });

  const moradaInput = document.getElementById('morada');
  searchBox = new google.maps.places.SearchBox(moradaInput);

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (!places.length || !places[0].geometry?.location) return;

    const location = places[0].geometry.location;
    window.latitude = location.lat();
    window.longitude = location.lng();

    map.setCenter(location);
    map.setZoom(16);

    if (!marker) {
      marker = new google.maps.Marker({
        map: map,
        draggable: true
      });

      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results[0]) {
            moradaInput.value = results[0].formatted_address;
            window.latitude = position.lat();
            window.longitude = position.lng();
          }
        });
      });
    }

    marker.setPosition(location);
  });

  // Também permitir clicar no mapa
  map.addListener("click", (e) => {
    if (!marker) {
      marker = new google.maps.Marker({
        map: map,
        draggable: true
      });

      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === 'OK' && results[0]) {
            moradaInput.value = results[0].formatted_address;
            window.latitude = pos.lat();
            window.longitude = pos.lng();
          }
        });
      });
    }

    marker.setPosition(e.latLng);
    geocoder.geocode({ location: e.latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        moradaInput.value = results[0].formatted_address;
        window.latitude = e.latLng.lat();
        window.longitude = e.latLng.lng();
      }
    });
  });
}
