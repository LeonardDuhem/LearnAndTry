"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import type { Subject } from "@/lib/types";

interface StoreInitializerProps {
  subjects: Subject[];
}

export default function StoreInitializer({ subjects }: StoreInitializerProps) {
  const initialized = useRef(false);
  const setSubjects = useAppStore((s) => s.setSubjects);

  useEffect(() => {
    if (!initialized.current) {
      setSubjects(subjects);
      initialized.current = true;
    }
  }, [subjects, setSubjects]);

  return null; // Ce composant ne rend rien visuellement
}