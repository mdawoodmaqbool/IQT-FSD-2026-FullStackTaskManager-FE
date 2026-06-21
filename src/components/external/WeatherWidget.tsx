"use client";

import { useQuery } from "@apollo/client";
import { RefreshIcon } from "@/components/icons";
import { GET_WEATHER } from "@/graphql/external-operations";

export function WeatherWidget() {
  const { data, loading, error, refetch } = useQuery(GET_WEATHER, {
    fetchPolicy: "cache-and-network",
  });

  const weather = data?.weather;

  return (
    <section className="w-full">
      <div className="rounded-lg border border-sky-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-md sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-sky-800 sm:text-sm">
              Local weather
            </h2>
            <p className="hidden text-xs text-slate-500 sm:block">
              Powered by Open-Meteo (free public API)
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={loading}
            aria-label="Refresh weather"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-sky-200 text-sky-800 hover:bg-sky-100 disabled:opacity-60 sm:h-auto sm:w-auto sm:px-3 sm:py-1"
          >
            <RefreshIcon className={`h-4 w-4 sm:hidden ${loading ? "animate-spin" : ""}`} />
            <span className="hidden text-xs font-medium sm:inline">Refresh</span>
          </button>
        </div>

        {loading && !weather ? (
          <p className="mt-2 text-sm text-slate-600 sm:mt-3">Loading weather...</p>
        ) : null}

        {error ? (
          <p className="mt-2 text-sm text-red-600 sm:mt-3" role="alert">
            {error.message}
          </p>
        ) : null}

        {weather ? (
          <>
            <div className="mt-2 sm:hidden">
              <p className="text-lg font-bold leading-tight text-slate-900">
                {weather.temperatureC}°C
                <span className="ml-2 text-sm font-medium text-slate-700">{weather.condition}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {weather.location} · {weather.countryName} · {weather.humidity}% ·{" "}
                {weather.windSpeedKmh} km/h
              </p>
            </div>

            <div className="mt-3 hidden gap-3 sm:grid sm:grid-cols-4">
              <div className="sm:col-span-2">
                <p className="text-2xl font-bold text-slate-900">{weather.temperatureC}°C</p>
                <p className="text-sm font-medium text-slate-700">{weather.condition}</p>
                <p className="text-xs text-slate-500">
                  {weather.location} · {weather.countryName}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Humidity</p>
                <p className="text-lg font-semibold text-slate-900">{weather.humidity}%</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Wind</p>
                <p className="text-lg font-semibold text-slate-900">{weather.windSpeedKmh} km/h</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
