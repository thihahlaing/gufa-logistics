'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, type CSSProperties } from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { ChevronLeft, Menu, X, Wallet, Map, Star, Cog } from 'lucide-react';
import { useAuth } from '@/app/AuthProvider';
import Link from 'next/link';
import LoadingSpinner from '../components/LoadingSpinner';

// BrandLogo Component
import Sidebar from '../components/Sidebar';


// Main Component
export default function BookingPage() {
  const { supabase, user, profile } = useAuth();
  // State Management
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeVehicle, setActiveVehicle] = useState('Motorbike');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'searching' | 'assigned'>('idle');
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi, I am on my way.', sender: 'driver' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Map State
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [pickupPosition, setPickupPosition] = useState({ lat: 16.7810, lng: 96.1561 }); // Junction City
  const dropoffPosition = useMemo(() => ({ lat: 16.8282, lng: 96.1550 }), []); // Myanmar Plaza
  const mapCenter = useMemo(() => ({ lat: 16.8409, lng: 96.1735 }), []); // Yangon
  const [carPath, setCarPath] = useState<google.maps.LatLng[]>([]);
  const [carPathIndex, setCarPathIndex] = useState(0);
  const [shouldFetchDirections, setShouldFetchDirections] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['marker'],
  });

  // Data
  const vehicleOptions = [
    { name: 'Motorbike', icon: '🛵', weight: '20kg', price: 2500 },
    { name: 'Car', icon: '🚗', weight: '250kg', price: 8000 },
    { name: 'MPV', icon: '🚙', weight: '400kg', price: 12000 },
    { name: 'Truck', icon: '🚚', weight: '750kg', price: 20000 },
  ];
  const selectedVehicle = vehicleOptions.find(v => v.name === activeVehicle);
  const totalPrice = selectedVehicle ? selectedVehicle.price : 0;



  // Effects
  useEffect(() => {
    if (orderStatus === 'searching') {
      const timer = setTimeout(() => {
        setOrderStatus('assigned');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (orderStatus === 'assigned' && carPath.length > 0) {
      const interval = setInterval(() => {
        setCarPathIndex(prevIndex => {
          if (prevIndex < carPath.length - 1) {
            return prevIndex + 1;
          }
          clearInterval(interval);
          return prevIndex;
        });
      }, 1000); // Move every second
      return () => clearInterval(interval);
    }
  }, [orderStatus, carPath]);

  // Handlers
  const handleConfirmBooking = async () => {
    if (!user) {
      alert('Please log in to book a ride.');
      return;
    }

    setIsBooking(true);

    const booking = {
      user_id: user.id,
      pickup_location: pickupPosition,
      dropoff_location: dropoffPosition,
      vehicle_type: activeVehicle,
      status: 'pending',
    };

    const { error } = await supabase.from('bookings').insert(booking);

    if (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } else {
      setOrderStatus('searching');
    }
    setIsBooking(false);
  };

  const handleLogout = async () => { 
   console.log('Executing Logout...'); 
   const { error } = await supabase.auth.signOut(); 
   if (error) { 
     console.error('Logout error:', error); 
   } else { 
     console.log('Logout successful, redirecting...'); 
     // Force clear cache and redirect 
     window.location.href = '/login'; 
   } 
 }; 

  const handleSendMessage = (quickReply = '') => {
    const text = quickReply || newMessage;
    if (text.trim() === '') return;
    const newMsg = { id: messages.length + 1, text, sender: 'user' };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Map Callbacks
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(pickupPosition);
    bounds.extend(dropoffPosition);
    mapInstance.fitBounds(bounds);
  }, [pickupPosition, dropoffPosition]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const directionsCallback = useCallback((response: google.maps.DirectionsResult | null) => {
    if (response !== null && response.routes && response.routes.length > 0) {
      setDirectionsResponse(response);
      const route = response.routes[0].overview_path;
      setCarPath(route);
      setCarPathIndex(0);
      setShouldFetchDirections(false); // Stop fetching after a successful response
    } else {
      console.error('Directions request failed');
    }
  }, []);

  const onPickupDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPickupPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setShouldFetchDirections(true); // Re-fetch directions when marker is moved
    }
  };

  // Inline Styles
  const mapTheme: google.maps.MapTypeStyle[] = [
      { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
      { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
      { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
      { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
      { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
      { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
      { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
      { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
      { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  ];

  const pickupIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2322c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`;
  const dropoffIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23ef4444" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  const carIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23f97316" stroke="white" stroke-width="1"><path d="M10 20.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm7 0c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm-10.816-3.5c.112.446.523.764.986.816l.03.004h1.8c.56 0 1.021-.429 1.081-.986l.004-.03.5-2h6.8l.5 2c.06.557.521.986 1.081.986l.004.03h1.8c.463-.052.874-.37.986-.816l.004-.03.9-3.5c.113-.446-.141-.905-.585-.986l-.03-.004h-15c-.444.081-.7.54-.585.986l-.03.004.9 3.5zm.816-5.5h14l-1-4h-12l-1 4z"/></svg>`;

  const pulseAnimation = `
    @keyframes pulse {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 25px rgba(249, 115, 22, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
    }
  `;

  const styles: { [key: string]: CSSProperties } = {
    // Layout
    mainContent: { flexGrow: 1, position: 'relative', overflow: 'hidden' },
    map: { position: 'absolute', top: 0, left: 0, right: 0, height: '65%', zIndex: 1 },
    drawer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', backgroundColor: 'white', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', zIndex: 10, transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)', transform: orderStatus === 'idle' ? 'translateY(60%)' : 'translateY(100%)', overflowY: 'auto', paddingBottom: '120px', boxSizing: 'border-box' },
    // Booking Form
    routeBox: { display: 'flex', padding: '20px', alignItems: 'center' },
    routeLine: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '15px' },
    inputGroup: { flexGrow: 1, position: 'relative' },
    inputField: { width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '10px 25px 10px 0', fontSize: '16px', outline: 'none' },
    clearButton: { position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' },
    // Vehicle Selection
    vehicleSelector: { padding: '0 20px', display: 'flex', overflowX: 'auto', gap: '10px' },
    vehicleCard: { flex: '0 0 100px', padding: '15px', border: '2px solid #eee', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' },
    // Total & Confirm
    totalSection: { padding: '20px', borderTop: '1px solid #eee', marginTop: '10px' },
    confirmButton: { backgroundColor: '#f97316', color: 'white', width: 'calc(100% - 40px)', padding: '15px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', margin: '0 20px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.3s ease' },
    // Order Status: Searching
    searchingContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'white', zIndex: 11, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', transform: orderStatus === 'searching' ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.4s ease-out' },
    radar: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'pulse 2s infinite' },
    // Order Status: Assigned
    driverCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', zIndex: 11, padding: '20px', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', transform: orderStatus === 'assigned' ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.4s ease-out' },
    driverInfo: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
    driverActions: { display: 'flex', gap: '10px' },
    actionButton: { flex: 1, padding: '15px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s ease' },
    // Chat
    chatOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', zIndex: 102, transform: isChatOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s ease-out', display: 'flex', flexDirection: 'column', maxWidth: '430px', margin: '0 auto' },
    chatHeader: { display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' },
    chatMessages: { flexGrow: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' },
    messageBubble: { padding: '10px 15px', borderRadius: '20px', maxWidth: '75%' },
    userMessage: { backgroundColor: '#fff0e6', alignSelf: 'flex-end' },
    driverMessage: { backgroundColor: '#f3f4f6', alignSelf: 'flex-start' },
    chatInputContainer: { padding: '15px', borderTop: '1px solid #eee' },
    quickReplyContainer: { display: 'flex', gap: '10px', marginBottom: '10px' },
    quickReplyButton: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #f97316', backgroundColor: 'white', color: '#f97316', cursor: 'pointer', transition: 'all 0.3s ease' },
    messageInputRow: { display: 'flex', gap: '10px' },
    messageInputField: { flexGrow: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' },
    sendButton: { padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#f97316', color: 'white', cursor: 'pointer', transition: 'background-color 0.3s ease' },
  };

  return (
    <>
      <style>{pulseAnimation}</style>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          user={user} 
          profile={profile} 
          handleLogout={handleLogout} 
        />

        <main style={styles.mainContent}>
          {/* Map */}
          <div style={styles.map}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={13}
                options={{ styles: mapTheme, disableDefaultUI: true, zoomControl: true }}
                onLoad={onMapLoad}
                onUnmount={onUnmount}
              >
                {shouldFetchDirections && (
                  <DirectionsService
                    options={{
                      destination: dropoffPosition,
                      origin: pickupPosition,
                      travelMode: google.maps.TravelMode.DRIVING
                    }}
                    callback={directionsCallback}
                  />
                )}
                {directionsResponse && (
                  <DirectionsRenderer options={{ directions: directionsResponse, suppressMarkers: true, polylineOptions: { strokeColor: '#1e40af', strokeWeight: 5 } }} />
                )}
                <Marker position={pickupPosition} icon={{ url: pickupIcon, scaledSize: new google.maps.Size(30, 30) }} draggable={true} onDragEnd={onPickupDragEnd} />
                <Marker position={dropoffPosition} icon={{ url: dropoffIcon, scaledSize: new google.maps.Size(30, 30) }} />
                {orderStatus === 'assigned' && carPath[carPathIndex] && (
                  <Marker position={carPath[carPathIndex]} icon={{ url: carIcon, scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }} />
                )}
              </GoogleMap>
            ) : <p>Loading Map...</p>}
          </div>

          {/* Booking Drawer */}
          <div style={styles.drawer}>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '4px', backgroundColor: '#dbdbdb', borderRadius: '2px', margin: '0 auto' }}></div>
            </div>
            <div style={styles.routeBox}>
              <div style={styles.routeLine}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
                <div style={{ width: '2px', height: '30px', backgroundColor: '#e0e0e0', margin: '4px 0' }}></div>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#f97316', borderRadius: '50%' }}></div>
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={styles.inputGroup}>
                  <input type="text" placeholder="ပို့ရမည့်နေရာ" value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ ...styles.inputField, marginBottom: '10px' }} />
                  {pickup && <X size={18} color="#999" style={styles.clearButton} onClick={() => setPickup('')} />}
                </div>
                <div style={styles.inputGroup}>
                  <input type="text" placeholder="ပို့ပေးရမည့်နေရာ" value={dropoff} onChange={(e) => setDropoff(e.target.value)} style={styles.inputField} />
                  {dropoff && <X size={18} color="#999" style={styles.clearButton} onClick={() => setDropoff('')} />}
                </div>
              </div>
            </div>
            <div style={styles.vehicleSelector}>
              {vehicleOptions.map(v => (
                <div key={v.name} onClick={() => setActiveVehicle(v.name)} style={{ ...styles.vehicleCard, borderColor: activeVehicle === v.name ? '#f97316' : '#eee', borderWidth: activeVehicle === v.name ? '2px' : '1px' }}>
                  <div style={{ fontSize: '28px' }}>{v.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{v.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{v.weight}</div>
                </div>
              ))}
            </div>
            <div style={styles.totalSection}>
              <button onClick={handleConfirmBooking} style={styles.confirmButton} disabled={isBooking}>
                {isBooking ? <LoadingSpinner /> : 
                <>
                  <span>အော်ဒါတင်မည်</span>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '5px 12px', borderRadius: '8px' }}>
                    {totalPrice.toLocaleString()} Ks
                  </span>
                </>
                }
              </button>
            </div>
          </div>

          {/* Searching Overlay */}
          {orderStatus === 'searching' && (
            <div style={styles.searchingContainer}>
              <div style={styles.radar}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.2)' }}></div>
              </div>
              <p style={{ marginTop: '25px', fontSize: '18px', color: '#333' }}>Searching for your Gufa Driver...</p>
              <p style={{ color: '#666' }}>သင့်အတွက် Gufa ဒရိုင်ဘာရှာဖွေနေသည်...</p>
            <button onClick={() => setOrderStatus('idle')} style={{ ...styles.actionButton, backgroundColor: '#ef4444', color: 'white', marginTop: '20px', width: 'calc(100% - 80px)' }}>Cancel</button>
          </div>
        )}

        {/* Driver Assigned Card */}
        {orderStatus === 'assigned' && (
          <div style={styles.driverCard}>
            <div style={styles.driverInfo}>
              <img src="/driver-avatar.png" alt="Driver" style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px' }} />
              <div>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '18px' }}>U Kyaw Kyaw</p>
                <p style={{ color: '#666', margin: 0 }}>White Toyota Probox - YGN-1234</p>
              </div>
            </div>
            <div style={styles.driverActions}>
              <button style={{ ...styles.actionButton, backgroundColor: '#22c55e', color: 'white' }}>Call Driver</button>
              <button onClick={() => setChatOpen(true)} style={{ ...styles.actionButton, backgroundColor: '#3b82f6', color: 'white' }}>Message</button>
            </div>
          </div>
        )}

        {/* Chat Overlay */}
        {isChatOpen && (
          <div style={styles.chatOverlay}>
            <div style={styles.chatHeader}>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
              <p style={{ fontWeight: 'bold', margin: 0, marginLeft: '10px' }}>U Kyaw Kyaw</p>
            </div>
            <div style={styles.chatMessages}>
              {messages.map(msg => (
                <div key={msg.id} style={{ ...styles.messageBubble, ...(msg.sender === 'user' ? styles.userMessage : styles.driverMessage) }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={styles.chatInputContainer}>
              <div style={styles.quickReplyContainer}>
                <button onClick={() => handleSendMessage('I am coming')} style={styles.quickReplyButton}>I am coming</button>
                <button onClick={() => handleSendMessage('Please wait')} style={styles.quickReplyButton}>Please wait</button>
                <button onClick={() => handleSendMessage('Where are you?')} style={styles.quickReplyButton}>Where are you?</button>
              </div>
              <div style={styles.messageInputRow}>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={styles.messageInputField} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <button onClick={() => handleSendMessage()} style={styles.sendButton}>Send</button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </>
  );
}
