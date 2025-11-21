Application Overview

Build a Tinder-style web or desktop application that allows users to swipe through video game mods (sourced from Nexus Mods) and determine their compatibility with a selected game version using a custom scoring algorithm and AI analysis. Users swipe left to reject a mod and swipe right to approve it. Approved mods can be exported to a text file. The application is for cataloging only—no mod installation or downloading occurs.

Core Functional Requirements
1. API Usage and Privacy

The app uses two API keys: Nexus Mods API + Gemini (or GPT-like) API.

API keys must never be stored. The user enters them each time the application launches.

Progress (approved/rejected mods) can be stored locally, but API keys must not.

2. Game Selection

UI must include a Game Selector and Game Version Dropdown.

The version chosen determines how compatibility scoring is evaluated.

3. Mod Data Retrieval

Fetch mods from Nexus Mods using the API.

Randomize the order completely (no sorting by downloads/endorsements).

Batch load at least 50 mods per request to ensure smooth swiping.

Display mods as large cards with:

Title

Author

Snippet of description

Compatibility score

Optional thumbnail

4. Swiping System

Swipe left or right with mouse.

Buttons for Approve (right) and Reject (left).

Keyboard shortcuts:

A = left

B = right

Show a small preview of the next card to keep user oriented.

5. Export System

Export all approved mods to a .txt file.

The file should be clean, readable, and list mod name + link.

6. Settings Menu

Include a dropdown with:

Reset progress (must show a confirmation dialog).

UI theme toggle.

7. UI Themes

Two options:

Themed UI matching the selected game’s aesthetic (colors, animations, vibe)

Simple dark UI for minimalism

The theme should not distract from core functionality.

Compatibility Scoring Algorithm
Base score: 50/100

All mods begin at score 50. Positive and negative signals adjust the score.

Primary Compatibility Signals
1. Author-Confirmed Compatibility (Very Large Boost)

If mod author explicitly states compatibility with the chosen game version:

In description

In posts

In changelogs

This yields a near-max positive boost, almost guaranteeing compatibility.

2. User-Confirmed Compatibility (Large Boost)

If 1 user comment confirms compatibility → small positive boost.

If 2+ comments confirm compatibility → large positive boost.

Must check at least 3 pages of comments to ensure reliability.

This boost is always lower than the author-confirmation boost.

3. Mod Updated After Game Update (Positive Boost)

If the mod was updated chronologically after the game’s patch:

Add a positive signal.

This suggests the mod supports the latest version.

4. Post-Update User Discussion (Positive Boost)

If users comment after a game update and the comments show the mod still works:

Boost increases with quantity (minimum two comments).

Still less than author-confirmation weight.

Negative Signals
1. Multiple Users Report Broken Status (Significant Negative)

If 2+ users say the mod is not working with the selected version.

Large negative penalty, but not as severe as explicit author-declared incompatibility.

2. Author Declares Incompatibility (Very Large Negative)

If author explicitly says:

“Not compatible with version X”

“Broken on version X”

Apply a heavy negative penalty.

3. Partial Incompatibility (Small Negative)

Author notes: “Feature A is broken but rest works” → smaller penalty.

Special Mod Cases (Script Extenders, Foundation Mods)

Some mods (e.g., script extenders, core frameworks) are:

Essential for other mods

Frequently fixed rapidly

Often compatible even if comments are closed

These should be treated as high-probability compatible by default, unless explicit incompatibility signals are present.

Disallowed or Low-Value Signals

Update frequency of the mod is irrelevant (already covered by update‑after‑patch logic).

General community feedback (endorsements, ratings) is unreliable for compatibility.

Two Separate Scoring Systems

The app must generate two scores, not combined into one.

1. Logic-Based Score

Determined purely by heuristics & algorithm above.

Clear, deterministic, reproducible.

Uses Nexus Mods API data.

2. General Knowledge / AI Reasoning Score

Powered by Gemini or GPT-based reasoning.

Uses:

Game knowledge

Modding ecosystem knowledge

Typical behavior of similar mods

Logical reasoning

Essentially a “consensus” or “opinion-based” score.

Both scores must display separately on every mod card.

Future (Not Initial) Development Features

Do not include these in the v1 build. They are intended for later stages.

1. Community-Sourced Compatibility Database

Users can vote whether a mod is compatible.

Users can submit their own experiences.

Helps refine compatibility verdicts long-term.

2. User Flagging / Feedback Loop

Users can flag incorrect AI assessments.

Data can be used for future algorithm improvements.

General Application Goals

Make browsing Nexus Mods less frustrating.

Provide a fun, swipe-based interface.

Allow users to quickly determine mod compatibility for the game version they care about.

Keep the UI responsive, smooth, and aesthetically cohesive.

Builder Agent Instructions

Follow all requirements strictly.

Do not store API keys.

Keep UI clean and functional.

Maintain full support for the dual scoring system.

Ensure mod scoring is consistent and reproducible.

Use animations and styling that match the selected game theme, unless the user switches to minimalist dark mode.

Ensure smooth swiping, fast loading, and responsive design.

Never edit README.md

Use README.md as a general guideline, not as an absolute guideline. Prioritize instructions in this prompt.

Refer to https://github.com/Nexus-Mods/node-nexus-api/tree/master for API usage guidelines.
