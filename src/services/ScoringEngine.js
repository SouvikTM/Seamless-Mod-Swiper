// ScoringEngine.js
// Logic-based compatibility scoring

// Approximate release dates for major game versions (fallback)
const GAME_PATCH_DATES = {
    'skyrimse': {
        '1.6.1170': new Date('2024-01-17'),
        '1.6.640': new Date('2022-09-15'),
        '1.5.97': new Date('2019-11-21')
    },
    'fallout4': {
        '1.10.163': new Date('2019-12-04'),
        '1.10.984': new Date('2024-05-13') // Next-gen update
    }
};

export const ScoringEngine = {
    calculateLogicScore: (modData, gameDomain, gameVersion) => {
        let score = 50;
        const signals = [];
        const maxScore = 100;
        const minScore = 0;

        // 1. Check Update Date vs Game Patch Date
        const modDate = new Date(modData.updatedAt);
        const patchDate = GAME_PATCH_DATES[gameDomain]?.[gameVersion];

        if (patchDate) {
            if (modDate > patchDate) {
                score += 20;
                signals.push({ type: 'positive', text: 'Updated after game patch' });
            } else {
                // Not necessarily bad, but not a positive signal
            }
        }

        // 2. Author Confirmation (Text Analysis of Description)
        const description = (modData.description || '').toLowerCase() + (modData.summary || '').toLowerCase();

        if (description.includes(`compatible with ${gameVersion}`) || description.includes(`works with ${gameVersion}`)) {
            score += 30;
            signals.push({ type: 'positive', text: 'Author confirms compatibility' });
        }

        if (description.includes(`incompatible with ${gameVersion}`) || description.includes(`broken in ${gameVersion}`)) {
            score -= 40;
            signals.push({ type: 'negative', text: 'Author declares incompatibility' });
        }

        // 3. User Reports (Endorsements/Comments - Proxy)
        // Real comment analysis requires fetching comments. For list view, we use endorsements/downloads ratio or just endorsements as a weak signal?
        // The prompt asks for "User-Confirmed Compatibility" from comments. 
        // Since we don't have comments in the basic mod list object, we can't do this fully without fetching details.
        // For MVP list view, we'll skip deep comment analysis or rely on Gemini for that part if it can see comments (it can't unless we fetch them).
        // We'll add a placeholder signal if endorsements are high (popular mods often updated or compatible).
        if (modData.endorsements > 10000) {
            score += 5;
            signals.push({ type: 'positive', text: 'Highly endorsed (Community trusted)' });
        }

        // Clamp score
        score = Math.max(minScore, Math.min(maxScore, score));

        return {
            score,
            signals
        };
    }
};
