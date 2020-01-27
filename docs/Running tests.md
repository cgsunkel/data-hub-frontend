# Running tests

## Creating Docker container for CircleCI

```bash
export VERSION=3.1.0 # Increment this version each time when you edit Dockerfile.

docker login # Ask webops for Docker Hub access to the ukti group.
docker build -f test/Dockerfile -t data-hub-frontend-test .

docker tag data-hub-frontend-test:latest ukti/data-hub-frontend-test:${VERSION}
docker tag data-hub-frontend-test:latest ukti/data-hub-frontend-test:latest

docker push ukti/data-hub-frontend-test:${VERSION}
docker push ukti/data-hub-frontend-test:latest
```

You image should be now listed at [Docker Hub](https://cloud.docker.com/u/ukti/repository/docker/ukti/data-hub-frontend-test/tags).

## Executing CircleCI jobs locally

Not all the jobs currently can be executed locally.

```bash
curl -fLSs https://circle.ci/cli | bash
circleci local execute --job unit_tests
circleci local execute --job unit_client_tests
```

## Coding standards

Prettier and Sass linter will run as part of the build, assure you run the command below before committing:

`$ yarn test:lint`

## Functional Tests

The aim of this test suite is perform functional tests of frontend components in isolation.

### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ yarn`

### Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

Execute all the tests on `specs` in chrome browser:

`$ yarn test:functional -- --browser chrome`

### Running the tests manually in cypress interface

`$ yarn test:functional:watch`

### Running a specific spec

`$ yarn test:functional -- --spec test/functional/cypress/specs/nav-spec.js`

## E2E Tests

The aim of this test suite is perform end to end tests, simulating a user flow.

### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ yarn`

### Running the tests

Notice that before running the tests the application should be up and running.

You will also need data hub api application started with the initial fixutres loaded. This can be done
by running `start-uat.sh` located on the root of the api repository.

The main e2e test suite is triggered by running the following command:

`$ yarn test:e2e:dit -- --browser chrome`

### Setting up users with different permissions

On CircleCi we run E2E tests against users with different permissions. We do this via the environment variable `OAUTH2_DEV_TOKEN`.
Essentially we have users with different permissions setup in a job via `OAUTH2_DEV_TOKEN` and then we run tests with the specified permissions tag.
So for setting up a test for a user of type `LEP` you need to:

- add a token to the backend with a token associated to the permissions type. e.g `lepStaffToken`
- add this token to the environment variable `OAUTH2_DEV_TOKEN` in the circleCi job
- specify which suite to use when running `cypress`. e.g `npm run yarn test:e2e:lep -- --browser chrome`

### Permission tags

There are also 3 other test suites, which run permission specs against users that have particular
permissions for their roles, you can trigger these tests by running either of the commands below:

`$ yarn test:e2e:lep -- --browser chrome`

or

`$ yarn test:e2e:da -- --browser chrome`

or

`$ yarn test:e2e:dit -- --browser chrome`

### Running the tests manually in cypress interface

`$ yarn test:e2e:watch`

### Running a specific spec

`$ yarn test:e2e:dit -- --spec test/end-to-end/cypress/specs/DIT/local-nav-spec.js`

## Visual Tests

The aim of this suite is taking screenshots from pages and comparing to baselines
to ensure consistency between builds.

### Folder structure

Screenshots will be stored in the root of the project. We commit the baselines and ignore the comparison diff images. If we need to update the baseline screenshot we need to delete the old baseline and rerun the test (it will then copy the new screenshot saved in comparison folder into the baseline folder)

```
- visual-screenshots
  - baseline
  - comparison
  - diff
```

### Browserstack environment variables

to run in browserstack, ensure you have the following environment variables set:

```
export BROWSERSTACK_USERNAME=xxx
export BROWSERSTACK_ACCESS_KEY=xxx
export IS_REMOTE=true
```

### Running the tests

After setting up the environment variables, run the following command to execute the tests:

`$ yarn test:visual`

### Updating the baseline image

Updating the baseline consists in 2 steps:

- 1:. Run the visual tests on your machine, if the baseline is no longer the correct representation of the page in test then execute step #2:

- 2:. Run `$ yarn test:visual:update` to update the failed tests with updated images of how the page in test should look like.


## Sandbox (API mocks)

Sandbox is as a light replacement for API backend and it's used only by functional tests.

### Using sandbox within docker (preferred method)

1. Clone this repo

2. `cd` into the folder you just cloned

3. Build the image:

   ```bash
   docker build -t data-hub-sandbox .
   ```

4. Start sandbox server on port `8001`:

   ```bash
   docker run -it -p 8001:8001 data-hub-sandbox
   ```

   Stop the server by pressing `CTRL`+`C`

### Additional steps if you're running sandbox with Data Hub Frontend for functional testing

1. You'll also have to run redis as the sandbox does not come with this and will throw an error on the frontend without it. So open a new terminal window and run `docker run -it -p 6379:6379 redis:3.2`

2. `cd` into your datahub-front-end folder

3. Run `yarn run develop` and you should now be all set up

4. When you make changes to the fixtures, you'll need to rebuild the docker image and then run the server again.

### Using sandbox on host machine

1. Install sandbox, for more info see [instructions](https://github.com/getsandbox/sandbox)

```bash
wget https://s3.amazonaws.com/sandbox-binaries/runtime-binary.tar \
  && tar -C /usr/local/bin -xzvf runtime-binary.tar \
  && rm runtime-binary.tar
```

2. Start sandbox on port `8001`:

   ```bash
   sandbox run --port="8001" --watch=true
   ```

### Creating Docker container for CircleCI

Docker image will be automatically rebuilt on each push.

However, you can still do this manually.

```bash
docker login # Ask webops for Docker Hub access to the ukti group.
docker build -f Dockerfile -t data-hub-sandbox .

docker tag data-hub-sandbox:latest ukti/data-hub-sandbox:latest

docker push ukti/data-hub-sandbox:latest
```

You image should be now listed at [Docker Hub](https://cloud.docker.com/u/ukti/repository/docker/ukti/data-hub-sandbox/tags).