import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState('Locating...');
    const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLiveLocation();
    }, []);

    const fetchLiveLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoordinates({ lat: latitude, lon: longitude });

                    try {
                        // Reverse Geocoding with OpenStreetMap (Nominatim)
                        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);

                        const address = res.data.address;
                        // Construct a more detailed address (House/Building, Street, Area)
                        const detailedAddress = [
                            address.house_number,
                            address.building,
                            address.road || address.street,
                            address.suburb || address.neighbourhood,
                            address.city || address.town
                        ].filter(Boolean).join(', ');

                        setLocation(detailedAddress || res.data.display_name);
                    } catch (error) {
                        console.error("Reverse geocoding failed", error);
                        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error("Geolocation error", error);
                    setLocation("Location Permission Denied");
                    setLoading(false);
                }
            );
        } else {
            setLocation("Geolocation not supported");
            setLoading(false);
        }
    };

    const setManualLocation = (newLocation) => {
        setLocation(newLocation);
        setCoordinates({ lat: null, lon: null }); // Clear live coords if manual
        setIsModalOpen(false);
    };

    const openLocationModal = () => setIsModalOpen(true);
    const closeLocationModal = () => setIsModalOpen(false);

    return (
        <LocationContext.Provider value={{
            location,
            coordinates,
            fetchLiveLocation,
            setManualLocation,
            isModalOpen,
            openLocationModal,
            closeLocationModal,
            loading
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export default LocationContext;
