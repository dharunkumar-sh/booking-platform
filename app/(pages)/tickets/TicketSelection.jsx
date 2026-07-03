"use client"
import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import styles from './Tickets.module.css';
import { ArrowRight, ArrowLeft, CheckCircle2, Calendar, MapPin, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BookingTimer from '@/components/BookingTimer';
import { useBookingStore } from "@/hooks/useBookingStore";

const TicketSelection = ({
  event = { title: 'Special Event Concert', venue: 'Main Arena', priceVal: 499 },
  confirmedSeats = [],
  onBack = null,
  onConfirmBooking = () => {}
}) => {
  const router = useRouter();
  const [selections, setSelections] = useState({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [passesData, setPassesData] = useState(null);

  useEffect(() => {
    if (event?.id) {
      fetch(`/api/bookings/pass-status?eventId=${event.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.passes) {
            setPassesData(data.passes);
          }
        })
        .catch((err) => console.error("Error fetching pass status in TicketSelection:", err));
    }
  }, [event?.id]);

  const getPassAvailableCount = (passId, fallback) => {
    return passesData?.[passId]?.availableCount !== undefined ? passesData[passId].availableCount : fallback;
  };

  const getPassStatusLabel = (passId, fallback) => {
    return passesData?.[passId]?.status || fallback;
  };

  const seatPriceSum = confirmedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const basePrice = confirmedSeats.length > 0 
    ? Math.round(seatPriceSum / confirmedSeats.length) 
    : (event.priceVal || 499);

  const ticketTypes = [
    {
      id: 'general',
      title: 'General Pass',
      price: basePrice,
      description: 'Standard general entry pass to the event with no additions.',
      benefits: ['General Admission Entry', 'Standard Zone Access'],
      availableCount: getPassAvailableCount('general', 200),
      status: getPassStatusLabel('general', 'Available'),
      isPopular: false
    },
    {
      id: 'silver',
      title: 'Silver Pass',
      price: basePrice + 150,
      description: 'Enhanced standard pass with standard seating and food court coupons.',
      benefits: ['General Admission Entry', 'Standard Seating Access', 'Food Court Access', 'Standard Souvenir Pass'],
      availableCount: getPassAvailableCount('silver', 150),
      status: getPassStatusLabel('silver', 'Available'),
      isPopular: false
    },
    {
      id: 'gold',
      title: 'Gold Pass',
      price: basePrice + 450,
      description: 'Premium experience with priority seating and exclusive lounge access.',
      benefits: ['Priority Fast-track Entry', 'Premium Elevated Seating', '1 Complimentary Drink & Snack', 'Exclusive Lounge Access'],
      availableCount: getPassAvailableCount('gold', 45),
      status: getPassStatusLabel('gold', 'Filling Fast'),
      isPopular: true
    },
    {
      id: 'vip',
      title: 'VIP Experience',
      price: basePrice + 1000,
      description: 'The ultimate luxury experience with backstage access and meet & greet.',
      benefits: ['Front Row Seating Access', 'Backstage VIP Pass', 'Meet & Greet with Artists/Cast', 'All-Inclusive Premium Food & Drinks', 'VIP Lounge Access'],
      availableCount: getPassAvailableCount('vip', 15),
      status: getPassStatusLabel('vip', 'Filling Fast'),
      isPopular: false
    }
  ];

  const selectedTickets = ticketTypes.filter(ticket => selections[ticket.id] > 0);
  const totalTickets = selectedTickets.reduce((sum, ticket) => sum + selections[ticket.id], 0);
  const totalAmount = selectedTickets.reduce((sum, ticket) => sum + (ticket.price * selections[ticket.id]), 0);

  const isStandalone = confirmedSeats.length === 0;

  const handleUpdateQuantity = (ticketId, quantity) => {
    const currentQuantity = selections[ticketId] || 0;
    const isIncrement = quantity > currentQuantity;

    if (!isStandalone && isIncrement && totalTickets >= confirmedSeats.length) {
      return; // Do not allow selecting more tickets than confirmed seats
    }

    setSelections(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

  const handleCheckout = () => {
    onConfirmBooking({
      event,
      seats: confirmedSeats,
      tickets: selectedTickets.map(t => ({ id: t.id, title: t.title, quantity: selections[t.id], price: t.price })),
      total: totalAmount,
      bookingStartedAt: useBookingStore.getState().bookingStartedAt || Date.now().toString()
    });
  };

  if (bookingConfirmed) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successHeader}>
            <div className={styles.successIconWrapper}>
              <CheckCircle2 size={48} className={styles.successIcon} />
            </div>
            <h2 className={styles.successTitle}>Booking Confirmed!</h2>
            <p className={styles.successSubtitle}>Your virtual ticket is ready. Show this at the entry gate.</p>
          </div>

          {/* Virtual Ticket Card */}
          <div className={styles.virtualTicket}>
            <div className={styles.ticketMain}>
              <div className={styles.ticketBrand}>
                <span className={styles.brandText}>Antigravity Bookings</span>
                <span className={styles.ticketBadge}>VIP PASS</span>
              </div>
              <h3 className={styles.ticketEventTitle}>{event.title}</h3>
              
              <div className={styles.ticketMetaGrid}>
                <div>
                  <span className={styles.metaLabel}>VENUE</span>
                  <span className={styles.metaValue}>{event.venue}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>SEATS</span>
                  <span className={styles.metaValue}>
                    {isStandalone ? 'General' : confirmedSeats.map(s => s.label || s.id).join(', ')}
                  </span>
                </div>
                <div>
                  <span className={styles.metaLabel}>DATE</span>
                  <span className={styles.metaValue}>July 15, 2026</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>TICKETS</span>
                  <span className={styles.metaValue}>
                    {selectedTickets.map(t => `${selections[t.id]}x ${t.title}`).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.ticketDivider}>
              <div className={styles.leftCutout}></div>
              <div className={styles.dashedLine}></div>
              <div className={styles.rightCutout}></div>
            </div>

            <div className={styles.ticketStub}>
              <div className={styles.qrWrapper}>
                <QrCode size={100} className={styles.qrCode} />
                <span className={styles.stubSerial}>#AG-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className={styles.priceSummary}>
                <span className={styles.stubLabel}>TOTAL PAID</span>
                <span className={styles.stubPrice}>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          <button 
            className={styles.homeButton}
            onClick={() => router.push('/')}
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if plus buttons should be disabled globally
  const isLimitReached = !isStandalone && totalTickets >= confirmedSeats.length;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            <ArrowLeft size={16} /> Back to Seats
          </button>
        )}
        <div>
          <h1 className={styles.title}>Select Your Tickets</h1>
          <p className={styles.subtitle}>Choose your pass types for event "{event.title}".</p>
        </div>
      </div>

      <BookingTimer />


      <div className={styles.contentWrapper}>
        <div className={styles.grid}>
          {ticketTypes.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              quantity={selections[ticket.id] || 0}
              onUpdateQuantity={handleUpdateQuantity}
              plusDisabled={isLimitReached}
            />
          ))}
        </div>

        <div className={styles.summaryPanel}>
          <h2 className={styles.summaryTitle}>Booking Summary</h2>
          
          {selectedTickets.length === 0 ? (
            <div className={styles.emptyState}>
              No tickets selected yet. Allocate passes for your seats.
            </div>
          ) : (
            <>
              <div className={styles.summaryList}>
                {selectedTickets.map(ticket => (
                  <div key={ticket.id} className={styles.summaryItem}>
                    <span className={styles.summaryItemName}>
                      {selections[ticket.id]}x {ticket.title}
                    </span>
                    <span className={styles.summaryItemPrice}>
                      ₹{ticket.price * selections[ticket.id]}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={styles.summaryTotalRow}>
                <span className={styles.summaryTotalLabel}>Total ({totalTickets} tickets)</span>
                <span className={styles.summaryTotalValue}>₹{totalAmount}</span>
              </div>
            </>
          )}

          <button 
            className={styles.checkoutButton}
            disabled={!isStandalone && totalTickets !== confirmedSeats.length}
            onClick={handleCheckout}
          >
            {isStandalone ? (
              <>Continue Booking <ArrowRight size={18} /></>
            ) : totalTickets === confirmedSeats.length ? (
              <>Confirm Ticket Booking <ArrowRight size={18} /></>
            ) : (
              `Select ${confirmedSeats.length} tickets (${totalTickets}/${confirmedSeats.length})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
