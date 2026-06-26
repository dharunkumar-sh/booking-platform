"use client";

import { MapPin, Clock, Calendar, Users, Star, Film, Music, Bus } from "lucide-react";

const CATEGORY_CONFIG = {
  movie: {
    gradient: "from-violet-900/30 to-purple-900/10",
    border: "border-violet-700/20",
    accent: "text-violet-400",
    dot: "bg-violet-500",
    label: "Cinema",
  },
  event: {
    gradient: "from-blue-900/30 to-cyan-900/10",
    border: "border-blue-700/20",
    accent: "text-blue-400",
    dot: "bg-blue-500",
    label: "Event",
  },
  concert: {
    gradient: "from-orange-900/30 to-rose-900/10",
    border: "border-orange-700/20",
    accent: "text-orange-400",
    dot: "bg-orange-500",
    label: "Concert",
  },
  travel: {
    gradient: "from-emerald-900/30 to-teal-900/10",
    border: "border-emerald-700/20",
    accent: "text-emerald-400",
    dot: "bg-emerald-500",
    label: "Travel",
  },
};

function MovieMeta({ show }) {
  return (
    <>
      <span className="flex items-center gap-1.5">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <span>{show.rating}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-neutral-700" />
      <span>{show.duration}</span>
      <span className="w-1 h-1 rounded-full bg-neutral-700" />
      <span>{show.language}</span>
      <span className="w-1 h-1 rounded-full bg-neutral-700" />
      <span>{show.genre}</span>
    </>
  );
}

function EventMeta({ show }) {
  return (
    <>
      <span>{show.type}</span>
    </>
  );
}

function ConcertMeta({ show }) {
  return (
    <>
      <span className="flex items-center gap-1.5">
        <Music size={12} />
        <span>{show.artist}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-neutral-700" />
      <span>{show.genre}</span>
    </>
  );
}

function TravelMeta({ show }) {
  return (
    <>
      <span className="flex items-center gap-1.5">
        <Bus size={12} />
        <span>{show.vehicle}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-neutral-700" />
      <span>{show.operator}</span>
      <span className="w-1 h-1 rounded-full bg-neutral-700" />
      <span>{show.duration}</span>
    </>
  );
}

export default function VenueHeader({ show, category }) {
  const cfg = CATEGORY_CONFIG[category];

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 bg-linear-to-r ${cfg.gradient} ${cfg.border}`}
    >
      <div className="flex items-start gap-4">
        {/* Live dot */}
        <div className="flex-shrink-0 flex items-center gap-2 mt-1">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} animate-pulse`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Category label */}
          <span
            className={`text-\[10px] font-bold uppercase tracking-widest ${cfg.accent} mb-1 block`}
          >
            {cfg.label}
          </span>

          {/* Show Title */}
          <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight mb-2">
            {show.title}
          </h2>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 mb-3">
            {category === "movie" && <MovieMeta show={show} />}
            {category === "event" && <EventMeta show={show} />}
            {category === "concert" && <ConcertMeta show={show} />}
            {category === "travel" && <TravelMeta show={show} />}
          </div>

          {/* Venue / Date / Time */}
          <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-orange-400 flex-shrink-0" />
              <span>{show.venue}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-orange-400 flex-shrink-0" />
              <span>{show.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-orange-400 flex-shrink-0" />
              <span>{show.time}</span>
            </span>
          </div>
        </div>

        {/* Price from badge */}
        <div className="flex-shrink-0 text-right hidden sm:block">
          <p className="text-\[10px] text-neutral-500 uppercase tracking-wider">From</p>
          <p className="text-lg font-extrabold text-white">
            ₹{show.priceFrom?.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}