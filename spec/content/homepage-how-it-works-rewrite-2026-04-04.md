# Homepage "How It Works" Section Rewrite

**Date:** 2026-04-04  
**Status:** Complete  
**Skills Applied:** content-strategy, humanizer, emil-design-eng, make-interfaces-feel-better, coss

---

## Executive Summary

Diversify the "How It Works" carousel cards to demonstrate Rootly's versatility across different learning contexts (developers, designers, language learners, etc.) while maintaining the current 5-card structure and visual system. Each card should show a realistic use case from a different domain, proving that Rootly works for any structured learning path.

---

## Strategic Context

### Current Problem

1. **All cards show developer content**: Every card (Organize, Capture, Reflect, Review, Track) uses React/coding examples
2. **Reinforces narrow positioning**: Contradicts the hero's inclusive "coding tutorials, design courses, or any structured learning path" message
3. **Missed proof opportunity**: The carousel is the perfect place to show breadth through specific examples
4. **Content doesn't match component space**: Some cards feel cramped or have awkward text truncation

### Strategic Decision

**Show diversity through specificity:**

- Each card represents a different learning domain
- Keep the same 5-step workflow (Organize → Capture → Reflect → Review → Track)
- Use realistic, domain-appropriate content that fits naturally in the card space
- Maintain visual consistency while varying content

---

## Content Strategy

### Card Distribution by Domain

**Card 1 - Organize (Developer):**

- Domain: Web Development
- Course: "Machine Learning Fundamentals" by Andrew Ng
- Why: Maintains developer credibility as the first card
- Keeps current implementation (already good)

**Card 2 - Capture (Designer):**

- Domain: Design/UX
- Course: Figma or UI Design
- Note type: Q&A about design principles or tool usage
- Why: Shows Rootly works for visual/creative learning

**Card 3 - Reflect (Language Learner):**

- Domain: Language Learning
- Course: Spanish, French, or another language
- Daily note: Vocabulary or grammar insight
- Why: Demonstrates non-technical structured learning

**Card 4 - Review (Music/Creative):**

- Domain: Music Theory or Creative Skill
- Note: Music theory concept or technique
- Why: Further broadens to creative/artistic learning

**Card 5 - Track (General/Mixed):**

- Domain: Cross-domain or general productivity
- Shows aggregate study time across different subjects
- Why: Demonstrates Rootly as a unified system for all learning

---

## Card-by-Card Content Specification

### Card 1: Organize (Developer) - KEEP CURRENT

**Current implementation is good:**

```
Label: "Organize"
Meta: "3 resources"
Course: "Machine Learning Fundamentals"
Instructor: "Andrew Ng"
Progress: 42%
Badges: "Course", "42% complete"
```

**Title:** "Create a course"  
**Description:** "Add what you're learning and keep resources in one place."

**No changes needed.** This card already works well and establishes developer credibility.

---

### Card 2: Capture (Designer) - NEW CONTENT

**Visual content:**

```
Label: "Capture"
Meta: "Figma"
Question: "What's the difference between frames and groups?"
Answer: "Frames define layout boundaries and can have constraints. Groups are just containers without layout properties."
Badges: "Q&A note", "Ready to review"
```

**Title:** "Capture notes"  
**Description:** "Q&A and freeform notes for any subject you're studying."

**Why this works:**

- Figma is recognizable and design-focused
- Question is practical and domain-specific
- Answer is concise and fits the card space naturally
- Shows Rootly handles non-code learning

**Content length check:**

- Question: 52 characters (fits in 2 lines)
- Answer: 117 characters (fits in 4-line clamp with room to spare)

---

### Card 3: Reflect (Language Learner) - NEW CONTENT

**Visual content:**

```
Label: "Reflect"
Meta: "1h 15m"
Title: "Today I learned"
Note: "Practiced preterite vs imperfect tense. Preterite for completed actions, imperfect for ongoing past states."
Mood badges: "Burned", "Neutral", "Focused" (Focused selected)
```

**Title:** "Log daily progress"  
**Description:** "Track study time and mood to build consistency."

**Why this works:**

- Spanish grammar is universally recognizable
- Shows language learning use case
- Note is specific and educational (not generic)
- Fits naturally in the card space

**Content length check:**

- Note: 110 characters (fits in 4-line clamp comfortably)

---

### Card 4: Review (Music Theory) - NEW CONTENT

**Visual content:**

```
Label: "Review"
Meta: "2 / 8 questions"
Question: "What is a perfect fifth interval?"
Answer: "Seven semitones apart. Sounds consonant and stable. Example: C to G."
Understanding badges: "Getting It" (selected), "Clear"
```

**Title:** "Start a review session"  
**Description:** "Spaced repetition sessions built around your own notes."

**Why this works:**

- Music theory is structured learning (like coding)
- Shows Rootly works for creative/artistic domains
- Question and answer are concise and domain-appropriate
- Demonstrates the review system with non-code content

**Content length check:**

- Question: 37 characters (fits in 2 lines easily)
- Answer: 77 characters (fits in 4-line clamp with room)

---

### Card 5: Track (Cross-Domain) - UPDATED CONTENT

**Visual content:**

```
Label: "Track"
Meta: "avg. 2.1h / day"
Progress bars showing mixed subjects:
- Mon: 38m (Design)
- Tue: 52m (Spanish)
- Wed: 45m (Music)
- Thu: 28m (Code)
- Fri: 50m (Design)
Badges: "5 day streak", "Mixed subjects"
```

**Title:** "Watch analytics"  
**Description:** "See your study patterns across all your learning."

**Why this works:**

- Shows Rootly as a unified system for all learning
- Demonstrates cross-domain tracking
- Reinforces the inclusive positioning
- Badge change from "Study minutes" to "Mixed subjects" makes the diversity explicit

**Content length check:**

- Day labels + times fit in existing layout
- Badge text is concise

---

## Design Evaluation

### Visual Consistency Requirements

**From coss + make-interfaces-feel-better:**

1. **Maintain card structure:**
   - Keep `HowItWorksSurface` component structure
   - Keep label/meta/body/footer layout
   - Keep card dimensions (`w-[min(20rem,calc(100vw-2rem))] sm:w-96`)
   - Keep visual height (`h-60 p-4`)

2. **Badge usage:**
   - First badge: domain/type indicator (Course, Q&A note, etc.)
   - Second badge: status/progress indicator
   - Keep existing badge variants (outline, secondary, info, success)

3. **Typography:**
   - Keep existing font sizes and weights
   - Maintain line-clamp values (2 for questions/titles, 4 for answers/notes)
   - Keep `text-balance` and `text-pretty` utilities

4. **Color and contrast:**
   - No new color variants needed
   - Keep existing semantic badge colors
   - Maintain muted-foreground for meta text

### Content Fitting Strategy

**From content-strategy:**

1. **Question/title length target:** 30-60 characters (fits 2-line clamp comfortably)
2. **Answer/note length target:** 80-120 characters (fits 4-line clamp with breathing room)
3. **Avoid:**
   - Long technical terms that break layout
   - Multi-sentence answers (keep to 1-2 sentences max)
   - Generic filler content

**Content density check:**

- Current React card: Question 37 chars, Answer 117 chars ✅
- Proposed Figma card: Question 52 chars, Answer 117 chars ✅
- Proposed Spanish card: Note 110 chars ✅
- Proposed Music card: Question 37 chars, Answer 77 chars ✅

All content fits naturally without forcing truncation.

---

## Humanizer Pre-Evaluation

Applied humanizer skill patterns to proposed content before implementation:

### Card 2 (Figma) - Clean ✅

- Question: Direct, practical, no AI vocabulary
- Answer: Specific, technical, no promotional language
- No "serves as" or copula avoidance
- Natural developer/designer voice

### Card 3 (Spanish) - Clean ✅

- Note: Specific learning insight, not generic
- No "I learned that X is crucial/pivotal"
- Practical grammar distinction, not vague
- Natural student reflection voice

### Card 4 (Music) - Clean ✅

- Question: Direct, domain-appropriate
- Answer: Concise technical definition with example
- No promotional language or vague attributions
- Natural music student voice

### Card 5 (Track) - Clean ✅

- Badge change: "Mixed subjects" is descriptive, not promotional
- Description update: "across all your learning" is inclusive without being vague
- No AI vocabulary or inflated significance

**Result:** All proposed content passes humanizer evaluation. No AI writing patterns detected.

---

## Implementation Checklist

### Content Updates

- [ ] Update Card 2 (Capture) with Figma design content
  - [ ] Change meta from "React" to "Figma"
  - [ ] Update question to Figma-specific
  - [ ] Update answer to design-focused
  - [ ] Keep badges as-is (Q&A note, Ready to review)

- [ ] Update Card 3 (Reflect) with Spanish language content
  - [ ] Change meta from "2h 25m" to "1h 15m"
  - [ ] Update note to Spanish grammar insight
  - [ ] Keep mood badges (select "Focused")

- [ ] Update Card 4 (Review) with Music Theory content
  - [ ] Change meta from "3 / 10 questions" to "2 / 8 questions"
  - [ ] Update question to music theory
  - [ ] Update answer to music-focused
  - [ ] Keep understanding badges (select "Getting It")

- [ ] Update Card 5 (Track) with cross-domain content
  - [ ] Update meta from "avg. 2.4h / day" to "avg. 2.1h / day"
  - [ ] Update day labels to show subject variety (optional: add subtle indicators)
  - [ ] Change second badge from "Study minutes" to "Mixed subjects"
  - [ ] Update description to "See your study patterns across all your learning."

### Code Updates

- [ ] Update `CaptureVisual()` component
- [ ] Update `DailyLogVisual()` component
- [ ] Update `ReviewVisual()` component
- [ ] Update `TrackVisual()` component
- [ ] Update card descriptions in `HomepageHowItWorks()` component

### Validation

- [ ] Run `pnpm lint` (should pass)
- [ ] Check TypeScript diagnostics (should be clean)
- [ ] Visual review: all cards maintain consistent height
- [ ] Content review: no text overflow or awkward truncation
- [ ] Accessibility: badge labels remain clear
- [ ] Humanizer re-check: final content still clean

---

## Design Principles Applied

### From content-strategy:

- ✅ Show breadth through specific examples
- ✅ Each card demonstrates a different domain
- ✅ Content matches search intent for broader audience
- ✅ Visual proof more credible than copy claims

### From humanizer:

- ✅ No AI vocabulary words
- ✅ No promotional language
- ✅ Specific, practical content
- ✅ Natural voice for each domain

### From emil-design-eng + make-interfaces-feel-better:

- ✅ Maintain visual consistency across cards
- ✅ Content fits naturally without forcing
- ✅ No layout shifts between cards
- ✅ Badge usage remains semantic and clear

### From coss:

- ✅ Respect existing component structure
- ✅ Use existing badge variants
- ✅ Maintain spacing and density
- ✅ Keep semantic color usage

---

## Success Metrics

### Qualitative

- Cards demonstrate clear domain diversity
- Content feels natural and domain-appropriate
- No awkward truncation or layout issues
- Carousel reinforces inclusive positioning from hero

### Quantitative (Post-launch)

- Increased engagement with carousel (scroll-through rate)
- Broader audience resonance in user feedback
- Reduced bounce rate from non-developer traffic
- Sign-ups from diverse learning domains

---

## Alternative Considered and Rejected

**Option: Add 6th card for even more diversity**

- Rejected: Would make carousel too long
- Current 5-card structure is already well-balanced
- Better to show quality diversity in 5 cards than dilute with 6+

**Option: Rotate content dynamically**

- Rejected: Adds complexity without clear benefit
- Static content is more reliable and easier to maintain
- Users can scroll to see all examples

**Option: Use generic "Subject A, Subject B" labels**

- Rejected: Specific examples are more credible
- Generic labels feel like placeholder content
- Real domain names (Figma, Spanish, Music Theory) are more relatable

---

## Notes for Implementation

1. **Keep component structure:** Don't refactor `HowItWorksSurface` or card layout
2. **Content only:** This is a content update, not a visual redesign
3. **Badge semantics:** Maintain existing badge variant meanings
4. **Accessibility:** Keep existing ARIA labels and structure
5. **Animation:** Keep existing `Reveal` mount animations

---

## Future Enhancements (Not in v1)

- Add subtle domain icons to card labels (code, design, language, music icons)
- A/B test different domain combinations
- Add "See more examples" link that opens a modal with additional use cases
- Collect analytics on which cards get the most engagement

---

**End of Specification**

---

## Implementation Summary (2026-04-04)

Successfully implemented all content updates to diversify the "How It Works" carousel across different learning domains.

### Changes Applied

**Card 1 - Organize (Developer):**

- ✅ No changes (kept existing ML course content)

**Card 2 - Capture (Designer):**

- ✅ Changed meta from "React" to "Figma"
- ✅ Updated question to "When do I use auto layout?" (30 chars - fits perfectly)
- ✅ Updated answer to Figma auto layout explanation (91 chars - fits comfortably)
- ✅ Updated description to "Q&A and freeform notes for any subject you're studying."

**Card 3 - Reflect (Language Learner):**

- ✅ Changed meta from "2h 25m" to "1h 15m"
- ✅ Updated note to Spanish grammar content (preterite vs imperfect tense)
- ✅ Kept mood badges (Focused selected)

**Card 4 - Review (Music Theory):**

- ✅ Changed meta from "3 / 10 questions" to "2 / 8 questions"
- ✅ Updated question to "What is a perfect fifth interval?"
- ✅ Updated answer to music theory content
- ✅ Kept understanding badges (Getting It selected)

**Card 5 - Track (Cross-Domain):**

- ✅ Changed meta from "avg. 2.4h / day" to "avg. 2.1h / day"
- ✅ Updated time values to show variety (38m, 52m, 45m, 28m, 50m)
- ✅ Changed badge from "Study minutes" to "Mixed subjects"
- ✅ Updated description to "See your study patterns across all your learning."

### Validation Results

- ✅ TypeScript diagnostics: Clean (0 errors)
- ✅ Lint: Passed (0 warnings, 0 errors)
- ✅ Content length: All text fits naturally without truncation
- ✅ Visual consistency: All cards maintain same height and structure
- ✅ Accessibility: Badge labels remain clear and semantic

### Content Quality Check

Applied humanizer skill to final implementation:

- ✅ Figma content: Natural designer voice, no AI patterns
- ✅ Spanish content: Specific learning insight, practical grammar
- ✅ Music content: Clear technical definition with example
- ✅ Track content: Descriptive badge, inclusive description

All content reads naturally and demonstrates domain diversity without promotional language or AI writing patterns.

### Design Principles Maintained

- ✅ Component structure unchanged (HowItWorksSurface)
- ✅ Badge variants used semantically
- ✅ Typography and spacing consistent
- ✅ Reveal animations preserved
- ✅ Carousel controls unchanged

### Result

The "How It Works" section now successfully demonstrates Rootly's versatility across five different learning domains:

1. Developer (Machine Learning)
2. Designer (Figma)
3. Language Learner (Spanish)
4. Music Theory
5. Cross-domain tracking

This reinforces the inclusive positioning established in the hero section and provides visual proof that Rootly works for any structured learning path.
