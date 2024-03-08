# Git Conduct

## Git Branch Naming Conventions

### Feature Branches

Create a branch for each new feature or enhancement:

```bash
git checkout -b feature/user-authentication
```

### Bug Fix Branches

For bug fixes, create a branch:

```bash
git checkout -b bugfix/login-issue
```

### Hotfix Branches

For urgent production fixes:

```bash
git checkout -b hotfix/login/admin-issue
```

### Release Branches

Create a branch for releasing a version:

```bash
git checkout -b release/1.2.0
```

## Git Commit Message Conventions

### Feature

A new feature

```bash
git commit -m "feat: add user authentication"
```

### Fix

A bug fix

```bash
git commit -m "fix: resolve login issue"
```

### Refactor

A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)

```bash
git commit -m "refactor: resolve login issue"
```

### Documentation

Documentation related changes

```bash
git commit -m "docs: readme file added"
```

### Chore

A code change that external user won't see (eg: change to .gitignore file or .prettierrc file)

```bash
git commit -m "chore: .prettierrc file added"
```

### Style

A code that is related to styling

```bash
git commit -m "style: readme file added"
```

### Perf

A code that improves performance

```bash
git commit -m "perf: improve user search algo"
```

### Test

Adding new test or making changes to existing test

```bash
git commit -m "test: improve user search algo"
```

### Build

Build related changes (eg: npm related/ adding external dependencies)

```bash
git commit -m "build: adding/update nodemon"
```

### **SHOULD:** Adding scope in commit message is a good idea.

Ex- `git commit -m "feat(auth): add admin check in login"`  
You should use scope in every type of commit message if it's necessary.
