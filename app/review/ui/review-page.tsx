"use client";

import * as React from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  PlayIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageContainer } from "@/components/ui/page-container";
import { useIsMobile } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { toastManager } from "@/components/ui/toast";
import {
  FormSection,
  FormSectionDescription,
  FormSectionTitle,
} from "@/components/ui/form";

import { useDashboardShellFab } from "@/app/ui/dashboard-shell";
import { DashboardStickyHeader } from "@/app/ui/dashboard-sticky-header";
import {
  deleteReviewSession,
  getReviewSessionsPage,
  getReviewNotes,
  saveReviewSession,
} from "./review-actions";
import {
  ReviewEmptyState,
  SessionCard,
  formatMinutes,
} from "./review-components";
import {
  ReviewSession as ReviewSessionView,
  type ReviewSessionState,
} from "./review-session";
import {
  ReviewSummary,
  type ReviewSummaryData,
  buildSessionFromSummary,
  sessionDateLabel,
} from "./review-summary";
import type {
  ReviewCourse,
  ReviewNote,
  ReviewSession as ReviewSessionModel,
  ReviewSessionConfig,
} from "./review-model";

function buildSummary(nextState: ReviewSessionState): ReviewSummaryData {
  const answeredCount = nextState.answeredCount;
  const accuracy =
    answeredCount > 0
      ? Math.round((nextState.leveledUp.length / answeredCount) * 100)
      : 0;

  const timeSpentMinutes = Math.max(0, Math.round(nextState.elapsedMs / 60000));
  const notesById = new Map(nextState.notes.map((note) => [note.id, note]));

  const leveledUp = nextState.leveledUp
    .map((id) => {
      const note = notesById.get(id);
      if (!note) return null;
      return { id, question: note.question };
    })
    .filter(Boolean) as { id: string; question: string }[];

  const leveledDown = nextState.leveledDown
    .map((id) => {
      const note = notesById.get(id);
      if (!note) return null;
      return { id, question: note.question };
    })
    .filter(Boolean) as { id: string; question: string }[];

  const courseBuckets = new Map<string, number[]>();
  for (const n of nextState.notes.slice(0, answeredCount)) {
    if (!n.courseId) continue;
    const list = courseBuckets.get(n.courseId) ?? [];
    list.push(n.understandingLevel);
    courseBuckets.set(n.courseId, list);
  }

  const courseScores: Record<string, number> = {};

  let weakestCourseId: string | null = null;
  let strongestCourseId: string | null = null;
  let weakestAvg = Infinity;
  let strongestAvg = -Infinity;

  for (const [courseId, levels] of courseBuckets.entries()) {
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    courseScores[courseId] = Math.max(
      0,
      Math.min(100, Math.round(((avg - 1) / 2) * 100)),
    );
    if (avg < weakestAvg) {
      weakestAvg = avg;
      weakestCourseId = courseId;
    }
    if (avg > strongestAvg) {
      strongestAvg = avg;
      strongestCourseId = courseId;
    }
  }

  return {
    answeredCount,
    totalPlanned: nextState.totalPlanned,
    endedEarly: nextState.endedEarly,
    accuracy,
    timeSpentMinutes,
    notesLeveledUp: leveledUp,
    notesLeveledDown: leveledDown,
    weakestCourseId,
    strongestCourseId,
    courseScores,
  };
}

type ViewState =
  | { type: "list" }
  | { type: "active" }
  | { type: "summary"; data: ReviewSummaryData; config: ReviewSessionConfig };

export default function ReviewPage({
  userId,
  initialSessions,
  initialSessionsTotal,
  sessionsPageSize,
  courses,
  initialNotesPool,
}: {
  userId: string | null;
  initialSessions: ReviewSessionModel[];
  initialSessionsTotal: number;
  sessionsPageSize: number;
  courses: ReviewCourse[];
  initialNotesPool: ReviewNote[];
}) {
  const isMobile = useIsMobile();
  const now = React.useMemo(() => new Date(), []);
  const shellFab = React.useMemo(
    () => ({
      ariaLabel: "Start review",
      icon: <HugeiconsIcon icon={PlayIcon} size={20} />,
      onClick: () => setSetupOpen(true),
    }),
    [],
  );
  useDashboardShellFab(shellFab);

  const [view, setView] = React.useState<ViewState>({ type: "list" });

  const [notesPool, setNotesPool] = React.useState<ReviewNote[]>(
    () => initialNotesPool,
  );

  const queryClient = useQueryClient();
  const [sessionsPage, setSessionsPage] = React.useState(1);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedSessionId, setSelectedSessionId] = React.useState<
    string | null
  >(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  const [setupOpen, setSetupOpen] = React.useState(false);
  const [startingSession, setStartingSession] = React.useState(false);

  const [questionCountMode, setQuestionCountMode] =
    React.useState<ReviewSessionConfig["questionCountMode"]>("20");
  const [customCount, setCustomCount] = React.useState(20);
  const [shuffled, setShuffled] = React.useState(false);
  const [flaggedOnly, setFlaggedOnly] = React.useState(false);

  const availableNotes = React.useMemo(
    () => notesPool.filter((n) => (flaggedOnly ? n.flag : true)),
    [flaggedOnly, notesPool],
  );

  const isInitialSessionsQuery = sessionsPage === 1;
  const sessionsQuery = useQuery({
    queryKey: ["review-sessions-page", userId, sessionsPage, sessionsPageSize],
    enabled: Boolean(userId),
    queryFn: async () => {
      const result = await getReviewSessionsPage({
        page: sessionsPage,
        pageSize: sessionsPageSize,
        userId: userId as string,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    initialData: isInitialSessionsQuery
      ? {
          success: true as const,
          data: initialSessions,
          totalCount: initialSessionsTotal,
        }
      : undefined,
    placeholderData: keepPreviousData,
  });

  React.useEffect(() => {
    if (!sessionsQuery.error) return;

    toastManager.add({
      type: "error",
      title: "Could not load sessions",
      description: sessionsQuery.error.message,
    });
  }, [sessionsQuery.error]);

  const sessions = sessionsQuery.data?.data ?? [];
  const sessionsTotal = sessionsQuery.data?.totalCount ?? 0;
  const sessionsPageLoading = sessionsQuery.isFetching;

  const sessionsTotalPages = Math.max(
    1,
    Math.ceil(sessionsTotal / sessionsPageSize),
  );

  React.useEffect(() => {
    if (!userId) return;
    if (sessionsPage >= sessionsTotalPages) return;

    void queryClient.prefetchQuery({
      queryKey: [
        "review-sessions-page",
        userId,
        sessionsPage + 1,
        sessionsPageSize,
      ],
      queryFn: async () => {
        const result = await getReviewSessionsPage({
          page: sessionsPage + 1,
          pageSize: sessionsPageSize,
          userId,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        return result;
      },
    });
  }, [queryClient, sessionsPage, sessionsPageSize, sessionsTotalPages, userId]);

  async function ensureReviewNotesLoaded(noteIds: string[]) {
    if (!userId) return [];

    const notesById = new Map(notesPool.map((note) => [note.id, note]));

    const missingIds = noteIds.filter((noteId) => {
      const note = notesById.get(noteId);
      return note != null && !note.detailsLoaded;
    });

    if (missingIds.length === 0) {
      return noteIds
        .map((noteId) => notesById.get(noteId))
        .filter((note): note is ReviewNote => note != null);
    }

    const res = await getReviewNotes({ noteIds: missingIds, userId });
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not load review notes",
        description: res.error,
      });
      return [];
    }

    const fetchedById = new Map(
      res.data.map((note) => [note.id, note] as const),
    );

    setNotesPool((prev) =>
      prev.map((note) => fetchedById.get(note.id) ?? note),
    );

    return noteIds
      .map((noteId) => fetchedById.get(noteId) ?? notesById.get(noteId))
      .filter((note): note is ReviewNote => note != null);
  }

  async function openSessionDetail(sessionId: string) {
    setSelectedSessionId(sessionId);
    setDetailOpen(true);

    const session = sessions.find((candidate) => candidate.id === sessionId);
    if (!session) return;

    const noteIds = Array.from(
      new Set([...session.notesLeveledUp, ...session.notesLeveledDown]),
    );
    if (noteIds.length === 0) return;

    setDetailLoading(true);
    try {
      await ensureReviewNotesLoaded(noteIds);
    } finally {
      setDetailLoading(false);
    }
  }

  async function onSaveSession({
    sessionName,
    data,
    config,
  }: {
    sessionName: string;
    data: ReviewSummaryData;
    config: { shuffled: boolean; flaggedOnly: boolean };
  }) {
    if (!userId) return;

    const createdAt = new Date().toISOString();
    const date = createdAt.slice(0, 10);

    const optimistic = buildSessionFromSummary({
      data,
      id: crypto.randomUUID(),
      createdAt,
      date,
      name: sessionName,
      userId,
      config,
    });
    setView({ type: "list" });

    const res = await saveReviewSession({
      session: optimistic,
      userId,
      courseScores: data.courseScores,
    });

    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not save session",
        description: res.error,
      });
      return;
    }

    setSessionsPage(1);
    await queryClient.invalidateQueries({
      queryKey: ["review-sessions-page", userId],
    });
  }

  async function onDeleteSession(id: string) {
    if (!userId) return;

    const res = await deleteReviewSession({ sessionId: id, userId });
    if (!res.success) {
      toastManager.add({
        type: "error",
        title: "Could not delete session",
        description: res.error,
      });
      return;
    }

    const nextPage =
      sessions.length === 1 && sessionsPage > 1
        ? sessionsPage - 1
        : sessionsPage;

    setSessionsPage(nextPage);
    await queryClient.invalidateQueries({
      queryKey: ["review-sessions-page", userId],
    });
  }

  const configuredCount = React.useMemo(() => {
    if (questionCountMode === "10") return 10;
    if (questionCountMode === "20") return 20;
    if (questionCountMode === "all") return availableNotes.length;
    return customCount;
  }, [availableNotes.length, customCount, questionCountMode]);

  const customCountTooHigh =
    questionCountMode === "custom" &&
    customCount > 0 &&
    customCount > availableNotes.length;

  async function startSession() {
    if (questionCountMode === "custom" && (!customCount || customCount < 1)) {
      return;
    }
    if (customCountTooHigh) return;

    const base = notesPool.filter((n) => (flaggedOnly ? n.flag : true)).slice();

    if (shuffled) {
      for (let i = base.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = base[i];
        const b = base[j];
        if (!a || !b) continue;
        base[i] = b;
        base[j] = a;
      }
    }

    const planned =
      questionCountMode === "all"
        ? base.length
        : Math.min(configuredCount, base.length);

    const targetIds = base.slice(0, planned).map((note) => note.id);
    setStartingSession(true);
    try {
      const notes = await ensureReviewNotesLoaded(targetIds);
      if (notes.length === 0) {
        return;
      }

      const state: ReviewSessionState = {
        notes,
        totalPlanned: planned,
        currentIndex: 0,
        revealed: false,
        answeredCount: 0,
        leveledUp: [],
        leveledDown: [],
        endedEarly: false,
        startMs: Date.now(),
        elapsedMs: 0,
        finished: false,
      };

      setSetupOpen(false);
      setView({ type: "active" });
      setActiveState(state);
    } finally {
      setStartingSession(false);
    }
  }

  const [activeState, setActiveState] =
    React.useState<ReviewSessionState | null>(null);

  function endWithoutSummary() {
    setActiveState(null);
    setView({ type: "list" });
  }

  function toSummary(nextState: ReviewSessionState) {
    const summary = buildSummary(nextState);
    const config: ReviewSessionConfig = {
      questionCountMode,
      customCount,
      shuffled,
      flaggedOnly,
    };
    setActiveState(null);
    setView({ type: "summary", data: summary, config });
  }

  function onRate(rating: "nailed" | "sort_of" | "forgot") {
    if (!activeState) return;

    const current = activeState.notes[activeState.currentIndex];
    if (!current) return;

    const prevLevel = current.understandingLevel;
    let nextLevel = prevLevel;

    if (rating === "nailed")
      nextLevel = Math.min(3, prevLevel + 1) as 1 | 2 | 3;
    if (rating === "forgot")
      nextLevel = Math.max(1, prevLevel - 1) as 1 | 2 | 3;

    const didChange = nextLevel !== prevLevel;

    const nextNotes = activeState.notes.map((n, idx) =>
      idx === activeState.currentIndex
        ? { ...n, understandingLevel: nextLevel }
        : n,
    );

    const leveledUp =
      rating === "nailed" && didChange
        ? Array.from(new Set([...activeState.leveledUp, current.id]))
        : activeState.leveledUp;

    const leveledDown =
      rating === "forgot" && didChange
        ? Array.from(new Set([...activeState.leveledDown, current.id]))
        : activeState.leveledDown;

    const nextAnswered = activeState.answeredCount + 1;
    const nextIndex = activeState.currentIndex + 1;

    const nextState: ReviewSessionState = {
      ...activeState,
      notes: nextNotes,
      leveledUp,
      leveledDown,
      answeredCount: nextAnswered,
      currentIndex: Math.min(nextIndex, nextNotes.length - 1),
      revealed: false,
    };

    setNotesPool((prev) =>
      prev.map((n) =>
        n.id === current.id ? { ...n, understandingLevel: nextLevel } : n,
      ),
    );

    if (nextIndex >= nextNotes.length) {
      toSummary({ ...nextState, finished: true });
      return;
    }

    setActiveState(nextState);
  }

  if (view.type === "active" && activeState) {
    return (
      <ActiveReviewSession
        activeState={activeState}
        onRate={onRate}
        onUpdateState={setActiveState}
        onEndWithoutSummary={endWithoutSummary}
        onToSummary={toSummary}
      />
    );
  }

  return (
    <>
      <ReviewPageHeader onStart={() => setSetupOpen(true)} />

      <ReviewPageContent
        view={view}
        courses={courses}
        sessions={sessions}
        sessionsTotal={sessionsTotal}
        sessionsPage={sessionsPage}
        sessionsPageSize={sessionsPageSize}
        sessionsPageLoading={sessionsPageLoading}
        isMobile={isMobile}
        now={now}
        onStart={() => setSetupOpen(true)}
        onSaveSession={onSaveSession}
        onDiscardSummary={() => setView({ type: "list" })}
        onChangeSessionsPage={(page) => {
          setSessionsPage(page);
        }}
        onOpenSessionDetail={openSessionDetail}
        onDeleteSession={onDeleteSession}
      />

      <SetupSheet
        open={setupOpen}
        onOpenChange={setSetupOpen}
        isMobile={isMobile}
        questionCountMode={questionCountMode}
        customCount={customCount}
        shuffled={shuffled}
        flaggedOnly={flaggedOnly}
        availableCount={availableNotes.length}
        customCountTooHigh={customCountTooHigh}
        onQuestionCountModeChange={setQuestionCountMode}
        onCustomCountChange={setCustomCount}
        onShuffledChange={setShuffled}
        onFlaggedOnlyChange={(value) => {
          setFlaggedOnly(value);
          const count = notesPool.filter((n) => (value ? n.flag : true)).length;
          if (questionCountMode === "all") return;
          if (questionCountMode === "10") return;
          if (questionCountMode === "20") return;
          if (customCount > count) setCustomCount(count);
        }}
        onStart={startSession}
        startingSession={startingSession}
      />

      <SessionDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isMobile={isMobile}
        session={sessions.find((s) => s.id === selectedSessionId) ?? null}
        now={now}
        courses={courses}
        notesPool={notesPool}
        loading={detailLoading}
      />
    </>
  );
}

function ActiveReviewSession({
  activeState,
  onRate,
  onUpdateState,
  onEndWithoutSummary,
  onToSummary,
}: {
  activeState: ReviewSessionState;
  onRate: (rating: "nailed" | "sort_of" | "forgot") => void;
  onUpdateState: React.Dispatch<
    React.SetStateAction<ReviewSessionState | null>
  >;
  onEndWithoutSummary: () => void;
  onToSummary: (nextState: ReviewSessionState) => void;
}) {
  return (
    <ReviewSessionView
      state={activeState}
      onReveal={() =>
        onUpdateState((prev) => (prev ? { ...prev, revealed: true } : prev))
      }
      onRate={onRate}
      onTick={(elapsedMs) =>
        onUpdateState((prev) => (prev ? { ...prev, elapsedMs } : prev))
      }
      onEndEarly={() => {
        if (activeState.answeredCount === 0) {
          onEndWithoutSummary();
          return;
        }
        onToSummary({ ...activeState, endedEarly: true });
      }}
    />
  );
}

function ReviewPageHeader({ onStart }: { onStart: () => void }) {
  return (
    <DashboardStickyHeader>
      <PageContainer>
        <div className="flex items-center justify-between py-4">
          <div className="text-lg font-medium">Review Sessions</div>
          <Button onClick={onStart} type="button" className="gap-2">
            <HugeiconsIcon icon={PlayIcon} size={18} />
            <span className="hidden sm:inline">Start Review</span>
          </Button>
        </div>
      </PageContainer>
    </DashboardStickyHeader>
  );
}

function ReviewPageContent({
  view,
  courses,
  sessions,
  sessionsTotal,
  sessionsPage,
  sessionsPageSize,
  sessionsPageLoading,
  isMobile,
  now,
  onStart,
  onSaveSession,
  onDiscardSummary,
  onChangeSessionsPage,
  onOpenSessionDetail,
  onDeleteSession,
}: {
  view: ViewState;
  courses: ReviewCourse[];
  sessions: ReviewSessionModel[];
  sessionsTotal: number;
  sessionsPage: number;
  sessionsPageSize: number;
  sessionsPageLoading: boolean;
  isMobile: boolean;
  now: Date;
  onStart: () => void;
  onSaveSession: (args: {
    sessionName: string;
    data: ReviewSummaryData;
    config: { shuffled: boolean; flaggedOnly: boolean };
  }) => Promise<void>;
  onDiscardSummary: () => void;
  onChangeSessionsPage: (page: number) => void;
  onOpenSessionDetail: (sessionId: string) => Promise<void>;
  onDeleteSession: (sessionId: string) => Promise<void>;
}) {
  const totalPages = Math.max(1, Math.ceil(sessionsTotal / sessionsPageSize));

  return (
    <PageContainer>
      <div className="flex min-h-[calc(100vh-14rem)] flex-col py-6 pb-8">
        {view.type === "summary" ? (
          <ReviewSummary
            data={view.data}
            courses={courses}
            isMobile={isMobile}
            onSave={(sessionName) => {
              void onSaveSession({
                sessionName,
                data: view.data,
                config: {
                  shuffled: view.config.shuffled,
                  flaggedOnly: view.config.flaggedOnly,
                },
              });
            }}
            onDiscard={onDiscardSummary}
          />
        ) : sessions.length === 0 ? (
          <ReviewEmptyState onStart={onStart} />
        ) : (
          <ReviewSessionGrid
            courses={courses}
            sessions={sessions}
            now={now}
            onOpenSessionDetail={onOpenSessionDetail}
            onDeleteSession={onDeleteSession}
          />
        )}

        {view.type === "list" && sessions.length > 0 ? (
          <div className="mt-auto flex items-center justify-start gap-2 pt-6">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                onChangeSessionsPage(Math.max(1, sessionsPage - 1))
              }
              disabled={sessionsPage <= 1 || sessionsPageLoading}
              aria-label="Previous page"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {sessionsPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                onChangeSessionsPage(Math.min(totalPages, sessionsPage + 1))
              }
              disabled={sessionsPage >= totalPages || sessionsPageLoading}
              aria-label="Next page"
            >
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </Button>
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}

function ReviewSessionGrid({
  courses,
  sessions,
  now,
  onOpenSessionDetail,
  onDeleteSession,
}: {
  courses: ReviewCourse[];
  sessions: ReviewSessionModel[];
  now: Date;
  onOpenSessionDetail: (sessionId: string) => Promise<void>;
  onDeleteSession: (sessionId: string) => Promise<void>;
}) {
  const coursesById = React.useMemo(
    () => new Map(courses.map((course) => [course.id, course.title])),
    [courses],
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sessions.map((s) => {
          const weakestTitle = s.weakestCourseId
            ? (coursesById.get(s.weakestCourseId) ?? "—")
            : "—";
          const strongestTitle = s.strongestCourseId
            ? (coursesById.get(s.strongestCourseId) ?? "—")
            : "—";

          return (
            <SessionCard
              key={s.id}
              session={s}
              formattedDate={sessionDateLabel(s.date, now)}
              weakestCourseTitle={weakestTitle}
              strongestCourseTitle={strongestTitle}
              onView={() => {
                void onOpenSessionDetail(s.id);
              }}
              onDelete={() => void onDeleteSession(s.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function SetupSheet({
  open,
  onOpenChange,
  isMobile,
  questionCountMode,
  customCount,
  shuffled,
  flaggedOnly,
  availableCount,
  customCountTooHigh,
  onQuestionCountModeChange,
  onCustomCountChange,
  onShuffledChange,
  onFlaggedOnlyChange,
  onStart,
  startingSession,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  questionCountMode: "10" | "20" | "all" | "custom";
  customCount: number;
  shuffled: boolean;
  flaggedOnly: boolean;
  availableCount: number;
  customCountTooHigh: boolean;
  onQuestionCountModeChange: (mode: "10" | "20" | "all" | "custom") => void;
  onCustomCountChange: (value: number) => void;
  onShuffledChange: (value: boolean) => void;
  onFlaggedOnlyChange: (value: boolean) => void;
  onStart: () => void | Promise<void>;
  startingSession: boolean;
}) {
  const side = isMobile ? "bottom" : "right";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={side} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>New Review Session</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            <div className="flex flex-col gap-5">
              <FormSection>
                <FormSectionTitle>Questions</FormSectionTitle>
                <FormSectionDescription>
                  Choose how many prompts to include in this session.
                </FormSectionDescription>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant={questionCountMode === "10" ? "secondary" : "ghost"}
                    type="button"
                    onClick={() => onQuestionCountModeChange("10")}
                  >
                    10
                  </Button>
                  <Button
                    variant={questionCountMode === "20" ? "secondary" : "ghost"}
                    type="button"
                    onClick={() => onQuestionCountModeChange("20")}
                  >
                    20
                  </Button>
                  <Button
                    variant={
                      questionCountMode === "all" ? "secondary" : "ghost"
                    }
                    type="button"
                    onClick={() => onQuestionCountModeChange("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      questionCountMode === "custom" ? "secondary" : "ghost"
                    }
                    type="button"
                    onClick={() => onQuestionCountModeChange("custom")}
                  >
                    Custom
                  </Button>
                </div>

                {questionCountMode === "custom" ? (
                  <div className="pt-2">
                    <Input
                      nativeInput
                      type="number"
                      min={1}
                      value={String(customCount)}
                      aria-invalid={customCountTooHigh}
                      placeholder="Enter number..."
                      onChange={(e) =>
                        onCustomCountChange(Number(e.target.value))
                      }
                    />
                    {customCountTooHigh ? (
                      <div className="pt-2 text-sm text-destructive-foreground">
                        You only have {availableCount} Q&A notes available.
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </FormSection>

              <FormSection>
                <FormSectionTitle>Session options</FormSectionTitle>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm">Shuffle questions</div>
                  </div>
                  <Switch
                    checked={shuffled}
                    aria-label="Shuffle questions"
                    onCheckedChange={(v) => onShuffledChange(Boolean(v))}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm">Flagged notes only</div>
                  </div>
                  <Switch
                    checked={flaggedOnly}
                    aria-label="Flagged notes only"
                    onCheckedChange={(v) => onFlaggedOnlyChange(Boolean(v))}
                  />
                </div>
              </FormSection>

              {flaggedOnly && availableCount < customCount ? (
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">
                    You have {availableCount} flagged notes. The session will
                    include all of them.
                  </div>
                </Card>
              ) : null}
            </div>
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" type="button" />}>
              Cancel
            </SheetClose>
            <Button
              type="button"
              onClick={() => {
                void onStart();
              }}
              className="gap-2"
              disabled={
                startingSession ||
                (questionCountMode === "custom" && customCountTooHigh)
              }
            >
              {startingSession ? (
                <Spinner />
              ) : (
                <HugeiconsIcon icon={PlayIcon} size={18} />
              )}
              {startingSession ? "Loading Notes" : "Start Session"}
            </Button>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  );
}

function SessionDetailSheet({
  open,
  onOpenChange,
  isMobile,
  session,
  now,
  courses,
  notesPool,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  session: ReviewSessionModel | null;
  now: Date;
  courses: ReviewCourse[];
  notesPool: ReviewNote[];
  loading: boolean;
}) {
  const side = isMobile ? "bottom" : "right";

  const weakestTitle = React.useMemo(() => {
    if (!session?.weakestCourseId) return "—";
    return courses.find((c) => c.id === session.weakestCourseId)?.title ?? "—";
  }, [courses, session?.weakestCourseId]);

  const strongestTitle = React.useMemo(() => {
    if (!session?.strongestCourseId) return "—";
    return (
      courses.find((c) => c.id === session.strongestCourseId)?.title ?? "—"
    );
  }, [courses, session?.strongestCourseId]);

  const leveledUpQuestions = React.useMemo(() => {
    if (!session) return [];
    return session.notesLeveledUp
      .map((id) => notesPool.find((n) => n.id === id)?.question)
      .filter(Boolean) as string[];
  }, [notesPool, session]);

  const leveledDownQuestions = React.useMemo(() => {
    if (!session) return [];
    return session.notesLeveledDown
      .map((id) => notesPool.find((n) => n.id === id)?.question)
      .filter(Boolean) as string[];
  }, [notesPool, session]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPopup side={side} variant="inset">
        <Form className="h-full gap-0">
          <SheetHeader>
            <SheetTitle>{session?.name ?? "Session"}</SheetTitle>
          </SheetHeader>
          <SheetPanel className="px-4 pb-5">
            {loading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : session ? (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Target01Icon} size={18} />
                    <span className="tabular-nums">{session.accuracy}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">
                      {formatMinutes(session.timeSpentMinutes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">
                      {session.questionCount} questions
                    </span>
                  </div>
                  <div className="tabular-nums">
                    {sessionDateLabel(session.date, now)}
                  </div>
                </div>

                {session.shuffled || session.flaggedOnly ? (
                  <div className="flex flex-wrap gap-2">
                    {session.shuffled ? (
                      <Badge variant="outline">Shuffled</Badge>
                    ) : null}
                    {session.flaggedOnly ? (
                      <Badge variant="outline">Flagged</Badge>
                    ) : null}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="font-medium">Leveled Up</div>
                    <div className="pt-3">
                      {leveledUpQuestions.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic">
                          None
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {leveledUpQuestions.map((q) => (
                            <div key={q} className="text-sm">
                              {q}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium">Leveled Down</div>
                    <div className="pt-3">
                      {leveledDownQuestions.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic">
                          None
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {leveledDownQuestions.map((q) => (
                            <div key={q} className="text-sm">
                              {q}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Card className="p-4">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-muted-foreground">
                        Weakest Course
                      </div>
                      <div className="min-w-0 truncate">{weakestTitle}</div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-muted-foreground">
                        Strongest Course
                      </div>
                      <div className="min-w-0 truncate">{strongestTitle}</div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : null}
          </SheetPanel>
          <SheetFooter>
            <SheetClose render={<Button variant="ghost" />}>Close</SheetClose>
          </SheetFooter>
        </Form>
      </SheetPopup>
    </Sheet>
  );
}
