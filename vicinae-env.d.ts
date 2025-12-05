/// <reference types="@vicinae/api">

/*
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 */

type ExtensionPreferences = {
  /** Preferred Editor - Select the editor to open projects with */
	"programName"?: "positron" | "code" | "cursor";

	/** Terminal Emulator - Select your preferred terminal emulator. Choose 'Custom' to specify a custom command with arguments. */
	"terminalPreset"?: "auto-detect" | "gnome-terminal" | "konsole" | "alacritty" | "kitty" | "ghostty" | "tilix" | "wezterm" | "xterm" | "custom";

	/** Custom Terminal Command - Custom terminal command template. Use {path} as placeholder for the folder path. Example: ghostty --working-directory={path} */
	"customTerminalCommand": string;

	/** Base Directory Path - The base directory where folders will be created. Leave empty to use home directory. Supports ~ for home, relative paths, or absolute paths like / or /projects */
	"basePath": string;

	/** Add Year to Path - When enabled, creates folders in YEAR/MM-DD/TITLE structure. When disabled, uses MM-DD/TITLE or just TITLE structure. */
	"addYearToPath": boolean;

	/** Add Month-Day to Path - When enabled, creates folders with MM-DD subdirectory. When disabled with year enabled, uses YEAR/TITLE structure. */
	"addMonthDayToPath": boolean;

	/** Sanitize Path Name - When enabled, converts the title to lowercase snake_case and removes special characters. When disabled, uses the title as-is. */
	"sanitizePathName": boolean;

	/** Truncate Path Name - When enabled, limits the title to 50 characters or 10 words. When disabled, uses the full title. */
	"truncatePathName": boolean;
}

declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Command: Code in New Folder */
	export type CodeInNewFolder = ExtensionPreferences & {
		
	}

	/** Command: Search Recent Projects */
	export type SearchRecentProjects = ExtensionPreferences & {
		
	}
}

declare namespace Arguments {
  /** Command: Code in New Folder */
	export type CodeInNewFolder = {
		
	}

	/** Command: Search Recent Projects */
	export type SearchRecentProjects = {
		
	}
}