"use client";

import { FormEvent, useMemo, useState } from "react";
import type { BirthdayProfile } from "@/types/experience";
import { useExperience } from "@/hooks/useExperience";

export type { BirthdayProfile };



type BirthdayProfileExperienceProps = {
  onComplete: (profile: BirthdayProfile) => void;
};

function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(`${birthDate}T00:00:00`);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference =
    today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

export default function BirthdayProfileExperience({
  onComplete,
}: BirthdayProfileExperienceProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [wish, setWish] = useState("");

  const [step, setStep] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const { setProfile } = useExperience();

  const fields = useMemo(
    () => [
      {
        key: "name",
        label: "اول از همه...",
        title: "دوست داری با چه اسمی صدات کنیم؟",
        description:
          "اسمی که قرار است در ادامه این تجربه همراهت باشد.",
        value: name,
        setValue: setName,
        placeholder: "نامت را اینجا بنویس",
        type: "text",
      },
      {
        key: "birthDate",
        label: "مرحله دوم",
        title: "تاریخ تولدت چه روزیه؟",
        description:
          "فقط برای اینکه لحن و حال‌وهوای پیام پایانی درست انتخاب بشه.",
        value: birthDate,
        setValue: setBirthDate,
        placeholder: "",
        type: "date",
      },
      {
        key: "wish",
        label: "آخرین مرحله",
        title: "یکی از بهترین آرزوهایی که داری رو بنویس",
        description:
          "همون آرزویی که دوست داری یک روز قشنگ بهش برسی.",
        value: wish,
        setValue: setWish,
        placeholder: "مثلاً: آرامش، موفقیت، سفر به یک جای خاص...",
        type: "textarea",
      },
    ],
    [name, birthDate, wish]
  );

  const currentField = fields[step];

  const canContinue =
    currentField.key === "name"
      ? name.trim().length >= 2
      : currentField.key === "birthDate"
        ? birthDate.length > 0
        : wish.trim().length >= 5;

  function nextStep() {
    if (!canContinue) return;

    if (step < fields.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    submitProfile();
  }

  function submitProfile() {
    const age = calculateAge(birthDate);

    const profile: BirthdayProfile = {
      name: name.trim(),
      birthDate,
      wish: wish.trim(),
      age,
      tone: age > 30 ? "warm-respectful" : "warm-friendly",
    };

    setProfile(profile);

    setIsLeaving(true);

    window.setTimeout(() => {
      onComplete(profile);
    }, 700);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    nextStep();
  }

  return (
    <main
      className={`profile-experience ${
        isLeaving ? "is-leaving" : ""
      }`}
      dir="rtl"
    >
      <div className="profile-background" />

      <div className="profile-glow profile-glow-one" />
      <div className="profile-glow profile-glow-two" />

      <div className="profile-stars" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
              animationDelay: `${(index % 6) * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="profile-frame" />

      <section className="profile-card">
        <div className="profile-topline">
          <span />
          <span>PIXORA EXPERIENCE</span>
          <span />
        </div>

        <div className="profile-progress">
          <div className="profile-progress-info">
            <span>
              {String(step + 1).padStart(2, "0")}
            </span>

            <span>
              {String(fields.length).padStart(2, "0")}
            </span>
          </div>

          <div className="profile-progress-track">
            <div
              className="profile-progress-value"
              style={{
                width: `${((step + 1) / fields.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="profile-intro">
          <div className="profile-label">
            {currentField.label}
          </div>

          <h1>{currentField.title}</h1>

          <p>{currentField.description}</p>
        </div>

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          {currentField.type === "textarea" ? (
            <textarea
              value={currentField.value}
              onChange={(event) =>
                currentField.setValue(event.target.value)
              }
              placeholder={currentField.placeholder}
              autoFocus
              rows={4}
            />
          ) : (
            <input
              type={currentField.type}
              value={currentField.value}
              onChange={(event) =>
                currentField.setValue(event.target.value)
              }
              placeholder={currentField.placeholder}
              autoFocus
            />
          )}

          <button
            type="submit"
            className="profile-next-button"
            disabled={!canContinue}
          >
            <span>
              {step === fields.length - 1
                ? "ادامه تجربه"
                : "مرحله بعد"}
            </span>

            <i>←</i>
          </button>
        </form>

        <div className="profile-footer">
          اطلاعاتت فقط برای ساختن یک تجربه شخصی‌تر استفاده میشه
        </div>
      </section>

      <div className="profile-corner profile-corner-one" />
      <div className="profile-corner profile-corner-two" />
    </main>
  );
}