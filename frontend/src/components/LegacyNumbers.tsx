"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Building2, BookOpen, Globe } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
}

const STATS: StatItem[] = [
  {
    icon: Award,
    value: 35, suffix: "+",
    label: "Years of Service",
    sublabel: "Since NICE founding in 1989",
    color: "#B8862C",
  },
  {
    icon: Building2,
    value: 2, suffix: "",
    label: "University Campuses",
    sublabel: "Meerut & Gangoh, Uttar Pradesh",
    color: "#1E2D5A",
  },
  {
    icon: Users,
    value: 10000, suffix: "+",
    label: "Lives Touched",
    sublabel: "Students, researchers & communities",
    color: "#B8862C",
  },
  {
    icon: Globe,
    value: 50, suffix: "+",
    label: "Global Summits",
    sublabel: "International education forums",
    color: "#1E2D5A",
  },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatCard({ item, index }: { item: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(item.value, 1600, isInView);
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay: index * 0.1 }}
      className="heritage-card rounded-2xl p-6 flex flex-col items-center text-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: item.color === "#B8862C" ? "#FDF5E4" : "rgba(30,45,90,0.08)" }}
      >
        <Icon className="w-6 h-6" style={{ color: item.color }} />
      </div>

      <div>
        <div
          className="font-display font-semibold text-4xl sm:text-5xl leading-none"
          style={{ color: item.color }}
        >
          {item.value >= 1000
            ? (count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count)
            : count
          }{item.suffix}
        </div>
        <div className="mt-1.5 font-ui font-semibold text-sm text-[#1A1614]">{item.label}</div>
        <div className="mt-0.5 text-xs text-[#8B7B6F] font-ui">{item.sublabel}</div>
      </div>
    </motion.div>
  );
}

export const LegacyNumbers: React.FC = () => {
  return (
    <section id="legacy-numbers" className="bg-[#F5F1EC] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section heading */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold font-ui tracking-[0.18em] uppercase text-[#B8862C] mb-3"
          >
            ✦ &nbsp;A Legacy in Numbers
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display font-semibold text-3xl sm:text-4xl text-[#1A1614]"
          >
            Decades of Dedication
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} item={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
