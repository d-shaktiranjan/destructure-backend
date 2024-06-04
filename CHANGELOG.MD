# Changelog

All notable changes to this project will be documented in this file.

## 0.1.14

### Release Date- 4th Jun 24

#### Added

-   author info in details route.
-   reaction & comment info in details page.

#### Changed

-   fetch blog details by `slug`.

## 0.1.13

### Release Date- 25th May 24

#### Added

-   reaction status added in comment & reply list.
-   reaction lookup & addFields function to implement DRY.

#### Fixed

-   reaction status in blog list.

## 0.1.12

### Release Date- 25th May 24

#### Added

-   reaction support for comment & reply.

#### Fixed

-   reaction update issue.

#### Changed

-   all documents into one file.

## 0.1.11

### Release Date- 20th May 24

#### Added

-   route & controller to reply to a comment.

## 0.1.10

### Release Date- 20th May 24

#### Added

-   ownership status in comment & reply list.

#### Removed

-   `content` from blog list.

## 0.1.9

### Release Date- 20th May 24

#### Changed

-   user aggregate method.

## 0.1.8

### Release Date- 20th May 24

#### Added

-   comment list route & controller.
-   reply list route & controller.

## 0.1.7

### Release Date- 18th May 24

#### Added

-   unique slug checking route.
-   unique slug creating route.

## 0.1.6

### Release Date- 18th May 24

#### Added

-   `totalCount` in blog list.

## 0.1.5

### Release Date- 11th May 24

#### Added

-   `isAdmin` field in jwt.

## 0.1.4

### Release Date- 10th May 24

#### Added

-   `isEdited` field in comment.
-   `updateComment` route & controller.

#### Fixed

-   ownership checking issue in comment.

## 0.1.3

### Release Date- 9th May 24

#### Added

-   sort by date & like feature.

## 0.1.2

### Release Date- 9th May 24

#### Added

-   logic to remove file if it is not acceptable.

## 0.1.1

### Release Date- 8th May 24

#### Added

-   serving static files logic.
-   file url after success upload.

## 0.1.0

### Release Date- 1st Apr 24

#### Added

-   `coAuthor` field in blog model.
-   allow `coAuthor` field in create & update.
-   `coAuthor` in blog list.

## 0.0.9

### Release Date- 1st Apr 24

#### Fixed

-   dynamic redirectUri issue.

## 0.0.8

### Release Date- 27th Mar 24

#### Added

-   dynamic redirectUri after sign in.

#### Changed

-   constant.ts file.
-   packages to latest version.

## 0.0.7

### Release Date- 26th Mar 24

#### Changed

-   response `messages` into a separate file.
-   some import statements.

## 0.0.6

### Release Date- 25th Mar 24

#### Fixed

-   `cors` issues related to cookies.

## 0.0.5

### Release Date- 21st Mar 24

#### Added

-   `Comment` model & lib.
-   comment add & remove.
-   CHANGELOG.
