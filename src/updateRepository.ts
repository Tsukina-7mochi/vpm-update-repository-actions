import * as fs from "node:fs/promises";
import * as v from "valibot";

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
    repo.packages[pkg.name] = {
      versions: {
        [pkg.version]: pkg,
      },
    };
  } else if (!(pkg.version in repo.packages[pkg.name].versions)) {
    repo.packages[pkg.name].versions[pkg.version] = pkg;
  } else {
    const existing = repo.packages[pkg.name].versions[pkg.version];
    if (JSON.stringify(existing) === JSON.stringify(pkg)) {
      console.log("no change");
      return { updated: false };
    } else if (input.onConflict === "abort") {
      console.log("abort");
      throw new ConflictError();
    } else if (input.onConflict === "no-change") {
      console.log("ignore change");
      return { updated: false };
    }
  }

  await fs.writeFile(input.path, JSON.stringify(repo, null, 2), {
    encoding: "utf-8",
  });

  return { updated: true };
}
