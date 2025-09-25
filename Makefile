# Circle of Fifths - NPM Scripts Makefile
# Cross-platform Makefile that wraps npm scripts for convenience
# Similar to traditional make help functionality

.PHONY: help dev test build clean lint format install

# Default target
.DEFAULT_GOAL := help

# Colors for output (works on most terminals)
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m
BOLD := \033[1m

help: ## Show this help message
	@echo "$(BOLD)$(CYAN)Circle of Fifths - Available Commands$(RESET)"
	@echo "$(CYAN)=====================================$(RESET)"
	@echo ""
	@echo "$(BOLD)Development:$(RESET)"
	@echo "  $(GREEN)make dev$(RESET)      Start development server"
	@echo "  $(GREEN)make serve$(RESET)    Start development server (alias)"
	@echo ""
	@echo "$(BOLD)Testing:$(RESET)"
	@echo "  $(GREEN)make test$(RESET)     Run all tests"
	@echo "  $(GREEN)make test-unit$(RESET) Run unit tests only"
	@echo "  $(GREEN)make test-ci$(RESET)  Run tests for CI (with bail)"
	@echo "  $(GREEN)make test-watch$(RESET) Run tests in watch mode"
	@echo ""
	@echo "$(BOLD)Code Quality:$(RESET)"
	@echo "  $(GREEN)make lint$(RESET)     Run ESLint"
	@echo "  $(GREEN)make lint-fix$(RESET) Run ESLint and fix issues"
	@echo "  $(GREEN)make format$(RESET)   Format code with Prettier"
	@echo ""
	@echo "$(BOLD)Build & Deploy:$(RESET)"
	@echo "  $(GREEN)make build$(RESET)    Full build (lint + format + test)"
	@echo "  $(GREEN)make validate$(RESET) Validate codebase"
	@echo ""
	@echo "$(BOLD)Utilities:$(RESET)"
	@echo "  $(GREEN)make install$(RESET)  Install dependencies"
	@echo "  $(GREEN)make clean$(RESET)    Clean node_modules and reinstall"
	@echo "  $(GREEN)make npm-help$(RESET) Show detailed npm scripts help"
	@echo ""
	@echo "$(YELLOW)Usage: make <command>$(RESET)"
	@echo "$(YELLOW)Example: make dev$(RESET)"

# Development commands
dev: ## Start development server
	npm run dev

serve: ## Start development server (alias for dev)
	npm run serve

# Testing commands
test: ## Run all tests
	npm run test

test-unit: ## Run unit tests only
	npm run test:unit

test-integration: ## Run integration tests only
	npm run test:integration

test-all: ## Run all tests (unit + integration)
	npm run test:all

test-ci: ## Run tests for CI (with bail on first failure)
	npm run test:ci

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

# Code quality commands
lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint and automatically fix issues
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check if code is properly formatted
	npm run format:check

# Build commands
build: ## Full build: lint + format check + test
	npm run build

build-production: ## Production build
	npm run build:production

validate: ## Validate codebase (same as build)
	npm run validate

precommit: ## Run pre-commit checks
	npm run precommit

# Utility commands
install: ## Install dependencies
	npm install

clean: ## Clean node_modules and reinstall dependencies
	@echo "$(YELLOW)Cleaning node_modules...$(RESET)"
	rm -rf node_modules package-lock.json
	@echo "$(YELLOW)Reinstalling dependencies...$(RESET)"
	npm install
	@echo "$(GREEN)Dependencies reinstalled successfully!$(RESET)"

npm-help: ## Show detailed npm scripts help
	npm run help

# Component-specific test commands
test-music-theory: ## Run MusicTheory component tests
	npm run test:music-theory

test-audio-engine: ## Run AudioEngine component tests
	npm run test:audio-engine

test-theme-manager: ## Run ThemeManager component tests
	npm run test:theme-manager

test-circle-renderer: ## Run CircleRenderer component tests
	npm run test:circle-renderer

test-theme-system: ## Run theme system tests
	npm run test:theme-system

test-accessibility: ## Run accessibility tests
	npm run test:accessibility

test-performance: ## Run performance tests
	npm run test:performance

# Advanced help - show all available targets
help-all: ## Show all available make targets (including component tests)
	@echo "$(BOLD)$(CYAN)All Available Make Targets:$(RESET)"
	@echo "$(CYAN)============================$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)make %-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
