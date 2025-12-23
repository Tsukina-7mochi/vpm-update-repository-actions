# Update VPM Repository

A GitHub Action that updates VPM (VRChat Package Manager) repository manifests by adding or updating package entries.

## Usage

```yaml
- uses: your-username/vpm-update-repository-actions@v0.1
  with:
    path: ./vpm-repository.json
    package: ./Packages/com.example.package/package.json
    on-conflict: overwrite
```

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `path` | Yes | Path to repository manifest file |
| `package` | Yes | Path to package manifest file (`package.json`) |
| `on-conflict` | Yes | Action when version exists: `overwrite`, `abort`, or `no-change` |

## Outputs

| Output | Description |
|--------|-------------|
| `updated` | Whether the repository was updated |

## Development

This action is built with Deno and uses esbuild for bundling.

```bash
# Build the action
deno task build
```

## License

MIT
