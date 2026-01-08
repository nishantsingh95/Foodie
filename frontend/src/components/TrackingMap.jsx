import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon missing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TrackingMap = ({ deliveryLocation }) => {
    const [position, setPosition] = useState([51.505, -0.09]); // Default London

    useEffect(() => {
        if (deliveryLocation && deliveryLocation.lat) {
            setPosition([deliveryLocation.lat, deliveryLocation.lng]);
        }
    }, [deliveryLocation]);

    function ChangeView({ center }) {
        const map = useMap();
        map.setView(center);
        return null;
    }

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
            <ChangeView center={position} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    Delivery Location
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default TrackingMap;
