import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, Star, Tag } from "lucide-react";

export default function EventHeader({ event }) {
  const fallbackImage = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a";
  const [imgSrc, setImgSrc] = useState(fallbackImage);

  // Sync state if event prop changes
  useEffect(() => {
    if (event?.image) {
      setImgSrc(event.image);
    } else {
      setImgSrc(fallbackImage);
    }
  }, [event]);

  if (!event) return null;

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-3xl overflow-hidden shadow-2xl mb-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imgSrc}
          alt={event.title || "Event Image"}
          fill
          className="object-cover"
          priority
          loading="eager"
          unoptimized
          onError={() => setImgSrc(fallbackImage)}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 flex flex-col justify-end h-full">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {event.category && (
            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-lg capitalize">
              <Tag size={14} /> {event.category}
            </span>
          )}
          {event.rating && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
              <Star size={14} className="text-yellow-400 fill-yellow-400" /> {event.rating}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
          {event.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-neutral-300">
          {event.date && (
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                <Calendar size={18} className="text-orange-400" />
              </div>
              <span className="text-sm md:text-base font-medium">{event.date}</span>
            </div>
          )}

          {event.time && (
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                <Clock size={18} className="text-orange-400" />
              </div>
              <span className="text-sm md:text-base font-medium">{event.time}</span>
            </div>
          )}

          {event.venue && (
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                <MapPin size={18} className="text-orange-400" />
              </div>
              <span className="text-sm md:text-base font-medium">{event.venue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
