import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";
import EventMapWrapper from "@/components/EventMapWrapper";

export default function Home() {
  return (
    <div>
      <Hero />
      
      <FeaturedEvents />
      <TrendingEvents />
      <EventMapWrapper /> 
    </div>
  );
}