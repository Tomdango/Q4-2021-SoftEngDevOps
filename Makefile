
activate-virtualenv:
	. venv/bin/activate

start-api: activate-virtualenv
	python -m api.app

start-ui:
	cd ui && yarn start

build-ui:
	cd ui && rm -rf build/ && yarn build
	rm -rf api/public/
	cp -r ui/build/ api/public
