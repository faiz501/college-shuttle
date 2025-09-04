export type Shuttle = {
  id: string;
  name: string;
  route: 'Men’s Hostel ↔ Main Gate' | 'Main Gate ↔ SJT';
  location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  seats_available: number;
  status: 'active' | 'inactive';
};

export type RouteInfo = {
  name: 'Men’s Hostel ↔ Main Gate' | 'Main Gate ↔ SJT';
  stops: string[];
  path: { lat: number, lng: number }[];
  schedule: {
    departure: string;
    arrival: string;
  }[];
};

export type BoardingPoint = {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    }
}
