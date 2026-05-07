#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const rawArgs = process.argv.slice(2);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const hasFlag = (flag) => rawArgs.includes(flag);

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const printUsage = () => {
  console.log(
    [
      'Usage: node scripts/promoteProdWorkflow.mjs [options]',
      '',
      'Options:',
      '  --repo <owner/name>        GitHub repository (default: Wroblewski-Patryk/Soar)',
      '  --workflow <file>          Workflow file name (default: promote-prod.yml)',
      '  --ref <ref>                Git ref to dispatch (default: main)',
      '  --dispatch                Dispatch the workflow before checking status',
      '  --wait-seconds <number>   Wait for latest run after dispatch/status (default: 30)',
      '  --interval-seconds <num>  Poll interval (default: 5)',
      '  --dry-run                 Print planned action without GitHub mutation',
      '  --help                    Show this message',
      '',
      'Auth:',
      '  Uses GITHUB_TOKEN, GH_TOKEN, or git credential fill for github.com.',
      '  Token values are never printed.',
    ].join('\n')
  );
};

const resolveOptions = () => ({
  repo: readArgValue('--repo') || process.env.PROMOTE_PROD_REPO || 'Wroblewski-Patryk/Soar',
  workflow:
    readArgValue('--workflow') || process.env.PROMOTE_PROD_WORKFLOW || 'promote-prod.yml',
  ref: readArgValue('--ref') || process.env.PROMOTE_PROD_REF || 'main',
  dispatch: hasFlag('--dispatch'),
  dryRun: hasFlag('--dry-run'),
  waitSeconds: toPositiveInteger(
    readArgValue('--wait-seconds') || process.env.PROMOTE_PROD_WAIT_SECONDS,
    30
  ),
  intervalSeconds: toPositiveInteger(
    readArgValue('--interval-seconds') || process.env.PROMOTE_PROD_INTERVAL_SECONDS,
    5
  ),
});

const resolveToken = () => {
  const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  if (envToken.trim()) return envToken.trim();

  const result = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n',
    encoding: 'utf8',
    windowsHide: true,
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || 'unknown git credential helper error';
    throw new Error(`Could not read GitHub credential helper token: ${stderr}`);
  }

  const passwordLine = result.stdout
    .split(/\r?\n/)
    .find((line) => line.startsWith('password='));
  const token = passwordLine?.slice('password='.length).trim() ?? '';
  if (!token) {
    throw new Error('No GitHub token returned by GITHUB_TOKEN, GH_TOKEN, or git credential helper.');
  }
  return token;
};

const githubFetch = async (url, { token, method = 'GET', body = null } = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body,
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 500) };
  }

  if (!response.ok) {
    const message = payload?.message || payload?.raw || response.statusText;
    throw new Error(`GitHub ${method} ${url} failed with HTTP ${response.status}: ${message}`);
  }

  return payload;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const summarizeAnnotation = (annotation) => ({
  path: annotation?.path ?? null,
  startLine: annotation?.start_line ?? null,
  level: annotation?.annotation_level ?? null,
  message: annotation?.message ?? null,
});

const fetchLatestRun = async ({ token, repo, workflow, ref }) => {
  const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs?branch=${encodeURIComponent(ref)}&per_page=1`;
  const payload = await githubFetch(url, { token });
  return Array.isArray(payload?.workflow_runs) ? payload.workflow_runs[0] : null;
};

const fetchRunDetails = async ({ token, repo, run }) => {
  if (!run?.id) return { run: null, job: null, annotations: [] };

  const jobsPayload = await githubFetch(
    `https://api.github.com/repos/${repo}/actions/runs/${run.id}/jobs?per_page=20`,
    { token }
  );
  const job = Array.isArray(jobsPayload?.jobs) ? jobsPayload.jobs[0] : null;
  let annotations = [];

  if (job?.id) {
    const annotationsPayload = await githubFetch(
      `https://api.github.com/repos/${repo}/check-runs/${job.id}/annotations?per_page=20`,
      { token }
    );
    annotations = Array.isArray(annotationsPayload) ? annotationsPayload : [];
  }

  return { run, job, annotations };
};

const waitForLatestRun = async ({ token, repo, workflow, ref, waitSeconds, intervalSeconds }) => {
  const deadline = Date.now() + waitSeconds * 1000;
  let latest = null;

  do {
    latest = await fetchLatestRun({ token, repo, workflow, ref });
    if (latest) return latest;
    await sleep(Math.min(intervalSeconds * 1000, Math.max(0, deadline - Date.now())));
  } while (Date.now() < deadline);

  return latest;
};

const main = async () => {
  if (hasFlag('--help') || hasFlag('-h')) {
    printUsage();
    return;
  }

  const options = resolveOptions();
  if (!options.repo.includes('/')) throw new Error('Expected --repo in owner/name form.');
  if (!options.workflow) throw new Error('Missing --workflow.');
  if (!options.ref) throw new Error('Missing --ref.');

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          repo: options.repo,
          workflow: options.workflow,
          ref: options.ref,
          dispatch: options.dispatch,
          waitSeconds: options.waitSeconds,
        },
        null,
        2
      )
    );
    return;
  }

  const token = resolveToken();

  try {
    if (options.dispatch) {
      await githubFetch(
        `https://api.github.com/repos/${options.repo}/actions/workflows/${options.workflow}/dispatches`,
        {
          token,
          method: 'POST',
          body: JSON.stringify({ ref: options.ref }),
        }
      );
      console.log('[promote:prod] workflow_dispatch_status=sent');
    }

    const latest = await waitForLatestRun({ token, ...options });
    const details = await fetchRunDetails({ token, repo: options.repo, run: latest });
    const annotations = details.annotations.map(summarizeAnnotation);

    const summary = {
      repo: options.repo,
      workflow: options.workflow,
      ref: options.ref,
      run: latest
        ? {
            id: latest.id,
            runNumber: latest.run_number,
            headSha: latest.head_sha,
            status: latest.status,
            conclusion: latest.conclusion,
            event: latest.event,
            htmlUrl: latest.html_url,
          }
        : null,
      job: details.job
        ? {
            id: details.job.id,
            name: details.job.name,
            status: details.job.status,
            conclusion: details.job.conclusion,
            stepsCount: Array.isArray(details.job.steps) ? details.job.steps.length : 0,
          }
        : null,
      annotations,
    };

    console.log(JSON.stringify(summary, null, 2));

    if (!latest) {
      process.exitCode = 2;
      return;
    }
    if (latest.status === 'completed' && latest.conclusion !== 'success') {
      process.exitCode = 1;
    }
  } finally {
    // Do not retain the token longer than the request scope.
  }
};

main().catch((error) => {
  console.error('[promote:prod] failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
