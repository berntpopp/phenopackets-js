// .releaserc.js
module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x', // e.g. 1.x.x, 2.x.x, for maintenance releases
    'main', // Your primary release branch
    'next', // For pre-releases on a 'next' branch
    'next-major', // For pre-releases of a major version
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  plugins: [
    // Analyzes commit messages to determine release type (PATCH, MINOR, MAJOR)
    '@semantic-release/commit-analyzer',

    // Generates release notes based on conventional commits
    '@semantic-release/release-notes-generator',

    // Creates or updates CHANGELOG.md
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],

    // Updates package.json version and publishes to NPM
    '@semantic-release/npm',

    // Commits package.json, package-lock.json, and CHANGELOG.md back to the repo
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],

    // Creates a GitHub release and comments on related issues/PRs
    '@semantic-release/github',
  ],
};
