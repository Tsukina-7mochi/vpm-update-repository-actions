# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

A GitHub Action that updates VPM (VRChat Package Manager) repository manifests
by adding or updating package entries.

## Architecture

This is a Deno-based GitHub Action that:

1. Takes inputs: `path` (repository manifest path), `package` (package.json
   path), `on-conflict` (overwrite/abort/no-change)
2. Parses and validates both manifests using Valibot schemas
3. Updates the repository manifest with the package version
4. Outputs `updated` boolean indicating if changes were made

**Key files:**

- `src/main.ts` - Action entry point, parses GitHub Action inputs via
  `@actions/core`
- `src/updateRepository.ts` - Core logic for updating repository manifest
- `src/types.ts` - Valibot schemas for VPM package and repository manifests
- `build.ts` - esbuild configuration for bundling
- `action.yml` - GitHub Action definition

**Schema structure:**

- `PackageManifestSchema` - Unity package.json format (name, version,
  dependencies, etc.)
- `RepositoryManifestSchema` - VPM repository format with nested packages and
  versions
