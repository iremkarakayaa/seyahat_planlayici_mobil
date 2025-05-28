import { createContext, ReactNode, useContext, useState } from 'react';

// Seyahat tipi tanımlaması
export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
  created: Date;
};

// Context için tip tanımı
type TripsContextType = {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'created'>) => void;
  removeTrip: (id: string) => void;
};

// Context oluşturma
const TripsContext = createContext<TripsContextType | undefined>(undefined);

// Context provider bileşeni
export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);

  // Yeni seyahat ekleme
  const addTrip = (tripData: Omit<Trip, 'id' | 'created'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(), // Basit bir ID oluşturma
      created: new Date(),
    };
    setTrips([...trips, newTrip]);
  };

  // Seyahat silme
  const removeTrip = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  return (
    <TripsContext.Provider value={{ trips, addTrip, removeTrip }}>
      {children}
    </TripsContext.Provider>
  );
}

// Hook olarak kullanmak için
export function useTrips() {
  const context = useContext(TripsContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
} 