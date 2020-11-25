# A Cli For Webpack5 And Vue2

# Install

`npm install kangaroo-cli -g`

# How to use

`ds-cli create appName`
create a webpack5 & vue2 project

`ds-cli init user -c -s -r -a`

- -c component
- -s store
- -r route
- -a api

Create some file in these folders for this project & will import them;But you need use it at the root folder;

if you just input ds-cli init user, it will just create a view file in the folder.

- views/user
  - index.vue
- components/user
  - Index.vue
- store/modules/user.js
- routes/user.js
- api/user.js

# Call help

`ds-cli -h` or `ds-cli --help`
