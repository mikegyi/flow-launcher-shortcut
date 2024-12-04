# Flow Launcher Shortcut Plugin

A Flow Launcher plugin for interacting with Shortcut (formerly Clubhouse) - the project management tool.

## Features

- Search stories in Shortcut
- Create new stories quickly
- Open stories directly in your browser

## Installation

1. Download the latest release from the [Releases page](https://github.com/mikegyi/flow-launcher-shortcut/releases)
2. Extract the zip file to `%APPDATA%\FlowLauncher\Plugins` (on Windows) or `~/.local/share/FlowLauncher/Plugins` (on Linux/macOS)
3. Restart Flow Launcher
4. Get your Shortcut API token from [Shortcut Settings](https://app.shortcut.com/settings/account/api-tokens)
5. Configure the token in Flow Launcher:
   - Open Flow Launcher settings
   - Go to Plugin section
   - Find "Shortcut" plugin
   - Add your API token in the settings

## Usage

- `sc` - Show initial menu
- `sc search_term` - Search for stories
- `sc new Story Title` - Create a new story

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## License

MIT 