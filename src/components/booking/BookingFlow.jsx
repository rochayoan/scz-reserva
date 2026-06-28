import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { MapPin, Star, Check, QrCode, CheckCircle2, User, Phone, RefreshCw } from "lucide-react";
import { Card, CardContent, Button, SectionLabel, SectionTitle } from "../ui";

export default function BookingFlow({ court, selectedTime, setSelectedTime, availableTimes, availableLoading }) {
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(1); // horas

  const DURATIONS = [
    { value: 1, label: "1h" },
    { value: 1.5, label: "1.5h" },
    { value: 2, label: "2h" },
    { value: 2.5, label: "2.5h" },
    { value: 3, label: "3h" },
  ];

  // Calcular hora de fin y precio
  const calcEndTime = () => {
    if (!selectedTime) return null;
    const [h, m] = selectedTime.split(":").map(Number);
    const totalMin = h * 60 + m + duration * 60;
    const endH = Math.floor(totalMin / 60);
    const endM = totalMin % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  };

  const endTime = calcEndTime();
  const totalPrice = court.price ? court.price * duration : 0;

  const handleConfirm = async () => {
    if (!guestName.trim()) {
      setError("Ingresa tu nombre para reservar");
      return;
    }
    setSaving(true);
    setError("");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const [hourStr] = selectedTime.split(":");
    const [minStr] = selectedTime.split(":").slice(1);
    const hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);

    const startsAt = new Date(`${todayStr}T${selectedTime}:00-04:00`);
    const endsAt = new Date(startsAt);
    endsAt.setMinutes(endsAt.getMinutes() + duration * 60);

    try {
      // Find the actual court for this venue
      const { data: courts } = await supabase
        .from("courts")
        .select("id, sport")
        .eq("venue_id", court.id)
        .eq("is_active", true);

      const sportMap = { "Fútbol": "futbol", "Pádel": "padel", "Tenis": "tenis" };
      const targetSport = sportMap[court.sport] || court.sport.toLowerCase();
      const matchingCourt = courts?.find((c) => c.sport === targetSport) || courts?.[0];

      if (!matchingCourt) {
        setError("No se encontró la cancha en la base de datos");
        setSaving(false);
        return;
      }

      const { error: insertError } = await supabase.from("reservations").insert({
        organization_id: court.organization_id,
        venue_id: court.id,
        court_id: matchingCourt.id,
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim() || null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: "pending",
        price_total: totalPrice,
        payment_method: "none",
        payment_status: "unpaid",
        notes: `Reservado desde la web (${duration}h)`,
      });

      if (insertError) {
        if (insertError.message?.includes("reservations_no_overlap")) {
          setError("Este horario ya fue reservado. Por favor elige otro horario.");
        } else {
          setError("Error al guardar la reserva: " + insertError.message);
        }
        setSaving(false);
        return;
      }

      // Notificar al dueño por WhatsApp
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            venueName: court.name,
            courtName: `${court.sport} — ${matchingCourt.name}`,
            guestName: guestName.trim(),
            guestPhone: guestPhone.trim() || null,
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
            price: totalPrice,
            status: "pending",
          }),
        });
      } catch (notifyErr) {
        console.warn("Notificación no enviada:", notifyErr);
      }

      setBookingStep(3);
      setBookingDone(true);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    }
    setSaving(false);
  };

  return (
    <section id="reserva" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <SectionLabel>Reserva en vivo</SectionLabel>
          <SectionTitle className="mt-2">Reserva rápida</SectionTitle>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Court Detail */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={court.image}
                    alt={court.name}
                    className="h-40 w-full rounded-2xl object-cover md:h-full"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                </div>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold">{court.name}</h3>
                      <p className="mt-2 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                        {court.zone}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {court.sport} · {court.category}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={1.75} />
                      {court.rating}
                    </span>
                  </div>

                  {/* Time Selection */}
                  <div className="mt-6">
                    <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Horarios disponibles hoy
                    </p>
                    {availableLoading ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Cargando disponibilidad...
                      </div>
                    ) : availableTimes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(availableTimes.length > 0 ? availableTimes : court.times).map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              setSelectedTime(time);
                              setBookingStep(1);
                              setBookingDone(false);
                            }}
                            className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-colors ${
                              selectedTime === time
                                ? "border-emerald-700 bg-emerald-700 text-white"
                                : "border-slate-200 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-50 p-4 text-center">
                        <p className="text-sm font-semibold text-amber-700">
                          No hay horarios disponibles hoy
                        </p>
                        <p className="mt-1 text-xs text-amber-600">
                          Esta cancha no tiene disponibilidad para hoy.
                          Prueba seleccionar otra cancha o contacta al complejo.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Duration selector */}
                  {selectedTime && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Duración
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DURATIONS.map((d) => (
                          <button
                            key={d.value}
                            onClick={() => setDuration(d.value)}
                            className={`flex h-10 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors ${
                              duration === d.value
                                ? "border-emerald-700 bg-emerald-700 text-white"
                                : "border-slate-200 hover:border-emerald-400 dark:border-slate-700"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Precio por hora</span>
                    <span className="text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                      Bs {court.price}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Confirmation */}
          <Card>
            <CardContent className="p-6 md:p-8">
              {/* Progress Steps */}
              <div className="mb-6 flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-1 items-center gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        bookingStep >= step
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                      }`}
                    >
                      {bookingDone && step === 3 ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`h-0.5 w-full rounded-full transition-colors ${
                          bookingStep > step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mb-6 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Datos</span>
                <span>Pago</span>
                <span>Confirmación</span>
              </p>

              {/* Guest Info Form */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <User className="h-3.5 w-3.5" strokeWidth={2} />
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej: Carlos Rojas"
                    disabled={bookingDone}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Ej: 70000000"
                    disabled={bookingDone}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:bg-slate-900 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Cancha</span>
                  <b className="max-w-[60%] text-right">{court.name}</b>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Deporte</span>
                  <b>{court.sport}</b>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Horario</span>
                  <b>Hoy · {selectedTime} → {endTime}</b>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Duración</span>
                  <b>{duration}h</b>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Total</span>
                  <b className="text-lg tabular-nums text-emerald-700 dark:text-emerald-400">Bs {totalPrice}</b>
                </div>
              </div>

              {/* QR de pago */}
              <div className="mt-6 rounded-2xl border border-dashed border-emerald-400 bg-emerald-50 p-5 text-center dark:border-emerald-700 dark:bg-emerald-950/20">
                {court.qr_image_url ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={court.qr_image_url}
                      alt="QR de pago"
                      className="h-36 w-36 rounded-xl border-2 border-white bg-white shadow-sm"
                      onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                    />
                    <p className="hidden text-xs text-red-500">No se pudo cargar el QR</p>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Escanea para pagar
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Paga desde tu app del banco <strong>Bs {totalPrice}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                      <QrCode className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                    </div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-200">Pago pendiente</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      El dueño confirmará tu reserva. Paga en el complejo.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
              )}

              {!bookingDone ? (
                <Button
                  onClick={handleConfirm}
                  disabled={saving}
                  className="mt-5 w-full py-4 text-base"
                >
                  {saving ? "Reservando..." : "Confirmar reserva"}
                </Button>
              ) : (
                <div className="mt-5 space-y-3">
                  <div className="animate-fade-in-up rounded-2xl bg-emerald-100 p-4 text-center dark:bg-emerald-950/40">
                    <p className="flex items-center justify-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
                      ¡Reserva creada!
                    </p>
                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                      {guestName}, te esperamos hoy a las {selectedTime} en {court.name}
                    </p>
                    <p className="mt-2 text-xs text-emerald-600">
                      Escanea el QR para pagar
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setBookingDone(false);
                      setBookingStep(1);
                      setGuestName("");
                      setGuestPhone("");
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    Hacer otra reserva
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
