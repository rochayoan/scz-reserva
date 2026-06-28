import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { getCourts } from "./lib/dataService";
import { getAvailableSlots } from "./lib/availabilityService";
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
import ScrollReveal from "./lib/useScrollReveal";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminReservations from "./components/admin/AdminReservations";
import AdminCourts from "./components/admin/AdminCourts";
import AdminSchedule from "./components/admin/AdminSchedule";
import AdminSettings from "./components/admin/AdminSettings";
import LoginPage from "./components/admin/LoginPage";
import RegisterPage from "./components/admin/RegisterPage";
import PricingPage from "./components/admin/PricingPage";
import SuperAdminPage from "./components/admin/SuperAdminPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SubscriptionGuard from "./components/admin/SubscriptionGuard";

function LandingPage() {
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
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableLoading, setAvailableLoading] = useState(false);

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

  // Fetch real available slots when court changes
  useEffect(() => {
    if (!selectedCourt || !selectedCourt.id) return;
    let active = true;
    setAvailableLoading(true);

    // Find the first actual court for this venue to get availability
    getAvailableSlots(selectedCourt.id, new Date()).then((slots) => {
      if (!active) return;
      setAvailableTimes(slots);
      setSelectedTime(slots[0] ?? selectedCourt.times?.[0] ?? null);
      setAvailableLoading(false);
    });

    return () => { active = false; };
  }, [selectedCourt?.id]);

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
    // Don't reset selectedTime here - the useEffect will handle it
  };

  const handleHeroSearch = (sport) => {
    setSport(sport ?? "Todos");
    document.getElementById("canchas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white font-sans">
        <Header dark={dark} setDark={setDark} />
        <Hero onSearch={handleHeroSearch} />
        <ScrollReveal><ProblemSection /></ScrollReveal>
        <ScrollReveal delay={100}><SolutionSection /></ScrollReveal>
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
            <ScrollReveal>
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
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <BookingFlow
                court={selectedCourt}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                availableTimes={availableTimes}
                availableLoading={availableLoading}
              />
            </ScrollReveal>
          </>
        )}
        <ScrollReveal><HowItWorks /></ScrollReveal>
        <ScrollReveal delay={100}><BenefitsSection /></ScrollReveal>
        <ScrollReveal delay={200}><AdminPanel /></ScrollReveal>
        <ScrollReveal delay={300}><CTASection /></ScrollReveal>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/registro" element={<RegisterPage />} />
          <Route path="/admin/precios" element={<PricingPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <SubscriptionGuard>
                  <AdminLayout />
                </SubscriptionGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="reservas" element={<AdminReservations />} />
            <Route path="canchas" element={<AdminCourts />} />
            <Route path="horarios" element={<AdminSchedule />} />
            <Route path="configuracion" element={<AdminSettings />} />
          </Route>
          <Route path="/admin/super" element={
            <ProtectedRoute>
              <SuperAdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
