## Branching Guide

When contributing to our project, it's essential to follow a structured approach to branching. This ensures that your changes are well-organized and can be easily integrated into the main codebase. We use a feature branch workflow, which involves creating branches for specific features or fixes. Here's how you can create and manage branches effectively:

### Branch Naming Convention

1. **Feature Branches**: Create branches from the `develop` branch. Use the following naming convention:

   - `<GitHub Issue ID>-<Optional Name>`

   Example:

   - If you're working on issue #123 and adding a new feature for user authentication, your branch name could be: `123-user-authentication`.

### Creating a Branch

To create a new branch, follow these steps:

1. **Fetch the Latest Changes**: Before creating a new branch, ensure your local repository is up to date with the latest changes from the remote repository.

   ```bash
   git fetch origin
   ```

2. **Checkout the Develop Branch**: Switch to the `develop` branch.

   ```bash
   git checkout develop
   ```

3. **Create a New Branch**: Create a new branch from the `develop` branch using the naming convention mentioned above.

   ```bash
   git checkout -b 123-user-authentication
   ```

### Working on Your Branch

Once you've created your feature branch, you can start working on your changes. Make sure to:

- Commit your changes regularly, with meaningful commit messages.
- Reference the GitHub issue ID in your commit messages. For example, `Added user authentication feature. Fixes #123`.

### Pushing Your Branch

After making your changes, push your branch to the remote repository:

```bash
git push origin 123-user-authentication
```

### Creating a Merge Request

Once you've completed your changes and are ready to merge them into the `develop` branch, create a merge request (or pull request) on GitHub.

Ensure to:

- Provide a clear description of the changes made.
- Reference the relevant GitHub issue in your pull request description.
- Assign the pull request to the appropriate reviewers or maintainers.

### Conclusion

Following this branching strategy helps maintain a clean and organized codebase, making it easier to collaborate and manage contributions effectively. If you have any questions or need assistance with branching, feel free to reach out to the project maintainers. Thank you for your contribution!
