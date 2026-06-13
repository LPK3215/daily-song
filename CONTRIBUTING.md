# Contributing to Daily Song

Thank you for your interest in contributing to Daily Song! 🎵

## Ways to Contribute

### 1. Report Bugs
- Check if the issue already exists in [GitHub Issues](https://github.com/LPK3215/daily-song/issues)
- If not, create a new issue with:
  - Clear description of the bug
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser version and OS

### 2. Suggest Features
- Open a new issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would be useful

### 3. Submit Pull Requests

#### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/LPK3215/daily-song.git
cd daily-song

# Start local server
python -m http.server 8080
# Or use your preferred static server

# Open http://localhost:8080
```

#### Pull Request Process
1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```
3. **Make your changes**:
   - Follow existing code style
   - Keep commits atomic and well-described
   - Test your changes locally
4. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with X"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub

### Commit Message Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

## Code Style Guidelines

### JavaScript
- Use ES6+ features (const/let, arrow functions, etc.)
- Use native ES Modules (`import`/`export`)
- No external dependencies or build tools
- Clear, descriptive variable names
- Add comments only when necessary (explain "why", not "what")

### CSS
- Use CSS custom properties (variables)
- Mobile-first approach
- Semantic class names
- Keep files modular by responsibility

### HTML
- Semantic HTML5 elements
- Accessibility attributes (ARIA)
- Clean, indented structure

## File Structure
```
daily-song/
├── index.html          # Entry point
├── assets/
│   ├── css/            # Stylesheets (modular)
│   ├── js/             # JavaScript modules
│   └── pwa/            # PWA files
├── data/               # Configuration files
└── media/              # Audio and cover images
```

## Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Verify PWA functionality (offline mode, install prompt)
- Check keyboard shortcuts work correctly

## Questions?
Feel free to:
- Open an issue with the `question` label
- Email: 17538703215@163.com

## License
By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for making Daily Song better! 🎶
