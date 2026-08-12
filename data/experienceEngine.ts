import { visualWorlds } from "@/data/worlds";

export type ExperienceDNA = {
  warmth: number;
  calm: number;
  energy: number;
  intimacy: number;
  mystery: number;
  dreaminess: number;
  luxury: number;
  romance: number;
  nature: number;
  intensity: number;
};

const emptyDNA = (): ExperienceDNA => ({
  warmth: 0,
  calm: 0,
  energy: 0,
  intimacy: 0,
  mystery: 0,
  dreaminess: 0,
  luxury: 0,
  romance: 0,
  nature: 0,
  intensity: 0,
});

const moodWeights: Record<
  string,
  Partial<ExperienceDNA>
> = {
  calm: {
    calm: 1,
    dreaminess: 0.35,
    nature: 0.35,
    intensity: -0.35,
  },

  warm: {
    warmth: 1,
    intimacy: 0.25,
    romance: 0.2,
  },

  dreamy: {
    dreaminess: 1,
    mystery: 0.3,
    calm: 0.2,
  },

  natural: {
    nature: 1,
    calm: 0.45,
    warmth: 0.15,
  },

  mystic: {
    mystery: 1,
    dreaminess: 0.4,
    intensity: 0.25,
  },

  romantic: {
    romance: 1,
    warmth: 0.45,
    intimacy: 0.65,
  },

  intimate: {
    intimacy: 1,
    warmth: 0.55,
    calm: 0.2,
  },

  luxury: {
    luxury: 1,
    intensity: 0.35,
    warmth: 0.2,
  },
};

const emotionWeights: Record<
  string,
  Partial<ExperienceDNA>
> = {
  warm: {
    warmth: 1,
    intimacy: 0.35,
  },

  dreamy: {
    dreaminess: 1,
    calm: 0.25,
    mystery: 0.25,
  },

  grand: {
    luxury: 1,
    intensity: 0.55,
  },

  intimate: {
    intimacy: 1,
    warmth: 0.4,
    calm: 0.2,
  },

  calm: {
    calm: 1,
    nature: 0.2,
    intensity: -0.3,
  },

  energetic: {
    energy: 1,
    intensity: 1,
    warmth: 0.2,
  },

  mysterious: {
    mystery: 1,
    dreaminess: 0.35,
    intensity: 0.2,
  },

  delicate: {
    warmth: 0.25,
    romance: 0.55,
    calm: 0.45,
    intensity: -0.2,
  },
};

function applyWeights(
  dna: ExperienceDNA,
  weights: Partial<ExperienceDNA>,
  amount = 1
) {
  for (const key of Object.keys(weights) as Array<
    keyof ExperienceDNA
  >) {
    dna[key] += (weights[key] ?? 0) * amount;
  }
}

function normalizeDNA(
  dna: ExperienceDNA,
  selections: number
): ExperienceDNA {
  if (selections === 0) {
    return dna;
  }

  const result = { ...dna };

  for (const key of Object.keys(result) as Array<
    keyof ExperienceDNA
  >) {
    result[key] = Math.max(
      -1,
      Math.min(1, result[key] / selections)
    );
  }

  return result;
}

export function buildExperienceDNA({
  worlds = [],
  emotions = [],
}: {
  worlds?: string[];
  emotions?: string[];
}): ExperienceDNA {
  const dna = emptyDNA();

  for (const worldId of worlds) {
    const world = visualWorlds.find(
      (item) => item.id === worldId
    );

    if (!world) {
      continue;
    }

    const weights = moodWeights[world.mood];

    if (weights) {
      applyWeights(dna, weights);
    }
  }

  for (const emotionId of emotions) {
    const weights = emotionWeights[emotionId];

    if (weights) {
      applyWeights(dna, weights);
    }
  }

  return normalizeDNA(
    dna,
    Math.max(worlds.length + emotions.length, 1)
  );
}