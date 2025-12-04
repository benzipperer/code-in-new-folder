/// <reference types="@vicinae/api">

/*
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 */

type ExtensionPreferences = {
  /** Base Directory Path - The base directory where folders will be created (e.g., ~/playground) */
	"basePath"?: string;

	/** Editor Program Name - The name of the program to open folders with (e.g., 'code' for VS Code, 'positron' for Positron) */
	"programName"?: string;

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
  /** Command: Code in Folder */
	export type CodeInFolder = ExtensionPreferences & {
		
	}
}

declare namespace Arguments {
  /** Command: Code in Folder */
	export type CodeInFolder = {
		
	}
}