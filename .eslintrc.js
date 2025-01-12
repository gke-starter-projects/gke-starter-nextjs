module.exports = {
  // settings: {
  //   'import/resolver': {
  //     typescript: {}
  //   }
  // },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  globals: {
    fail: 'readonly',
  },
  extends: [
    'airbnb',
    //  "airbnb/hooks",
    'next',
    // 'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': 0,
  },
};
