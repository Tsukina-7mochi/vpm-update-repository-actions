import * as v from "valibot";

export const InputSchema = v.object({
  path: v.string(),
  package: v.string(),
  onConflict: v.picklist(["ovrewrite", "abort", "no-change"] as const),
});
export type InputType = v.InferOutput<typeof InputSchema>;

export type OutputType = {
  updated: boolean;
};

export const PackageManifestSchema = v.object({
  name: v.string(),
  version: v.string(),
  displayName: v.string(),
  url: v.string(),
  vpmDependencies: v.record(v.string(), v.string()),
  author: v.object({
    name: v.string(),
    email: v.string(),
    url: v.optional(v.string()),
  }),

  description: v.optional(v.string()),
  unity: v.optional(v.string()),
  unityRelease: v.optional(v.string()),
  dependencies: v.optional(v.record(v.string(), v.string())),
  keywords: v.optional(v.array(v.string())),
  type: v.optional(v.string()),
  legacyFolders: v.optional(v.string()),
  legacyFiles: v.optional(v.string()),
  legacyPackages: v.optional(v.string()),
  zipSHA256: v.optional(v.string()),
  changeLogUrl: v.optional(v.string()),
});

export const RepositoryManifestSchema = v.object({
  name: v.string(),
  author: v.string(),
  id: v.string(),
  url: v.string(),
  packages: v.record(
    v.string(),
    v.object({
      versions: v.record(v.string(), PackageManifestSchema),
    }),
  ),
});
