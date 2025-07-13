# Contributing to FINSIGHT

Thank you for your interest in contributing to FINSIGHT! We welcome contributions from developers of all skill levels. This guide will help you get started.

## 🤝 How to Contribute

### Types of Contributions
- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes, new features, or improvements
- **Documentation**: Improve or add to our documentation
- **Testing**: Help us test new features and find bugs

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Stock_prediction.git
   cd Stock_prediction
   ```

2. **Set Up the Backend**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Set Up the Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Fill in your API keys and configuration
   # You'll need API keys for:
   # - Finnhub API
   # - NewsAPI
   # - Google API
   # - Yahoo Finance API
   ```

5. **Run the Application**
   ```bash
   # Terminal 1: Start backend
   python app.py
   
   # Terminal 2: Start frontend
   cd frontend
   npm start
   ```

## 📋 Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ES6+ features, follow Prettier configuration
- **Comments**: Write clear, concise comments for complex logic
- **Naming**: Use descriptive variable and function names

### Commit Messages
Follow conventional commit format:
```
type(scope): description

Examples:
feat(api): add sentiment analysis endpoint
fix(ui): resolve stock chart rendering issue
docs(readme): update installation instructions
```

### Branch Naming
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

## 🐛 Reporting Issues

### Bug Reports
Please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, browser, Python/Node versions
- **Screenshots**: If applicable

### Feature Requests
Please include:
- **Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you think it should work
- **Alternatives**: Any alternative solutions considered

## 🔧 Pull Request Process

### Before Submitting
1. **Check existing issues** to avoid duplicates
2. **Test your changes** thoroughly
3. **Update documentation** if needed
4. **Add tests** for new features
5. **Ensure code follows style guidelines**

### Submitting a Pull Request
1. **Create a new branch** from `main`
2. **Make your changes** following the guidelines
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Submit the pull request** with a clear description

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or marked as such)
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Include edge cases and error handling
- Test both positive and negative scenarios

## 📚 Documentation

### Types of Documentation
- **Code Comments**: Inline documentation for complex logic
- **API Documentation**: Document all endpoints and parameters
- **User Documentation**: Help users understand features
- **Developer Documentation**: Help other developers contribute

### Documentation Style
- Use clear, concise language
- Include code examples
- Keep it up-to-date with code changes
- Use proper markdown formatting

## 🏷️ Labels and Tags

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation needs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `duplicate`: Duplicate issue
- `invalid`: Invalid issue
- `question`: Further information requested

### Priority Labels
- `priority/low`: Low priority
- `priority/medium`: Medium priority
- `priority/high`: High priority
- `priority/critical`: Critical priority

## 🎯 Good First Issues

New contributors should look for issues labeled:
- `good first issue`
- `beginner friendly`
- `help wanted`

### Suggested First Contributions
- Fix typos in documentation
- Add unit tests for existing functions
- Improve error handling
- Add new data visualization features
- Enhance UI/UX components

## 🤔 Questions and Support

### Getting Help
- **GitHub Discussions**: For general questions and discussions
- **Issues**: For bug reports and feature requests
- **Discord/Slack**: (If you have a community chat)

### Response Times
- We aim to respond to issues within 48 hours
- Pull requests are typically reviewed within 1 week
- Please be patient and respectful

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Hall of Fame for consistent contributors

## 📋 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## 📄 License

By contributing to FINSIGHT, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FINSIGHT! Your contributions help make financial insights more accessible to everyone. 🚀📈
