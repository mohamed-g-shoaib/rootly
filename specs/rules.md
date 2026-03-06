# UI and Interaction Rules

## UI Components and Styling
- **Do NOT** replace, override, or ignore the existing styling of shadcn/ui components.
- **Do NOT** create custom UI components when a shadcn/ui or Radix UI component already exists.
- Always use the established design system tokens and Tailwind classes.

## User Feedback and Interactions
- **Optimistic UI Update**: Always prefer optimistic updates for instant user feedback. Reflect the successful state in the UI immediately while the actual request is in flight. Roll back state gracefully if the request fails.
- **Every** clickable item that performs an asynchronous or significant action **MUST** provide immediate visual feedback.
- **Loading States**:
    - Use `<Spinner />` or a loading skeleton during data fetching or processing.
    - When a button is clicked (e.g., "Delete"), replace the icon or text with a loading spinner while the action is in progress.
- **Destructive Actions**:
    - Delete buttons must always use the `destructive` variant and include a relevant icon (e.g., `Trash`).
    - Use `AlertDialog` for confirmation before performing irreversible destructive actions.
- **Post-Action Feedback**:
    - Use `sonner` toasts to confirm success or report errors after an action completes.
- **Interactive Elements**:
    - Always ensure buttons and links have clear hover and focus states.
    - Use Tooltips for icon-only buttons to provide additional context.