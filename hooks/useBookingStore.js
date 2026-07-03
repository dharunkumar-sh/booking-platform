import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBookingStore = create(
  persist(
    (set) => ({
      user: null,
      pendingBooking: null,
      dbBookingId: null,
      confirmedBookings: [],
      selectedEvent: null,
      favourites: [],
      favouritePendingEventId: null,
      likePendingEventId: null,
      loginRedirect: null,
      notifications: [],
      sessionId: null,
      bookingStartedAt: null,

      setUser: (user) => set({ user }),
      logout: () => set({ 
        user: null, 
        pendingBooking: null, 
        dbBookingId: null, 
        selectedEvent: null,
        favourites: [],
        favouritePendingEventId: null,
        likePendingEventId: null,
        loginRedirect: null,
        notifications: [],
        bookingStartedAt: null,
      }),
      setPendingBooking: (pendingBooking) => set({ pendingBooking }),
      clearPendingBooking: () => set({ pendingBooking: null }),
      setDbBookingId: (dbBookingId) => set({ dbBookingId }),
      clearDbBookingId: () => set({ dbBookingId: null }),
      setConfirmedBookings: (confirmedBookings) => set({ confirmedBookings }),
      addConfirmedBooking: (booking) => set((state) => ({ confirmedBookings: [...state.confirmedBookings, booking] })),
      setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
      setFavourites: (favourites) => set({ favourites }),
      setFavouritePendingEventId: (id) => set({ favouritePendingEventId: id }),
      setLikePendingEventId: (id) => set({ likePendingEventId: id }),
      setLoginRedirect: (path) => set({ loginRedirect: path }),
      setNotifications: (notifications) => set({ notifications }),
      setSessionId: (sessionId) => set({ sessionId }),
      setBookingStartedAt: (bookingStartedAt) => set({ bookingStartedAt }),
    }),
    {
      name: "vibepass-storage",
    }
  )
);
