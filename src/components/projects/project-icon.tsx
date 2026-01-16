"use client";

import {
  Hash,
  Folder,
  Briefcase,
  Code,
  Book,
  Star,
  Heart,
  Home,
  ShoppingCart,
  Music,
  Camera,
  Gamepad2,
  Plane,
  Car,
  Dumbbell,
  Utensils,
  GraduationCap,
  Lightbulb,
  Palette,
  Gift,
  Trophy,
  Target,
  Rocket,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ProjectIconName } from "@/lib/constants";

const iconMap: Record<ProjectIconName, LucideIcon> = {
  hash: Hash,
  folder: Folder,
  briefcase: Briefcase,
  code: Code,
  book: Book,
  star: Star,
  heart: Heart,
  home: Home,
  "shopping-cart": ShoppingCart,
  music: Music,
  camera: Camera,
  "gamepad-2": Gamepad2,
  plane: Plane,
  car: Car,
  dumbbell: Dumbbell,
  utensils: Utensils,
  "graduation-cap": GraduationCap,
  lightbulb: Lightbulb,
  palette: Palette,
  gift: Gift,
  trophy: Trophy,
  target: Target,
  rocket: Rocket,
  zap: Zap,
};

interface ProjectIconProps {
  icon: string | null;
  color?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function ProjectIcon({
  icon,
  color,
  size = "md",
  className = "",
}: ProjectIconProps) {
  const iconName = (icon ?? "hash") as ProjectIconName;
  const IconComponent = iconMap[iconName] ?? Hash;

  return (
    <IconComponent
      className={`${sizeClasses[size]} ${className}`}
      style={{ color: color ?? undefined }}
    />
  );
}

export function getIconComponent(iconName: string | null): LucideIcon {
  const name = (iconName ?? "hash") as ProjectIconName;
  return iconMap[name] ?? Hash;
}
