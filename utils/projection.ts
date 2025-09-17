
import proj4 from 'proj4';

// Define the UTM Zone 48S projection for WGS84
const utmZone48S = '+proj=utm +zone=48 +south +datum=WGS84 +units=m +no_defs';

// WGS84 (Latitude/Longitude) is the target projection
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

export function convertUtmToLatLng(easting: number, northing: number): [number, number] {
  try {
    const [lng, lat] = proj4(utmZone48S, wgs84, [easting, northing]);
    return [lat, lng];
  } catch (error) {
    console.error("Error converting coordinates:", error);
    return [0, 0]; // Return a default value on error
  }
}
