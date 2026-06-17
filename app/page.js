import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import TrendingEvents from "@/components/TrendingEvents";

export default function Home() {
  return (
    <div>
      <Hero />
      <TrendingEvents />
      <FeaturedEvents />
      
    </div>
  );
}