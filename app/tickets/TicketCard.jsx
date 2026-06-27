"use client"
import React from 'react';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';
import styles from './Tickets.module.css';

const TicketCard = ({ ticket, quantity, onUpdateQuantity, plusDisabled }) => {
  const { id, title, price, description, benefits, availableCount, status, isPopular } = ticket;
  const isSoldOut = status === 'Sold Out' || availableCount === 0;

  const handleIncrement = () => {
    if (quantity < availableCount && !isSoldOut && !plusDisabled) {
      onUpdateQuantity(id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  const statusClass = 
    status === 'Available' ? styles.statusAvailable :
    status === 'Filling Fast' ? styles.statusFilling :
    styles.statusSoldOut;

  return (
    <div className={`${styles.card} ${isSoldOut ? styles.cardSoldOut : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleWrapper}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {isPopular && <span className={styles.mostPopularBadge}>Most Popular</span>}
        </div>
        
        <div className={`${styles.statusBadge} ${statusClass}`}>
          {isSoldOut ? 'Sold Out' : status} {availableCount > 0 && availableCount <= 20 ? `(${availableCount} left)` : ''}
        </div>
        
        <p className={styles.description}>{description}</p>
        
        {benefits && benefits.length > 0 && (
          <ul className={styles.benefits}>
            {benefits.map((benefit, idx) => (
              <li key={idx} className={styles.benefitItem}>
                <CheckCircle2 size={14} className={styles.benefitIcon} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.priceSection}>
        <div className={styles.priceWrapper}>
          <div className={styles.price}>
            <span className={styles.currency}>₹</span>
            {price}
          </div>
          <span className={styles.priceLabel}>Per Ticket</span>
        </div>

        <div className={styles.quantitySelector}>
          <button 
            className={styles.qtyButton} 
            onClick={handleDecrement}
            disabled={quantity === 0 || isSoldOut}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button 
            className={styles.qtyButton} 
            onClick={handleIncrement}
            disabled={quantity >= availableCount || quantity >= 10 || isSoldOut || plusDisabled}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {quantity > 0 && (
          <div className={styles.subtotal}>
            Subtotal: <span className={styles.subtotalValue}>₹{price * quantity}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
