import { useState, useMemo } from "react";
import { courts } from "./data";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import CourtList from "./components/CourtList";
import BookingFlow from "./components/BookingFlow";
import HowItWorks from "./components/HowItWorks";
import BenefitsSection from "./components/BenefitsSection";
import AdminPanel from "./components/AdminPanel";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function App() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("Todos");
  const [zone, setZone] = useState("Todas");
  const [time, setTime] = useState("Cualquiera");
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [selectedTime, setSelectedTime] = useState(courts[0].times[0]);

  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      const matchSearch =
        search.trim() === "" ||
        court.name.toLowerCase().includes(search.toLowerCase()) ||
        court.zone.toLowerCase().includes(search.toLowerCase());
      const matchSport = sport === "Todos" || court.sport === sport;
      const matchZone = zone === "Todas" || court.zone.includes(zone);
      const matchTime =
        time === "Cualquiera" ||
        court.times.some((t) => {
          const hour = parseInt(t.split(":")[0], 10);
          if (time === "Mañana") return hour >= 6 && hour < 12;
          if (time === "Tarde") return hour >= 12 && hour < 18;
          if (time === "Noche") return hour >= 18 || hour < 6;
          return true;
        });
      return matchSearch && matchSport && matchZone && matchTime;
    });
  }, [search, sport, zone, time]);

  const selectCourt = (court) => {
    setSelectedCourt(court);
    setSelectedTime(court.times[0]);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white font-sans">
        <Header dark={dark} setDark={setDark} />
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <CourtList
          courts={filteredCourts}
          selectedCourt={selectedCourt}
          onSelectCourt={selectCourt}
          search={search}
          setSearch={setSearch}
          sport={sport}
          setSport={setSport}
          zone={zone}
          setZone={setZone}
          time={time}
          setTime={setTime}
        />
        <BookingFlow
          court={selectedCourt}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <HowItWorks />
        <BenefitsSection />
        <AdminPanel />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
