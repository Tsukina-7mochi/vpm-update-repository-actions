import * as fs from "node:fs/promises";
import * as v from "valibot";
import * as core from "@actions/core";

import {
  InputType,
  OutputType,
  PackageManifestSchema,
  RepositoryManifestSchema,
} from "./types.ts";

export class ConflictError extends Error {
  static {
    this.prototype.name = "ConflictError";
  }
}

async function readJson<
  const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(path: string, schema: TSchema): Promise<v.InferOutput<TSchema>> {
  const content = await fs.readFile(path, { encoding: "utf-8" });
  return v.parse(schema, JSON.parse(content));
}

export async function updateRepository(input: InputType): Promise<OutputType> {
  const repo = await readJson(input.path, RepositoryManifestSchema);
  const pkg = await readJson(
    input.package,
    PackageManifestSchema,
  );

  if (!(pkg.name in repo.packages)) {
    core.info(`Creating new package entry: ${pkg.name} ${pkg.version}`);
    repo.packages[pkg.name] = {
      versions: {
        [pkg.version]: pkg,
      },
    };
  } else if (!(pkg.version in repo.packages[pkg.name].versions)) {
    core.info(`Adding new version to package: ${pkg.name} ${pkg.version}`);
    repo.packages[pkg.name].versions[pkg.version] = pkg;
  } else {
    const existing = repo.packages[pkg.name].versions[pkg.version];
    if (JSON.stringify(existing) === JSON.stringify(pkg)) {
      // deno-fmt-ignore
      core.info(`Package version is identical, no update needed: ${pkg.name} ${pkg.version}`);
      return { updated: false };
    } else if (input.onConflict === "abort") {
      core.info(`Conflict detected for package: ${pkg.name} ${pkg.version}`);
      throw new ConflictError();
    } else if (input.onConflict === "no-change") {
      // deno-fmt-ignore
      core.info(`Conflict detected, no changes made for package: ${pkg.name} ${pkg.version}`);
      return { updated: false };
    } else if (input.onConflict === "overwrite") {
      // deno-fmt-ignore
      core.info(`Conflict detected, overwriting package: ${pkg.name} ${pkg.version}`);
      repo.packages[pkg.name].versions[pkg.version] = pkg;
    } else {
      const _: never = input.onConflict;
    }
  }

  await fs.writeFile(input.path, JSON.stringify(repo, null, 2), {
    encoding: "utf-8",
  });

  return { updated: true };
}
