import * as core from "@actions/core";
import * as v from "valibot";

import { InputSchema } from "./types.ts";
import { updateRepository } from "./updateRepository.ts";

async function main() {
  try {
    const input = v.parse(InputSchema, {
      path: core.getInput("path"),
      package: core.getInput("package"),
      onConflict: core.getInput("on-conflict"),
    });

    const output = await updateRepository(input);

    core.setOutput("updated", output.updated);
  } catch (e) {
    if (e instanceof v.ValiError) {
      core.setFailed(e.message);
    } else {
      throw e;
    }
  }
}

main();
