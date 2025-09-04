'use client';

import { useState, useEffect } from 'react';
import type { Shuttle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SeatSelectionProps {
  shuttle: Shuttle;
  onBookingComplete: () => void;
}

export default function SeatSelection({ shuttle, onBookingComplete }: SeatSelectionProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  const [occupiedSeats, setOccupiedSeats] = useState<Set<number>>(new Set());

  useEffect(() => {
    const newOccupiedSeats = new Set<number>();
    const numOccupied = shuttle.capacity - shuttle.seats_available;
    while(newOccupiedSeats.size < numOccupied) {
      // Ensure seat 1 (driver) is not occupied
      const randomSeat = Math.floor(Math.random() * (shuttle.capacity -1)) + 2;
      newOccupiedSeats.add(randomSeat);
    }
    setOccupiedSeats(newOccupiedSeats);
  }, [shuttle.capacity, shuttle.seats_available]);

  const handleSeatClick = (seatNumber: number) => {
    if (occupiedSeats.has(seatNumber) || seatNumber === 1) return;
    setSelectedSeat(seatNumber === selectedSeat ? null : seatNumber);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat) return;
    setIsBooking(true);

    // Simulate payment and booking process
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsBooking(false);
    onBookingComplete();
    
    toast({
      title: "Booking Confirmed!",
      description: `Your seat (${selectedSeat}) on ${shuttle.name} has been booked. Payment of 20 rs is simulated.`,
      className: "bg-accent text-accent-foreground border-accent-foreground/20",
    });
  };
  
  const isDriverSeat = (seatNumber: number) => seatNumber === 1;

  return (
    <div className="py-4">
      <div className="grid grid-cols-4 gap-3 mb-6 p-4 bg-muted/50 rounded-md">
        {[...Array(20)].map((_, i) => {
          const seatNumber = i + 1;
          const isOccupied = occupiedSeats.has(seatNumber);
          const isSelected = seatNumber === selectedSeat;
          
          return (
            <div key={seatNumber} className="relative aspect-square">
              {isDriverSeat(seatNumber) && (
                 <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground font-mono">
                   DRIVER
                 </div>
              )}
              <button
                onClick={() => handleSeatClick(seatNumber)}
                disabled={isOccupied || isDriverSeat(seatNumber)}
                className={`w-full h-full rounded-md flex items-center justify-center font-bold text-sm transition-colors
                  ${(isOccupied || isDriverSeat(seatNumber)) ? 'bg-muted text-muted-foreground cursor-not-allowed' : ''}
                  ${!(isOccupied || isDriverSeat(seatNumber)) ? 'bg-card hover:bg-primary/20' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                `}
              >
                {!isDriverSeat(seatNumber) && seatNumber}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-around items-center mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-card border"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-muted"></div> Occupied</div>
      </div>
      
      <Button 
        onClick={handleConfirmBooking}
        disabled={!selectedSeat || isBooking}
        className="w-full"
      >
        {isBooking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Confirm Booking for Seat ${selectedSeat || ''} (20 rs)`
        )}
      </Button>
    </div>
  );
}
