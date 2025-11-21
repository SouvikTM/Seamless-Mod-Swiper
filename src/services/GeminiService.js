// GeminiService.js
// Handles interactions with Gemini API for compatibility scoring

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const GeminiService = {
    evaluateCompatibility: async (apiKey, modData, gameVersion) => {
        if (!apiKey) return { score: 50, reasoning: "No API Key provided." };

        const prompt = `
      You are a modding expert. Evaluate the compatibility of the following mod for version ${gameVersion} of the game.
      
      Mod Name: ${modData.name}
      Author: ${modData.author}
      Version: ${modData.version}
      Last Updated: ${modData.updatedAt}
      Description: ${modData.summary}
      
      Provide a compatibility score from 0 to 100 (0 = definitely broken, 50 = unknown/neutral, 100 = definitely compatible) and a brief reasoning (max 2 sentences).
      
      Format your response as JSON:
      {
        "score": number,
        "reasoning": "string"
      }
    `;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("Gemini API Error", data.error);
                return { score: 50, reasoning: "AI Error: " + data.error.message };
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) return { score: 50, reasoning: "No response from AI." };

            // Parse JSON from text (handle potential markdown code blocks)
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanText);

            return result;
        } catch (e) {
            console.error("Gemini Service Failed", e);
            return { score: 50, reasoning: "AI Service unavailable." };
        }
    }
};
