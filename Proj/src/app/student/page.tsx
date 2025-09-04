'use client';

import { useState } from 'react';
import ShuttleMap from '@/components/student/shuttle-map';
import BookingHistory from '@/components/student/booking-history';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import type { BoardingPoint } from '@/lib/types';
import { boardingPoints } from '@/lib/data';

export default function StudentPage() {
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<BoardingPoint | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handlePointSelection = (value: string) => {
    const point = boardingPoints.find(p => p.id === value);
    setSelectedBoardingPoint(point || null);
  };
  
  const handleProceed = () => {
    if (selectedBoardingPoint) {
      setShowMap(true);
    }
  }

  if (!showMap) {
    return (
        <main className="flex justify-center items-center h-[calc(100vh-4rem)] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <MapPin />
                Where are you now?
              </CardTitle>
              <CardDescription>Select your current location to find nearby shuttles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={handlePointSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a boarding point" />
                </SelectTrigger>
                <SelectContent>
                  {boardingPoints.map((point) => (
                    <SelectItem key={point.id} value={point.id}>
                      {point.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleProceed} disabled={!selectedBoardingPoint} className="w-full">
                Find Shuttles
              </Button>
            </CardContent>
          </Card>
        </main>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 text-center">
        <h1 className="font-headline text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
            Showing shuttles near <span className="font-semibold text-primary">{selectedBoardingPoint?.name}</span>. {' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => setShowMap(false)}>Change location</Button>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 flex-grow">
        <div className="lg:col-span-2 h-full">
          <ShuttleMap boardingPoint={selectedBoardingPoint!} />
        </div>
        <div className="h-full">
          <BookingHistory />
        </div>
      </div>
    </div>
  );
}
