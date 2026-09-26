mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
});

// Airbnb-style marker
const markerElement = document.createElement("div");

markerElement.className = "custom-marker";

markerElement.innerHTML = `
    <div class="marker-home">
        <i class="fa-solid fa-house"></i>
    </div>
`;

new mapboxgl.Marker({
    element: markerElement
})
.setLngLat(coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
            <h4>${listingLocation}, ${listingCountry}</h4>
            <p>Exact location will be provided after booking.</p>
        `)
)
.addTo(map);