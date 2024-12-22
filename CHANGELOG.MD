# Changelog

All notable changes to this project will be documented in this file.

## 1.0.1

### Release Date-22th Dec 24

#### Added

-   time stamp & time taken in logger.

## 1.0.0

### Release Date- 6th Nov 24

#### Added

-   search feature.

## 0.1.25

### Release Date- 30th Jul 24

#### Added

-   multiple image upload support.

## 0.1.24

### Release Date- 29th Jul 24

#### Added

-   image list route.

#### Changed

-   upload image route.

#### Fixed

-   route in logger.

## 0.1.23

### Release Date- 28th Jul 24

#### Added

-   api logger.
-   env variable to control log to store in DB.
-   colors into api logging.

## 0.1.22

### Release Date- 25th Jul 24

#### Removed

-   pagination support from blog list.

## 0.1.21

### Release Date- 22th Jul 24

#### Refactor

-   `/admin` routes.

#### Fixed

-   `createBlog` controller.

## 0.1.20

### Release Date- 20th Jul 24

#### Improved

-   error handing.

## 0.1.19

### Release Date- 18th Jul 24

#### Added

-   `isDeleted` field.
-   comment soft delete route & controller.
-   logic that soft deleted comment can't update.

## 0.1.18

### Release Date- 15th Jul 24

#### Removed

-   cookies support.
-   `logout` route & controller.
-   `userInfo` in google callback.

#### Added

-   `picture` in JWT.

## 0.1.17

### Release Date- 15th Jul 24

#### Added

-   individual reaction count in blog stats controller.

## 0.1.16

### Release Date- 14th Jun 24

#### Added

-   route & controller to get public blog's slug list.

## 0.1.15

### Release Date- 12th Jun 24

#### Added

-   route & controller to get blog stats(reaction, comment).

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
