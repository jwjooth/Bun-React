import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";

interface WorkflowStep {
  name: string;
  uses?: string;
  run?: string;
  if?: string;
  with?: Record<string, unknown>;
}

interface WorkflowJob {
  name: string;
  "runs-on": string;
  steps: WorkflowStep[];
}

interface Workflow {
  name: string;
  on: {
    push: { branches: string[] };
    pull_request: { branches: string[] };
    workflow_dispatch: null | Record<string, unknown>;
  };
  jobs: Record<string, WorkflowJob>;
}

const repositoryRoot = resolve(import.meta.dir, "..");
const workflowPath = resolve(repositoryRoot, ".github/workflows/main.yml");
const workflow = Bun.YAML.parse(
  await Bun.file(workflowPath).text(),
) as Workflow;

function qualityCheckJob(): WorkflowJob {
  const job = workflow.jobs["quality-check"];
  expect(job).toBeDefined();
  return job!;
}

function stepNamed(name: string): WorkflowStep {
  const step = qualityCheckJob().steps.find((candidate) => candidate.name === name);
  expect(step).toBeDefined();
  return step!;
}

describe("Bun React development workflow", () => {
  test("runs for main branch changes and supports manual dispatch", () => {
    expect(workflow.on.push.branches).toEqual(["main"]);
    expect(workflow.on.pull_request.branches).toEqual(["main"]);
    expect(workflow.on).toHaveProperty("workflow_dispatch");
  });

  test("defines one quality gate on the expected runner", () => {
    expect(workflow.name).toBe("Bun React Dev CI");
    expect(Object.keys(workflow.jobs)).toEqual(["quality-check"]);
    expect(qualityCheckJob()).toMatchObject({
      name: "Code Quality & Build",
      "runs-on": "ubuntu-latest",
    });
  });

  test("checks out the repository and installs Bun before running commands", () => {
    const steps = qualityCheckJob().steps;

    expect(steps[0]).toMatchObject({
      name: "Checkout Repository",
      uses: "actions/checkout@v4",
    });
    expect(steps[1]).toMatchObject({
      name: "Setup Bun",
      uses: "oven-sh/setup-bun@v2",
      with: { "bun-version": "latest" },
    });
  });

  test("uses the frozen lockfile before type-checking and building", () => {
    const commandSteps = qualityCheckJob().steps
      .filter((step) => step.run !== undefined)
      .map((step) => ({ name: step.name, run: step.run }));

    expect(commandSteps).toEqual([
      { name: "Install Dependencies", run: "bun install --frozen-lockfile" },
      { name: "Type Check", run: "bunx tsc --noEmit" },
      { name: "Build Project", run: "bun run build" },
    ]);
  });

  test("keys the Bun dependency cache from a committed lockfile", async () => {
    const cacheStep = stepNamed("Cache Bun Dependencies");
    expect(cacheStep).toMatchObject({
      uses: "actions/cache@v4",
      with: { path: "~/.bun/install/cache" },
    });

    const cacheKey = String(cacheStep.with?.key ?? "");
    const lockfilePatterns = Array.from(
      cacheKey.matchAll(/hashFiles\((['"])(.*?)\1\)/g),
      (match) => match[2]!,
    );
    expect(lockfilePatterns.length).toBeGreaterThan(0);

    const matchedLockfiles = (
      await Promise.all(
        lockfilePatterns.map((pattern) =>
          Array.fromAsync(
            new Bun.Glob(pattern).scan({
              cwd: repositoryRoot,
              onlyFiles: true,
            }),
          ),
        ),
      )
    ).flat();

    expect(matchedLockfiles).toContain("bun.lock");
  });

  test("uploads the production build only after successful checks", () => {
    expect(stepNamed("Upload Build Output")).toMatchObject({
      if: "success()",
      uses: "actions/upload-artifact@v4",
      with: {
        name: "production-build",
        path: "dist/",
        "retention-days": 3,
      },
    });
  });
});
