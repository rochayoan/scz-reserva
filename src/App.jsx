import { useState, useMemo, useEffect } from "react";
import { getCourts } from "./lib/dataService";
import Header from "./components/layout/Header";
import Hero from "./components/marketing/Hero";
import ProblemSection from "./components/marketing/ProblemSection";
import SolutionSection from "./components/marketing/SolutionSection";
import CourtList from "./components/booking/CourtList";
import BookingFlow from "./components/booking/BookingFlow";
import HowItWorks from "./components/marketing/HowItWorks";
import BenefitsSection from "./components/marketing/BenefitsSection";
import AdminPanel from "./components/owner/AdminPanel";
import CTASection from "./components/marketing/CTASection";
import Footer from "./components/layout/Footer";

export default function App() {
  const [courts, setCourts] = useState([]);
  const [courtsLoading, setCourtsLoading] = useState(true);
  const [courtsError, setCourtsError] = useState(null);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("Todos");
  const [zone, setZone] = useState("Todas");
  const [time, setTime] = useState("Cualquiera");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    let active = true;

    getCourts().then(({ data, error }) => {
      if (!active) return;
      setCourts(data);
      setSelectedCourt(data[0] ?? null);
      setSelectedTime(data[0]?.times?.[0] ?? null);
      setCourtsError(error);
      setCourtsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

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
  }, [courts, search, sport, zone, time]);

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
        {courtsError && (
          <p className="mx-auto max-w-7xl px-4 pt-6 text-center text-xs font-medium text-amber-600 dark:text-amber-400 md:px-8">
            No se pudo conectar con el servidor, mostrando datos de muestra.
          </p>
        )}
        {courtsLoading || !selectedCourt ? (
          <div className="px-4 py-16 text-center text-sm text-slate-400 md:px-8">
            Cargando canchas...
          </div>
        ) : (
          <>
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
          </>
        )}
        <HowItWorks />
        <BenefitsSection />
        <AdminPanel />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
