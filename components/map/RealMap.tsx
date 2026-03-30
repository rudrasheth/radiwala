"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js/Webpack
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons to sync with moss green theme
const UserIcon = L.divIcon({
    html: `<div style="width: 16px; height: 16px; background-color: #2D4F3C; border-radius: 50%; box-shadow: 0 0 20px rgba(45,79,60,0.6); border: 2px solid white;"></div>`,
    className: 'custom-user-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const CollectorIcon = L.divIcon({
    html: `<div style="width: 24px; height: 24px; background-color: white; border: 1.5px solid #2D4F3C; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D4F3C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
    className: 'custom-collector-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function RealMap({ userLocation, collectors = {}, isSearching = false }: any) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="absolute inset-0 z-0 bg-background" />;

    const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [19.1860, 72.8485];

    return (
        <div className="absolute inset-0 z-0 bg-background">
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                zoomControl={false}
            >
                <ChangeView center={center} zoom={15} />

                {/* Dark map tile layer */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* User Location */}
                <Marker position={center} icon={UserIcon}>
                </Marker>

                {/* If we are searching, we could show a radius circle here but for now just map markers */}

                {/* Collectors */}
                {Object.entries(collectors).map(([id, pos]: any) => (
                    <Marker key={id} position={[pos.lat, pos.lng]} icon={CollectorIcon}>
                    </Marker>
                ))}

                {/* Mock collectors if none online */}
                {Object.keys(collectors).length === 0 && !isSearching && (
                    <Marker position={[center[0] + 0.002, center[1] - 0.002]} icon={CollectorIcon} />
                )}
            </MapContainer>
        </div>
    );
}
