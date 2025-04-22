install:
	pnpm install

lint:
	pnpm lint

test:
	pnpm test

build-core:
	pnpm build:core

build-react:
	pnpm build:react

build: build-core build-react

release-core: 
	pnpm release:core

release-react: 
	pnpm release:react

dev:
	pnpm dev