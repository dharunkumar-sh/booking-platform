"use client";

import { useState } from "react";
import { Check, X, ShieldAlert, Info, Plus, Minus } from "lucide-react";

export default function SeatSelection({
  event = {
    title: "Special Event Concert",
    venue: "Main Arena",
    priceVal: 499,
  },
  onConfirmSelection = () => {},
  onCancel = () => {},
}) {
  // Venue type detection: theatre, stadium, and hall venues get the seat grid; others use zone selection
  const isTheatre = /theat(re|er)|stadium|hall|palazzo|cinema|multiplex|pvr/i.test(event.venue);
  const isOpenSpace = !isTheatre;

  // Define Seat Configuration for Theatre
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;

  // Ticket Categories & Pricing
  const categories = {
    VIP: {
      rows: ["A", "B"],
      price: event.priceVal ? Math.round(event.priceVal * 2.5) : 1250,
      color: "#fbbf24", // Golden Yellow
      glow: "rgba(251, 191, 36, 0.4)",
      label: isOpenSpace ? "VIP Lounge" : "VIP",
    },
    Premium: {
      rows: ["C", "D", "E"],
      price: event.priceVal ? Math.round(event.priceVal * 1.5) : 750,
      color: "#ff2a85", // Neon Pink
      glow: "rgba(255, 42, 133, 0.4)",
      label: isOpenSpace ? "Premium Pit" : "Premium",
    },
    Standard: {
      rows: ["F", "G", "H"],
      price: event.priceVal ? event.priceVal : 499,
      color: "#00f0ff", // Electric Cyan
      glow: "rgba(0, 240, 255, 0.4)",
      label: isOpenSpace ? "General Admission" : "Standard",
    },
  };

  // Mock occupied seats for Theatre
  const [occupiedSeats] = useState(
    new Set([
      "A-3", "A-4", "B-7", "B-8",
      "C-1", "C-2", "D-11", "D-12",
      "E-5", "E-6", "F-9", "G-2", "H-10"
    ])
  );

  // Array of ticket objects: { id: string, type: 'seat' | 'zone', cat: string, price: number }
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isBooked, setIsBooked] = useState(false);

  const getSeatCategory = (row) => {
    if (categories.VIP.rows.includes(row)) return "VIP";
    if (categories.Premium.rows.includes(row)) return "Premium";
    return "Standard";
  };

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.has(seatId)) return;

    const existingIndex = selectedTickets.findIndex((t) => t.id === seatId);
    if (existingIndex >= 0) {
      setSelectedTickets((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      if (selectedTickets.length >= 6) {
        alert("You can select a maximum of 6 tickets at a time.");
        return;
      }
      const [row] = seatId.split("-");
      const cat = getSeatCategory(row);
      setSelectedTickets((prev) => [
        ...prev,
        { id: seatId, type: "seat", cat, price: categories[cat].price },
      ]);
    }
  };

  const addZoneTicket = (catKey) => {
    if (selectedTickets.length >= 6) {
      alert("You can select a maximum of 6 tickets at a time.");
      return;
    }
    const zoneId = `${catKey}-${Date.now()}-${Math.random()}`;
    setSelectedTickets((prev) => [
      ...prev,
      { id: zoneId, type: "zone", cat: catKey, price: categories[catKey].price },
    ]);
  };

  const removeZoneTicket = (catKey) => {
    const existingIndex = selectedTickets.findIndex((t) => t.cat === catKey && t.type === "zone");
    if (existingIndex >= 0) {
      setSelectedTickets((prev) => prev.filter((_, i) => i !== existingIndex));
    }
  };

  const removeTicketById = (ticketId) => {
    setSelectedTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  // Calculations
  const subtotal = selectedTickets.reduce((acc, t) => acc + t.price, 0);
  const bookingFee = selectedTickets.length > 0 ? 46 * selectedTickets.length : 0;
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const total = subtotal + bookingFee + cgst + sgst;

  const handleConfirm = () => {
    if (selectedTickets.length === 0) return;
    setIsBooked(true);
    onConfirmSelection({
      tickets: selectedTickets,
      totalPrice: total,
    });
  };

  // Group tickets for display
  const zoneTicketCounts = { VIP: 0, Premium: 0, Standard: 0 };
  selectedTickets.filter(t => t.type === "zone").forEach(t => zoneTicketCounts[t.cat]++);

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header Info */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <span
            style={{
              background: "linear-gradient(90deg, #f97316, #ff5862)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {isOpenSpace ? "Zone Booking" : "Seat Booking"}
          </span>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              marginTop: "8px",
              marginBottom: "4px",
              background: "linear-gradient(to right, #ffffff, #a1a1aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {event.title}
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "15px" }}>📍 {event.venue}</p>
        </div>

        <button
          onClick={onCancel}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px 20px",
            borderRadius: "12px",
            color: "#e4e4e7",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
        >
          Go Back
        </button>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1200px",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Section: Interactive Map / Zones */}
        <div
          style={{
            flex: 2,
            minWidth: "320px",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "24px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}
        >
          {/* Stage Visualization */}
          <div
            style={{
              width: "80%",
              height: "40px",
              background: "linear-gradient(180deg, rgba(249, 115, 22, 0.3) 0%, rgba(249, 115, 22, 0) 100%)",
              borderTop: "4px solid #f97316",
              borderRadius: "50% / 0 0 100% 100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "60px",
              boxShadow: "0 8px 32px rgba(249, 115, 22, 0.2)",
            }}
          >
            <span style={{ fontSize: "12px", letterSpacing: "4px", color: "#fb923c", fontWeight: 700 }}>
              STAGE / SCREEN
            </span>
          </div>

          {isTheatre ? (
            /* --- THEATRE SEAT GRID --- */
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  width: "100%",
                  overflowX: "auto",
                  paddingBottom: "10px",
                }}
              >
                {rows.map((row) => {
                  const cat = getSeatCategory(row);
                  const config = categories[cat];

                  return (
                    <div
                      key={row}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        minWidth: "fit-content",
                      }}
                    >
                      <span style={{ width: "24px", textAlign: "center", fontWeight: 700, color: "#71717a", fontSize: "14px" }}>
                        {row}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {Array.from({ length: seatsPerRow }).map((_, index) => {
                          const seatNum = index + 1;
                          const seatId = `${row}-${seatNum}`;
                          const isOccupied = occupiedSeats.has(seatId);
                          const isSelected = selectedTickets.some(t => t.id === seatId);

                          let bg = "rgba(255, 255, 255, 0.08)";
                          let border = `1px solid rgba(255, 255, 255, 0.15)`;
                          let cursor = "pointer";
                          let shadow = "none";

                          if (isOccupied) {
                            bg = "#27272a"; border = "1px solid #3f3f46"; cursor = "not-allowed";
                          } else if (isSelected) {
                            bg = config.color; border = `1px solid ${config.color}`; shadow = `0 0 12px ${config.glow}`;
                          } else {
                            border = `1px solid ${config.color}55`;
                          }

                          return (
                            <button
                              key={seatId}
                              onClick={() => handleSeatClick(seatId)}
                              disabled={isOccupied}
                              title={`${seatId} (${cat} - ₹${config.price})`}
                              style={{
                                width: "28px", height: "28px", borderRadius: "6px",
                                background: bg, border: border, cursor: cursor,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "10px", fontWeight: 700,
                                color: isSelected ? "#000" : isOccupied ? "#52525b" : "#e4e4e7",
                                transition: "all 0.15s ease", boxShadow: shadow,
                              }}
                              onMouseEnter={(e) => {
                                if (!isOccupied && !isSelected) {
                                  e.currentTarget.style.background = config.color;
                                  e.currentTarget.style.color = "#000";
                                  e.currentTarget.style.boxShadow = `0 0 8px ${config.glow}`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isOccupied && !isSelected) {
                                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                                  e.currentTarget.style.color = "#e4e4e7";
                                  e.currentTarget.style.boxShadow = "none";
                                }
                              }}
                            >
                              {seatNum}
                            </button>
                          );
                        })}
                      </div>
                      <span style={{ width: "24px", textAlign: "center", fontWeight: 700, color: "#71717a", fontSize: "14px" }}>
                        {row}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legends */}
              <div style={{ display: "flex", gap: "24px", marginTop: "40px", flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <span style={{ fontSize: "13px", color: "#a1a1aa" }}>Available</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#27272a", border: "1px solid #3f3f46" }} />
                  <span style={{ fontSize: "13px", color: "#a1a1aa" }}>Reserved</span>
                </div>
                {Object.keys(categories).map(catKey => (
                  <div key={catKey} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: categories[catKey].color, border: `1px solid ${categories[catKey].color}` }} />
                    <span style={{ fontSize: "13px", color: "#a1a1aa" }}>{categories[catKey].label} (₹{categories[catKey].price})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* --- OPEN SPACE ZONE SELECTION --- */
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "500px" }}>
              {Object.keys(categories).map((catKey) => {
                const config = categories[catKey];
                const count = zoneTicketCounts[catKey];

                return (
                  <div
                    key={catKey}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px",
                      background: count > 0 ? `${config.color}15` : "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${count > 0 ? config.color : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      boxShadow: count > 0 ? `0 0 20px ${config.glow}` : "none",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "4px" }}>
                        {config.label}
                      </h3>
                      <p style={{ color: config.color, fontSize: "15px", fontWeight: 600 }}>₹{config.price}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <button
                        onClick={() => removeZoneTicket(catKey)}
                        disabled={count === 0}
                        style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: count === 0 ? "#27272a" : "rgba(255,255,255,0.1)",
                          border: "none", color: count === 0 ? "#52525b" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: count === 0 ? "not-allowed" : "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <Minus size={18} />
                      </button>
                      <span style={{ fontSize: "18px", fontWeight: 700, width: "24px", textAlign: "center" }}>
                        {count}
                      </span>
                      <button
                        onClick={() => addZoneTicket(catKey)}
                        disabled={selectedTickets.length >= 6}
                        style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: selectedTickets.length >= 6 ? "#27272a" : config.color,
                          border: "none", color: selectedTickets.length >= 6 ? "#52525b" : "black",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: selectedTickets.length >= 6 ? "not-allowed" : "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Section: Summary & Checkout */}
        <div
          style={{
            flex: 1,
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Details & Selection Panel */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>Ticket Summary</h2>

            {selectedTickets.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                  textAlign: "center",
                  color: "#71717a",
                }}
              >
                <Info size={40} style={{ marginBottom: "12px", color: "#3f3f46" }} />
                <p style={{ fontSize: "14px" }}>No tickets selected yet.</p>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  {isTheatre ? "Click on the seat layout to select your spot." : "Select quantities for your preferred zones."}
                </p>
              </div>
            ) : (
              <div>
                {/* Chosen Tickets list */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "24px",
                  }}
                >
                  {isTheatre ? (
                    // Display individual seats for theatre
                    selectedTickets.map((t) => {
                      const config = categories[t.cat];
                      return (
                        <span
                          key={t.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: `${config.color}20`,
                            border: `1px solid ${config.color}40`,
                            color: config.color,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          {t.id}
                          <button
                            onClick={() => removeTicketById(t.id)}
                            style={{ background: "transparent", border: "none", color: config.color, cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    // Display aggregated zones for open space
                    Object.keys(categories).map(catKey => {
                      const count = zoneTicketCounts[catKey];
                      if (count === 0) return null;
                      const config = categories[catKey];
                      return (
                        <span
                          key={catKey}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: `${config.color}20`,
                            border: `1px solid ${config.color}40`,
                            color: config.color,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          {count}x {config.label}
                        </span>
                      );
                    })
                  )}
                </div>

                {/* Bill Breakdown */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    paddingTop: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#a1a1aa" }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#a1a1aa" }}>
                    <span>Booking Fee (₹46 / ticket)</span>
                    <span>₹{bookingFee}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#a1a1aa" }}>
                    <span>CGST (9%)</span>
                    <span>₹{cgst}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#a1a1aa" }}>
                    <span>SGST (9%)</span>
                    <span>₹{sgst}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "18px",
                      fontWeight: 700,
                      borderTop: "1px dashed rgba(255, 255, 255, 0.15)",
                      paddingTop: "16px",
                      marginTop: "4px",
                      color: "#fb923c",
                    }}
                  >
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleConfirm}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(90deg, #f97316, #ff5862)",
                    border: "none",
                    borderRadius: "14px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "16px",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.95";
                    e.currentTarget.style.transform = "scale(1.01)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>

          {/* Secure Booking Notice */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.01)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <ShieldAlert size={20} style={{ color: "#fb923c", flexShrink: 0 }} />
            <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>
              Tickets are reserved for 10 minutes upon selection. Please complete your transaction to guarantee your booking.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal Simulation */}
      {isBooked && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#18181b",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(34, 197, 94, 0.1)",
                border: "2px solid #22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: "#22c55e",
              }}
            >
              <Check size={40} />
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>Booking Confirmed!</h2>
            <p style={{ color: "#a1a1aa", fontSize: "15px", marginBottom: "32px" }}>
              Your tickets for <strong>{event.title}</strong> have been successfully booked.
            </p>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "32px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                <span style={{ color: "#71717a" }}>Selected Tickets</span>
                <span style={{ fontWeight: 600, color: "white", textAlign: "right" }}>
                  {isTheatre
                    ? selectedTickets.map(t => t.id).join(", ")
                    : Object.keys(categories)
                        .filter(cat => zoneTicketCounts[cat] > 0)
                        .map(cat => `${zoneTicketCounts[cat]}x ${categories[cat].label}`)
                        .join(", ")
                  }
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#71717a" }}>Amount Paid</span>
                <span style={{ fontWeight: 700, color: "#fb923c" }}>₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsBooked(false);
                setSelectedTickets([]);
                onCancel();
              }}
              style={{
                width: "100%",
                padding: "14px",
                background: "white",
                color: "black",
                border: "none",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Back to Events
            </button>
          </div>
        </div>
      )}
    </div>
  );
}