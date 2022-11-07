import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Fix broken leaflet marker
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const ZOOM = 13;

const MapStops = ({ stops, activeStopIdx }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    const _center = [stops[activeStopIdx].lat, stops[activeStopIdx].lon];
    setCenter(_center);
    if (map) map.setView(_center, ZOOM);
  }, [stops, activeStopIdx]);

  return (
    <MapContainer center={center} zoom={ZOOM} scrollWheelZoom={false} ref={setMap}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stops.map((stop, i) => (
        <Marker key={i} position={[stop.lat, stop.lon]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

MapStops.propTypes = {
  stops: PropTypes.array,
  activeStopIdx: PropTypes.number
};

export default MapStops;
