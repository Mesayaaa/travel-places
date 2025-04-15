"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Place } from "../data/places";

interface TripPlanMinimal {
  id: number;
  name: string;
  places: Place[];
}

type TripContextType = {
  currentTrip: TripPlanMinimal | null;
  addPlaceToTrip: (place: Place) => void;
  removePlaceFromTrip: (placeId: number) => void;
  isInCurrentTrip: (placeId: number) => boolean;
  placesInTrip: Place[];
  tripName: string;
  setTripName: (name: string) => void;
  saveCurrentTrip: () => void;
  clearCurrentTrip: () => void;
  openTripPlanModal: boolean;
  setOpenTripPlanModal: (open: boolean) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrip, setCurrentTrip] = useState<TripPlanMinimal | null>(null);
  const [placesInTrip, setPlacesInTrip] = useState<Place[]>([]);
  const [tripName, setTripName] = useState<string>("My Trip");
  const [openTripPlanModal, setOpenTripPlanModal] = useState<boolean>(false);

  // Load current trip from localStorage on mount
  useEffect(() => {
    const storedTrip = localStorage.getItem("currentTrip");
    if (storedTrip) {
      try {
        const parsedTrip = JSON.parse(storedTrip);
        setCurrentTrip(parsedTrip);
        setPlacesInTrip(parsedTrip.places || []);
        setTripName(parsedTrip.name || "My Trip");
      } catch (error) {
        console.error("Error parsing current trip from localStorage", error);
      }
    } else {
      // Initialize with empty trip if none exists
      const newTrip = {
        id: Date.now(),
        name: "My Trip",
        places: [],
      };
      setCurrentTrip(newTrip);
      localStorage.setItem("currentTrip", JSON.stringify(newTrip));
    }
  }, []);

  // Save current trip to localStorage when updated
  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem("currentTrip", JSON.stringify(currentTrip));
    }
  }, [currentTrip]);

  const addPlaceToTrip = (place: Place) => {
    if (!currentTrip) return;

    // Check if place is already in the trip
    if (!placesInTrip.some((p) => p.id === place.id)) {
      const updatedPlaces = [...placesInTrip, place];
      setPlacesInTrip(updatedPlaces);
      setCurrentTrip({
        ...currentTrip,
        places: updatedPlaces,
      });
    }
  };

  const removePlaceFromTrip = (placeId: number) => {
    if (!currentTrip) return;

    const updatedPlaces = placesInTrip.filter((place) => place.id !== placeId);
    setPlacesInTrip(updatedPlaces);
    setCurrentTrip({
      ...currentTrip,
      places: updatedPlaces,
    });
  };

  const isInCurrentTrip = (placeId: number) => {
    return placesInTrip.some((place) => place.id === placeId);
  };

  const saveCurrentTrip = () => {
    if (!currentTrip || placesInTrip.length === 0) return;

    // Open the trip plan modal to complete trip details
    setOpenTripPlanModal(true);
  };

  const clearCurrentTrip = () => {
    const newTrip = {
      id: Date.now(),
      name: "My Trip",
      places: [],
    };
    setCurrentTrip(newTrip);
    setPlacesInTrip([]);
    setTripName("My Trip");
    localStorage.setItem("currentTrip", JSON.stringify(newTrip));
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        addPlaceToTrip,
        removePlaceFromTrip,
        isInCurrentTrip,
        placesInTrip,
        tripName,
        setTripName,
        saveCurrentTrip,
        clearCurrentTrip,
        openTripPlanModal,
        setOpenTripPlanModal,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
