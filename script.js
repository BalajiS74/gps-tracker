const stops = [
  { name: "stop 1", lat: 8.662540, lon: 77.568220 },
  { name: "Nedungulam", lat: 8.661800, lon: 77.567200 },
  { name: "SCAD College", lat: 8.663900, lon: 77.572100 }
];
//8.662540, 77.568220


let lastAlertedStop = null;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkNextStop(currentLat, currentLon) {
  let minDist = Infinity;
  let nextStop = null;

  for (const stop of stops) {
    const dist = getDistance(currentLat, currentLon, stop.lat, stop.lon);

    if (dist < minDist) {
      minDist = dist;
      nextStop = stop;
    }

    if (dist < 100 && lastAlertedStop !== stop.name) {
      alert(`🚨 Reached: ${stop.name}`);
      lastAlertedStop = stop.name;
    }
  }

  if (nextStop) {
    document.getElementById("nextStop").innerText = nextStop.name;
  }
}

async function fetchGPS() {
  try {
    const res = await fetch("https://bus-tracking-school-92dd9-default-rtdb.asia-southeast1.firebasedatabase.app/gps/BUS123.json");
    const data = await res.json();

    if (!data.latitude || !data.longitude) {
      console.warn("Location not available yet.");
      return;
    }

    const currentLat = data.latitude;
    const currentLon = data.longitude;

    document.getElementById("location").innerText = `${currentLat.toFixed(5)}, ${currentLon.toFixed(5)}`;
    checkNextStop(currentLat, currentLon);

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

setInterval(fetchGPS, 5000);
fetchGPS();
