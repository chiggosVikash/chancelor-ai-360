"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Sparkles, Award, ArrowUpRight } from "lucide-react";
import { Milestone, fetchMilestones } from "../lib/api";

interface HorizontalJourneyTimelineProps {
  onAskAIAboutMilestone?: (milestoneTitle: string) => void;
}

export const HorizontalJourneyTimeline: React.FC<HorizontalJourneyTimelineProps> = ({
  onAskAIAboutMilestone,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMilestones();
        setMilestones(data);
      } catch (err) {
        console.error("Failed to load milestones:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="journey" className="w-full py-16 px-4 sm:px-6 md:px-8 border-t border-white/5 relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C9A45C] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E4C98A]" />
            Chronological Odyssey
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-[#F5F2EA] tracking-wide">
            EXPLORE HIS JOURNEY
          </h2>
          <p className="text-xs sm:text-sm text-[#9B968B] max-w-xl font-ui leading-relaxed">
            From the 1989 inception of NICE Society to university charters, integrative healthcare, and global educational diplomacy.
          </p>
        </div>

        {/* Horizontal Navigation Controls */}
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-block text-[11px] font-mono text-[#9B968B]">
            PAST ────→ PRESENT
          </span>
          <div className="flex items-center space-x-2">
            <button
              id="timeline-scroll-left"
              onClick={() => handleScroll("left")}
              className="p-3 rounded-full bg-[#121210] hover:bg-[#1c1b18] border border-white/10 text-[#F5F2EA] transition-all cursor-pointer hover:border-[#C9A45C]/40"
              title="Scroll back in time"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="timeline-scroll-right"
              onClick={() => handleScroll("right")}
              className="p-3 rounded-full bg-[#121210] hover:bg-[#1c1b18] border border-white/10 text-[#F5F2EA] transition-all cursor-pointer hover:border-[#C9A45C]/40"
              title="Scroll forward in time"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* The Horizontal Timeline Track */}
      <div className="relative w-full">
        {/* Horizontal connecting guideline */}
        <div className="absolute top-[28px] inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A45C]/30 to-transparent pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto no-scrollbar pb-8 pt-4 px-2 snap-x snap-mandatory"
        >
          {isLoading ? (
            <div className="flex space-x-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[320px] sm:w-[380px] h-96 rounded-3xl bg-[#121210]/60 border border-white/5 animate-pulse shrink-0"
                />
              ))}
            </div>
          ) : (
            milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone)}
                className="w-[320px] sm:w-[380px] shrink-0 snap-start group cursor-pointer"
              >
                {/* Year Marker Pin */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-[#121210] border-2 border-[#C9A45C] group-hover:bg-[#C9A45C] group-hover:scale-125 transition-all shadow-[0_0_12px_rgba(201,164,92,0.4)]" />
                  <span className="font-mono text-xs font-semibold tracking-wider text-[#E4C98A]">
                    {milestone.year}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c1b18] border border-white/10 text-[#9B968B]">
                    {milestone.category}
                  </span>
                </div>

                {/* Milestone Card */}
                <div className="heritage-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-[360px] relative overflow-hidden group-hover:border-[#C9A45C]/40">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-[#9B968B] uppercase tracking-widest block">
                      Milestone 0{idx + 1}
                    </span>
                    <h3 className="font-display font-medium text-xl sm:text-2xl text-[#F5F2EA] leading-snug group-hover:text-[#E4C98A] transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-[#9B968B] leading-relaxed line-clamp-4">
                      {milestone.narrative}
                    </p>
                  </div>

                  {/* Card Bottom / Citations & AI Query Trigger */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#9B968B]">
                      <BookOpen className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span className="truncate max-w-[170px]">{milestone.citations[0]}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAskAIAboutMilestone) {
                          onAskAIAboutMilestone(milestone.title);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#1c1a17] hover:bg-[#C9A45C] text-[#C9A45C] hover:text-[#0B0B0A] text-[10px] font-mono tracking-wider transition-colors flex items-center gap-1"
                      title="Ask Chancellor AI about this milestone"
                    >
                      <span>Ask AI</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
