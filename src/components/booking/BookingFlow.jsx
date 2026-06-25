import { useState } from "react";
import { Card, CardContent, Button, SectionLabel, SectionTitle } from "../ui";

export default function BookingFlow({ court, selectedTime, setSelectedTime }) {
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  const handleConfirm = () => {
    setBookingStep(3);
    setBookingDone(true);
    setTimeout(() => {
      setBookingDone(false);
      setBookingStep(1);
    }, 4000);
  };

  return (
    <section id="reserva" className="px-4 py-16 md:px-8">
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black">{court.name}</h3>
                      <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {court.zone}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {court.sport} · {court.category}
                      </p>
                    </div>
                    <p className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                      ⭐ {court.rating}
                    </p>
                  </div>

                  {/* Time Selection */}
                  <div className="mt-6">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">Horarios disponibles hoy</p>
                    <div className="flex flex-wrap gap-2">
                      {court.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setBookingStep(1);
                            setBookingDone(false);
                          }}
                          className={`rounded-2xl border-2 px-5 py-2.5 text-sm font-bold transition-all cursor-pointer ${
                            selectedTime === time
                              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                              : "border-slate-200 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Precio por hora</span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">Bs {court.price}</span>
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
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shrink-0 ${
                        bookingStep >= step
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                      }`}
                    >
                      {bookingDone && step === 3 ? "✓" : step}
                    </div>
                    {step < 3 && (
                      <div className={`h-0.5 w-full rounded-full transition-all ${bookingStep > step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex justify-between">
                <span>Selección</span>
                <span>Pago</span>
                <span>Confirmación</span>
              </p>

              <h3 className="text-2xl font-black">Confirmar reserva</h3>

              {/* Summary */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Cancha</span>
                  <b className="text-right max-w-[60%]">{court.name}</b>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Deporte</span>
                  <b>{court.sport}</b>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Horario</span>
                  <b>Hoy · {selectedTime}</b>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Total</span>
                  <b className="text-lg text-emerald-600">Bs {court.price}</b>
                </div>
              </div>

              {/* QR Payment */}
              <div className="mt-6 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50 p-5 text-center qr-pattern dark:bg-emerald-950/20 dark:border-emerald-700">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md dark:bg-slate-800">
                  <span className="text-3xl">💳</span>
                </div>
                <p className="font-black text-emerald-800 dark:text-emerald-200">Pago QR simulado</p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                  Escanea el código o confirma para bloquear tu horario.
                </p>
              </div>

              {!bookingDone ? (
                <Button
                  onClick={() => {
                    setBookingStep(2);
                    setTimeout(handleConfirm, 800);
                  }}
                  className="mt-5 w-full rounded-2xl py-4 text-base font-black animate-pulse-glow"
                >
                  Confirmar reserva
                </Button>
              ) : (
                <div className="mt-5 rounded-2xl bg-emerald-100 p-4 text-center dark:bg-emerald-950/40 animate-fade-in-up">
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    ✅ ¡Reserva confirmada!
                  </p>
                  <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                    Te esperamos hoy a las {selectedTime} en {court.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
