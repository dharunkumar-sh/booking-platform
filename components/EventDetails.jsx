"use client";
import { Info, User, Ticket, CheckCircle2, Users, Star, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventDetails({ event, description, organizer, price, features, crew, reviews }) {
  const router = useRouter();
  if (!event) return null;

  const handleCheckout = () => {
    const numericPrice = event.price ? parseInt(event.price.toString().replace(/[^\d]/g, "")) : (event.priceVal || 499);
    const query = new URLSearchParams({
      title: event.title || "",
      venue: event.venue || event.location || "",
      price: numericPrice.toString(),
    }).toString();
    router.push(`/seat-selection?${query}`);
  };

  const defaultDescription = "Join us for an unforgettable experience! This event brings together the best in the industry for a night of entertainment, learning, and connection. Don't miss out on what promises to be the highlight of the year.";
  const defaultFeatures = [
    "Exclusive VIP access available",
    "Food and beverages on site",
    "Meet & Greet opportunities",
    "Merchandise stalls"
  ];

  const defaultCrew = [
    { name: "Anirudh", role: "Lead Artist", img: "https://ui-avatars.com/api/?name=Anirudh&background=random&size=200" },
    { name: "Jonita Gandhi", role: "Guest Singer", img: "https://ui-avatars.com/api/?name=Jonita+Gandhi&background=random&size=200" },
    { name: "MS Dhoni", role: "Captain", img: "https://ui-avatars.com/api/?name=MS+Dhoni&background=random&size=200" }
  ];

  const defaultReviews = [
    { name: "Emily R.", rating: 5, comment: "Absolutely breathtaking! The performance exceeded all my expectations. Highly recommended!" },
    { name: "John T.", rating: 4, comment: "Great experience overall. The crowd was amazing and the sound quality was top notch." }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white mb-12">
      {/* Main Details */}
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl hover:shadow-orange-500/10 transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <Info className="text-orange-500" /> About the Event
          </h2>
          <p className="text-neutral-300 leading-relaxed text-lg">
            {description || defaultDescription}
          </p>
        </section>

        <section className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl hover:shadow-rose-500/10 transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <CheckCircle2 className="text-rose-500" /> What to Expect
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(features || defaultFeatures).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-neutral-300">
                <div className="mt-1 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full p-1">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Crew Section */}
        <section className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl hover:shadow-orange-500/10 transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <Users className="text-orange-500" /> The Crew & Cast
          </h2>
          <div className="flex flex-wrap gap-6">
            {(crew || defaultCrew).map((member, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-neutral-800 shadow-md hover:scale-105 transition-transform" />
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">{member.name}</p>
                  <p className="text-neutral-400 text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Reviews Section */}
        <section className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl hover:shadow-rose-500/10 transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <MessageSquare className="text-rose-500" /> Top Reviews
          </h2>
          <div className="space-y-6">
            {(reviews || defaultReviews).map((review, idx) => (
              <div key={idx} className="bg-neutral-950/50 rounded-2xl p-6 border border-neutral-800 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{review.name}</p>
                    <div className="flex gap-1 text-yellow-400 mt-0.5">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400" />)}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm italic leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl sticky top-8">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">Booking Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-neutral-300">
              <span className="flex items-center gap-2">
                <Ticket size={18} className="text-orange-500" /> Standard Ticket
              </span>
              <span className="font-semibold text-white">{price || "$50.00"}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-300">
              <span className="flex items-center gap-2">
                <User size={18} className="text-rose-500" /> Organizer
              </span>
              <span className="font-semibold text-white">{organizer || "Live Nation"}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-orange-500/50 cursor-pointer"
          >
            Proceed to Checkout
          </button>
          
          <p className="text-xs text-center text-neutral-500 mt-4">
            * All tickets are non-refundable. Terms & Conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
}
