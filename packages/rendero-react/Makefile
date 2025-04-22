clean:
	rm -rf ./dist

lint:
	pnpm lint

test:
	pnpm test

build:
	pnpm build

publish:
	pnpm publish --access public

release: clean lint test build publish