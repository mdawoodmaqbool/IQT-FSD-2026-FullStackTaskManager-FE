"use client";

import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "@/graphql/external-operations";

type CountrySelectProps = {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  error?: string;
};

export function CountrySelect({ value, onChange, disabled, error }: CountrySelectProps) {
  const { data, loading, error: queryError } = useQuery(GET_COUNTRIES);

  const countries = data?.countries ?? [];

  return (
    <div>
      <label htmlFor="country" className="mb-1 block text-sm font-medium text-slate-700">
        Country
      </label>
      <select
        id="country"
        required
        disabled={disabled || loading}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
        }`}
      >
        <option value="">{loading ? "Loading countries..." : "Select your country"}</option>
        {countries.map((country: { code: string; name: string }) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      {queryError ? (
        <p className="mt-1 text-xs text-red-600">Could not load countries. Try again later.</p>
      ) : null}
      <p className="mt-1 text-xs text-slate-500">
        Country list is fetched from REST Countries API via our backend.
      </p>
    </div>
  );
}
