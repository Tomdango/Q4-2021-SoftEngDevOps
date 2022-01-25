
activate-virtualenv:
	. venv/bin/activate

start-api: activate-virtualenv
	python -m api.app

start-ui:
	cd ui && yarn start
