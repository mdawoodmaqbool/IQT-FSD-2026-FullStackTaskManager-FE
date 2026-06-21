"use client";

import { useQuery } from "@apollo/client";
import { GET_WEATHER } from "@/graphql/external-operations";

export function WeatherWidget() {
  const { data, loading, error, refetch } = useQuery(GET_WEATHER, {
    fetchPolicy: "cache-and-network",
  });

  const weather = data?.weather;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-800">
              Local weather
            </h2>
            <p className="text-xs text-slate-500">Powered by Open-Meteo (free public API)</p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={loading}
            className="rounded-md border border-sky-200 px-3 py-1 text-xs font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {loading && !weather ? (
          <p className="mt-3 text-sm text-slate-600">Loading weather...</p>
        ) : null}

        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error.message}
          </p>
        ) : null}

        {weather ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
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
        ) : null}
      </div>
    </section>
  );
}
