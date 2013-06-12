all: lint test

bench:
	@node tools/benchmark

lint:
	@./node_modules/.bin/jshint --show-non-errors --config .jshintrc **/*.js

test:
	@./node_modules/.bin/mocha --reporter spec

.PHONY: test
