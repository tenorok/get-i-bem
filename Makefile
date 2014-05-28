.PHONY: release

release::
	npm run make
	cp i-bem/i-bem.js .
	cp i-bem/i-bem.min.js .
