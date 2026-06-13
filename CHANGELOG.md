# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Keyboard shortcuts support (Space, Enter, Arrow keys, T, B, ESC)
- Fullscreen mode with dedicated button
- Dual theme system (4 backgrounds × 7 accent colors)
- Theme switching shortcuts (T for accent, B for background)
- Left/Right arrow keys for seeking ±5 seconds
- Service Worker for offline functionality
- PWA support (installable to home screen)

### Changed
- Simplified configuration format from object to array
- Renamed configuration files:
  - `schedule.json` → `date-songs.json`
  - `songs.json` → `default-songs.json`
- Moved PWA files to `assets/pwa/` directory
- Global English localization (user-facing content)
- Improved project structure and organization

### Fixed
- Audio stopping at 70% progress issue
- Theme switching toast showing twice
- Removed unnecessary progress limitations

## [1.0.0] - 2026-06-13

### Added
- Initial release
- Daily song player with date-based scheduling
- Support for local MP3, direct URL, and embed sources
- Custom audio player with progress bar
- Circular rotating cover art
- Mobile-first responsive design
- Auto dark mode support
- Frosted glass card design with star background

[Unreleased]: https://github.com/LPK3215/daily-song/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/LPK3215/daily-song/releases/tag/v1.0.0
