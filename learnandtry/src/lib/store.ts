import { create } from "zustand";
import type { Subject } from "./types";

interface AppStore {
  // État
  subjects: Subject[];
  subjectsLoaded: boolean;

  // Actions
  setSubjects: (subjects: Subject[]) => void;
  addSubject: (subject: Subject) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  subjects: [],
  subjectsLoaded: false,

  setSubjects: (subjects) => set({ subjects, subjectsLoaded: true }),

  addSubject: (subject) =>
    set((state) => ({
      subjects: [...state.subjects, subject],
    })),
}));