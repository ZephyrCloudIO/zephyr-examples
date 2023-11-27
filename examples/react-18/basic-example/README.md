# Zephyr Demo

# Setup

1. `npm install`
2. Login to Zephyr https://zephyr-cloud.io/
3. Create the project https://app.zephyr-cloud.io/projects
4. Copy Default or Generate New **Read/Write** Token for created Project
5. Copy **Read/Write** Token and add to the `.env` in the root of this directory.
6. Run a build with yarn start, then go check Zephyr.
7. If you want to test out version management, change something in `dsl` and run `npm run build && npm run serve` again - you will now be able to control what remote/app uses what version at runtime

# Running Demo

Run `npm run build && npm run serve`

- [Home is on localhost:3001](http://localhost:3001/)
- [DSL is on localhost:3002](http://localhost:3002/)
- [Nav is on localhost:3003](http://localhost:3003/)
- [Search is on localhost:3004](http://localhost:3004/)
- [Utils is on localhost:3005](http://localhost:3005/)

Notice that `app1` will asynchronously load `app2`'s button and vice versa.
