mapboxgl.accessToken = mapToken;
// 'pk.eyJ1Ijoid3NueWRlcjIxIiwiYSI6ImNsMzlkYXNvNTA1ZzEzY28ybWJrd2I3eTUifQ.bMfy2P0uptot762WQmXusg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)