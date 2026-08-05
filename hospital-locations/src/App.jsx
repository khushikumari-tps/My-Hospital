import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, PhoneCall, Mail, Clock, ArrowRight, Calendar, AlertCircle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '1rem',
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const locations = [
  {
    id: 1,
    city: 'New Delhi',
    name: 'Advitya Healthcares - Main Branch',
    address: '123 Healthcare Ave, Connaught Place, New Delhi, 110001',
    phone: '+91 11 2345 6789',
    email: 'delhi@advityahealth.com',
    timings: 'Mon - Sun: 24 Hours',
    emergency: 'Available 24x7',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    id: 2,
    city: 'Mumbai',
    name: 'Advitya Healthcares - West',
    address: '45 Wellness Blvd, Bandra West, Mumbai, 400050',
    phone: '+91 22 9876 5432',
    email: 'mumbai@advityahealth.com',
    timings: 'Mon - Sat: 8:00 AM - 10:00 PM',
    emergency: 'Available 24x7',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566d6af7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lat: 19.0596,
    lng: 72.8295,
  },
  {
    id: 3,
    city: 'Bangalore',
    name: 'Advitya Healthcares - South',
    address: '78 Tech Park Road, Whitefield, Bangalore, 560066',
    phone: '+91 80 1234 5678',
    email: 'bangalore@advityahealth.com',
    timings: 'Mon - Sun: 24 Hours',
    emergency: 'Available 24x7',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lat: 12.9698,
    lng: 77.7499,
  }
];

function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Replace with actual API key
  });

  const [activeMarker, setActiveMarker] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Our <span className="text-teal-600">Locations</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Find an Advitya Healthcares center near you. We bring world-class healthcare closer to your home.
          </motion.p>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-4 rounded-3xl"
        >
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={5}
              options={{
                styles: [
                  {
                    featureType: "all",
                    elementType: "geometry.fill",
                    stylers: [{ weight: "2.00" }]
                  },
                  {
                    featureType: "all",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#9c9c9c" }]
                  },
                  {
                    featureType: "all",
                    elementType: "labels.text",
                    stylers: [{ visibility: "on" }]
                  },
                  {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [{ color: "#f2f2f2" }]
                  },
                  {
                    featureType: "landscape",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#ffffff" }]
                  },
                  {
                    featureType: "landscape.man_made",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#ffffff" }]
                  },
                  {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [{ visibility: "off" }]
                  },
                  {
                    featureType: "road",
                    elementType: "all",
                    stylers: [{ saturation: -100 }, { lightness: 45 }]
                  },
                  {
                    featureType: "road",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#eeeeee" }]
                  },
                  {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#7b7b7b" }]
                  },
                  {
                    featureType: "road",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#ffffff" }]
                  },
                  {
                    featureType: "road.highway",
                    elementType: "all",
                    stylers: [{ visibility: "simplified" }]
                  },
                  {
                    featureType: "road.arterial",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                  },
                  {
                    featureType: "transit",
                    elementType: "all",
                    stylers: [{ visibility: "off" }]
                  },
                  {
                    featureType: "water",
                    elementType: "all",
                    stylers: [{ color: "#46bcec" }, { visibility: "on" }]
                  },
                  {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#c8d7d4" }]
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#070707" }]
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#ffffff" }]
                  }
                ],
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {locations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => setActiveMarker(loc.id)}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/teal-dot.png',
                  }}
                />
              ))}

              {activeMarker && (
                <InfoWindow
                  position={{ 
                    lat: locations.find(l => l.id === activeMarker).lat, 
                    lng: locations.find(l => l.id === activeMarker).lng 
                  }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-teal-700">{locations.find(l => l.id === activeMarker).name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{locations.find(l => l.id === activeMarker).address}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center bg-slate-100 rounded-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Locations Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc, index) => (
            <motion.div 
              key={loc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-teal-100"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-teal-700 shadow-sm">
                  {loc.city}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{loc.name}</h3>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <PhoneCall className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="text-sm">{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="text-sm">{loc.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="text-sm">{loc.timings}</span>
                  </div>
                  <div className="flex items-center gap-3 text-rose-500 bg-rose-50 p-2 rounded-lg mt-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{loc.emergency}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">
                    <MapPin className="w-4 h-4" />
                    Directions
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-teal-600 to-teal-800 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
            Need Immediate Medical Assistance?
          </h2>
          <p className="text-teal-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Our emergency care units are available 24/7. Don't hesitate to reach out if you or a loved one needs urgent care.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-white text-teal-700 font-bold text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all relative z-10"
          >
            <PhoneCall className="w-6 h-6" />
            Call Us 24×7
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
}

export default App;
