"use client";
import React from "react";
import { Calendar, BookOpen, ExternalLink, Award } from "lucide-react";
import { Milestone } from "../lib/api";

interface MilestoneCardProps {
  milestone: Milestone;
  onSelect: (milestone: Milestone) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(milestone)}
      className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Category ribbon / badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{milestone.year}</span>
        </span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {milestone.category}
        </span>
      </div>

      {/* Title & Summary */}
      <div className="space-y-2">
        <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
          {milestone.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {milestone.summary}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>{milestone.citations.length} Citation{milestone.citations.length > 1 ? "s" : ""}</span>
        </span>
        <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px] font-medium">
          View Narrative <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
