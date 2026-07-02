"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Ticket, Heart, ThumbsUp } from "lucide-react";

function formatPrice(price) {
  if (price == null) return "";
  if (typeof price === "string" && price.startsWith("₹")) return price;
  const num = Number(price);
  if (isNaN(num)) return String(price);
  return `₹${(num / 100).toFixed(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function EventCard({
  event,
  onBookEvent = () => {},
  isFavourite = () => false,
  toggleFavourite = () => {},
  showTrendingBadge = false,
  style = {},
}) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesLoaded, setLikesLoaded] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80";
  const [imgSrc, setImgSrc] = useState(event.image || fallbackImage);

  // Sync state if event prop changes
  useEffect(() => {
    setImgSrc(event.image || fallbackImage);
  }, [event.image]);

  // Fetch likes count and user like status dynamically on mount
  useEffect(() => {
    const userStored = localStorage.getItem("vibepass_user");
    const userId = userStored ? JSON.parse(userStored).id : "";
    fetch(`/api/events/like?eventId=${event.id}&userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikesCount(data.likes);
          setHasLiked(data.hasLiked);
          setLikesLoaded(true);
        }
      })
      .catch((err) => console.error("Failed to fetch dynamic like count:", err));
  }, [event.id]);

  // Auto-apply pending like after auth redirect
  useEffect(() => {
    const pendingId = localStorage.getItem("like_pending_event_id");
    const userStored = localStorage.getItem("vibepass_user");
    if (pendingId && Number(pendingId) === event.id && userStored) {
      localStorage.removeItem("like_pending_event_id");
      const user = JSON.parse(userStored);
      fetch("/api/events/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, userId: user.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLikesCount(data.likes);
          setHasLiked(data.hasLiked);
        }
      })
      .catch(err => console.error("Pending like apply failed:", err));
    }
  }, [event.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    const userStored = localStorage.getItem("vibepass_user");
    if (!userStored) {
      localStorage.setItem("like_pending_event_id", event.id);
      localStorage.setItem("login_redirect", window.location.pathname);
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStored);
    try {
      const res = await fetch("/api/events/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, userId: user.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLikesCount(data.likes);
          setHasLiked(data.hasLiked);
        }
      })
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div
      onClick={async () => {
        try {
          localStorage.setItem("selectedEvent", JSON.stringify(event));
        } catch (e) {
          console.error(e);
        }
        router.push(`/event-details/${encodeURIComponent(event.title)}`);
      }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-orange-500/20 bg-neutral-900/30 border border-white/5 transition duration-300"
      style={style}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={event.title}
          fill
          priority
          loading="eager"
          unoptimized
          onError={() => setImgSrc(fallbackImage)}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {showTrendingBadge && (
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "linear-gradient(90deg, #f97316, #ff5862)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          🔥 Trending
        </div>
      )}

      <button
        onClick={handleLike}
        style={{
          position: "absolute",
          top: "15px",
          right: "65px",
          padding: "0 12px",
          height: "40px",
          borderRadius: "20px",
          border: "none",
          background: hasLiked ? "rgba(249,115,22,0.95)" : "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          zIndex: 2,
          transition: "all 0.2s",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
        title="Like this event"
      >
        <ThumbsUp
          size={15}
          style={{
            color: hasLiked ? "white" : "#f97316",
            fill: hasLiked ? "white" : "none",
          }}
        />
        {likesLoaded && likesCount > 0 && (
          <span style={{ fontSize: "12px", fontWeight: "bold", color: hasLiked ? "white" : "#1f2937" }}>
            {likesCount}
          </span>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavourite(event);
        }}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          background: isFavourite(event.id) ? "rgba(244,63,94,0.95)" : "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 2,
          transition: "background 0.2s",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
        title={isFavourite(event.id) ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart
          size={17}
          style={{
            color: isFavourite(event.id) ? "white" : "#f43f5e",
            fill: isFavourite(event.id) ? "white" : "none",
            transition: "all 0.2s",
          }}
        />
      </button>

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col justify-between grow">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 group-hover:text-orange-400 transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-neutral-400 mb-1 flex items-center gap-1">
            📍 {event.location}
          </p>
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            📅 {formatDate(event.date)} • ⏰ {event.time || "Various Timings"}
          </p>
          <p className="text-xs text-neutral-400 mt-2.5">
            Starts at{" "}
            <span className="text-base font-extrabold text-orange-500 block sm:inline mt-0.5 sm:mt-0">
              {formatPrice(event.price)}
            </span>
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookEvent(event);
          }}
          className="mt-4 w-full bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all duration-300 shadow-md hover:shadow-orange-500/20 cursor-pointer relative z-10 text-sm"
        >
          <Ticket size={16} /> Book Now
        </button>
      </div>
    </div>
  );
}
