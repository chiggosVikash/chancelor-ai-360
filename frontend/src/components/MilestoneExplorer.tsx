"use client";
import React, { useState, useEffect } from "react";
import { Search, Compass, X, BookOpen, Calendar, Award } from "lucide-react";
import { Milestone, fetchMilestones } from "../lib/api";
import { MilestoneCard } from "./MilestoneCard";

const CATEGORIES = ["All", "Education", "Healthcare & Ayurveda", "Global Leadership", "Youth Welfare"];

export const MilestoneExplorer: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMilestones();
  }, [selectedCategory]);

  const loadMilestones = async (query = searchQuery) => {
    setIsLoading(true);
    try {
      const data = await fetchMilestones(query, selectedCategory);
      setMilestones(data);
    } catch (err) {
      console.error("Failed to load milestones:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMilestones(searchQuery);
  };

  return (
    <section className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
              Explore His Journey
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Traverse over three decades of transformative milestones, institution building, and social initiatives.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            id="milestone-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 1989, Ayurveda, AI..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 py-4 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-semibold"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Milestone Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800/60" />
          ))}
        </div>
      ) : milestones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {milestones.map((m) => (
            <MilestoneCard key={m.id} milestone={m} onSelect={(item) => setActiveMilestone(item)} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 text-sm">
          No milestones matched your search query. Try searching &quot;1989&quot;, &quot;Gangoh&quot;, or &quot;Hospital&quot;.
        </div>
      )}

      {/* Detailed Narrative Modal */}
      {activeMilestone && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              id="close-milestone-modal"
              onClick={() => setActiveMilestone(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  {activeMilestone.year}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {activeMilestone.category}
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl text-white">
                {activeMilestone.title}
              </h3>

              {/* Photo Showcase Frame */}
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                <Award className="w-10 h-10 text-amber-400/60 mb-2" />
                <p className="text-xs text-amber-300/80 font-medium">Official Archival Milestone</p>
                <p className="text-[11px] text-slate-500">Shobhit University Historical Collection</p>
              </div>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed pt-2">
                {activeMilestone.narrative}
              </p>

              {/* Citations */}
              {activeMilestone.citations && activeMilestone.citations.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    Verified Archival Citations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeMilestone.citations.map((c, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300/90 border border-amber-500/20">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
