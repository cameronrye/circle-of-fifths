const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module', // Use module for ES6 imports/exports
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                alert: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                location: 'readonly',
                history: 'readonly',
                CustomEvent: 'readonly',
                KeyboardEvent: 'readonly',
                MouseEvent: 'readonly',
                Event: 'readonly',
                EventTarget: 'readonly',
                Element: 'readonly',
                HTMLElement: 'readonly',
                Node: 'readonly',
                NodeList: 'readonly',
                fetch: 'readonly',
                Request: 'readonly',
                Response: 'readonly',
                Headers: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                performance: 'readonly',
                matchMedia: 'readonly',

                // Web Audio API
                AudioContext: 'readonly',
                webkitAudioContext: 'readonly',

                // Service Worker globals
                self: 'readonly',
                caches: 'readonly',
                clients: 'readonly',
                registration: 'readonly',
                skipWaiting: 'readonly',

                // Custom globals from the application (allow redefinition)
                CircleOfFifthsApp: 'writable',
                circleOfFifthsApp: 'writable',
                AudioEngine: 'writable',
                CircleRenderer: 'writable',
                InteractionsHandler: 'writable',
                MusicTheory: 'writable',
                ThemeManager: 'writable',
                ThemeToggle: 'writable',

                // Node.js globals for test files
                module: 'readonly',
                require: 'readonly',
                exports: 'writable',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                global: 'readonly'
            }
        },
        rules: {
            // Code quality
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            'no-console': 'off', // Allow console for this educational app
            'no-debugger': 'error',
            'no-alert': 'warn',

            // Best practices
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'prefer-promise-reject-errors': 'error',
            radix: 'error',
            yoda: 'error',

            // Variables
            'no-delete-var': 'error',
            'no-label-var': 'error',
            'no-restricted-globals': ['error', 'event'],
            'no-shadow': 'error',
            'no-shadow-restricted-names': 'error',
            'no-undef': 'error',
            'no-undef-init': 'error',
            'no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: true,
                    variables: true
                }
            ],
            'no-redeclare': ['error', { builtinGlobals: false }],

            // Stylistic
            'array-bracket-spacing': ['error', 'never'],
            'block-spacing': ['error', 'always'],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'comma-dangle': ['error', 'never'],
            'comma-spacing': ['error', { before: false, after: true }],
            'comma-style': ['error', 'last'],
            'computed-property-spacing': ['error', 'never'],
            'eol-last': ['error', 'always'],
            'func-call-spacing': ['error', 'never'],
            // indent: ['error', 4, { SwitchCase: 1 }], // Disabled - handled by Prettier
            'key-spacing': ['error', { beforeColon: false, afterColon: true }],
            'keyword-spacing': ['error', { before: true, after: true }],
            'linebreak-style': ['error', 'unix'],
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            'no-trailing-spaces': 'error',
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'semi-spacing': ['error', { before: false, after: true }],
            'space-before-blocks': ['error', 'always'],
            // 'space-before-function-paren': ['error', 'never'], // Disabled - handled by Prettier
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': 'error',
            'space-unary-ops': ['error', { words: true, nonwords: false }]
        }
    },
    {
        // Specific rules for test files
        files: ['tests/**/*.js', '**/test*.js', '**/*.test.js'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                // Test framework globals
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly'
            }
        },
        rules: {
            'no-console': 'off'
        }
    },
    {
        // Specific rules for visual test files
        files: ['tests/visual/**/*.js'],
        languageOptions: {
            globals: {
                // Browser globals for visual tests
                getComputedStyle: 'readonly'
            }
        }
    },
    {
        // Specific rules for service worker files
        files: ['sw.js', '**/sw.js', '**/*worker*.js'],
        languageOptions: {
            globals: {
                // Service Worker specific globals
                importScripts: 'readonly',
                WorkerGlobalScope: 'readonly',
                ServiceWorkerGlobalScope: 'readonly',
                ExtendableEvent: 'readonly',
                FetchEvent: 'readonly',
                InstallEvent: 'readonly',
                ActivateEvent: 'readonly',
                MessageEvent: 'readonly',
                NotificationEvent: 'readonly',
                PushEvent: 'readonly',
                SyncEvent: 'readonly'
            }
        },
        rules: {
            'no-restricted-globals': 'off' // Allow service worker globals
        }
    },
    {
        // Ignore patterns
        ignores: ['node_modules/**', 'dist/**', 'build/**', '*.min.js']
    }
];
