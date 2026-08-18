'use client'

import { useEffect, useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import { travelLocations } from '@/lib/travel-map'

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const MAP_W = 800
const MAP_H = 420

export function TravelMap() {
  const [active, setActive] = useState<number | null>(null)
  // react-simple-maps projects marker coordinates to floating-point values
  // that can round differently on the server vs the client, causing a
  // hydration mismatch. Render the map only after mounting to avoid it.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section id="map" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="border-b border-border pb-4">
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Where We Went
          </h2>
        </div>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          From that first weekend in wine country to the edges of the earth,
          here is where Blaq Gurl Moves has journeyed together. Tap a pin to
          revisit the trip.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
          <div>
            {!mounted ? (
              <div
                className="w-full rounded-2xl bg-secondary/40"
                style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
                aria-hidden
              />
            ) : (
            <ComposableMap
              projectionConfig={{ scale: 155 }}
              width={MAP_W}
              height={MAP_H}
              style={{ width: '100%', height: 'auto' }}
            >
              <defs>
                <pattern
                  id="earth-texture"
                  patternUnits="userSpaceOnUse"
                  width={MAP_W}
                  height={MAP_H}
                >
                  <image
                    href="/images/earth-texture.png"
                    x={0}
                    y={0}
                    width={MAP_W}
                    height={MAP_H}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              </defs>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="url(#earth-texture)"
                      stroke="oklch(0.985 0.01 85)"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {travelLocations.map((loc, i) => (
                <Marker
                  key={loc.name}
                  coordinates={loc.coordinates}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(i)}
                  style={{ default: { cursor: 'pointer' } }}
                >
                  <g
                    transform={`translate(0, ${active === i ? -2 : 0}) scale(${
                      active === i ? 1.25 : 1
                    })`}
                    className="transition-transform"
                  >
                    {/* teardrop pin, tip at (0,0) */}
                    <path
                      d="M0,0 C-6,-11 -9.5,-14.5 -9.5,-20.5 A9.5,9.5 0 1 1 9.5,-20.5 C9.5,-14.5 6,-11 0,0 Z"
                      fill="oklch(0.55 0.22 27)"
                      stroke="oklch(0.995 0.006 85)"
                      strokeWidth={1}
                    />
                    {/* white X inside the bulb, centered at (0,-20.5) */}
                    <g
                      stroke="oklch(0.995 0.006 85)"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    >
                      <line x1={-3} y1={-23.5} x2={3} y2={-17.5} />
                      <line x1={-3} y1={-17.5} x2={3} y2={-23.5} />
                    </g>
                  </g>
                </Marker>
              ))}
            </ComposableMap>
            )}
          </div>

          <div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {active !== null ? (
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-primary">
                    {travelLocations[active].country} &middot;{' '}
                    {travelLocations[active].year}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-foreground">
                    {travelLocations[active].name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {travelLocations[active].blurb}
                  </p>
                </div>
              ) : (
                <p className="leading-relaxed text-muted-foreground">
                  Hover or tap a red pin to explore each destination the
                  sisterhood has visited together.
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {travelLocations.map((loc, i) => (
                <button
                  key={loc.name}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    active === i
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
