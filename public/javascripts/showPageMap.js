// Get data from HTML data attributes
const mapElement = document.getElementById("map");
const maptilerApiKey = mapElement.dataset.apiKey;
const campground = JSON.parse(
  decodeURIComponent(mapElement.dataset.campground)
);

maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.LANDSCAPE,
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
