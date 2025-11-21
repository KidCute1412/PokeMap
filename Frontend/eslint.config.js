import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // Basic JavaScript rules
  js.configs.recommended,
  
  {
    // Apply to JS and JSX files
    files: ['**/*.{js,jsx}'],
    
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    
    plugins: {
      react,
      'react-hooks': reactHooks,
    },      
    
        
    // Simple, essential rules
    rules: {
      // Catch basic errors
      'no-undef': 'error',              // Undefined variables
      'no-unused-vars': 'warn',         // Unused variables  
      // 'no-console': 'warn',             // Console statements
      
      // React essentials
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error', 
      'react/react-in-jsx-scope': 'off',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];