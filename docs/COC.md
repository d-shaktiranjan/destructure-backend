# Code of Conduct

## Overview

This code of conduct outlines the guidelines and expectations for contributors participating in the project. These rules are designed to ensure consistency and maintain a clean and readable codebase.

## Directory Naming

-   **MUST:** Directory names must be in snake case.
-   **SHOULD:** Directory name must be in plural form.
-   Ex- `routers`, `controllers`

## File Naming

-   **MUST:** File names must be in camel case.
-   **SHOULD:** Controllers,middlewares,models, route & test file names should include the directory name.
-   Ex- `auth.routers.ts`, `auth.model.ts`, `auth.controller.ts`, `auth.test.ts`

## Variable & Class Naming & Declaration

-   **MUST:** Variable & function names must be in camel case, Ex- `isValidEmail`,`authStrings`
-   **MUST:** Class names must be in pascal case, Ex- `ApiResponse`,`UserModel`
-   **MUST NOT:** Use `var` for variable declaration. Prefer `let` and `const` for variable declaration.
-   **MUST:** Use meaningful name, Ex- `userObject`,`verificationToken`
-   **MUST NOT:** Use random names for variable, file name & folder name.

## VCS

-   **MUST:** use [Git](https://git-scm.com/) to manage versions.
-   **MUST NOT:** directly push to dev & main branch.
-   **MUST:** Create PR to dev only.
-   **MUST NOT:** Merge failed PR to dev.
-   **MUST:** Create a new branch for new feature or bugfix.
-   **MUST:** Make atomic commit.
-   **MUST:** Be follow branch naming conventions.
-   **MUST:** Be follow commit message conventions.
-   **MUST:** Follow [Git Conduct](./gitConduct.md).
