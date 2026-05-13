'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Goal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'health';
export type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'athlete';

export interface OnboardingData {
  gender: 'male' | 'female' | null;
  weight: number;
  height: number;
  age: number;
  goal: Goal | null;
  activityLevel: ActivityLevel | null;
}

interface OnboardingContextType {
  data: OnboardingData;
  set: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

const defaultData: OnboardingData = {
  gender: null,
  weight: 70,
  height: 170,
  age: 25,
  goal: null,
  activityLevel: null,
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultData,
  set: () => {},
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

export default function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  function set<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  return (
    <OnboardingContext.Provider value={{ data, set }}>
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </OnboardingContext.Provider>
  );
}
