"use client";

import {
  useCallback,
  useState,
} from "react";

import IntroExperience from "@/components/intro/IntroExperience";
import PixoraWelcome from "@/components/intro/PixoraWelcome";
import BirthdayProfileExperience from "@/components/profile/BirthdayProfileExperience";
import QuizExperience from "@/components/quiz/QuizExperience";

import {
  ExperienceAudioProvider,
} from "@/src/components/audio/ExperienceAudioManager";

import { useExperience } from "@/hooks/useExperience";

import type { BirthdayProfile } from "@/types/experience";

function ExperienceApp() {
  const [introFinished, setIntroFinished] =
    useState(false);

  const [welcomeFinished, setWelcomeFinished] =
    useState(false);

  const {
    preferences,
    setProfile,
  } = useExperience();

  const handleIntroComplete =
    useCallback(() => {
      setIntroFinished(true);
    }, []);

  const handleWelcomeComplete =
    useCallback(() => {
      setWelcomeFinished(true);
    }, []);

  const handleProfileComplete =
    useCallback(
      (profile: BirthdayProfile) => {
        setProfile(profile);
      },
      [setProfile]
    );

  /*
   * =====================================================
   * STEP 1 — INTRO
   * =====================================================
   *
   * Intro موسیقی خودش را دارد.
   *
   * ExperienceAudioManager هنوز برای Background
   * Music استفاده نمی‌شود.
   */

  if (!introFinished) {
    return (
      <IntroExperience
        onComplete={handleIntroComplete}
      />
    );
  }

  /*
   * =====================================================
   * STEP 2 — WELCOME
   * =====================================================
   *
   * Background Music از کلیک Start در Welcome
   * شروع می‌شود.
   */

  if (!welcomeFinished) {
    return (
      <PixoraWelcome
        onComplete={handleWelcomeComplete}
      />
    );
  }

  /*
   * =====================================================
   * STEP 3 — PROFILE
   * =====================================================
   */

  if (!preferences.profile) {
    return (
      <BirthdayProfileExperience
        onComplete={
          handleProfileComplete
        }
      />
    );
  }

  /*
   * =====================================================
   * STEP 4+
   * =====================================================
   *
   * Select Color
   * World
   * Emotion
   * Music
   * Lighting
   * Symbol
   * FinalExperience
   */

  return <QuizExperience />;
}

export default function Home() {
  return (
    <ExperienceAudioProvider>
      <ExperienceApp />
    </ExperienceAudioProvider>
  );
}