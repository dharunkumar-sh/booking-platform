"use client"
import React, { useState } from 'react';
import TicketCard from './TicketCard';
import styles from './Tickets.module.css';
import { ArrowRight } from 'lucide-react';

const TICKET_DATA = [
  {
    id: 'silver',
    title: 'Silver Pass',
    price: 49.99,
    description: 'Standard entry pass to the event with access to all general areas.',
    benefits: ['General Admission', 'Standard Seating', 'Food Court Access'],
    availableCount: 150,
    status: 'Available',
    isPopular: false
  },
  {
    id: 'gold',
    title: 'Gold Pass',
    price: 99.99,
    description: 'Premium experience with better seating and exclusive perks.',
    benefits: ['Priority Entry', 'Premium Seating', '1 Complimentary Drink', 'Exclusive Lounge Access'],
    availableCount: 45,
    status: 'Filling Fast',
    isPopular: true
  },
  {
    id: 'vip',
    title: 'VIP Experience',
    price: 199.99,
    description: 'The ultimate luxury experience with backstage access.',
    benefits: ['Backstage Tour', 'Front Row Seating', 'All-inclusive Food & Drinks', 'Meet & Greet', 'Free Parking'],
    availableCount: 0,
    status: 'Sold Out',
    isPopular: false
  }
];

const TicketSelection = () => {
  const [selections, setSelections] = useState({});

  const handleUpdateQuantity = (ticketId, quantity) => {
    setSelections(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

  const selectedTickets = TICKET_DATA.filter(ticket => selections[ticket.id] > 0);
  const totalTickets = selectedTickets.reduce((sum, ticket) => sum + selections[ticket.id], 0);
  const totalAmount = selectedTickets.reduce((sum, ticket) => sum + (ticket.price * selections[ticket.id]), 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Your Tickets</h1>
      <p className={styles.subtitle}>Choose the perfect package for your ultimate experience.</p>

      <div className={styles.contentWrapper}>
        <div className={styles.grid}>
          {TICKET_DATA.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              quantity={selections[ticket.id] || 0}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>

        <div className={styles.summaryPanel}>
          <h2 className={styles.summaryTitle}>Booking Summary</h2>
          
          {selectedTickets.length === 0 ? (
            <div className={styles.emptyState}>
              No tickets selected yet. Choose your tickets to proceed.
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
                      ${(ticket.price * selections[ticket.id]).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={styles.summaryTotalRow}>
                <span className={styles.summaryTotalLabel}>Total ({totalTickets} tickets)</span>
                <span className={styles.summaryTotalValue}>${totalAmount.toFixed(2)}</span>
              </div>
            </>
          )}

          <button 
            className={styles.checkoutButton}
            disabled={totalTickets === 0}
          >
            Continue Booking
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
