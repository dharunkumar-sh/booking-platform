"use client";

import { Film, Music, Calendar, Bus, Star, Clock, MapPin, Zap } from "lucide-react";

const BADGE_COLORS = {
  IMAX: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "4DX": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DOLBY: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  HOT: "bg-red-500/20 text-red-400 border-red-500/30",
  TRENDING: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "SELLING FAST": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  LIMITED: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  AC: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  TRAIN: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  default: "bg-neutral-700/40 text-neutral-400 border-neutral-600/30",
};

const CAT_ICON = { movie: Film, event: Calendar, concert: Music, travel: Bus };
const CAT_ACCENT = {
  movie: "from-violet-500 to-purple-600",
  event: "from-blue-500 to-cyan-500",
  concert: "from-orange-500 to-rose-500",
  travel: "from-emerald-500 to-teal-500",
};

function getSubtitle(show, cat) {
  if (cat === "movie") return `${show.language} · ${show.genre} · ${show.rating}`;
  if (cat === "event") return show.type;
  if (cat === "concert") return `${show.artist} · ${show.genre}`;
  return `${show.vehicle} · ${show.operator}`;
}

function getPriceLabel(show, cat) {
  if (cat === "travel") return `₹${show.priceFrom.toLocaleString("en-IN")} / seat`;
  return `₹${show.priceFrom.toLocaleString("en-IN")} onwards`;
}

export default function ShowCards({ shows, selectedShowId, onShowSelect, category }) {
  const Icon = CAT_ICON[category];
  const accent = CAT_ACCENT[category];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 vp-scroll">
      {shows.map((show) => {
        const isActive = show.id === selectedShowId;
        const badgeClass = BADGE_COLORS[show.badge] || BADGE_COLORS.default;

        return (
          <button
            key={show.id}
            id={`show-card-${show.id}`}
            onClick={() => onShowSelect(show.id)}
            className={`flex-shrink-0 w-64 sm:w-72 text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer group ${
              isActive
                ? "bg-neutral-800/80 border-orange-500/40 shadow-lg shadow-orange-500/10"
                : "bg-neutral-900/60 border-neutral-800/60 hover:border-neutral-600 hover:bg-neutral-800/50"
            }`}
          >
            {/* Top row: icon + badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center bg-linear-to-br ${accent} flex-shrink-0`}
              >
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {show.badge && (
                  <span
                    className={`text-\[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
                  >
                    {show.badge}
                  </span>
                )}
                {isActive && (
                  <span className="text-\[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                    <Zap size={9} />
                    SELECTED
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <p className={`font-bold text-sm leading-tight mb-1 ${isActive ? "text-white" : "text-neutral-200 group-hover:text-white"} transition-colors`}>
              {show.title}
            </p>
            <p className="text-\[11px] text-neutral-500 mb-3">{getSubtitle(show, category)}</p>

            {/* Details row */}
            <div className="flex items-center gap-3 text-\[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <MapPin size={10} className="text-orange-400" />
                <span className="truncate max-w-\[100px]">{show.venue}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} className="text-orange-400" />
                {show.time}
              </span>
            </div>

            {/* Price + Date */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800/60">
              <span className="text-\[11px] font-semibold text-orange-400">
                {getPriceLabel(show, category)}
              </span>
              <span className="text-\[10px] text-neutral-500">{show.date}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}