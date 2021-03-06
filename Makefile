docker-base = docker-compose -p dh -f docker-compose.base.yml
docker-mock = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.mock.yml
docker-e2e = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.e2e.yml -f docker-compose.services.yml
docker-dev = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.e2e.yml -f docker-compose.dev.yml

wait-for-frontend = dockerize -wait tcp://localhost:3000/healthcheck -timeout 5m -wait-retry-interval 5s

ifdef CI
	start-command = up --build --force-recreate -d
	cypress-args = -- --parallel --record --key $(CYPRESS_DASHBOARD_KEY) --ci-build-id $(CIRCLE_BUILD_NUM)
else
	start-command = up --build --force-recreate
	cypress-args =
endif

# Helper commands to execute docker-compose for a specific setup
# e.g. "`make base` logs"
base:
	@echo $(docker-base)
mock:
	@echo $(docker-mock)
e2e:
	@echo $(docker-e2e)
dev:
	@echo $(docker-dev)

start-base:
	@echo "*** To stop this stack run 'make stop-base' ***"
	$(docker-base) $(start-command)
start-mock:
	@echo "*** To stop this stack run 'make stop-mock' ***"
	$(docker-mock) $(start-command)
start-e2e-lep:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	OAUTH2_DEV_TOKEN=lepStaffToken $(docker-e2e) $(start-command)
start-e2e-da:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	OAUTH2_DEV_TOKEN=daStaffToken $(docker-e2e) $(start-command)
start-e2e-dit:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	OAUTH2_DEV_TOKEN=ditStaffToken $(docker-e2e) $(start-command)
start-dev:
	@echo "*** To stop this stack run 'make stop-dev' ***"
	$(docker-dev) $(start-command)

stop-base:
	$(docker-base) down -v --remove-orphans
stop-mock:
	$(docker-mock) down -v --remove-orphans
stop-e2e:
	$(docker-e2e) down -v --remove-orphans
stop-dev:
	$(docker-dev) down -v --remove-orphans

lint:
	$(docker-base) build frontend
	$(docker-base) run --no-deps --rm frontend bash -c 'mkdir -p reports && npm run lint:sass && npm run lint:js -- --format junit --output-file reports/eslint.xml'

unit-tests:
	$(docker-base) build frontend
ifdef CI
	$(docker-base) run --no-deps --rm frontend bash -c 'npx nyc --reporter=lcov --reporter=json --report-dir=coverage npm run test:unit -- --reporter mocha-circleci-reporter'
else
	$(docker-base) run --no-deps --rm frontend bash -c 'npm run test:unit'
endif

unit-client-tests:
	$(docker-base) build frontend
	$(docker-base) run --no-deps --rm frontend bash -c 'npm run test:unit-client -- --reporter mocha-circleci-reporter'

functional-tests:
	@echo "*** Requires the mock stack, it can be started with 'make start-mock' ***"
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && npm run test:functional $(cypress-args)'

visual-tests:
	@echo "*** Requires the mock stack, it can be started with 'make start-mock' ***"
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && npm run test:visual'

e2e-tests-lep:
	@echo "*** Requires the e2e stack with the LEP role, it can be started with 'make start-e2e-lep' ***"
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:lep $(cypress-args)'

e2e-tests-da:
	@echo "*** Requires the e2e stack with the DA role, it can be started with 'make start-e2e-da' ***"
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:da $(cypress-args)'

e2e-tests-dit:
	@echo "*** Requires the e2e stack with the DIT role, it can be started with 'make start-e2e-dit' ***"
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:dit $(cypress-args)'

clean:
	make stop-base
	make stop-mock
	make stop-e2e
	make stop-dev
