"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  Sparkles,
  Award,
  ArrowUpRight,
  X,
  GraduationCap,
  Building,
  Globe2,
  HeartHandshake
} from "lucide-react";
import { Milestone, fetchMilestones } from "../lib/api";
import { cn } from "@/lib/cn";

// Fallback verified milestones from Shobhit University archival records
const FALLBACK_MILESTONES: Milestone[] = [
  {
    id: "1989-nice",
    year: "1989",
    title: "Founding of NICE Society",
    category: "Foundation",
    summary: "Establishment of the NICE Society to pioneer computer education and vocational training across North India.",
    narrative: "Recognizing that the dawn of the information era would transform society, Kunwar Shekhar Vijendra co-founded the National Institute of Computer Education (NICE) in Meerut, democratizing technological access for students from semi-urban and rural backgrounds.",
    photos: ["/photos/image1.jpeg"],
    citations: ["NICE Society Foundation Charter 1989", "Shobhit Institute Archives"]
  },
  {
    id: "2000-eng-med",
    year: "2000",
    title: "Engineering & Professional Institutes",
    category: "Higher Education",
    summary: "Inauguration of Shobhit Institute of Engineering & Technology, fostering research-driven engineering education.",
    narrative: "Expanding higher education beyond conventional paradigms, new schools of engineering, biotechnology, and management were founded to train future technocrats and leaders.",
    photos: ["/photos/image2.jpeg"],
    citations: ["AICTE Recognition Approvals 2000", "SIET Founding Documentation"]
  },
  {
    id: "2006-deemed-uni",
    year: "2006",
    title: "Shobhit Deemed University Notification",
    category: "University Charter",
    summary: "Conferment of Deemed-to-be University status under Section 3 of the UGC Act 1956 by MHRD, Govt. of India.",
    narrative: "A historic milestone celebrating academic excellence, granting autonomous university status to Shobhit Institute of Engineering & Technology in Meerut.",
    photos: ["/photos/image1.jpeg"],
    citations: ["MHRD Govt. of India Notification No. F.9-37/2004-U.3", "UGC Gazette Record 2006"]
  },
  {
    id: "2012-gangoh-campus",
    year: "2012",
    title: "Shobhit University Gangoh Charter",
    category: "Rural Empowerment",
    summary: "State Legislative Charter establishing Shobhit University at Gangoh, Saharanpur, advancing rural health and education.",
    narrative: "Fulfilling the vision that world-class education should not remain limited to metropolitan centers, the Gangoh campus was founded, housing Ayurveda, Naturopathy, Pharmacy, and Agricultural research.",
    photos: ["/photos/image2.jpeg"],
    citations: ["Uttar Pradesh Act No. 3 of 2012", "UP State Legislature Gazette"]
  },
  {
    id: "2018-ayur-wellness",
    year: "2018",
    title: "Integrative Ayurveda & Wellness Hospital",
    category: "Healthcare & Social",
    summary: "Establishment of Ayurvedic medical college and charitable hospital providing affordable healthcare to thousands.",
    narrative: "Revitalizing Indian traditional medicine through rigorous clinical validation, establishing free community medical camps and rural healthcare outreach in Western UP.",
    photos: ["/photos/image1.jpeg"],
    citations: ["AYUSH Ministry Recognition", "Charitable Medical Registry 2018"]
  },
  {
    id: "2024-global-summits",
    year: "2024+",
    title: "Global Educational Diplomacy & Innovation",
    category: "Global Leadership",
    summary: "Keynote delegations across UNESCO, European parliaments, and Asian leadership summits championing NEP 2020.",
    narrative: "Continuing to advocate for ethical AI, skill-based education, and universal human values, representing Indian higher education across premier global academic forums.",
    photos: ["/photos/image2.jpeg"],
    citations: ["Global Peace Summit Proceedings", "Indian Higher Education Delegation Archives"]
  }
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Foundation": Award,
  "Higher Education": GraduationCap,
  "University Charter": Building,
  "Rural Empowerment": HeartHandshake,
  "Healthcare & Social": HeartHandshake,
  "Global Leadership": Globe2,
};

interface JourneyTimelineProps {
  onAskAIAboutMilestone?: (milestoneTitle: string) => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  onAskAIAboutMilestone,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(FALLBACK_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMilestones();
        if (data && data.length > 0) {
          setMilestones(data);
        }
      } catch (err) {
        console.warn("Using fallback milestones archive:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420;
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="journey" className="w-full py-20 px-4 sm:px-6 md:px-8 bg-white border-t border-[rgba(26,22,20,0.08)] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold font-ui tracking-[0.2em] text-[#B8862C] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A84B]" />
              Chronological Odyssey
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-5xl text-[#1A1614] tracking-tight">
              Explore His Journey
            </h2>
            <p className="text-sm text-[#8B7B6F] max-w-xl font-ui leading-relaxed">
              From the 1989 inception of NICE Society to university charters, integrative healthcare, and global educational leadership.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleScroll("left")}
              className="p-3 rounded-full bg-[#F5F1EC] hover:bg-[#EFEAE2] text-[#4A3F35] border border-[rgba(26,22,20,0.08)] transition-all active:scale-95 shadow-sm"
              title="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-3 rounded-full bg-[#1E2D5A] hover:bg-[#2E4080] text-white transition-all active:scale-95 shadow-md"
              title="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Milestone Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {milestones.map((m, index) => {
            const Icon = CATEGORY_ICONS[m.category] || Award;
            return (
              <motion.div
                key={m.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.08 }}
                onClick={() => setSelectedMilestone(m)}
                className="heritage-card rounded-2xl p-6 sm:p-7 min-w-[320px] sm:min-w-[360px] md:min-w-[380px] max-w-[400px] flex-shrink-0 cursor-pointer snap-start flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Year Badge & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-[#B8862C] font-mono text-xs font-semibold">
                      {m.year}
                    </span>
                    <span className="text-[11px] font-ui text-[#8B7B6F] flex items-center gap-1.5 font-medium">
                      <Icon className="w-3.5 h-3.5 text-[#B8862C]" />
                      {m.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-medium text-xl sm:text-2xl text-[#1A1614] mb-3 group-hover:text-[#B8862C] transition-colors line-clamp-2">
                    {m.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#4A3F35] font-ui leading-relaxed line-clamp-3 mb-6">
                    {m.summary}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 border-t border-[rgba(26,22,20,0.06)] flex items-center justify-between text-xs font-semibold text-[#1E2D5A] group-hover:text-[#B8862C] transition-colors">
                  <span>View Archival Narrative</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Milestone Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A1614]/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white border border-[rgba(184,134,44,0.30)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#F5F1EC] text-[#8B7B6F] hover:text-[#1A1614] hover:bg-[#EFEAE2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FDF5E4] border border-[rgba(184,134,44,0.30)] text-[#B8862C] font-mono text-sm font-semibold">
                    {selectedMilestone.year}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8B7B6F]">
                    {selectedMilestone.category}
                  </span>
                </div>

                <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#1A1614]">
                  {selectedMilestone.title}
                </h3>

                <p className="text-sm sm:text-base text-[#4A3F35] font-ui leading-relaxed">
                  {selectedMilestone.narrative || selectedMilestone.summary}
                </p>

                {/* Citations Box */}
                {selectedMilestone.citations && selectedMilestone.citations.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[rgba(26,22,20,0.06)] space-y-2">
                    <span className="text-[11px] font-mono text-[#B8862C] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                      <BookOpen className="w-3.5 h-3.5" />
                      Verified Archival Citation:
                    </span>
                    <ul className="list-disc list-inside text-xs text-[#8B7B6F] space-y-1">
                      {selectedMilestone.citations.map((cite, i) => (
                        <li key={i} className="italic">{cite}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ask AI Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      const title = selectedMilestone.title;
                      setSelectedMilestone(null);
                      if (onAskAIAboutMilestone) {
                        onAskAIAboutMilestone(title);
                      } else {
                        document.getElementById("wisdom")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1E2D5A] hover:bg-[#2E4080] text-white font-ui font-semibold text-xs transition-all shadow-md active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4A84B]" />
                    <span>Ask Chancellor AI About This Era</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
