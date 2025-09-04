"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bus, PlayCircle, StopCircle, MapPin, Clock } from 'lucide-react';
import { shuttles } from '@/lib/data';
import type { Shuttle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DriverDashboard() {
  const [selectedShuttle, setSelectedShuttle] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking]);

  useEffect(() => {
    let watchId: number;
    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          // In a real application, you would send this location data to your backend.
          console.log('New Location:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to mock location for demo purposes.
          setCurrentLocation({ lat: 12.9712 + Math.random() * 0.01, lng: 79.1596 + Math.random() * 0.01 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  const handleStartTracking = () => {
    if (!selectedShuttle) {
      toast({ title: 'Error', description: 'Please select a shuttle first.', variant: 'destructive' });
      return;
    }
    setIsTracking(true);
    setElapsedTime(0);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const shuttleDetails = selectedShuttle ? shuttles.find(s => s.id === selectedShuttle) : null;

  return (
    <div className="p-4 md:p-8 flex justify-center items-start h-full mt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Bus /> Driver Dashboard</CardTitle>
          <CardDescription>Manage your shuttle service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="shuttle-select" className="text-sm font-medium">Select Shuttle</label>
            <Select onValueChange={setSelectedShuttle} disabled={isTracking}>
              <SelectTrigger id="shuttle-select">
                <SelectValue placeholder="Choose your shuttle" />
              </SelectTrigger>
              <SelectContent>
                {shuttles.map((shuttle: Shuttle) => (
                  <SelectItem key={shuttle.id} value={shuttle.id}>{shuttle.name} - {shuttle.route}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {shuttleDetails && (
             <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                 <h3 className="font-semibold">Shuttle Details</h3>
                 <p className="text-sm text-muted-foreground">Route: {shuttleDetails.route}</p>
                 <p className="text-sm text-muted-foreground">Capacity: {shuttleDetails.capacity}</p>
             </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleStartTracking} disabled={isTracking || !selectedShuttle} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <PlayCircle className="mr-2 h-4 w-4" /> Start Tracking
            </Button>
            <Button onClick={handleStopTracking} disabled={!isTracking} variant="destructive" className="w-full">
              <StopCircle className="mr-2 h-4 w-4" /> Stop Tracking
            </Button>
          </div>

          {isTracking && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Service Duration</p>
                  <p className="font-mono text-lg">{formatTime(elapsedTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Current Location</p>
                  <p className="text-sm text-muted-foreground">
                    {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'Acquiring location...'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
