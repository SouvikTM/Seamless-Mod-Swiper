# Seamless Mod Swiper Development Roadmap

> [!IMPORTANT]
> **DO NOT EDIT README.md**: The README.md file must never be modified under any circumstances.

## Goal Description
Build "Seamless Mod Swiper," a Tinder-like web application for browsing Nexus Mods. The app will allow users to swipe right (approve) or left (reject) on mods, filtering by game and version. It will feature advanced compatibility heuristics, smart filtering for translations/adult content, and strict adherence to Nexus Mods TOS.

## Proposed Changes

### Phase 1: Foundation & Setup
Establish the technical groundwork.
- **Tech Stack**: React, TypeScript, Vite, TailwindCSS (or Vanilla CSS with variables).
- **API Integration**:
    -   Implement `NexusClient` for authentication (API Key) and data fetching.
    -   Handle rate limiting (headers check).
    -   Game/Version configuration settings.

### Phase 2: Core Mechanics
Implement the primary user loop.
- **UI Components**:
    -   `ModCard`: Display mod image, title, summary, endorsement count.
    -   `SwipeDeck`: Handle swipe gestures (Touch/Mouse).
    -   `Sidebar`: List approved mods.
- **Logic**:
    -   Fetch mod list (randomized order).
    -   State management for Approved/Rejected lists.

### Phase 3: Advanced Heuristics & Filtering
The "Brain" of the application.
- **Compatibility Engine**:
    -   Analyze comments/changelogs for keywords (e.g., "broken", "update", "works", "compatible").
    -   **Scoring**:
        -   Positive comments: Small boost (single), Large boost (multiple).
        -   Negative comments: Small deduction (single), Large deduction (multiple).
    -   Confidence Score (0-100) displayed on the card.
- **Smart Filtering**:
    -   **Translations**: Detect via title/description keywords (e.g., "Russian", "Translation", "TR"). Default: OFF.
    -   **Adult Content**: Toggle based on Nexus flags. Default: ON.

### Phase 4: Data & Persistence
Ensure user progress is saved.
- **Storage**:
    -   Use `IndexedDB` (via `idb` or similar) to store:
        -   Session history (seen mod IDs to prevent repeats).
        -   Approved/Rejected lists.
        -   Settings (API Key - *in memory only if possible, or encrypted/secure storage if persistence needed, but user said "API key never stored or persisted" in README? README says "API key never stored or persisted", but also "Enter your API key when prompted (required for each session)". So we will NOT persist API key.*).
- **Export/Import**:
    -   JSON format for backing up approved lists.

### Phase 5: Compliance & Polish
Finalize for release.
- **TOS Check**: Verify no automated actions (endorse/vote) are triggered. Ensure attribution (Mod Author credits).
- **UI Polish**:
    -   Micro-animations for swipes.
    -   Glassmorphism effects.
    -   Responsive design.

## Verification Plan

### Automated Tests
-   Unit tests for `CompatibilityEngine` scoring logic.
-   Unit tests for `TranslationDetector` regex/logic.

### Manual Verification
-   **Swipe Flow**: Verify approved mods appear in sidebar.
-   **Persistence**: Reload page, ensure previously swiped mods do not reappear.
-   **API Limits**: Monitor network tab to ensure we respect rate limits.
