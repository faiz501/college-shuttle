'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useState, useMemo, useEffect } from 'react';
import { shuttles as initialShuttles, routes } from '@/lib/data';
import type { Shuttle, BoardingPoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, Users, Loader2, MapPin, Clock } from 'lucide-react';
import SeatSelection from './seat-selection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID";
const NEARBY_RADIUS_METERS = 1500; // 1.5km
const SHUTTLE_SPEED_MPS = 5.5; // meters per second (~20 km/h)
const SIMULATION_INTERVAL_MS = 2000; // 2 seconds

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (point1: {lat: number, lng: number}, point2: {lat: number, lng: number}) => {
    const R = 6371e3; // metres
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

export default function ShuttleMap({ boardingPoint }: { boardingPoint: BoardingPoint }) {
  const [selectedShuttle, setSelectedShuttle] = useState<Shuttle | null>(null);
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [shuttles, setShuttles] = useState(initialShuttles);
  const [shuttleProgress, setShuttleProgress] = useState<Record<string, { segment: number, progress: number, forward: boolean }>>({});

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

    const initialProgress: Record<string, { segment: number, progress: number, forward: boolean }> = {};
    initialShuttles.forEach(s => {
      if (s.status === 'active') {
        initialProgress[s.id] = { segment: 0, progress: 0, forward: true };
      }
    });
    setShuttleProgress(initialProgress);
  }, []);

  useEffect(() => {
    const simulation = setInterval(() => {
      setShuttles(currentShuttles =>
        currentShuttles.map(shuttle => {
          if (shuttle.status !== 'active') return shuttle;

          const routeInfo = routes.find(r => r.name === shuttle.route);
          if (!routeInfo) return shuttle;

          let { segment, progress, forward } = shuttleProgress[shuttle.id] || { segment: 0, progress: 0, forward: true };
          
          progress += 0.1; // Move along the segment

          if (progress >= 1) {
            progress = 0;
            segment = forward ? segment + 1 : segment - 1;

            if (forward && segment >= routeInfo.path.length - 1) {
              segment = routeInfo.path.length - 2;
              forward = false; // Reverse direction
            } else if (!forward && segment < 0) {
              segment = 0;
              forward = true; // Go forward again
            }
          }
          
          setShuttleProgress(prev => ({...prev, [shuttle.id]: { segment, progress, forward }}));
          
          const startPoint = routeInfo.path[segment];
          const endPoint = routeInfo.path[segment + 1];

          if (!startPoint || !endPoint) return shuttle;

          const newLat = startPoint.lat + (endPoint.lat - startPoint.lat) * progress;
          const newLng = startPoint.lng + (endPoint.lng - startPoint.lng) * progress;

          return { ...shuttle, location: { lat: newLat, lng: newLng } };
        })
      );
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(simulation);
  }, [shuttleProgress]);

  const nearbyShuttles = useMemo(() => {
    if (!boardingPoint) return [];
    return shuttles.filter(s => s.status === 'active' && getDistance(boardingPoint.location, s.location) <= NEARBY_RADIUS_METERS);
  }, [boardingPoint, shuttles]);

  const handleMarkerClick = (shuttle: Shuttle) => {
    setSelectedShuttle(shuttle);
  };
  
  const handleBooking = () => {
    if (selectedShuttle) {
        setIsSeatSelectionOpen(true);
    }
  };

  const calculateETA = (shuttle: Shuttle) => {
    if (!boardingPoint) return null;
    const distance = getDistance(shuttle.location, boardingPoint.location);
    const timeSeconds = distance / SHUTTLE_SPEED_MPS;
    const minutes = Math.ceil(timeSeconds / 60);
    return minutes;
  };
  
  if (!apiKey) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Map Unavailable</h3>
            <p className="text-muted-foreground">Google Maps API key is missing. <br/> Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Live Shuttle Map</CardTitle>
            <CardDescription>Click on a shuttle to view details and book a seat.</CardDescription>
          </CardHeader>
        <CardContent className="p-0 flex-grow relative">
           <div className="absolute inset-0">
            <APIProvider apiKey={apiKey}>
              <Map 
                defaultCenter={boardingPoint.location} 
                defaultZoom={15} 
                gestureHandling={'greedy'} 
                disableDefaultUI={true}
                mapId={MAP_ID}
              >
                {nearbyShuttles.map((shuttle) => (
                  <AdvancedMarker key={shuttle.id} position={shuttle.location} onClick={() => handleMarkerClick(shuttle)}>
                    <div className="p-2 bg-primary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <Bus className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </AdvancedMarker>
                ))}
                 <AdvancedMarker position={boardingPoint.location}>
                    <div className="flex flex-col items-center">
                        <div className="p-2 bg-red-500 rounded-full shadow-lg">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <span className="mt-2 font-semibold text-red-500 bg-white/70 px-2 py-1 rounded-md">{boardingPoint.name}</span>
                    </div>
                </AdvancedMarker>
              </Map>
            </APIProvider>
          </div>

          {selectedShuttle && (
            <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
              <CardHeader>
                <CardTitle>{selectedShuttle.name}</CardTitle>
                <CardDescription>{selectedShuttle.route}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{selectedShuttle.seats_available} / {selectedShuttle.capacity} seats available</span>
                  </div>
                  <div className="font-bold text-lg">20 rs</div>
                </div>
                 <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>ETA: <span className="font-bold text-primary">{calculateETA(selectedShuttle)} min</span></span>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleBooking} disabled={selectedShuttle.seats_available === 0}>
                  Book a Seat
                </Button>
              </CardContent>
            </Card>
          )}

          {nearbyShuttles.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                 <p className="text-lg font-semibold text-muted-foreground p-4 bg-background rounded-lg shadow-lg">No active shuttles found nearby.</p>
             </div>
          )}
        </CardContent>
      </Card>
      
      {selectedShuttle && 
        <Dialog open={isSeatSelectionOpen} onOpenChange={setIsSeatSelectionOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Your Seat</DialogTitle>
                    <DialogDescription>
                        Choose a seat on {selectedShuttle.name}. Unavailable seats are marked.
                    </DialogDescription>
                </DialogHeader>
                <SeatSelection shuttle={selectedShuttle} onBookingComplete={() => setIsSeatSelectionOpen(false)} />
            </DialogContent>
        </Dialog>
      }
    </>
  );
}
