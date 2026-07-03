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
      likedEventIds: [],
      likedEvents: [],
      loginRedirect: null,
      notifications: [],
      reviewEvents: [],
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
        likedEventIds: [],
        likedEvents: [],
        loginRedirect: null,
        notifications: [],
        reviewEvents: [],
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
      setLikedEventIds: (likedEventIds) => set({ likedEventIds }),
      toggleLikedEventId: (id) => set((state) => {
        const isLiked = state.likedEventIds.includes(id);
        const likedEventIds = isLiked
          ? state.likedEventIds.filter((item) => item !== id)
          : [...state.likedEventIds, id];
        return { likedEventIds };
      }),
      toggleLikedEvent: (event) => set((state) => {
        const isLiked = state.likedEvents.some((e) => e.id === event.id);
        const likedEvents = isLiked
          ? state.likedEvents.filter((e) => e.id !== event.id)
          : [...state.likedEvents, { id: event.id, title: event.title }];
        return { likedEvents };
      }),
      addReviewEvent: (eventTitle) => set((state) => ({
        reviewEvents: [...state.reviewEvents, { id: `rev-${Date.now()}-${Math.random()}`, title: eventTitle }]
      })),
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
