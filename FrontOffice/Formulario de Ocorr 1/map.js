let map;
let marker;

function initMap() {
    // Coordenadas iniciais (Braga)
    const braga = { lat: 41.5454, lng: -8.4265 };
    
    // Criar mapa
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: braga,
        mapTypeId: "roadmap",
        streetViewControl: false,
        mapTypeControl: false
    });

    // Criar marcador inicial
    marker = new google.maps.Marker({
        position: braga,
        map: map,
        draggable: true
    });

    // Adicionar clique no mapa para mover marcador
    map.addListener("click", (e) => {
        marker.setPosition(e.latLng);
    });
}