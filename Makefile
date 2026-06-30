ifneq (,$(wildcard .env))
include .env
export
endif

NETWORK ?= testnet
SOURCE ?= $(SECRET_KEY)
CONTRACT_ID ?= CCZBRUVFYUBH7DMWCQFL7LYO2V5UNVPSI2HAK7HCJA3IWCEE2QGFO5ZA
override CARGO_TARGET_DIR := target
WASM ?= $(CARGO_TARGET_DIR)/wasm32v1-none/release/funding_agreement.wasm
BINDINGS_DIR ?= frontend/contracts/funding-agreement
export CARGO_TARGET_DIR

OWNER_ADDRESS ?= $(PUBLIC_KEY)
FACTORY ?= $(OWNER_ADDRESS)
FUNDER ?= $(OWNER_ADDRESS)
GRANTEE ?= $(OWNER_ADDRESS)
ARBITER ?= $(OWNER_ADDRESS)
SETTLEMENT_ADAPTER ?= $(OWNER_ADDRESS)
METADATA_URI ?= ipfs://agreement
CONFIG ?= {"version":1,"settlement_adapter":"$(SETTLEMENT_ADAPTER)","allow_partial_completion":false,"requires_all_milestones":true}
MILESTONES ?= [["100","ipfs://milestone-0"],["250","ipfs://milestone-1"]]

ID ?= 0
ROLE ?=
NEW_ADDRESS ?=
URI ?=
METHOD ?= get_version
ACTION ?= Activate
ARGS ?=

.PHONY: help test fmt build bindings deploy new-agreement invoke invoke-send init check-init-env \
	get-agreement get-config get-status get-metadata get-milestones get-milestone get-participants \
	activate pause resume cancel complete archive submit-milestone approve-milestone reject-milestone complete-milestone \
	update-metadata transfer-role has-role can-execute

help:
	@echo "Funding Agreement commands"
	@echo ""
	@echo "Build and deploy:"
	@echo "  make test"
	@echo "  make fmt"
	@echo "  make build"
	@echo "  make bindings"
	@echo "  make deploy NETWORK=testnet"
	@echo "  make new-agreement NETWORK=testnet"
	@echo ""
	@echo "Generic invoke:"
	@echo "  make invoke CONTRACT_ID=C... METHOD=get_status"
	@echo "  make invoke CONTRACT_ID=C... METHOD=get_milestone ARGS='--id 0'"
	@echo ""
	@echo "Initialize:"
	@echo "  make init                 # uses OWNER_ADDRESS or PUBLIC_KEY from .env"
	@echo "  make init OWNER_ADDRESS=G... # override participant addresses for local testing"
	@echo ""
	@echo "Common queries:"
	@echo "  make get-agreement CONTRACT_ID=C..."
	@echo "  make get-config CONTRACT_ID=C..."
	@echo "  make get-status CONTRACT_ID=C..."
	@echo "  make get-metadata CONTRACT_ID=C..."
	@echo "  make get-milestone CONTRACT_ID=C... ID=0"
	@echo ""
	@echo "Lifecycle:"
	@echo "  make activate CONTRACT_ID=C..."
	@echo "  make submit-milestone CONTRACT_ID=C... ID=0"
	@echo "  make approve-milestone CONTRACT_ID=C... ID=0"
	@echo "  make complete-milestone CONTRACT_ID=C... ID=0"

test:
	cargo test --offline

fmt:
	cargo fmt

build:
	stellar contract build

bindings: build
	stellar contract bindings typescript \
		--wasm "$(WASM)" \
		--output-dir "$(BINDINGS_DIR)" \
		--overwrite

deploy: build
	@stellar contract deploy \
		--wasm "$(WASM)" \
		--source "$(SOURCE)" \
		--network "$(NETWORK)"

new-agreement: deploy
	@echo "Copy the new contract id above into:"
	@echo "  CONTRACT_ID=..."
	@echo "  frontend/.env.local: NEXT_PUBLIC_FUNDING_AGREEMENT_CONTRACT_ID=..."
	@echo "Then initialize it with:"
	@echo "  make init CONTRACT_ID=C..."

invoke:
	@stellar contract invoke \
		--id "$(CONTRACT_ID)" \
		--source "$(SOURCE)" \
		--network "$(NETWORK)" \
		-- "$(METHOD)" $(ARGS)

invoke-send:
	@stellar contract invoke \
		--id "$(CONTRACT_ID)" \
		--source "$(SOURCE)" \
		--network "$(NETWORK)" \
		--send=yes \
		-- "$(METHOD)" $(ARGS)

check-init-env:
	@$(if $(strip $(SOURCE)),rem SOURCE ok,echo Missing SECRET_KEY in .env or SOURCE=... & exit /b 1)
	@$(if $(strip $(CONTRACT_ID)),rem CONTRACT_ID ok,echo Missing CONTRACT_ID in .env or CONTRACT_ID=... & exit /b 1)
	@$(if $(strip $(OWNER_ADDRESS)),rem OWNER_ADDRESS ok,echo Missing PUBLIC_KEY in .env or OWNER_ADDRESS=G... & exit /b 1)

init: check-init-env
	@stellar contract invoke \
		--id "$(CONTRACT_ID)" \
		--source "$(SOURCE)" \
		--network "$(NETWORK)" \
		--send=yes \
		-- initialize \
		--factory "$(FACTORY)" \
		--funder "$(FUNDER)" \
		--grantee "$(GRANTEE)" \
		--arbiter "$(ARBITER)" \
		--metadata_uri "$(METADATA_URI)" \
		--config '$(CONFIG)' \
		--milestones '$(MILESTONES)'

get-agreement:
	@$(MAKE) invoke METHOD=get_agreement

get-config:
	@$(MAKE) invoke METHOD=get_config

get-status:
	@$(MAKE) invoke METHOD=get_status

get-metadata:
	@$(MAKE) invoke METHOD=get_metadata

get-milestones:
	@$(MAKE) invoke METHOD=get_milestones

get-milestone:
	@$(MAKE) invoke METHOD=get_milestone ARGS="--id $(ID)"

get-participants:
	@$(MAKE) invoke METHOD=get_participants

activate:
	@$(MAKE) invoke-send METHOD=activate

pause:
	@$(MAKE) invoke-send METHOD=pause

resume:
	@$(MAKE) invoke-send METHOD=resume

cancel:
	@$(MAKE) invoke-send METHOD=cancel

complete:
	@$(MAKE) invoke-send METHOD=complete

archive:
	@$(MAKE) invoke-send METHOD=archive

submit-milestone:
	@$(MAKE) invoke-send METHOD=submit_milestone ARGS="--id $(ID)"

approve-milestone:
	@$(MAKE) invoke-send METHOD=approve_milestone ARGS="--id $(ID)"

reject-milestone:
	@$(MAKE) invoke-send METHOD=reject_milestone ARGS="--id $(ID)"

complete-milestone:
	@$(MAKE) invoke-send METHOD=complete_milestone ARGS="--id $(ID)"

update-metadata:
	@$(MAKE) invoke-send METHOD=update_metadata ARGS="--metadata_uri $(URI)"

transfer-role:
	@$(MAKE) invoke-send METHOD=transfer_role ARGS="--role $(ROLE) --new_address $(NEW_ADDRESS)"

has-role:
	@$(MAKE) invoke METHOD=has_role ARGS="--address $(NEW_ADDRESS) --role $(ROLE)"

can-execute:
	@$(MAKE) invoke METHOD=can_execute ARGS="--action $(ACTION) --address $(NEW_ADDRESS)"
