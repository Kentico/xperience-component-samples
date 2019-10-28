# Web Hook Javascript Action

This Javascript GitHub action acts like a web-hook. It posts current GitHub event data to defined end-point.

**Note: This action should be used only for internal purposes.**

## Inputs

### `url`

**Required** The URL of the web hook's target.

## Outputs

This action doesn't produce any output.

## Secrets and environment variables

This action doesn't use any secret or environment variable.

## Example usage
```
uses: ./.github/actions/web-hook
with:
  url: ${{ secrets.ENDPOINT }}
```

## How to commit

Before commit you need to run bundler on the code:
```
npm i
npm run build
```

Before running the commands ensure that you had `cd`-ed to `.github/actions/web-hook` folder.


### Files to commit
- index.js
- dist/index.js
- action.yml
- package.json
- package-lock.json

### Files not to commit
- node_modules/**

## Diagnostics and Security

As you may know, one can enable detailed diagnostics logs by setting `ACTIONS_STEP_DEBUG` secret to `true`. The action then logs a payload of current event which may contain sensitive data. Please, use the debugging mode wisely if the action is used in a public-facing workflow.
