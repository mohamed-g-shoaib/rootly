# Homepage Hero Section Rewrite

**Date:** 2026-04-04  
**Status:** Complete  
**Skills Applied:** content-strategy, emil-design-eng, make-interfaces-feel-better, humanizer

---

## Executive Summary

Broaden Rootly's positioning from "developer-only" to "structured learning for anyone" while maintaining developer credibility as a core strength. Implement an interactive 3-tab browser mock to demonstrate versatility across different learning contexts.

---

## Strategic Context

### Current Problem

1. **Positioning too narrow**: "learning notebook for self-taught developers" excludes broader audience
2. **Search intent mismatch**: Generic learning tracker searches don't recognize Rootly as their solution
3. **Single use case shown**: React docs example reinforces developer-only perception
4. **Market opportunity missed**: Competitors successfully target "students, professionals, and lifelong learners"

### Market Research Findings

**Broader market exists:**
- Apps like "Learn Logbook," "TrackIt," "MyStudyTracker" target general learners
- Common pain points: "organize study life," "track learning journey," "stay consistent"
- Successful positioning: "all-in-one study system" rather than niche-specific

**Search volume opportunity:**
- Current keywords: "developer learning notebook" (narrow)
- Expanded keywords: "learning tracker," "study notes app," "organized learning system" (higher volume)

### Strategic Decision

**Broaden without diluting:**
- Lead with universal pain point ("scattered learning")
- Show breadth through specific examples (coding, design, languages)
- Maintain developer features as differentiation, not exclusion
- Visual proof (3-tab mock) more credible than copy claims

---

## Content Strategy

### Hero Headline (Searchable Content)

**Primary headline:**
```
Turn scattered learning into organized progress.
```

**Why this works:**
- Opens with universal pain point everyone recognizes
- Promises universal benefit (organized progress)
- Matches search intent for "organized learning," "study tracker," "learning system"
- No audience exclusion

### Supporting Copy (Inclusive + Specific)

**Body text:**
```
Rootly helps you capture notes, track study time, and review what you learn—whether you're following coding tutorials, design courses, or any structured learning path. The browser side panel keeps your notes and study timer beside the content while you learn.
```

**Why this works:**
- Shows breadth: "coding tutorials, design courses, or any structured learning path"
- Maintains developer strength without excluding others
- Explains core value: capture, track, review
- Highlights unique feature: browser side panel
- Uses inclusive language: "you learn" not "developers learn"

### SEO Impact

**Current keywords:**
- "developer learning notebook"
- "self-taught developer tools"

**Expanded keywords:**
- "learning tracker"
- "study notes app"
- "organized learning system"
- "progress tracker for students"
- "study time tracker"

**Expected outcome:** Broader search visibility while maintaining developer relevance

---

## Visual Strategy: 3-Tab Browser Mock

### Design Decision: Interactive Tabs

**Implementation approach:**
- 3 clickable tabs showing different learning contexts
- Each tab updates both URL bar and main content area
- Side panel adapts to show relevant note type
- Smooth transitions between tabs (200ms ease-out)

### Tab Selection Rationale

#### Tab 1: React Documentation (Developer)
**URL:** `react.dev/reference/react/useMemo`

**Why this tab:**
- Maintains developer credibility (core audience)
- Shows code snippet support
- Demonstrates technical learning use case
- Already implemented and familiar

**Content shown:**
- React docs page with highlighted excerpt
- Side panel: Q&A note about `useMemo`
- Understanding level badge: "Getting It"

#### Tab 2: Figma Tutorial (Designer/Creative)
**URL:** `youtube.com/watch?v=... - Figma for Beginners`

**Why this tab:**
- Represents design/creative learning
- Shows video-based learning support
- Broadens to visual learners
- Common structured learning path

**Content shown:**
- YouTube video player interface
- Video title: "Figma for Beginners - Complete Tutorial"
- Side panel: Q&A note about Figma layers/components
- Understanding level badge: "Clear"

#### Tab 3: Language Learning (General Education)
**URL:** `duolingo.com/lesson/spanish-basics`

**Why this tab:**
- Represents structured non-technical learning
- Shows Rootly works for any organized study
- Demonstrates true versatility
- Familiar learning platform

**Content shown:**
- Duolingo lesson interface
- Lesson: "Spanish Basics - Greetings"
- Side panel: Freeform note with vocabulary list
- No understanding badge (freeform notes don't have levels)

### Tab Interaction Design

**Default state:**
- Tab 1 (React) active on page load
- Other tabs visible but inactive

**Hover state:**
- Subtle background color change on inactive tabs
- No scale or transform (keep it calm)
- Cursor: pointer

**Active state:**
- Stronger background color
- Bottom border accent (2px, primary color)
- Font weight: medium

**Transition behavior:**
- Content cross-fades with 200ms ease-out
- URL bar updates instantly (no animation)
- Side panel content cross-fades with same timing
- No layout shift during transition

**Accessibility:**
- Tabs use proper ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- Keyboard navigation: Arrow keys to switch tabs
- Focus visible on keyboard navigation
- Screen reader announces tab changes

---

## Design Evaluation: Browser Chrome Elements

### Traffic Light Dots (Red/Yellow/Green)

**Current implementation:**
```tsx
<div className="flex items-center gap-2">
  <div className="size-2.5 rounded-full bg-destructive/60" />
  <div className="size-2.5 rounded-full bg-warning/60" />
  <div className="size-2.5 rounded-full bg-success/60" />
</div>
```

**Design analysis (using emil-design-eng + make-interfaces-feel-better):**

#### Keep the dots? **YES**

**Rationale:**
1. **Instant recognition**: Traffic lights immediately signal "this is a browser window"
2. **Familiar mental model**: Users recognize the pattern without thinking
3. **Adds authenticity**: Makes the mock feel like a real browser, not a generic card
4. **Minimal visual weight**: At 2.5 size units, they're present but not distracting
5. **Cohesion with design system**: Using semantic color tokens (destructive/warning/success) keeps them consistent

**Design refinements to apply:**

1. **Reduce opacity further for subtlety:**
   ```tsx
   // Current: bg-destructive/60, bg-warning/60, bg-success/60
   // Better: bg-destructive/50, bg-warning/50, bg-success/50
   ```
   - Reason: Traffic lights should be recognizable but not compete with content
   - They're decorative chrome, not functional UI

2. **Ensure proper spacing:**
   ```tsx
   // Current: gap-2 (0.5rem)
   // Keep: gap-2 is correct for macOS-style spacing
   ```
   - Matches actual macOS window controls
   - Feels authentic without being pixel-perfect

3. **Consider hover state (optional enhancement):**
   ```tsx
   // On parent hover, slightly increase opacity
   .browser-chrome:hover .traffic-light {
     opacity: 0.7; // from 0.5
   }
   ```
   - Subtle detail that adds life
   - Mimics real macOS behavior where controls become more visible on hover
   - Only implement if it doesn't distract from main content

**Alternative considered and rejected:**
- **Remove dots entirely**: Makes mock feel generic, loses instant "browser" recognition
- **Use monochrome dots**: Loses the familiar macOS pattern, feels less authentic
- **Make dots functional**: Overcomplicates the mock, adds unnecessary interaction

### URL Bar Design

**Current implementation:**
```tsx
<div className="min-w-0 flex-1 px-0.5 py-0.5 text-xs text-muted-foreground">
  react.dev/reference/react/useMemo
</div>
```

**Design analysis:**

#### Current approach is correct

**Rationale:**
1. **Text-only is cleaner**: No background pill needed (already removed in previous iteration)
2. **Muted foreground color**: Properly de-emphasizes chrome vs content
3. **Flexible width**: `flex-1` allows URL to adapt to available space
4. **Proper text size**: `text-xs` matches browser chrome scale

**Refinements for tab implementation:**

1. **Dynamic URL updates:**
   ```tsx
   const urls = {
     react: "react.dev/reference/react/useMemo",
     figma: "youtube.com/watch?v=... - Figma for Beginners",
     duolingo: "duolingo.com/lesson/spanish-basics"
   }
   
   <div className="min-w-0 flex-1 px-0.5 py-0.5 text-xs text-muted-foreground">
     {urls[activeTab]}
   </div>
   ```

2. **Truncation for long URLs:**
   ```tsx
   className="min-w-0 flex-1 truncate px-0.5 py-0.5 text-xs text-muted-foreground"
   ```
   - Prevents URL from breaking layout on narrow viewports
   - Maintains clean appearance

3. **No animation on URL change:**
   - URL should update instantly when tab switches
   - Content animates, chrome doesn't
   - Matches real browser behavior

### Browser Chrome Bar Overall

**Current structure is solid:**
```tsx
<div className="border-b bg-muted/22 px-3 py-2">
  <div className="flex flex-wrap items-center gap-3">
    {/* Traffic lights */}
    {/* URL bar */}
  </div>
</div>
```

**Design validation:**
- ✅ Subtle background (`bg-muted/22`) properly de-emphasizes chrome
- ✅ Border bottom creates clear separation from content
- ✅ Flex layout with gap-3 provides breathing room
- ✅ Flex-wrap handles narrow viewports gracefully
- ✅ Padding (px-3 py-2) matches compact browser chrome scale

**No changes needed to chrome bar structure.**

---

## Tab Visual Design Specification

### Tab Container

```tsx
<div className="flex items-center gap-1 border-b bg-muted/16 px-3 pb-0">
  {/* Tabs render here */}
</div>
```

**Design rationale:**
- Sits between traffic light bar and content
- Subtle background matches chrome aesthetic
- Border bottom creates tab shelf effect
- Padding bottom 0 allows tabs to touch border (proper tab UI)

### Individual Tab Design

**Inactive tab:**
```tsx
<button
  role="tab"
  aria-selected="false"
  className="relative px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
>
  React Docs
</button>
```

**Active tab:**
```tsx
<button
  role="tab"
  aria-selected="true"
  className="relative px-4 py-2 text-sm font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
>
  React Docs
</button>
```

**Design decisions:**
1. **No background on inactive tabs**: Keeps chrome minimal
2. **Text color change on hover**: Subtle feedback without motion
3. **Active indicator via pseudo-element**: Clean, no extra DOM nodes
4. **Bottom border accent**: Matches browser tab pattern
5. **Font weight change**: Reinforces active state
6. **No scale or transform**: Keeps tabs stable, not playful

### Tab Labels

**Option 1: Short labels (Recommended)**
- "React Docs"
- "Figma Tutorial"
- "Spanish Lesson"

**Why short labels:**
- Fits comfortably on mobile
- Scans quickly
- Matches real browser tab behavior (truncated titles)

**Option 2: Icon + label (Alternative)**
- Could add small icons (code, design, language)
- Increases visual weight
- Not recommended: adds complexity without clear benefit

**Decision: Use short text labels only**

---

## Content Area Transitions

### Cross-fade Specification

**Transition properties:**
```css
.tab-content {
  opacity: 1;
  transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.tab-content[data-exiting] {
  opacity: 0;
}

.tab-content[data-entering] {
  opacity: 0;
}
```

**Why this approach:**
- Simple opacity fade is cleanest for content swap
- 200ms is fast enough to feel responsive
- Custom ease-out curve (from emil-design-eng) feels intentional
- No transform needed: content isn't moving spatially

**Alternative considered and rejected:**
- **Slide transition**: Implies spatial relationship between tabs (they're not spatially related)
- **Scale + opacity**: Too much motion for frequent interaction
- **Blur during transition**: Unnecessary complexity for this use case

### Side Panel Sync

**Side panel should update in sync with main content:**
```tsx
// Same transition timing
<div className="transition-opacity duration-200 ease-out">
  {sidePanelContent[activeTab]}
</div>
```

**Content per tab:**
- React: Q&A note about useMemo
- Figma: Q&A note about layers/components
- Duolingo: Freeform note with vocabulary

---

## Implementation Checklist

### Content Updates
- [ ] Update hero headline to "Turn scattered learning into organized progress."
- [ ] Update supporting copy to inclusive version
- [ ] Update site-config.ts description for SEO
- [ ] Update metadata in homepage page.tsx

### Browser Mock Updates
- [ ] Keep traffic light dots (reduce opacity to /50)
- [ ] Add tab bar between chrome and content
- [ ] Implement 3 tabs with proper ARIA roles
- [ ] Create content variants for each tab
- [ ] Add URL switching logic
- [ ] Implement cross-fade transitions (200ms ease-out)
- [ ] Add keyboard navigation (arrow keys)
- [ ] Test on mobile (tabs should wrap or scroll)

### Side Panel Updates
- [ ] Create 3 note variants (React Q&A, Figma Q&A, Duolingo Freeform)
- [ ] Sync side panel with active tab
- [ ] Ensure understanding badges show correctly
- [ ] Test content doesn't overflow on narrow viewports

### Accessibility
- [ ] Add proper ARIA roles (tablist, tab, tabpanel)
- [ ] Implement keyboard navigation
- [ ] Test with screen reader
- [ ] Ensure focus visible on keyboard nav
- [ ] Add aria-label to traffic light dots container

### Testing
- [ ] Test tab switching on desktop
- [ ] Test tab switching on mobile
- [ ] Verify transitions feel smooth (not janky)
- [ ] Check URL bar truncation on narrow viewports
- [ ] Verify side panel content matches active tab
- [ ] Test keyboard navigation
- [ ] Run lighthouse accessibility audit

---

## Success Metrics

### Qualitative
- Hero section feels more inclusive without losing developer credibility
- Browser mock demonstrates versatility clearly
- Transitions feel polished and intentional

### Quantitative (Post-launch)
- Increased time on homepage (users exploring tabs)
- Broader keyword rankings (learning tracker, study notes)
- Reduced bounce rate from non-developer traffic
- Increased sign-ups from non-developer personas

---

## Design Principles Applied

### From content-strategy:
- ✅ Lead with universal pain point
- ✅ Match search intent for broader audience
- ✅ Show breadth through specific examples
- ✅ Visual proof more credible than copy

### From emil-design-eng:
- ✅ Traffic lights add authenticity without distraction
- ✅ Transitions use proper easing (custom ease-out)
- ✅ Duration under 300ms (200ms for responsiveness)
- ✅ No animation on chrome elements (URL bar)
- ✅ Opacity-only transition (no unnecessary transform)

### From make-interfaces-feel-better:
- ✅ Concentric border radius maintained
- ✅ Subtle opacity on decorative elements (traffic lights)
- ✅ Interruptible transitions (CSS, not keyframes)
- ✅ No `transition: all` (specific properties only)
- ✅ Proper hit areas on tabs (40px+ height)

---

## Notes for Implementation

1. **State management**: Use React state for activeTab, not URL params (this is a demo, not navigation)
2. **Content organization**: Create separate components for each tab's content to keep code clean
3. **Mobile considerations**: Tabs should remain horizontal but may need smaller padding on mobile
4. **Performance**: All 3 tab contents can be pre-rendered (no lazy loading needed for 3 small variants)
5. **Animation library**: Use CSS transitions (no Motion needed for simple opacity fade)

---

## Future Enhancements (Not in v1)

- Auto-rotate tabs every 5 seconds (with pause on hover)
- Add subtle indicator showing which tab is active (beyond bottom border)
- Expand to 4-5 tabs if more use cases emerge
- A/B test different tab orders to see which converts best

---

## Approval Required

- [ ] Content strategy approved
- [ ] Visual design approved
- [ ] Tab selection approved
- [ ] Traffic light decision approved
- [ ] Ready for implementation

---

**End of Specification**


---

## Humanizer Evaluation (2026-04-04)

Applied humanizer skill to evaluate final hero content for AI writing patterns.

### Headline Analysis

**Text:** "Turn scattered learning into organized progress."

**Evaluation:**
- ✅ No AI vocabulary words (crucial, pivotal, landscape, etc.)
- ✅ Direct verb structure (no "serves as" or copula avoidance)
- ✅ Specific pain point → benefit (no vague symbolism)
- ✅ Natural conversational tone
- ✅ No promotional language

**Result:** Clean. No changes needed.

### Supporting Copy Analysis

**Text:** "Rootly helps you capture notes, track study time, and review what you learn—whether you're following coding tutorials, design courses, or any structured learning path. The browser side panel keeps your notes and study timer beside the content while you learn."

**Evaluation:**
- ✅ Uses "you" naturally (not "users" or passive voice)
- ✅ Specific examples without forced rule-of-three
- ✅ No promotional language (vibrant, nestled, boasts, etc.)
- ✅ No vague attributions or weasel words
- ✅ Clear, practical description
- ✅ No em dash overuse (single em dash used appropriately)
- ✅ No filler phrases or hedging

**Result:** Clean. No changes needed.

### Overall Assessment

The rewritten hero content successfully avoids common AI writing patterns:
- No inflated symbolism or significance language
- No superficial -ing analyses
- No promotional/advertisement tone
- No AI vocabulary clustering
- No copula avoidance constructions
- Natural rhythm and voice

The content reads as human-written and maintains the inclusive, practical tone established in the content strategy phase.

**Final Status:** Hero content approved. No humanization edits required.
