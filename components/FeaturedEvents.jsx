"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FeaturedEvents({ onBookEvent = () => {} }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  const events = [
    {
      title: "Anirudh Live Concert",
      category: "music",
      venue: "Chennai Stadium",
      date: "Aug 25, 2026",
      time: "7:00 PM",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
      description: "Experience the magic of Anirudh Ravichander live in Chennai! A spectacular night filled with high-energy performances, mesmerizing visuals, and blockbuster hits.",
      price: "₹1999.00",
      organizer: "Wunderbar Films",
      features: ["VIP Backstage Pass", "Exclusive Merchandise", "Premium Seating", "Meet & Greet"],
      crew: [
        { name: "Anirudh", role: "Lead Artist", img: "https://ui-avatars.com/api/?name=Anirudh&background=random&size=200" },
        { name: "Jonita Gandhi", role: "Guest Singer", img: "https://ui-avatars.com/api/?name=Jonita+Gandhi&background=random&size=200" }
      ],
      reviews: [
        { name: "Vikram S.", rating: 5, comment: "Mind-blowing energy! Best concert I've ever attended." },
        { name: "Priya M.", rating: 5, comment: "Anirudh was on fire! The visual effects were insane." }
      ]
    },
    {
      title: "Vijay Antony Night",
      category: "music",
      venue: "Bangalore Arena",
      date: "Sep 10, 2026",
      time: "6:30 PM",
      rating: "4.5",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      description: "Join Vijay Antony for an unforgettable evening of soul-stirring melodies and intense performances that will leave you mesmerized.",
      price: "₹1499.00",
      organizer: "Fatima Vijay Antony",
      features: ["Early Entry", "Dedicated F&B zones", "Live Q&A"],
      crew: [
        { name: "Vijay Antony", role: "Lead Artist", img: "https://ui-avatars.com/api/?name=Vijay+Antony&background=random&size=200" }
      ],
      reviews: [
        { name: "Karthik", rating: 4, comment: "Great voice and wonderful atmosphere." }
      ]
    },
    {
      title: "Stand-up Comedy Show",
      category: "comedy",
      venue: "Hyderabad Club",
      date: "Sep 15, 2026",
      time: "8:00 PM",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      description: "Get ready for a night of non-stop laughter with top comedians. The perfect way to unwind and end your week on a high note.",
      price: "₹799.00",
      organizer: "Comedy Central India",
      features: ["Front Row Seating", "Free Drink Included", "After-party access"],
      crew: [
        { name: "Zakir Khan", role: "Comedian", img: "https://ui-avatars.com/api/?name=Zakir+Khan&background=random&size=200" }
      ],
      reviews: [
        { name: "Neha R.", rating: 5, comment: "My stomach hurts from laughing too much!" }
      ]
    },
    {
      title: "Drama Theatre Night",
      category: "drama",
      venue: "Mumbai Theatre",
      date: "Oct 05, 2026",
      time: "7:30 PM",
      rating: "4.3",
      image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d",
      description: "A classic Shakespearean play brought to life by acclaimed actors. Immerse yourself in a world of intense drama and theatrical brilliance.",
      price: "₹999.00",
      organizer: "Prithvi Theatre",
      features: ["Balcony Seats", "Complimentary Brochure", "Pre-show Talk"],
      crew: [
        { name: "Naseeruddin Shah", role: "Director", img: "https://ui-avatars.com/api/?name=Naseeruddin+Shah&background=random&size=200" }
      ],
      reviews: [
        { name: "Amitabh", rating: 4, comment: "A very moving performance with stellar acting." }
      ]
    },
    {
      title: "Dance Fiesta",
      category: "dance",
      venue: "Delhi Arena",
      date: "Oct 12, 2026",
      time: "6:00 PM",
      rating: "4.6",
      image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
      description: "The biggest dance festival of the year! Featuring international crews, epic battles, and electrifying choreography.",
      price: "₹1299.00",
      organizer: "Dance India Network",
      features: ["Dance Workshop Access", "Exclusive Cypher Zones", "Merch Discounts"],
      crew: [
        { name: "Prabhu Deva", role: "Judge & Performer", img: "https://ui-avatars.com/api/?name=Prabhu+Deva&background=random&size=200" }
      ],
      reviews: [
        { name: "Riya", rating: 5, comment: "The energy was simply off the charts." }
      ]
    },
    {
      title: "Gaming Championship",
      category: "games",
      venue: "Pune Expo Hall",
      date: "Oct 20, 2026",
      time: "5:00 PM",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
      description: "Watch the best esports teams battle it out for a massive prize pool. State-of-the-art setups, big screens, and thrilling matches.",
      price: "₹499.00",
      organizer: "Esports Federation",
      features: ["VIP Lounge", "Gamer Meetup", "Giveaways"],
      crew: [
        { name: "Mortal", role: "Pro Player", img: "https://ui-avatars.com/api/?name=Mortal&background=random&size=200" }
      ],
      reviews: [
        { name: "Sam", rating: 5, comment: "Insane clutches! The crowd was hyped." }
      ]
    },
    {
      title: "Hip Hop Night",
      category: "dance",
      venue: "Chandigarh Club",
      date: "Nov 02, 2026",
      time: "7:30 PM",
      rating: "4.4",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
      description: "An underground hip hop experience featuring local talents, rap battles, and graffiti showcases.",
      price: "₹699.00",
      organizer: "Gully Gang",
      features: ["Stage Access", "Free Drink", "After-party"],
      crew: [
        { name: "Divine", role: "Rapper", img: "https://ui-avatars.com/api/?name=Divine&background=random&size=200" }
      ],
      reviews: [
        { name: "Rahul", rating: 4, comment: "True hip hop vibe. Absolutely loved it." }
      ]
    },
    {
      title: "Live DJ Fest",
      category: "music",
      venue: "Goa Beach Arena",
      date: "Nov 15, 2026",
      time: "9:00 PM",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      description: "Dance the night away on the beaches of Goa with top international DJs. A surreal experience of music, lights, and ocean breeze.",
      price: "₹2499.00",
      organizer: "Sunburn",
      features: ["VIP Cabanas", "Unlimited F&B", "Exclusive Entry"],
      crew: [
        { name: "Martin Garrix", role: "DJ", img: "https://ui-avatars.com/api/?name=Martin+Garrix&background=random&size=200" }
      ],
      reviews: [
        { name: "Anita", rating: 5, comment: "Best night of my life. Period." }
      ]
    }
  ];

  const categoryData = {
    music: ["Concert Night", "DJ Party", "Live Band"],
    comedy: ["Standup Special", "Improv Night"],
    drama: ["Stage Play", "Classic Theatre"],
    dance: ["Hip Hop Battle", "Dance Fest"],
    games: ["Esports Tournament", "Arcade Challenge"],
  };

  return (
    <div className="px-6 py-10 bg-neutral-950 min-h-screen text-white">
      
      <h2
        className="text-2xl font-extrabold mb-8"
        style={{
          background: "linear-gradient(90deg, #f97316, #ff5862)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        🎟 Featured Events
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event, i) => (
          <div
            key={i}
            onClick={() => {
              localStorage.setItem("selectedEvent", JSON.stringify(event));
              router.push("/event-details");
            }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-orange-500/40 transition duration-300"
          >
            {/* IMAGE */}
            <div className="relative h-72 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* GRADIENT */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* CONTENT */}
            <div className="absolute bottom-0 p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              
              {/* Rating */}
              <div className="flex justify-between items-center mb-1">
                <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-xs px-2 py-1 rounded">
                  ⭐ {event.rating}
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur">
                  {event.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold">{event.title}</h3>

              <p className="text-xs text-gray-300">
                📍 {event.venue}
              </p>

              <p className="text-xs text-gray-300">
                📅 {event.date} • ⏰ {event.time}
              </p>

              {/* BOOK BUTTON */}
              <div
                className="mt-3 w-full bg-gradient-to-r from-orange-500 to-rose-500 py-2 rounded-lg text-center font-semibold text-white pointer-events-none"
              >
                🎟 Book Now
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORY SECTION */}
      {selectedCategory && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6 capitalize">
            {selectedCategory} Shows
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categoryData[selectedCategory].map((show, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-gradient-to-r from-orange-500 to-rose-500 transition transform hover:-translate-y-1"
              >
                🎭 {show}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-6 px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg hover:opacity-90 cursor-pointer"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}