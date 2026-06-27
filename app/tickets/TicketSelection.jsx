"use client"
import React, { useState } from 'react';
import TicketCard from './TicketCard';
import styles from './Tickets.module.css';
import { ArrowRight, ArrowLeft, CheckCircle2, Calendar, MapPin, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TICKET_DATA = [
  {
    id: 'silver',
    title: 'Silver Pass',
    price: 499,
    description: 'Standard entry pass to the event with access to all general areas.',
    benefits: ['General Admission', 'Standard Seating', 'Food Court Access'],
    availableCount: 150,
    status: 'Available',
    isPopular: false
  },
  {
    id: 'gold',
    title: 'Gold Pass',
    price: 999,
    description: 'Premium experience with better seating and exclusive perks.',
    benefits: ['Priority Entry', 'Premium Seating', '1 Complimentary Drink', 'Exclusive Lounge Access'],
    availableCount: 45,
    status: 'Filling Fast',
    isPopular: true
  },
  {
    id: 'vip',
    title: 'VIP Experience',
    price: 1999,
    description: 'The ultimate luxury experience with backstage access.',
    benefits: ['Backstage Tour', 'Front Row Seating', 'All-inclusive Food & Drinks', 'Meet & Greet', 'Free Parking'],
    availableCount: 15,
    status: 'Filling Fast',
    isPopular: false
  }
];

const TicketSelection = ({
  event = { title: 'Special Event Concert', venue: 'Main Arena', priceVal: 499 },
  confirmedSeats = [],
  onBack = null,
  onConfirmBooking = () => {}
}) => {
  const router = useRouter();
  const [selections, setSelections] = useState({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const selectedTickets = TICKET_DATA.filter(ticket => selections[ticket.id] > 0);
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
    setBookingConfirmed(true);
    onConfirmBooking({
      event,
      seats: confirmedSeats,
      tickets: selectedTickets.map(t => ({ id: t.id, title: t.title, quantity: selections[t.id], price: t.price })),
      total: totalAmount
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

      {!isStandalone && (
        <div className={styles.seatsNotification}>
          <p>
            🎟️ You selected <strong>{confirmedSeats.length} seats</strong>: {confirmedSeats.map(s => s.label || s.id).join(', ')}. 
            Please select exactly <strong>{confirmedSeats.length} tickets</strong> to proceed.
          </p>
        </div>
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.grid}>
          {TICKET_DATA.map(ticket => (
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
