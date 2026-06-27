import { useState } from "react";
import { MapPin, Star, Check, QrCode, CheckCircle2 } from "lucide-react";
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
                    <div className="flex flex-wrap gap-2">
                      {court.times.map((time) => (
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
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
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
                <span>Selección</span>
                <span>Pago</span>
                <span>Confirmación</span>
              </p>

              <h3 className="text-2xl font-bold">Confirmar reserva</h3>

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
                  <b>Hoy · {selectedTime}</b>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Total</span>
                  <b className="text-lg tabular-nums text-emerald-700 dark:text-emerald-400">Bs {court.price}</b>
                </div>
              </div>

              {/* QR Payment */}
              <div className="qr-pattern mt-6 rounded-2xl border border-dashed border-emerald-400 bg-emerald-50 p-5 text-center dark:border-emerald-700 dark:bg-emerald-950/20">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-800">
                  <QrCode className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                </div>
                <p className="font-bold text-emerald-800 dark:text-emerald-200">Pago QR simulado</p>
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
                  className="mt-5 w-full py-4 text-base"
                >
                  Confirmar reserva
                </Button>
              ) : (
                <div className="mt-5 animate-fade-in-up rounded-2xl bg-emerald-100 p-4 text-center dark:bg-emerald-950/40">
                  <p className="flex items-center justify-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
                    ¡Reserva confirmada!
                  </p>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
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
