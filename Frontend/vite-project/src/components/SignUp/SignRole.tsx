// src/pages/SignupLandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plane,
  Hotel,
  Bus,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";

const SignupLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100">
      {/* Soft gradient blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl animate-pulse"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl animate-pulse"
        style={{ animationDuration: "5s" }}
      />

      {/* Full-page flex center */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Header (optional: you can keep fixed at top if needed) */}
        <header className="mb-6 flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow">
              <Sparkles className="h-5 w-5 text-sky-500" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-700">
              TravelX
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-white/60 px-3 py-1 text-xs text-gray-700 shadow">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Secure & Verified
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/60 px-3 py-1 text-xs text-gray-700 shadow">
              <Star className="h-4 w-4 text-yellow-500" />
              4.9/5 Rated
            </div>
          </div>
        </header>

        {/* Main Card centered */}
        <main className="w-full max-w-6xl">
          <div className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-gray-200 backdrop-blur-md lg:p-10">
            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Left panel */}
              <div className="flex-1">
                <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
                  <h1 className="text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
                    Join Our{" "}
                    <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                      Travel & Business
                    </span>{" "}
                    Community
                  </h1>
                  <p className="mt-4 text-gray-600">
                    Whether you’re exploring the world or growing your service,
                    we’ve got you covered. Sign up today and unlock features
                    built for travelers and providers.
                  </p>

                  <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                    <button
                      onClick={() => navigate("/register")}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <Plane className="h-5 w-5" />
                      Sign Up as a Traveler
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="flex-1">
                <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-lg backdrop-blur">
                  <h2 className="mb-2 text-center text-2xl font-semibold text-sky-600">
                    Business Registration
                  </h2>
                  <p className="mx-auto mb-8 max-w-sm text-center text-gray-600">
                    Register your hotel or transport service to expand your
                    reach and grow your business.
                  </p>

                  <div className="grid gap-4">
                    <button
                      onClick={() => navigate("/signup/business/hotel")}
                      className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <span className="flex items-center gap-3">
                        <Hotel className="h-5 w-5" />
                        Register Your Hotel
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button
                      onClick={() => navigate("/signup/business/transport")}
                      className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-indigo-400 to-sky-400 px-5 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <span className="flex items-center gap-3">
                        <Bus className="h-5 w-5" />
                        Register Your Transport Service
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignupLandingPage;
