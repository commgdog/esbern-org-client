# esbern.org Client
The client-side (web) interface for esbern.org.

## Prerequisites
* Node.js >= 22
* NPM
* [The server project set up](https://github.com/commgdog/esbern-org-server)

## Installation

#### Project
```
# Clone the repository
git clone https://github.com/commgdog/esbern-org-client.git

# Navigate to the project folder
cd esbern-org-client

# Install dependencies
npm i
```

## Environmental Variables
The following environmental variables are available:
* `VITE_API_URL` (not required, default: http://localhost:3000) - The url that the server project is listening on.

For development, you can make a file called `.env` in the root directory of the project.
Inside you can define environmental variables in the format `VARIABLE=VALUE`.

For example: `VITE_API_URL=http://localhost:3030`

This value will also be used when building the project.

## Development Scripts

* `npm run dev` - Spin up a development server.
* `npm run lint` - Lint and fix the entire project.
* `npm run build` - Build the project for production.
* `npm run preview` - Preview the build locally before shipping to production.

## Dependencies
* [@mdi/font](https://www.npmjs.com/package/@mdi/font) - Material design icons.
* [axios](https://www.npmjs.com/package/axios) - Axios fetch API.
* [dayjs](https://www.npmjs.com/package/dayjs) - Date and time manipulation and formatting.
* [pinia](https://www.npmjs.com/package/pinia) - State management for Vue.
* [roboto-fontface](https://www.npmjs.com/package/roboto-fontface) - Roboto font.
* [vue](https://www.npmjs.com/package/vue) - Vue client framework.
* [vue-router](https://www.npmjs.com/package/vue-router) - Routing functionality for Vue.
* [vuetify](https://www.npmjs.com/package/vuetify) - Material design component framework.

## Development Dependencies
* [@eslint/js](https://www.npmjs.com/package/@eslint/js) - Base recommended linting config.
* [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin) - Formatting rules for linting.
* [@types/node](https://www.npmjs.com/package/@types/node) - Type definitions for `node`.
* [@vitejs/plugin-vue](https://www.npmjs.com/package/@vitejs/plugin-vue) - Vue functionality for  `vite`.
* [eslint](https://www.npmjs.com/package/eslint) - Linting and formatting.
* [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue) - Linting and formatting for Vue.
* [typescript](https://www.npmjs.com/package/typescript) - Typescript core.
* [typescript-eslint](https://www.npmjs.com/package/typescript-eslint) - Typescript tooling for linting.
* [unplugin-fonts](https://www.npmjs.com/package/unplugin-fonts) - Fonts for Vuetify.
* [unplugin-vue-components](https://www.npmjs.com/package/unplugin-vue-components) - Components for Vuetify.
* [vite](https://www.npmjs.com/package/vite) - Vite development and build tools.
* [vite-plugin-vuetify](https://www.npmjs.com/package/vite-plugin-vuetify) - Vuetify plugin for Vite.
* [vue-tsc](https://www.npmjs.com/package/vue-tsc) - Typescript transpiling tools for Vue.

## File Structure
```
+-- public - Public assets directory
+-- src - Source directory
    +-- components - Vue SFC building blocks
    +-- pages - Vue SFC pages
    +-- plugins - Core framework plugins
    +-- services - Core services
    +-- static - Static data files
    +-- stores - Pinia stores
```

## Date and Time
This project includes a wrapper utility for managing dates and times. There is a service wrapper in
`src/services/datetime.ts` that you should utilize for date and time functionality. All date and time
values on the server-side are in `UTC` whereas the client must translate from `UTC` to their respective
timezone saved on their account.

## Theming
* Primary Color: #1867C0

## Running the Development Server
You can run `npm run dev` to start the development server. This project utilizes the `vite`
package for watching for file changes and automatically updating when developing.

## Linting
This project utilizes `eslint` for linting. You can perform linting by running `npm run lint`.
Alternatively, if you are using WebStorm you can configure the IDE to perform the linting.

This project utilizes `stylistic` for along with `eslint` for code formatting. Code formatting
will be performed upon linting with `es run lint`.

To configure ESLint functionality in WebStorm, navigate to:

`Settings -> Languages & Frameworks -> JavaScript -> Code Quality Tools -> ESLint`

Set the configuration to `Manual ESLint configuration` and set the `ESLint package` to the
`eslint` package within the project's `node_modules`.

Set the configuration file to `eslint.config.mjs` which can be found in the root directory
of the project.

Additionally, you can set `Run eslint --fix on save` if you would like it to lint on save.

## Building
You can build this project by running `npm run build`. The build will be placed in a directory
called `build/` within the root directory of the project.

After building, you can run `npm run preview` to preview the build locally.
