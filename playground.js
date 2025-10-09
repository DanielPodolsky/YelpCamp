import "dotenv/config";

async function findCoordinates() {
  const geoData = await maptilerClient.geocoding.forward("Tel Aviv");
  console.log(geoData.features[0]);
}

findCoordinates();
