"use client";

import * as React from "react";

import {
  CodeIcon,
  Delete01Icon,
  Edit01Icon,
  Flag01Icon,
  MoreVerticalIcon,
  Note01Icon,
  Pdf01Icon,
  TextSquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";

import {
  understandingLabel,
  type Note,
  toCodeBadgeLabel,
} from "@/app/notes/ui/notes-model";

export function MockNoteCard({
  note,
  breakpoint,
  onToggleFlag,
  onEdit,
  onViewFull,
  onViewCode,
  onDelete,
}: {
  note: Note;
  breakpoint: "mobile" | "tablet" | "desktop";
  onToggleFlag: () => void;
  onEdit: () => void;
  onViewFull: () => void;
  onViewCode: () => void;
  onDelete: () => void;
}) {
  const isQa = note.type === "qa";
  const isDesktop = breakpoint === "desktop";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {note.courseTitle ? (
            <div className="text-sm text-muted-foreground">
              {note.courseTitle}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={note.flag ? "Remove flag" : "Flag for review"}
            onClick={onToggleFlag}
          >
            <HugeiconsIcon
              icon={Flag01Icon}
              size={18}
              className={cn(
                "cursor-pointer",
                note.flag ? "text-destructive" : "text-muted-foreground",
              )}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" aria-label="More" />}
            >
              <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <HugeiconsIcon icon={Edit01Icon} size={18} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewFull}>
                <HugeiconsIcon icon={Note01Icon} size={18} />
                View full note
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Pdf01Icon} size={18} />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={TextSquareIcon} size={18} />
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDialog onDelete={onDelete}>
                <DropdownMenuItem variant="destructive">
                  <HugeiconsIcon icon={Delete01Icon} size={18} />
                  Delete
                </DropdownMenuItem>
              </DeleteDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="pt-4">
        {isQa ? (
          <div className="font-medium">{note.question}</div>
        ) : (
          <div>
            <div className="line-clamp-4 text-sm text-muted-foreground">
              {note.body}
            </div>
            {note.body && note.body.split(" ").length > 24 ? (
              <Button variant="link" className="px-0" onClick={onViewFull}>
                View full note
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <div className="flex items-center gap-2">
          {note.codeSnippet ? (
            <Button
              variant="outline"
              size="sm"
              aria-label="View code"
              onClick={onViewCode}
              className="gap-2"
            >
              <HugeiconsIcon icon={CodeIcon} size={18} />
              {toCodeBadgeLabel(note.codeLanguage)}
            </Button>
          ) : null}
          {isQa ? (
            isDesktop ? (
              <PreviewCard>
                <PreviewCardTrigger
                  render={<Button variant="ghost" size="sm" />}
                >
                  Peek answer
                </PreviewCardTrigger>
                <PreviewCardPopup>
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {note.answer}
                  </div>
                </PreviewCardPopup>
              </PreviewCard>
            ) : (
              <Popover>
                <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
                  Peek answer
                </PopoverTrigger>
                <PopoverPopup align="start" className="w-64">
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {note.answer}
                  </div>
                </PopoverPopup>
              </Popover>
            )
          ) : null}
        </div>

        {isQa && note.understandingLevel ? (
          <Badge variant="outline">
            {understandingLabel(note.understandingLevel)}
          </Badge>
        ) : null}
      </div>
    </Card>
  );
}

function DeleteDialog({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        nativeButton={false}
        render={children as React.ReactElement}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete note?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The note will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
