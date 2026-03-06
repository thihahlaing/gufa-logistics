'use client';

import { useRef, useEffect, useState } from 'react';

interface PlaceInputProps {
  icon?: React.ReactNode; // Made optional
  placeholder: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  value: string;
  onInputChange: (value: string) => void;
  onFocus?: () => void;
}

const PlaceInput: React.FC<PlaceInputProps> = ({ icon, placeholder, onPlaceSelect, value, onInputChange, onFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      // A DOM element is required for the PlacesService constructor.
      // We can create a dummy div that is never rendered.
      const dummyDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
    } else {
      console.error("Google Maps JavaScript API with 'places' library is not loaded.");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onInputChange(query);

    if (autocompleteService.current && query) {
      autocompleteService.current.getPlacePredictions({ input: query, componentRestrictions: { country: 'mm' } }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    onInputChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);

    if (placesService.current && suggestion.place_id) {
      placesService.current.getDetails({ placeId: suggestion.place_id, fields: ['name', 'geometry', 'formatted_address'] }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          onPlaceSelect(place);
        }
      });
    }
  };

  const handleFocus = () => {
    if (onFocus) onFocus();
    setShowSuggestions(true);
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow click event to fire
    setTimeout(() => {
        setShowSuggestions(false);
    }, 150);
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full bg-gray-100 rounded-md px-3 py-2.5">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onMouseDown={() => handleSuggestionClick(suggestion)} // Use onMouseDown to fire before onBlur
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
            >
              <p className="font-semibold">{suggestion.structured_formatting.main_text}</p>
              <p className="text-xs">{suggestion.structured_formatting.secondary_text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaceInput;