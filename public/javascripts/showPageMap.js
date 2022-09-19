
  mapboxgl.accessToken = mapboxToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
      center: campground.geometry.coordinates, // starting position [lng, lat]
      zoom: 10, // starting zoom
      projection: 'globe' // display the map as a 3D globe
  });

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

  new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map)
  map.on('style.load', () => {
      map.setFog({}); // Set the default atmosphere style
  });