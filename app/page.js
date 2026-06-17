import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMap from "@/components/EventMap";

export default function Home() {
  return (
    <div>
      <Hero />
      
      <FeaturedEvents />
      <TrendingEvents />
      <EventMap /> 
    </div>
  );
}