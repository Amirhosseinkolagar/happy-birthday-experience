"use client";

import { useMemo, useState } from "react";

type PersonalizationExperienceProps = {
  onComplete: (profile: UserProfile) => void;
};

export type UserProfile = {
  name: string;
  birthDate: string;
  wish: string;
};

type Step = 0 | 1 | 2;

const STEP_META = [
  {
    number: "01",
    label: "IDENTITY",
    title: "اسمت رو بهم بگو",
    description:
      "می‌خوای این داستان رو با چه اسمی برای تو بسازیم؟",
  },
  {
    number: "02",
    label: "YOUR DATE",
    title: "تاریخ تولدت رو وارد کن",
    description:
      "یک تاریخ مهم؛ برای اینکه پایان داستان دقیقاً متناسب با تو نوشته بشه.",
  },
  {
    number: "03",
    label: "ONE WISH",
    title: "یکی از بهترین آرزوهات رو بنویس",
    description:
      "اگر فقط یک آرزو می‌توانست همین حالا واقعی بشه، چی بود؟",
  },
] as const;

export default function PersonalizationExperience({
  onComplete,
}: PersonalizationExperienceProps) {
  const [step, setStep] = useState<Step>(0);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    birthDate: "",
    wish: "",
  });

  const current = STEP_META[step];

  const canContinue = useMemo(() => {
    if (step === 0) {
      return profile.name.trim().length >= 2;
    }

    if (step === 1) {
      return Boolean(profile.birthDate);
    }

    return profile.wish.trim().length >= 3;
  }, [profile, step]);

  function updateProfile<K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K],
  ) {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleNext() {
    if (!canContinue) return;

    if (step < 2) {
      setStep((previous) => (previous + 1) as Step);
      return;
    }

    onComplete(profile);
  }

  function handleBack() {
    if (step === 0) return;

    setStep((previous) => (previous - 1) as Step);
  }

  return (
    <main
      dir="rtl"
      className="personalization-screen"
      aria-label="Pixora personalization experience"
    >
      <div className="personalization-background" />
      <div className="personalization-noise" />
      <div className="personalization-vignette" />

      <div className="personalization-orbit personalization-orbit-one" />
      <div className="personalization-orbit personalization-orbit-two" />

      <div className="personalization-shell">
        {/* Header */}
        <header className="personalization-header">
          <div className="personalization-brand">
            <span>PIXORA</span>
            <i />
            <small>PERSONAL EXPERIENCE</small>
          </div>

          <div className="personalization-progress">
            <span>
              {current.number} / 03
            </span>

            <div className="personalization-progress-track">
              <div
                className="personalization-progress-fill"
                style={{
                  width: `${((step + 1) / 3) * 100}%`,
                }}
              />
            </div>
          </div>
        </header>

        {/* Main */}
        <section
          key={step}
          className="personalization-stage"
        >
          <div className="personalization-step-label">
            <span>{current.number}</span>
            <div />
            <span>{current.label}</span>
          </div>

          <div className="personalization-title-wrap">
            <h1>{current.title}</h1>

            <p>{current.description}</p>
          </div>

          <div className="personalization-input-zone">
            {step === 0 && (
              <div className="personalization-field">
                <label htmlFor="pixora-name">
                  YOUR NAME
                </label>

                <input
                  id="pixora-name"
                  type="text"
                  value={profile.name}
                  onChange={(event) =>
                    updateProfile(
                      "name",
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      canContinue
                    ) {
                      handleNext();
                    }
                  }}
                  placeholder="نامت را وارد کن"
                  autoFocus
                  maxLength={60}
                  autoComplete="name"
                />

                <div className="personalization-input-line" />
              </div>
            )}

            {step === 1 && (
              <div className="personalization-field">
                <label htmlFor="pixora-birth-date">
                  DATE OF BIRTH
                </label>

                <input
                  id="pixora-birth-date"
                  type="date"
                  value={profile.birthDate}
                  onChange={(event) =>
                    updateProfile(
                      "birthDate",
                      event.target.value,
                    )
                  }
                  autoFocus
                  autoComplete="bday"
                />

                <div className="personalization-input-line" />
              </div>
            )}

            {step === 2 && (
              <div className="personalization-field personalization-field-wish">
                <label htmlFor="pixora-wish">
                  ONE WISH
                </label>

                <textarea
                  id="pixora-wish"
                  value={profile.wish}
                  onChange={(event) =>
                    updateProfile(
                      "wish",
                      event.target.value,
                    )
                  }
                  placeholder="آرزوت رو اینجا بنویس..."
                  autoFocus
                  maxLength={300}
                  rows={3}
                />

                <div className="personalization-input-line" />

                <span className="personalization-counter">
                  {profile.wish.length} / 300
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="personalization-actions">
            {step > 0 ? (
              <button
                type="button"
                className="personalization-back"
                onClick={handleBack}
              >
                <span>→</span>
                بازگشت
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              className="personalization-continue"
              onClick={handleNext}
              disabled={!canContinue}
            >
              <span>
                {step === 2
                  ? "ساخت داستان من"
                  : "ادامه"}
              </span>

              <strong> ← </strong>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="personalization-footer">
          <span>PIXORA</span>
          <i />
          <span>YOUR STORY · YOUR WORLD</span>
        </footer>
      </div>
    </main>
  );
}