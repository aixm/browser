import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import angular from "angular-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["projects/**/*", "**/dist", "**/docker", "**/node_modules", "**/.angular"]),
    {
        files: ["**/*.ts"],

        extends: [
            ...compat.extends(
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
            ),
            ...angular.configs.tsRecommended,
        ],

        processor: angular.processInlineTemplates,

        rules: {
            "@angular-eslint/directive-selector": ["error", {
                type: "attribute",
                prefix: "app",
                style: "camelCase",
            }],

            "@angular-eslint/component-selector": ["error", {
                type: "element",
                prefix: "app",
                style: "kebab-case",
            }],

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",

            // All components explicitly use ChangeDetectionStrategy.Eager (pre-v22 default,
            // set by the Angular v22 ng update migration) pending a dedicated OnPush migration.
            "@angular-eslint/prefer-on-push-component-change-detection": "off",
        },
    },
    {
        files: ["**/*.html"],

        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],

        rules: {},
    },
]);
