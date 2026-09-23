import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";

type WorkflowStep = {
  name?: string;
  uses?: string;
  run?: string;
  if?: string;
  with?: Record<string, unknown>;
  "continue-on-error"?: boolean;
};

type WorkflowJob = {
  name?: string;
  "runs-on"?: string;
  steps?: WorkflowStep[];
};

type Workflow = {
  name?: string;
  on?: Record<string, unknown>;
  jobs?: Record<string, WorkflowJob>;
};

const repositoryRoot = resolve(import.meta.dir, "..");
const workflowPath = resolve(repositoryRoot, ".github/workflows/main.yml");
const workflow = Bun.YAML.parse(await Bun.file(workflowPath).text()) as Workflow;
const qualityJob = workflow.jobs?.["quality-check"];
const steps = qualityJob?.steps ?? [];

function stepNamed(name: string): WorkflowStep {
  const step = steps.find((candidate) => candidate.name === name);
  expect(step, `Expected the workflow to contain the ${name} step`).toBeDefined();
  return step!;
}

describe("Bun React Dev CI workflow", () => {
  test("runs for pushes and pull requests to main and supports manual runs", () => {
    expect(workflow.name).toBe("Bun React Dev CI");
    expect(Object.keys(workflow.on ?? {}).sort()).toEqual([
      "pull_request",
      "push",
      "workflow_dispatch",
    ]);
    expect(workflow.on?.push).toEqual({ branches: ["main"] });
    expect(workflow.on?.pull_request).toEqual({ branches: ["main"] });
    expect(workflow.on).toHaveProperty("workflow_dispatch", null);
  });

  test("defines one Linux quality job", () => {
    expect(Object.keys(workflow.jobs ?? {})).toEqual(["quality-check"]);
    expect(qualityJob).toMatchObject({
      name: "Code Quality & Build",
      "runs-on": "ubuntu-latest",
    });
  });

  test("keeps the quality gates in dependency-to-artifact order", () => {
    expect(steps.map((step) => step.name)).toEqual([
      "Checkout Repository",
      "Setup Bun",
      "Cache Bun Dependencies",
      "Install Dependencies",
      "Type Check",
      "Build Project",
      "Upload Build Output",
    ]);
    expect(new Set(steps.map((step) => step.name)).size).toBe(steps.length);
  });

  test("uses the intended versioned actions and Bun setup", () => {
    expect(stepNamed("Checkout Repository").uses).toBe("actions/checkout@v4");
    expect(stepNamed("Setup Bun")).toMatchObject({
      uses: "oven-sh/setup-bun@v2",
      with: { "bun-version": "latest" },
    });
    expect(stepNamed("Cache Bun Dependencies").uses).toBe("actions/cache@v4");
    expect(stepNamed("Upload Build Output").uses).toBe(
      "actions/upload-artifact@v4",
    );
  });

  test("installs reproducibly before type-checking and building", () => {
    expect(stepNamed("Install Dependencies").run).toBe(
      "bun install --frozen-lockfile",
    );
    expect(stepNamed("Type Check").run).toBe("bunx tsc --noEmit");
    expect(stepNamed("Build Project").run).toBe("bun run build");
  });

  test("caches Bun dependencies with an operating-system-specific fallback", () => {
    expect(stepNamed("Cache Bun Dependencies").with).toEqual({
      path: "~/.bun/install/cache",
      key: "${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}",
      "restore-keys": "${{ runner.os }}-bun-\n",
    });
  });

  test("uploads only the successful production build for three days", async () => {
    const packageJson = await Bun.file(
      resolve(repositoryRoot, "package.json"),
    ).json();
    const buildCommand = packageJson.scripts?.build as string | undefined;
    const configuredOutputDirectory = buildCommand?.match(/--outdir=([^\s]+)/)?.[1];
    const uploadStep = stepNamed("Upload Build Output");

    expect(configuredOutputDirectory).toBe("dist");
    expect(uploadStep.if).toBe("success()");
    expect(uploadStep.with).toEqual({
      name: "production-build",
      path: `${configuredOutputDirectory}/`,
      "retention-days": 3,
    });
  });

  test("does not weaken failures or use privileged pull-request execution", () => {
    expect(workflow.on).not.toHaveProperty("pull_request_target");
    expect(steps.some((step) => step["continue-on-error"] === true)).toBeFalse();
  });
});
