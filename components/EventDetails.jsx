"use client";

import { useState, useEffect } from "react";
import { Info, User, Ticket, CheckCircle2, Users, Star, MessageSquare, ArrowRight, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useStore } from "@/hooks/useStore";

export default function EventDetails({ event, description, organizer, price, features, crew, reviews: initialReviews }) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesLoaded, setLikesLoaded] = useState(false);

  // Reviews states
  const [eventReviews, setEventReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formRating, setFormRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const storeUser = useStore(useBookingStore, (state) => state.user);
  const user = storeUser || null;

  useEffect(() => {
    if (!event?.id) return;
    const store = useBookingStore.getState();
    const userId = store.user ? store.user.id : "";
    fetch(`/api/events/like?eventId=${event.id}&userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikesCount(data.likes);
          setHasLiked(data.hasLiked);
          setLikesLoaded(true);
        }
      })
      .catch((err) => console.error(err));
  }, [event?.id]);

  useEffect(() => {
    if (!event?.id) return;
    const store = useBookingStore.getState();
    const pendingId = store.likePendingEventId;
    const userStored = store.user;
    if (pendingId && Number(pendingId) === event.id && userStored) {
      store.setLikePendingEventId(null);
      const user = userStored;
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
      });
    }
  }, [event?.id]);

  // Load reviews dynamically from DB
  useEffect(() => {
    if (!event?.id) return;
    fetch(`/api/events/review?eventId=${event.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEventReviews(data.reviews || []);
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [event?.id]);

  // Sync logged in user profile details
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);


  const handleLike = async () => {
    const store = useBookingStore.getState();
    const userStored = store.user;
    if (!userStored) {
      store.setLikePendingEventId(event.id);
      store.setLoginRedirect(window.location.pathname);
      router.push("/login");
      return;
    }
    const user = userStored;
    try {
      const res = await fetch("/api/events/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, userId: user.id })
      });
      const data = await res.json();
      if (data.success) {
        setLikesCount(data.likes);
        setHasLiked(data.hasLiked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!event?.id) return;
    if (!currentUser) return;

    if (!formComment.trim()) {
      setSubmitError("Review comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await fetch("/api/events/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          userId: currentUser.id,
          rating: formRating,
          comment: formComment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEventReviews(data.reviews || []);
        setFormComment("");
        setFormRating(5);
        setSubmitSuccess("Thank you! Your review has been added.");
      } else {
        setSubmitError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  const handleCheckout = () => {
    const store = useBookingStore.getState();
    const userStored = store.user;
    const query = new URLSearchParams({
      venue: event.venue || event.location || "",
      category: event.category || "",
    }).toString();
    const destination = `/seat-selection/${encodeURIComponent(event.title)}?${query}`;

    if (!userStored) {
      store.setLoginRedirect(destination);
      router.push("/login");
      return;
    }
    router.push(destination);
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

        {/* Top Reviews Section - Render only if actual DB reviews exist */}
        {eventReviews && eventReviews.filter(r => r && r.createdAt).length > 0 && (
          <section className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl hover:shadow-rose-500/10 transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <MessageSquare className="text-rose-500" /> Top Reviews
            </h2>
            <div className="space-y-6">
              {eventReviews.filter(r => r && r.createdAt).map((review, idx) => (
                <div key={idx} className="bg-neutral-950/50 rounded-2xl p-6 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {(review.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{review.name}</p>
                      <div className="flex gap-1 text-yellow-400 mt-0.5">
                        {[...Array(Number(review.rating || 5))].map((_, i) => <Star key={i} size={12} className="fill-yellow-400" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-300 text-sm italic leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Write a Review Section */}
        <section className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-3xl p-8 shadow-xl hover:shadow-orange-500/10 transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <Star className="text-orange-500" /> Share Your Review
          </h2>
          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="cursor-pointer transition-transform duration-150 active:scale-95 text-left bg-transparent border-none p-0 outline-none"
                    >
                      <Star
                        size={28}
                        className={`transition-colors duration-150 ${
                          star <= (hoveredStar || formRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-neutral-650 fill-none"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" className="block text-sm font-semibold text-neutral-300 mb-2">Comment</label>
                <textarea
                  id="review-comment"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Tell others what you loved about this event..."
                  rows={4}
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-orange-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-colors duration-200 resize-none placeholder-neutral-600"
                />
              </div>

              {submitError && (
                <p className="text-red-400 text-xs font-semibold">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-emerald-400 text-xs font-semibold">{submitSuccess}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:from-neutral-700 disabled:to-neutral-800 disabled:text-neutral-500 text-white rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-orange-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          ) : (
            <div className="bg-neutral-950/50 rounded-2xl p-6 border border-neutral-850 text-center">
              <p className="text-neutral-400 text-sm mb-4">You must be logged in to share your experience.</p>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("login_redirect", window.location.pathname);
                  router.push("/login");
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/10 cursor-pointer active:scale-95"
              >
                Log In / Register
              </button>
            </div>
          )}
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
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-orange-500/50 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <button 
            onClick={handleLike}
            className={`w-full mt-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all duration-300 cursor-pointer ${
              hasLiked 
                ? "bg-orange-500/10 border-orange-500 text-orange-400" 
                : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-orange-500/40 hover:text-white"
            }`}
          >
            <ThumbsUp size={16} className={hasLiked ? "fill-orange-400 text-orange-400" : ""} />
            <span>{hasLiked ? "Liked" : "Like Event"}</span>
            {likesLoaded && likesCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-md bg-neutral-850 text-xs text-neutral-400 font-extrabold">
                {likesCount}
              </span>
            )}
          </button>
          
          <p className="text-xs text-center text-neutral-500 mt-4">
            * All tickets are non-refundable. Terms & Conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
}
