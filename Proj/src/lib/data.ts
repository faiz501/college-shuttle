import type { Shuttle, RouteInfo, BoardingPoint } from './types';

export const shuttles: Shuttle[] = [
  {
    id: 'shuttle-1',
    name: 'Shuttle 1',
    route: 'Men’s Hostel ↔ Main Gate',
    location: { lat: 12.9712, lng: 79.1596 }, // Start of MH route
    capacity: 20,
    seats_available: 14,
    status: 'active',
  },
  {
    id: 'shuttle-2',
    name: 'Shuttle 2',
    route: 'Main Gate ↔ SJT',
    location: { lat: 12.9716, lng: 79.1634 }, // Start of SJT route
    capacity: 20,
    seats_available: 5,
    status: 'active',
  },
  {
    id: 'shuttle-3',
    name: 'Shuttle 3',
    route: 'Men’s Hostel ↔ Main Gate',
    location: { lat: 12.9690, lng: 79.1550 },
    capacity: 20,
    seats_available: 20,
    status: 'inactive',
  },
  {
    id: 'shuttle-4',
    name: 'Shuttle 4',
    route: 'Main Gate ↔ SJT',
    location: { lat: 12.9720, lng: 79.1640 }, // Mid-way on SJT route
    capacity: 20,
    seats_available: 8,
    status: 'active',
  }
];

export const routes: RouteInfo[] = [
  {
    name: 'Men’s Hostel ↔ Main Gate',
    stops: ['Men\'s Hostel', 'Foodys', 'Main Gate'],
    path: [
        { lat: 12.9712, lng: 79.1596 }, // MH
        { lat: 12.9705, lng: 79.1588 }, // Enzo/Foodys area
        { lat: 12.9708, lng: 79.1610 }, 
        { lat: 12.9716, lng: 79.1634 }, // Main Gate
    ],
    schedule: [
      { departure: '08:00 AM', arrival: '08:15 AM' },
      { departure: '09:00 AM', arrival: '09:15 AM' },
      { departure: '10:00 AM', arrival: '10:15 AM' },
    ],
  },
  {
    name: 'Main Gate ↔ SJT',
    stops: ['Main Gate', 'TT', 'SJT'],
    path: [
        { lat: 12.9716, lng: 79.1634 }, // Main Gate
        { lat: 12.9720, lng: 79.1640 }, // TT area
        { lat: 12.9725, lng: 79.1648 }, // SJT
    ],
    schedule: [
      { departure: '08:30 AM', arrival: '08:40 AM' },
      { departure: '09:30 AM', arrival: '09:40 AM' },
      { departure: '10:30 AM', arrival: '10:40 AM' },
    ],
  },
];

export const boardingPoints: BoardingPoint[] = [
    { id: 'main-gate', name: 'Main Gate', location: { lat: 12.9716, lng: 79.1634 } },
    { id: 'enzo', name: 'Enzo', location: { lat: 12.9705, lng: 79.1588 } },
    { id: 'q-block', name: 'Q Block', location: { lat: 12.9745, lng: 79.1601 } },
    { id: 'sjt', name: 'SJT', location: { lat: 12.9725, lng: 79.1648 } }
];

export const analyticsData = {
  usageByTime: [
    { time: '8am', tickets: 45, students: 45 },
    { time: '9am', tickets: 78, students: 78 },
    { time: '10am', tickets: 60, students: 60 },
    { time: '11am', tickets: 82, students: 82 },
    { time: '12pm', tickets: 40, students: 40 },
    { time: '1pm', tickets: 55, students: 55 },
    { time: '2pm', tickets: 65, students: 65 },
    { time: '3pm', tickets: 90, students: 90 },
    { time: '4pm', tickets: 110, students: 110 },
    { time: '5pm', tickets: 120, students: 120 },
  ],
  usageByStop: [
    { stop: "Men's Hostel", value: 450 },
    { stop: "Main Gate", value: 800 },
    { stop: "SJT", value: 650 },
    { stop: "TT", value: 300 },
    { stop: "Foodys", value: 200 },
  ],
};
