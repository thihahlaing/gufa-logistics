'use client'
import { MapPin } from 'lucide-react';

type Position = {
    lat: number;
    lng: number;
};

type AddressInputProps = {
    label: string;
    value: string;
    onMapOpen: () => void;
};

export default function AddressInput({ label, value, onMapOpen }: AddressInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="text"
                    value={value}
                    readOnly // The address is now set by the map
                    placeholder="Select location from map"
                    className="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 bg-gray-100 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={onMapOpen}
                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                    <MapPin className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

