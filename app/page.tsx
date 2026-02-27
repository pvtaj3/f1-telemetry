"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronRight, TrendingUp, TrendingDown, Clock, MapPin, Flag, Users } from "lucide-react";

// Haas F1 Theme Colors
const HAAS_RED = "#E6002B";
const HAAS_WHITE = "#FFFFFF";
const HAAS_BLACK = "#000000";
const HAAS_GRAY = "#1a1a1a";

// Types
interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code?: string;
  headshot_url?: string;
}

interface Session {
  session_name: string;
  circuit_short_name: string;
  location: string;
  session_status: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
}

interface ComparisonData {
  driver1: {
    name: string;
    best_lap: string;
    avg_speed: number;
    position: number;
  };
  driver2: {
    name: string;
    best_lap: string;
    avg_speed: number;
    position: number;
  };
  delta: string;
}

export default function HaasDashboard() {
  const [bearman, setBearman] = useState<Driver | null>(null);
  const [ocon, setOcon] = useState<Driver | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [bearmanRes, oconRes, sessionRes, comparisonRes] = await Promise.all([
          fetch("/api/f1/drivers/87").catch(() => null),
          fetch("/api/f1/drivers/31").catch(() => null),
          fetch("/api/f1/sessions/latest").catch(() => null),
          fetch("/api/f1/comparison/bearman-ocon").catch(() => null),
        ]);

        if (bearmanRes?.ok) {
          const data = await bearmanRes.json();
          setBearman(data);
        }
        
        if (oconRes?.ok) {
          const data = await oconRes.json();
          setOcon(data);
        }
        
        if (sessionRes?.ok) {
          const data = await sessionRes.json();
          setSession(data);
        }
        
        if (comparisonRes?.ok) {
          const data = await comparisonRes.json();
          setComparison(data);
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmBlack via-warmBlack2 to-warmBlack3">
      {/* Hero Section with Liquid Glass Effect */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-warmBlack via-[#E6002B]/5 to-warmBlack3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(230,0,43,0.1),transparent_50%)]" />
        </div>
        
        {/* Glass Morphism Hero Card */}
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="glass-card backdrop-blur-xl bg-warmBlack/40 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <Badge 
                  className="mb-4 bg-gradient-to-r from-[#E6002B] to-[#ff1e50] border-0 text-white px-4 py-1"
                  style={{ backgroundColor: HAAS_RED }}
                >
                  <Flag className="w-3 h-3 mr-2" />
                  HAAS F1 TEAM
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 tracking-tight">
                  Team Dashboard
                </h1>
                <p className="text-lg md:text-xl text-offWhite/80 font-light max-w-2xl">
                  Real-time telemetry and performance data for the Haas F1 Team drivers
                </p>
                
                {/* Live Status Indicator */}
                {session && (
                  <div className="mt-6 inline-flex items-center gap-3 glass-card backdrop-blur-lg bg-warmBlack/60 border border-white/10 rounded-full px-6 py-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6002B] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E6002B]"></span>
                    </div>
                    <span className="text-sm font-medium text-white font-orbitron">
                      {session.session_status || "LIVE"}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Decorative Element */}
              <div className="hidden md:block">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E6002B] to-transparent opacity-20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Users className="w-24 h-24 text-[#E6002B] opacity-30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Session Info Section */}
      {session && (
        <section className="container mx-auto px-4 py-8">
          <Card className="glass-card backdrop-blur-xl bg-warmBlack/60 border border-white/10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E6002B]/10 via-transparent to-transparent"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-orbitron flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#E6002B]" />
                Current Session
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-offWhite/60 uppercase tracking-wide">Location</p>
                  <p className="text-xl font-semibold font-orbitron">{session.circuit_short_name}</p>
                  <p className="text-sm text-offWhite/80">{session.location}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-offWhite/60 uppercase tracking-wide">Session</p>
                  <p className="text-xl font-semibold font-orbitron">{session.session_name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-offWhite/60 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Status
                  </p>
                  <Badge 
                    variant="outline" 
                    className="text-base border-[#E6002B] text-[#E6002B] bg-[#E6002B]/10"
                  >
                    {session.session_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Drivers Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[#E6002B] to-transparent"></div>
          Team Drivers
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bearman Card */}
          <DriverCard 
            driver={bearman} 
            loading={loading} 
            driverNumber={87}
            accentColor={HAAS_RED}
          />
          
          {/* Ocon Card */}
          <DriverCard 
            driver={ocon} 
            loading={loading} 
            driverNumber={31}
            accentColor={HAAS_RED}
          />
        </div>
      </section>

      {/* Comparison Section */}
      {comparison && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold font-orbitron text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#E6002B] to-transparent"></div>
            Head-to-Head Comparison
          </h2>
          
          <Card className="glass-card backdrop-blur-xl bg-warmBlack/60 border border-white/10 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E6002B]/5 via-transparent to-transparent"></div>
            <CardContent className="relative z-10 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Driver 1 */}
                <div className="text-center md:text-left space-y-4">
                  <h3 className="text-2xl font-bold font-orbitron">{comparison.driver1.name}</h3>
                  <div className="space-y-2">
                    <StatItem label="Best Lap" value={comparison.driver1.best_lap} />
                    <StatItem label="Avg Speed" value={`${comparison.driver1.avg_speed} km/h`} />
                    <StatItem label="Position" value={`P${comparison.driver1.position}`} />
                  </div>
                </div>

                {/* Delta */}
                <div className="flex flex-col items-center justify-center">
                  <div className="glass-card backdrop-blur-lg bg-[#E6002B]/20 border border-[#E6002B]/30 rounded-2xl p-6 text-center">
                    <p className="text-sm text-offWhite/60 uppercase tracking-wide mb-2">Delta</p>
                    <p className="text-4xl font-bold font-orbitron text-[#E6002B]">
                      {comparison.delta}
                    </p>
                    {parseFloat(comparison.delta) > 0 ? (
                      <TrendingUp className="w-6 h-6 mx-auto mt-2 text-[#E6002B]" />
                    ) : (
                      <TrendingDown className="w-6 h-6 mx-auto mt-2 text-f1Green" />
                    )}
                  </div>
                </div>

                {/* Driver 2 */}
                <div className="text-center md:text-right space-y-4">
                  <h3 className="text-2xl font-bold font-orbitron">{comparison.driver2.name}</h3>
                  <div className="space-y-2">
                    <StatItem label="Best Lap" value={comparison.driver2.best_lap} align="right" />
                    <StatItem label="Avg Speed" value={`${comparison.driver2.avg_speed} km/h`} align="right" />
                    <StatItem label="Position" value={`P${comparison.driver2.position}`} align="right" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <Card className="glass-card backdrop-blur-xl bg-gradient-to-br from-[#E6002B]/20 to-transparent border border-[#E6002B]/30 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(230,0,43,0.2),transparent_70%)]"></div>
          <CardContent className="relative z-10 p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">
              Experience Live Telemetry
            </h2>
            <p className="text-lg text-offWhite/80 mb-8 max-w-2xl mx-auto">
              Get real-time updates, detailed analytics, and exclusive insights during race weekends
            </p>
            <Button 
              size="lg"
              className="bg-[#E6002B] hover:bg-[#ff1e50] text-white border-0 font-orbitron text-lg px-8 py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#E6002B]/50"
            >
              View Live Timing
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-destructive/10 border-destructive/50 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-lg">{error}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Glass Card Styles */}
      <style jsx global>{`
        .glass-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px 0 rgba(230, 0, 43, 0.1);
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          box-shadow: 0 12px 48px 0 rgba(230, 0, 43, 0.2);
          transform: translateY(-2px);
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

// Driver Card Component
function DriverCard({ 
  driver, 
  loading, 
  driverNumber,
  accentColor 
}: { 
  driver: Driver | null; 
  loading: boolean; 
  driverNumber: number;
  accentColor: string;
}) {
  if (loading) {
    return (
      <Card className="glass-card backdrop-blur-xl bg-warmBlack/60 border border-white/10">
        <CardHeader>
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full bg-white/10" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card backdrop-blur-xl bg-warmBlack/60 border border-white/10 text-white overflow-hidden group">
      {/* Accent Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent"
        style={{ color: accentColor }}
      />
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}15, transparent 70%)`
        }}
      />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-orbitron mb-2">
              {driver?.broadcast_name || `Driver ${driverNumber}`}
            </CardTitle>
            <CardDescription className="text-offWhite/60">
              {driver?.full_name || "Loading..."}
            </CardDescription>
          </div>
          <div 
            className="text-4xl font-bold font-orbitron opacity-30"
            style={{ color: accentColor }}
          >
            #{driverNumber}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {driver && (
            <>
              <div className="flex items-center justify-between p-3 glass-card backdrop-blur-lg bg-warmBlack/40 border border-white/5 rounded-xl">
                <span className="text-sm text-offWhite/60 uppercase tracking-wide">Team</span>
                <span className="font-semibold font-orbitron">{driver.team_name}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 glass-card backdrop-blur-lg bg-warmBlack/40 border border-white/5 rounded-xl">
                <span className="text-sm text-offWhite/60 uppercase tracking-wide">Acronym</span>
                <Badge 
                  variant="outline" 
                  className="border-white/20 text-white font-orbitron"
                >
                  {driver.name_acronym}
                </Badge>
              </div>

              {driver.country_code && (
                <div className="flex items-center justify-between p-3 glass-card backdrop-blur-lg bg-warmBlack/40 border border-white/5 rounded-xl">
                  <span className="text-sm text-offWhite/60 uppercase tracking-wide">Country</span>
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://flagsapi.com/${driver.country_code}/flat/32.png`}
                      alt={driver.country_code}
                      className="w-6 h-4 object-cover rounded"
                    />
                    <span className="font-semibold">{driver.country_code}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Stat Item Component
function StatItem({ 
  label, 
  value, 
  align = "left" 
}: { 
  label: string; 
  value: string; 
  align?: "left" | "right" 
}) {
  return (
    <div className={cn("flex flex-col", align === "right" && "items-end")}>
      <p className="text-xs text-offWhite/60 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold font-orbitron">{value}</p>
    </div>
  );
}
