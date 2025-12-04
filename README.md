# Code in Folder

A Vicinae extension that creates a folder in your configured directory and opens it in your preferred code editor.

## Features

- Creates a flexible folder structure: `[BASE_PATH]/[YEAR]/[MM-DD]/[TITLE]`
- Configurable base path (defaults to `~/playground`)
- Configurable code editor (defaults to `positron`, can be set to `code` for VS Code or any other editor)

## Usage

1. Launch Vicinae and search for "Code in Folder"
2. Enter your project title
3. Press Enter to create the folder and open it in your configured editor

## Configuration

You can customize where folders are created and which editor to use:

### Accessing Settings

1. Open Vicinae's settings window:
   - Search for and run "open settings" command, **OR**
   - Press **Ctrl + Comma** while Vicinae is active
2. Navigate to the **Extensions** tab
3. Find "Code in Folder" in the extensions list
4. Configure the settings:
   - **Base Directory Path**: Where folders will be created (e.g., `~/playground`, `~/dev/experiments`)
   - **Editor Program Name**: The command to open folders (e.g., `code` for VS Code, `positron` for Positron, `cursor` for Cursor)
   - **Add Year to Path**: Include year subdirectory in path (default: enabled)
   - **Add Month-Day to Path**: Include month-day subdirectory in path (default: enabled)
   - **Sanitize Path Name**: Convert title to snake_case and remove special characters (default: enabled)
   - **Truncate Path Name**: Limit title to 50 characters or 10 words (default: enabled)

### Folder Structure Examples

The extension creates folders based on your settings. Here are some examples:

**All options enabled** (default):
```
[Your Base Path]/
  ├── 2025/
  │   ├── 01-15/
  │   │   └── my_project_name/
  │   └── 01-16/
  │       └── another_project/
  └── 2026/
      └── ...
```

**Year disabled, month-day enabled**:
```
[Your Base Path]/
  ├── 01-15/
  │   ├── my_project_name/
  │   └── another_project/
  └── 01-16/
      └── ...
```

**Both year and month-day disabled**:
```
[Your Base Path]/
  ├── my_project_name/
  ├── another_project/
  └── ...
```

**Sanitization**:
- With sanitization: `my_cool_project_2024`
- Without sanitization: `My Cool Project 2024!` (preserves original formatting)

## Installation

```bash
npm install
npm run dev
```

For production build:

```bash
npm run build
```

## Requirements

- [Vicinae](https://docs.vicinae.com/) launcher
- Your preferred code editor installed and available in PATH (e.g., Positron, VS Code, Cursor)

## Inspiration

This extension is inspired by [Andrew Heiss's Raycast script](https://gist.github.com/andrewheiss/ef3ac7dfef2fdb8477a84e7e27f6853e) for creating dated project folders.
