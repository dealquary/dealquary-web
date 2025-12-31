"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type TutorialState = {
  isEnabled: boolean;
  currentStep: number;
  isCompleted: boolean;

  enableTutorial: () => void;
  disableTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetTutorial: () => void;
  completeTutorial: () => void;
};

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      isEnabled: true, // Enabled by default for new users
      currentStep: 0,
      isCompleted: false,

      enableTutorial: () => set({ isEnabled: true, currentStep: 0, isCompleted: false }),
      disableTutorial: () => set({ isEnabled: false }),

      nextStep: () => set((state) => ({
        currentStep: state.currentStep + 1
      })),

      prevStep: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
      })),

      goToStep: (step: number) => set({ currentStep: step }),

      resetTutorial: () => set({
        currentStep: 0,
        isCompleted: false,
        isEnabled: true
      }),

      completeTutorial: () => set({
        isCompleted: true,
        isEnabled: false
      }),
    }),
    {
      name: 'tutorial-storage', // localStorage key
    }
  )
);
