let map;
let marker;
let geocoder;
let searchBox;

function initMap() {
    // Coordenadas iniciais (Braga)
    const braga = { lat: 41.5454, lng: -8.4265 };
    
    // Inicializar geocoder
    geocoder = new google.maps.Geocoder();
    
    // Criar mapa com mais opções
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17, // Zoom aumentado para ver mais detalhes
        center: braga,
        mapTypeId: "roadmap",
        streetViewControl: true, // Habilitar street view
        mapTypeControl: true, // Habilitar controle de tipo de mapa
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"]
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true, // Mostrar escala do mapa
        fullscreenControl: true // Permitir tela cheia
    });


    // Conectar input de morada com o mapa
    const moradaInput = document.getElementById('morada');
    searchBox = new google.maps.places.SearchBox(moradaInput);

    // Atualizar mapa quando uma localização é selecionada
   searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    // Atualizar mapa
    map.setCenter(place.geometry.location);
    map.setZoom(16);

    // Criar o marcador se ainda não existir
    if (!marker) {
        marker = new google.maps.Marker({
            map: map,
            draggable: true
        });

        // Listener do marker para atualizar morada, lat e lng
        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    moradaInput.value = results[0].formatted_address;
                    latitudeInput.value = position.lat();
                    longitudeInput.value = position.lng();
                }
            });
        });
    }

    // Atualizar posição do marcador
    marker.setPosition(place.geometry.location);

    // Atualizar latitude e longitude
    latitudeInput.value = place.geometry.location.lat();
    longitudeInput.value = place.geometry.location.lng();
});


    // Atualizar morada, latitude e longitude quando o marcador é movido
    marker.addListener('dragend', () => {
        const position = marker.getPosition();
        geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results[0]) {
                moradaInput.value = results[0].formatted_address;

                // Salvar latitude e longitude
                latitudeInput.value = position.lat();
                longitudeInput.value = position.lng();
            }
        });
    });

    // Adicionar clique no mapa para mover marcador e atualizar localização
    map.addListener("click", (e) => {
        marker.setPosition(e.latLng);
        geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
                moradaInput.value = results[0].formatted_address;

                // Salvar latitude e longitude
                latitudeInput.value = e.latLng.lat();
                longitudeInput.value = e.latLng.lng();
            }
        });
    });
}