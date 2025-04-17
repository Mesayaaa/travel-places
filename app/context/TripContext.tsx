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
  hasError: boolean;
  errorMessage: string;
  clearError: () => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

// Custom event for trip updates
const TRIP_UPDATED_EVENT = "trip_updated";

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrip, setCurrentTrip] = useState<TripPlanMinimal | null>(null);
  const [placesInTrip, setPlacesInTrip] = useState<Place[]>([]);
  const [tripName, setTripName] = useState<string>("My Trip");
  const [openTripPlanModal, setOpenTripPlanModal] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load current trip from localStorage on mount
  useEffect(() => {
    const loadTripFromStorage = () => {
      try {
        const storedTrip = localStorage.getItem("currentTrip");
        if (storedTrip) {
          const parsedTrip = JSON.parse(storedTrip);
          if (validateTripData(parsedTrip)) {
            setCurrentTrip(parsedTrip);
            setPlacesInTrip(parsedTrip.places || []);
            setTripName(parsedTrip.name || "My Trip");
          } else {
            throw new Error("Invalid trip data format");
          }
        } else {
          // Initialize with empty trip if none exists
          initializeEmptyTrip();
        }
      } catch (error) {
        console.error("Error loading trip from localStorage:", error);
        setHasError(true);
        setErrorMessage(
          "Gagal memuat data perjalanan. Membuat perjalanan baru."
        );
        initializeEmptyTrip();
      }
    };

    loadTripFromStorage();
  }, []);

  // Validate trip data structure
  const validateTripData = (data: any): boolean => {
    return (
      data &&
      typeof data === "object" &&
      typeof data.id === "number" &&
      typeof data.name === "string" &&
      Array.isArray(data.places)
    );
  };

  // Initialize with empty trip
  const initializeEmptyTrip = () => {
    const newTrip = {
      id: Date.now(),
      name: "My Trip",
      places: [],
    };
    setCurrentTrip(newTrip);
    setPlacesInTrip([]);
    setTripName("My Trip");

    try {
      localStorage.setItem("currentTrip", JSON.stringify(newTrip));
    } catch (error) {
      console.error("Error saving empty trip to localStorage:", error);
      setHasError(true);
      setErrorMessage("Gagal menyimpan perjalanan ke penyimpanan lokal");
    }
  };

  // Save current trip to localStorage when updated
  useEffect(() => {
    if (currentTrip) {
      try {
        localStorage.setItem("currentTrip", JSON.stringify(currentTrip));
        // Dispatch custom event to notify other components about the update
        const event = new CustomEvent(TRIP_UPDATED_EVENT);
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Error saving current trip to localStorage", error);
        setHasError(true);
        setErrorMessage("Gagal menyimpan perjalanan ke penyimpanan lokal");
      }
    }
  }, [currentTrip]);

  const addPlaceToTrip = (place: Place) => {
    if (!currentTrip) return;

    try {
      // Check if place is already in the trip
      if (!placesInTrip.some((p) => p.id === place.id)) {
        const updatedPlaces = [...placesInTrip, place];
        setPlacesInTrip(updatedPlaces);
        setCurrentTrip({
          ...currentTrip,
          places: updatedPlaces,
        });
      }
    } catch (error) {
      console.error("Error adding place to trip:", error);
      setHasError(true);
      setErrorMessage("Gagal menambahkan tempat ke perjalanan");
    }
  };

  const removePlaceFromTrip = (placeId: number) => {
    if (!currentTrip) return;

    try {
      const updatedPlaces = placesInTrip.filter(
        (place) => place.id !== placeId
      );
      setPlacesInTrip(updatedPlaces);
      setCurrentTrip({
        ...currentTrip,
        places: updatedPlaces,
      });
    } catch (error) {
      console.error("Error removing place from trip:", error);
      setHasError(true);
      setErrorMessage("Gagal menghapus tempat dari perjalanan");
    }
  };

  const isInCurrentTrip = (placeId: number) => {
    return placesInTrip.some((place) => place.id === placeId);
  };

  const saveCurrentTrip = () => {
    if (!currentTrip) {
      setHasError(true);
      setErrorMessage("Tidak ada perjalanan yang aktif");
      return;
    }

    if (placesInTrip.length === 0) {
      setHasError(true);
      setErrorMessage("Tambahkan minimal satu tempat ke perjalanan");
      return;
    }

    // Open the trip plan modal to complete trip details
    setOpenTripPlanModal(true);
  };

  const clearCurrentTrip = () => {
    try {
      const newTrip = {
        id: Date.now(),
        name: "My Trip",
        places: [],
      };
      setCurrentTrip(newTrip);
      setPlacesInTrip([]);
      setTripName("My Trip");
      localStorage.setItem("currentTrip", JSON.stringify(newTrip));

      // Dispatch custom event to notify other components about the update
      const event = new CustomEvent(TRIP_UPDATED_EVENT);
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error clearing current trip:", error);
      setHasError(true);
      setErrorMessage("Gagal membersihkan perjalanan saat ini");
    }
  };

  const clearError = () => {
    setHasError(false);
    setErrorMessage("");
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
        hasError,
        errorMessage,
        clearError,
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

// Export the custom event name for other components to use
export const TRIP_UPDATED_EVENT_NAME = TRIP_UPDATED_EVENT;
