module.exports = {
    root: true,
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    'env': {
        'browser': true,
        'node': true,
        'es6': true
    },
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
        'no-unused-vars': 'warn',
        'object-curly-spacing': ['error', 'always']
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: ['error', 4]
            }
        },
        {
            files: ['*.js'],
            rules: {
                indent: ['error', 4]
            }
        }

    ]
}