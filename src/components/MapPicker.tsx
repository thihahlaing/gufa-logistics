'use client';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type Position = {
    lat: number;
    lng: number;
};

type MapPickerProps = {
    onSelect: (position: Position, address: string) => void;
};

// A component to handle map events
const MapEvents = ({ onPositionChange }: { onPositionChange: (pos: L.LatLng) => void }) => {
    const map = useMap();
    useEffect(() => {
        map.on('click', (e) => {
            onPositionChange(e.latlng);
        });
    }, [map, onPositionChange]);
    return null;
};

export default function MapPicker({ onSelect }: MapPickerProps) {
    const [position, setPosition] = useState<Position>({ lat: 16.8409, lng: 96.1735 }); // Default to Yangon

    const handlePositionChange = (pos: L.LatLng) => {
        setPosition({ lat: pos.lat, lng: pos.lng });
    };
    
    const confirmSelection = async () => {
        // Reverse geocode to get an address string
        // NOTE: This uses a public service and is not guaranteed for production.
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
        const data = await response.json();
        const address = data.display_name || `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`;
        onSelect(position, address);
    };

    return (
        <div className="h-full w-full relative">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} draggable={true} eventHandlers={{
                    dragend: (e) => handlePositionChange(e.target.getLatLng())
                }} />
                <MapEvents onPositionChange={handlePositionChange} />
            </MapContainer>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000]">
                 <button onClick={confirmSelection} className="bg-gufa-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
                    Confirm Location
                </button>
            </div>
        </div>
    );
}
