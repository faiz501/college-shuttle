'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { History, Ticket } from 'lucide-react';

const bookings = [
    { id: 1, route: "Men's Hostel ↔ Main Gate", date: "2024-07-29", seat: 12, price: 20 },
    { id: 2, route: "Main Gate ↔ SJT", date: "2024-07-28", seat: 5, price: 20 },
    { id: 3, route: "Men's Hostel ↔ Main Gate", date: "2024-07-27", seat: 8, price: 20 },
];

export default function BookingHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" /> Booking History
        </CardTitle>
        <CardDescription>Your recent shuttle bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {bookings.map(booking => (
                <div key={booking.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <Ticket className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                        <p className="font-semibold">{booking.route}</p>
                        <p className="text-sm text-muted-foreground">
                            Seat {booking.seat} on {booking.date}
                        </p>
                    </div>
                    <div className="font-bold text-lg">{booking.price} rs</div>
                </div>
            ))}
            {bookings.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No recent bookings found.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
