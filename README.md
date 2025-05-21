# Standardizing the commits on both frontend and the backend

Include version numbers to signify whether the frontend and backend are in sync
with the features. I.e: backend v2.0.9 is ahead of frontend by 2 or more features.

The frontend has to reflect that change clearly

## Commit shorthand messages

1. Chore: Trivial tasks like adding anchor links, upgrading packages, updating
   dependencies
2. Test: Must assert that the commit for anything to do with testing
3. Fix: Bug Type + Why it happened
4. Version: version number + breaking changes | new feature discrepancy
5. Refactor: In case of refactoring code, while maintaining the same features
6. Non-Canonical: If the commit cannot be described in any of the 5 shorthands above.
   This can probably be used in cases where documentation is added, comments are added/
   removed, and where the relation between the frontend and backend is not affected

### Overall goal

The overall goal is to keep the code well documented and easy to navigate back <-->
forth. Our frontend is currently in production, and our backend is about to enter
production as well.

I want to keep it as simple as humanly possible to surgically navigate commits in the
codebase once it reaches production. Keep the atomic commits principle.

Additionally: refrain of running destructive db commands, especially
_node ace migration:refresh_

Refer to this small guide whenever you need to commit, to standardize it from now on.

Before this point, we did not really have much benefit from a rigid structure.
However, from this point on we do.

#### Let's speak cookies:

We have tried implementing cookies up until commit #11b86d8, and finally found out
why cookies won't work in our case. The oat tokens are too large and get silently
dropped by the browser. Henceforth, no cookie parser with http credentials can be used
in our case.

To mitigate the risk of XSS, keep the validity of OATs short
