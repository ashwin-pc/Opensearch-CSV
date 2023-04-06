# Changesets

## How to write a changeset

A changeset is a file that contains a small snippet of the change that will be added to the next changelog. It is a small yml file that contains a list of changes. The file name should be prefixed with the type of change, followed by a dash, followed by a short description of the change. The file name should be in kebab-case. The file should be placed in the `changelogs/fragments` directory.

### Types of changes

The type of change should be one of the following:

- `feature` - A new feature
- `bugfix` - A bug fix

## Example

Here is an example of a changelog fragment:

changelogs/fragments/bugfix-This-is-a-bugfix.md

```yml
bugfix:
  - This is a bugfix. ([#123](https://github.com/changesets/changesets/issues/123))
  - This is another bugfix. ([#456](https://github.com/changesets/changesets/issues/456))

features:
  - This is a feature. ([#789](https://github.com/changesets/changesets/issues/789))
```
