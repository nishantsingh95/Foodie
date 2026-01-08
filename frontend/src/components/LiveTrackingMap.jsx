import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to update map center when delivery location changes
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

const LiveTrackingMap = ({ trackingData }) => {
    console.log('🗺️ LiveTrackingMap rendering with data:', trackingData);

    // Default center (Delhi)
    const defaultCenter = [28.6139, 77.2090];

    // Determine map center
    const center = trackingData?.deliveryPersonLocation?.lat
        ? [trackingData.deliveryPersonLocation.lat, trackingData.deliveryPersonLocation.lng]
        : trackingData?.deliveryLocation?.lat
            ? [trackingData.deliveryLocation.lat, trackingData.deliveryLocation.lng]
            : defaultCenter;

    // Restaurant location (offset from center for demo)
    const restaurantLocation = [center[0] - 0.01, center[1] - 0.01];

    // User delivery location
    const userLocation = trackingData?.deliveryLocation?.lat
        ? [trackingData.deliveryLocation.lat, trackingData.deliveryLocation.lng]
        : [center[0] + 0.01, center[1] + 0.01];

    // Delivery person location
    const deliveryPersonLocation = trackingData?.deliveryPersonLocation?.lat
        ? [trackingData.deliveryPersonLocation.lat, trackingData.deliveryPersonLocation.lng]
        : null;

    // Route path
    const routePath = deliveryPersonLocation
        ? [restaurantLocation, deliveryPersonLocation, userLocation]
        : [restaurantLocation, userLocation];

    return (
        <div style={{ borderRadius: '15px', overflow: 'hidden', height: '500px', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <ChangeView center={center} />

                {/* Dark theme tile layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Route Polyline */}
                <Polyline
                    positions={routePath}
                    pathOptions={{
                        color: '#ffa502',
                        weight: 4,
                        opacity: 0.8,
                        dashArray: '10, 10',
                    }}
                />

                {/* Restaurant Marker */}
                <Marker position={restaurantLocation}>
                    <Popup>
                        <div style={{ color: '#000', padding: '5px' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>🍽️ Restaurant</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Foodie Kitchen</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Delivery Person Marker */}
                {deliveryPersonLocation && (
                    <Marker position={deliveryPersonLocation}>
                        <Popup>
                            <div style={{ color: '#000', padding: '5px' }}>
                                <h4 style={{ margin: '0 0 5px 0' }}>🏍️ Delivery Person</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                    {trackingData?.deliveryPerson?.name || 'On the way'}
                                </p>
                                {trackingData?.deliveryPersonLocation?.lastUpdated && (
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                                        Last updated:{' '}
                                        {new Date(
                                            trackingData.deliveryPersonLocation.lastUpdated
                                        ).toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* User Location Marker */}
                <Marker position={userLocation}>
                    <Popup>
                        <div style={{ color: '#000', padding: '5px' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>📍 Your Location</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                {trackingData?.deliveryLocation?.address || 'Delivery Address'}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {trackingData?.deliveryPersonLocation?.lastUpdated && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(255, 165, 2, 0.1)',
                    borderRadius: '8px',
                    color: '#ffa502',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    🕒 Last updated: {new Date(trackingData.deliveryPersonLocation.lastUpdated).toLocaleTimeString()}
                </div>
            )}
        </div>
    );
};

export default LiveTrackingMap;
