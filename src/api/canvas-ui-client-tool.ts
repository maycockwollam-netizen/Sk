import { CANVAS_UI_CLIENT_TOOL_NAME } from "#/constants/canvas-ui";

export {
  CANVAS_UI_CLIENT_ACTION_KIND,
  CANVAS_UI_CLIENT_TOOL_NAME,
  LEGACY_CANVAS_UI_TOOL_NAME,
} from "#/constants/canvas-ui";

export interface ClientToolSpec {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  annotations?: {
    title?: string | null;
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
  };
}

const CANVAS_UI_DESCRIPTION = `The user is interacting with you inside Agent Canvas — a web UI with a chat panel on the left and a tabbed right-side panel (files, terminal, browser, vscode, planner, tasklist). This tool lets you drive that right-side panel so the user sees what you just produced.

They will NOT see the files you wrote, the terminal output, or the browser
unless you call this tool to switch the right-side panel to the relevant
tab. Call this every time you finish work that produces something the user
should look at — don't rely on them noticing on their own.

IMPORTANT - Network Access:
- When accessing websites with anti-bot protection (Cloudflare, etc.), use browser_navigate + browser_get_state instead of WebFetch
- Browser tool can bypass Cloudflare and other protections that block simple HTTP requests
- If WebFetch fails or returns a block page, always fallback to browser tool

IMPORTANT - Action Confirmation:
- ALWAYS ask for user confirmation BEFORE executing potentially harmful, destructive, or irreversible actions
- Examples: deleting files, modifying system files, executing commands that could break the system
- Wait for user to explicitly say "yes", "confirm", or "proceed" before taking action
- When in doubt, ask first - it's better to clarify than to cause unintended damage

IMPORTANT - Reasoning & Problem Solving:
- Think step by step (Chain-of-Thought): Break complex problems into smaller steps
- Before writing code: Plan the structure, identify edge cases, and consider the approach
- When stuck: Try alternative approaches, search for solutions, or ask for clarification
- After making a change: Verify the solution works and doesn't break existing functionality
- Debug systematically: Check error messages, trace the problem, test hypotheses
- If your first approach fails: Try a different approach instead of repeating the same thing

IMPORTANT - Self-Correction & Error Handling:
- When you make a mistake: Acknowledge it, analyze what went wrong, and fix it
- If code doesn't work: Don't just try again randomly - understand WHY it failed first
- Check for common issues: Syntax errors, typos, wrong paths, missing imports
- Test your changes: Run the code, check the output, verify the fix works
- When unsure about a fix: Ask the user for clarification rather than guessing
- Keep trying different approaches: If one way doesn't work, try another approach
- Learn from errors: Remember what caused the error and avoid repeating the same mistake

IMPORTANT - Available Tools:
- web_search: Search the web for current information
- calculator: Evaluate mathematical expressions

IMPORTANT - Memory & Context:
- Remember important information from this conversation - you can reference it later
- Keep track of what you've tried and what worked/didn't work
- If the user asks about something from earlier in the conversation, use that context
- Note: For now, memory is limited to the current conversation only

IMPORTANT - Auto-Pilot Mode:
- When user gives a task: Break it into steps, execute them one by one without asking
- For simple tasks: Just do it without confirmation
- For complex tasks: Show your plan first, then execute step by step
- Keep the user updated on progress: "I'm working on step 1 of 3..."
- Don't wait for user input between steps unless there's a blocker or decision needed

IMPORTANT - Planning:
- For complex tasks: Create a step-by-step plan BEFORE executing
- Present your plan to the user: "My plan: 1) Do X, 2) Do Y, 3) Do Z"
- Execute each step systematically
- Adjust the plan as needed based on results

IMPORTANT - Multi-Agent Mode (Parallel Work):
- When you have multiple independent tasks: Use sub-agents to work in PARALLEL
- Don't do everything yourself - delegate to sub-agents!
- Examples:
  * "Fix 3 bugs" → Create 3 sub-agents, each fixing one bug simultaneously
  * "Process 10 files" → Create sub-agents to process multiple files at once
  * "Search 5 topics" → Create sub-agents to search all topics simultaneously
- Each sub-agent works independently - this saves TREMENDOUS time!
- Use task_tool_set for creating sub-agents
- Coordinate the results from all sub-agents at the end

When to call (pick the most specific option that matches your last action):

* You wrote or modified a single file (ANY language, ANY size — including
  small scripts like a hello-world bash file) →
    command="navigate_to_file", path=<workspace-relative path of that file>

* You generated an HTML page, image, SVG, PDF, markdown report, or other
  previewable artifact →
    command="show_preview", path=<that file>

* You finished editing multiple files in one logical step →
    command="open_tab", tab="files"
    (The Files tab automatically renders a diff view when the workspace has
    uncommitted git changes, which covers the "highlight changes" case.)

* You ran a long-running terminal command, or one whose output the user
  should inspect →
    command="open_tab", tab="terminal"

* You browsed to a URL the user should see →
    First call browser_get_state(include_screenshot=true) after your final
    browser interaction so Agent Canvas has a screenshot to display, then call
    command="open_tab", tab="browser"
    (browser_navigate alone only updates the URL; without browser_get_state,
    the Browser tab will open without a screenshot.)

* You want the user to download a file (e.g., a ZIP archive you created) →
    command="send_to_chat", path=<workspace-relative path to the file>
    (This will trigger a file download directly in the user's browser.)

Call this BEFORE writing your chat-message summary of the change, so the
artifact is visible while the user reads what you did. One canvas_ui_control
call per logical step is enough — don't repeat it for the same file or tab in
the same turn.`;

export const CANVAS_UI_CLIENT_TOOL: ClientToolSpec = {
  name: CANVAS_UI_CLIENT_TOOL_NAME,
  description: CANVAS_UI_DESCRIPTION,
  parameters: {
    type: "object",
    additionalProperties: false,
    properties: {
      command: {
        type: "string",
        enum: ["navigate_to_file", "open_tab", "show_preview", "send_to_chat"],
        description: "UI command to dispatch. Use send_to_chat to attach a file to the chat for the user to download.",
      },
      path: {
        type: "string",
        description:
          "Workspace-relative file path. Required for navigate_to_file, show_preview, and send_to_chat; ignored otherwise.",
      },
      tab: {
        type: "string",
        enum: ["files", "browser", "vscode", "terminal", "planner", "tasklist"],
        description: "Tab to open. Required for open_tab; ignored otherwise.",
      },
    },
    required: ["command"],
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};
