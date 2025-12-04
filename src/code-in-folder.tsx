import { Action, ActionPanel, Form, showToast, Toast, closeMainWindow, getPreferenceValues, Icon } from "@vicinae/api";
import { exec } from "child_process";
import { mkdir, access } from "fs/promises";
import { homedir } from "os";
import { join, dirname } from "path";
import { promisify } from "util";
import { constants } from "fs";

const execAsync = promisify(exec);

interface FormValues {
  title: string;
}

interface Preferences {
  basePath: string;
  programName: string;
  addYearToPath: boolean;
  addMonthDayToPath: boolean;
  sanitizePathName: boolean;
  truncatePathName: boolean;
}

/**
 * Expands tilde (~) to home directory
 */
function expandPath(path: string): string {
  if (path.startsWith("~")) {
    return join(homedir(), path.slice(1));
  }
  return path;
}

/**
 * Processes a title for use as a path component:
 * - Optionally converts to snake_case (if sanitizePathName is true)
 * - Optionally removes special characters (if sanitizePathName is true)
 * - Optionally truncates to max 50 characters or 10 words (if truncatePathName is true)
 */
function processTitle(title: string, sanitize: boolean, truncate: boolean): string {
  // Trim whitespace
  let processed = title.trim();

  if (sanitize) {
    // Convert to lowercase
    processed = processed.toLowerCase();

    // Replace spaces and common separators with underscores
    processed = processed.replace(/[\s\-\.]+/g, "_");

    // Remove special characters (keep only alphanumeric, underscore, and hyphen)
    processed = processed.replace(/[^a-z0-9_\-]/g, "");

    // Collapse multiple underscores into one
    processed = processed.replace(/_+/g, "_");

    // Remove leading/trailing underscores
    processed = processed.replace(/^_+|_+$/g, "");
  }

  if (truncate) {
    if (sanitize) {
      // Truncate by words (max 10 words) - only when sanitized (using underscores)
      const words = processed.split("_").filter((w) => w.length > 0);
      if (words.length > 10) {
        processed = words.slice(0, 10).join("_");
      }
    }

    // Truncate by characters (max 50 characters)
    if (processed.length > 50) {
      processed = processed.substring(0, 50);
      if (sanitize) {
        // Remove trailing underscore if truncation created one
        processed = processed.replace(/_+$/, "");
      }
    }
  }

  return processed;
}

/**
 * Validates that a program name is safe to use in a shell command
 * Prevents shell injection by checking for dangerous characters
 */
function validateProgramName(programName: string): { valid: boolean; error?: string } {
  if (!programName || programName.trim() === "") {
    return { valid: false, error: "Editor program name cannot be empty" };
  }

  // Check for shell metacharacters that could be used for injection
  const dangerousChars = /[;&|`$(){}[\]<>*?~!#\n\r]/;
  if (dangerousChars.test(programName)) {
    return {
      valid: false,
      error: "Editor program name contains invalid characters. Use only letters, numbers, hyphens, underscores, and forward slashes.",
    };
  }

  // Check for multiple words (spaces) which might indicate misconfiguration
  if (/\s/.test(programName.trim())) {
    return {
      valid: false,
      error: "Editor program name should be a single command (e.g., 'code', not 'code --new-window')",
    };
  }

  return { valid: true };
}

/**
 * Checks if a command exists in the system PATH
 */
async function checkCommandExists(command: string): Promise<boolean> {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that the base path is writable
 */
async function validateBasePath(path: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Try to access the directory
    try {
      await access(path, constants.W_OK);
      return { valid: true };
    } catch {
      // Directory might not exist, try to create it or check parent
      const parentDir = dirname(path);
      try {
        await access(parentDir, constants.W_OK);
        return { valid: true };
      } catch {
        return {
          valid: false,
          error: `Cannot write to base directory or its parent: ${path}. Please check the path and permissions in settings.`,
        };
      }
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error validating base path",
    };
  }
}

export default function CodeInFolder() {
  // Get preferences
  const preferences = getPreferenceValues<Preferences>();
  const expandedBasePath = expandPath(preferences.basePath);

  // Validate preferences early to provide warnings
  const programValidation = validateProgramName(preferences.programName);
  const hasConfigIssue = !programValidation.valid;

  // Calculate current date for display
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Build display path based on preferences
  let displayPathParts = [preferences.basePath];

  if (preferences.addYearToPath) {
    displayPathParts.push(String(year));
  }

  if (preferences.addMonthDayToPath) {
    displayPathParts.push(`${month}-${day}`);
  }

  displayPathParts.push("[TITLE]");

  const displayPath = displayPathParts.join("/");

  async function handleSubmit(values: FormValues) {
    const { title } = values;

    // Validate title input
    if (!title || title.trim() === "") {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter a project title",
      });
      return;
    }

    // Process the title based on preferences
    const processedTitle = processTitle(title, preferences.sanitizePathName, preferences.truncatePathName);

    if (!processedTitle) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid Title",
        message: "Title must contain at least one valid character",
      });
      return;
    }

    // Validate program name before proceeding
    const programValidation = validateProgramName(preferences.programName);
    if (!programValidation.valid) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid Editor Configuration",
        message: programValidation.error || "Please check your editor program name in extension settings",
      });
      return;
    }

    try {
      // Get current date
      const now = new Date();
      const year = String(now.getFullYear());
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateFolder = `${month}-${day}`;

      // Construct the full path based on preferences
      let pathParts = [expandedBasePath];

      if (preferences.addYearToPath) {
        pathParts.push(year);
      }

      if (preferences.addMonthDayToPath) {
        pathParts.push(dateFolder);
      }

      pathParts.push(processedTitle);

      const fullPath = join(...pathParts);

      // Create the directory (recursively creates parent directories)
      try {
        await mkdir(fullPath, { recursive: true });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        await showToast({
          style: Toast.Style.Failure,
          title: "Error Creating Folder",
          message: `Cannot create directory: ${errorMessage}. Check base path in settings.`,
        });
        return;
      }

      await showToast({
        style: Toast.Style.Success,
        title: "Folder Created",
        message: processedTitle !== title ? `Created as: ${processedTitle}` : `Created ${fullPath}`,
      });

      // Open in the configured editor
      try {
        await execAsync(`${preferences.programName} "${fullPath}"`);
        await closeMainWindow();
      } catch (error) {
        // Provide helpful error message based on error type
        let errorMessage = "Failed to open editor";

        if (error instanceof Error) {
          const errorString = error.message.toLowerCase();

          // Check if it's a "command not found" error
          if (errorString.includes("not found") || errorString.includes("command not found")) {
            errorMessage = `Command '${preferences.programName}' not found. Please install it or update the Editor Program Name in settings.`;
          } else if (errorString.includes("permission denied")) {
            errorMessage = `Permission denied when running '${preferences.programName}'. Check file permissions.`;
          } else {
            errorMessage = error.message;
          }
        }

        await showToast({
          style: Toast.Style.Failure,
          title: "Error Opening Editor",
          message: errorMessage,
        });
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Folder" onSubmit={handleSubmit} />
          <Action.Open
            title="Open Extension Settings"
            target="vicinae://extensions/code-in-folder"
            icon={Icon.Gear}
            shortcut={{ modifiers: ["cmd"], key: "," }}
          />
        </ActionPanel>
      }
    >
      {hasConfigIssue && (
        <Form.Description
          title="⚠️ Configuration Issue"
          text={programValidation.error || "Please check your extension settings"}
        />
      )}
      <Form.TextField
        id="title"
        title="Project Title"
        placeholder="Enter your project name"
      />
      <Form.Description
        title="Folder Path"
        text={displayPath}
      />
    </Form>
  );
}
