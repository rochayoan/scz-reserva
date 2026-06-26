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

  // Callback estrecha para el Hero: setea el filtro de deporte y baja a #canchas.
  // El Hero no conoce el estado de filtros ni a CourtList; solo llama onSearch.
  const handleHeroSearch = (sport) => {
    setSport(sport ?? "Todos");
    document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white font-sans">
        <Header dark={dark} setDark={setDark} />
        <Hero onSearch={handleHeroSearch} />
        <ProblemSection />
        <SolutionSection />
        {courtsError && (
          <p className="mx-auto max-w-7xl px-4 pt-6 text-center text-xs font-medium text-amber-600 dark:text-amber-400 md:px-8">
            No se pudo conectar con el servidor, mostrando datos de muestra.
          </p>
        )}
        {courtsLoading || !selectedCourt ? (
          <section className="px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 animate-pulse"
                  >
                    <div className="h-44 w-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="mt-4 h-10 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
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
