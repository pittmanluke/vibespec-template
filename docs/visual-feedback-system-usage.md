# Visual Feedback System - Usage Guide

## Quick Start

The Visual Feedback System is now integrated into your VibeSpec project! Here's how to use it:

### 1. Enable the System

The system is already configured in your `.env.local` file:
```env
NEXT_PUBLIC_ENABLE_FEEDBACK_OVERLAY=true
```

### 2. Start Your Dev Server

```bash
npm run dev
```

### 3. Activate the Overlay

Press **`⌘+Shift+V`** (Mac) or **`Ctrl+Shift+V`** (Windows/Linux) to toggle the feedback overlay.

> **Note**: We use `⌘+Shift+V` instead of `F` to avoid conflicts with browser fullscreen mode.

## Using the Feedback System

### Three Modes

1. **Navigate Mode** (default)
   - Browse normally without interference
   - Keyboard shortcut: `N` when overlay is active

2. **Annotate Mode** 
   - Click any element to add feedback
   - Elements highlight on hover
   - Shows component names when available
   - Keyboard shortcut: `A`

3. **Review Mode**
   - See all collected feedback
   - Filter by page, type, or priority
   - Edit or delete items
   - Keyboard shortcut: `R`

### Adding Feedback

1. Press `A` or click "Annotate" in the overlay
2. Hover over elements - they'll highlight in blue
3. Click an element to open the feedback modal
4. Fill in:
   - **Type**: Style, Content, Behavior, Layout, or Feature
   - **Priority**: High, Medium, or Low
   - **Description**: What needs to change (required)
   - **Suggested Change**: Implementation hints (optional)
5. Press `⌘+Enter` to save or click "Save Feedback"

### Reviewing Feedback

1. Press `R` or click "Review" in the overlay
2. A sidebar opens showing all feedback
3. Filter by:
   - Page
   - Type
   - Priority
4. Click items to expand details
5. Delete items with the trash icon

### Exporting Feedback

1. Click "Export" in the overlay
2. Your feedback is automatically copied to clipboard
3. The export includes:
   - Organized by component and page
   - Priority indicators
   - Element selectors
   - Component paths (when detected)
   - Implementation suggestions

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘+Shift+V` | Toggle overlay on/off |
| `A` | Switch to Annotate mode |
| `R` | Switch to Review mode |
| `N` | Switch to Navigate mode |
| `M` | Minimize overlay |
| `⌘+Shift+E` | Export feedback |
| `⌘+Enter` | Save feedback (in modal) |
| `Escape` | Close modal/exit mode |

## Working with Claude Code

### Manual Application

1. Collect your feedback using the overlay
2. Export the feedback (it's copied to clipboard)
3. Share with Claude Code:
   ```
   Here's my visual feedback:
   [paste exported feedback]
   
   Please implement these changes.
   ```

### Future: Automated Application

We're planning a `/apply-feedback` command that will:
1. Parse the exported feedback
2. Identify target files
3. Apply changes automatically
4. Show you a diff for review

## Tips for Effective Feedback

### Be Specific
- ✅ "Change button background from white to blue-500"
- ❌ "Make it blue"

### Use Suggested Changes
- Include Tailwind classes: `bg-blue-500 hover:bg-blue-600`
- Mention specific values: `padding: 16px` or `p-4`
- Reference design system tokens when applicable

### Group Related Changes
- Collect all feedback for a component before exporting
- Review mode helps you see everything together

### Priority Guidelines
- **High**: Blocking issues, broken functionality
- **Medium**: Important UX improvements
- **Low**: Nice-to-have enhancements

## Features

### Smart Component Detection
- Automatically detects React component names
- Shows component file paths (when available in dev mode)
- Maps elements to source code

### Visual Highlighting
- Blue border shows current element
- Component name displayed above
- Dimensions shown below
- Click indicator in center

### Persistent Storage
- Feedback saved in localStorage
- Survives page refreshes
- Auto-cleans after 7 days
- Session tracking included

### Export Formats
- **Markdown**: Human-readable, Claude Code optimized
- **JSON**: Machine-readable for automation
- **Combined**: Both formats in one export

## Troubleshooting

### Overlay Not Appearing
1. Check `.env.local` has `NEXT_PUBLIC_ENABLE_FEEDBACK_OVERLAY=true`
2. Restart dev server after changing env vars
3. Check you're in development mode
4. Try hard refresh: `⌘+Shift+R`

### Can't Click Elements
1. Make sure you're in "Annotate" mode
2. Some elements might be covered by others
3. Try clicking parent elements
4. Disable any browser extensions that might interfere

### Component Names Not Showing
- This is normal for:
  - HTML elements (div, span, etc.)
  - Production builds
  - Some third-party components
- Component detection works best with your own React components

### Feedback Not Saving
1. Check browser console for errors
2. Clear localStorage if it's full
3. Try incognito mode to rule out extensions

## Example Workflow

1. **Start Testing**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

2. **Enable Feedback Mode**
   Press `⌘+Shift+V`

3. **Annotate Issues**
   - Press `A` for annotate mode
   - Click header: "Need more padding and blue background"
   - Click button: "Should be primary color"
   - Click text: "Font size too small"

4. **Review Collected Feedback**
   - Press `R` to open review sidebar
   - Check all items are captured
   - Delete any mistakes

5. **Export and Apply**
   - Press `⌘+Shift+E` to export
   - Share with Claude Code or your team
   - Watch as changes are implemented!

## Privacy & Security

- **Development Only**: System only works in development mode
- **Local Storage**: All data stored locally, never sent to servers
- **No Screenshots**: Unless you explicitly enable screenshot capture
- **Auto-Cleanup**: Old sessions deleted after 7 days
- **Sanitized HTML**: Script tags and event handlers removed from captures

## Configuration

The system can be configured by modifying the default config in `feedback-provider.tsx`:

```typescript
{
  theme: 'auto',           // 'light', 'dark', 'auto'
  position: 'bottom-right', // 'top-right', 'bottom-right', 'floating'
  opacity: 1,              // 0.1 to 1
  autoHighlight: true,     // Highlight on hover
  captureScreenshots: false, // Future feature
  exportFormat: 'markdown', // 'markdown', 'json', 'both'
}
```

## Known Issues & Fixes

### Hydration Errors
If you see React hydration errors, the system handles this by loading state from localStorage only after component mount.

### Keyboard Shortcut Conflicts
The toggle shortcut is `⌘+Shift+V` (not F) to avoid browser fullscreen conflicts.

### Modal Interaction
The system includes safeguards to prevent selecting elements while entering feedback:
- Highlighting is disabled when modal is open
- 300ms cooldown after closing modal
- Focus management keeps keyboard navigation within modal

## Coming Soon

- Screenshot capture support
- Visual regression tracking
- Team collaboration features
- Integration with design tools
- Automated implementation via `/apply-feedback` command

---

Happy testing! The Visual Feedback System makes it easy to communicate visual changes without leaving your browser.