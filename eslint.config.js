import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'build'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/legacy/**',
      // TEMPORARY: node-based UI still on url-safe-bitpacking, removed with the rewrite
      'src/App.tsx',
      'src/Components/TextInput.tsx',
      'src/Components/icon/SymbolRenderer.tsx',
      'src/Components/inputs/HardcodedNumber.tsx',
      'src/Components/inputs/NumericInput.tsx',
      'src/Components/lib/textHelpers.ts',
      'src/Components/pdf/usePDFData.ts',
      'src/applet/Applet.tsx',
      'src/applet/utils.ts',
      'src/method/InputView.tsx',
      'src/method/renderers/MethodFlatRenderer.tsx',
      'src/method/renderers/MethodOptionsGrid.tsx',
      'src/method/renderers/MethodValue.tsx',
      'src/method/renderers/methodType.ts',
      'src/method/specificInputs/InputMethodsComponent.tsx',
      'src/method/specificInputs/MethodAlgorithmDefinition.tsx',
      'src/method/specificInputs/NameEditor.tsx',
      'src/method/specificInputs/NumericInputDefinitions.tsx',
      'src/method/specificInputs/SpecificNodeUI.tsx',
      'src/state/methodStore.ts',
      'src/urlBitPacking/NodeUI.tsx',
      'src/urlBitPacking/nodeProps.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'url-safe-bitpacking', message: 'Only src/legacy may use the old codec.' }] },
      ],
    },
  },
)
