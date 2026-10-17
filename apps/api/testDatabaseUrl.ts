type TestDatabaseInput = {
  runtimeUrl: string | undefined;
  explicitTestUrl?: string | undefined;
};

const parseDatabaseUrl = (value: string | undefined, label: string) => {
  if (!value?.trim()) throw new Error(`${label} is required for API tests`);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid PostgreSQL URL`);
  }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.pathname.slice(1)) {
    throw new Error(`${label} must name a PostgreSQL database`);
  }
  return url;
};

export const resolveIsolatedTestDatabaseUrl = ({
  runtimeUrl,
  explicitTestUrl,
}: TestDatabaseInput) => {
  const runtime = runtimeUrl?.trim() ? parseDatabaseUrl(runtimeUrl, 'DATABASE_URL') : null;
  const test = explicitTestUrl?.trim()
    ? parseDatabaseUrl(explicitTestUrl, 'TEST_DATABASE_URL')
    : new URL(parseDatabaseUrl(runtimeUrl, 'DATABASE_URL').toString());

  if (!explicitTestUrl?.trim()) {
    if (!runtime) throw new Error('DATABASE_URL is required for API tests');
    if (!['localhost', '127.0.0.1', '[::1]'].includes(runtime.hostname)) {
      throw new Error('Set TEST_DATABASE_URL explicitly for API tests outside localhost');
    }
    test.pathname = `${runtime.pathname}_test`;
  }

  const databaseName = decodeURIComponent(test.pathname.slice(1));
  if (!databaseName.endsWith('_test') || (runtime && test.toString() === runtime.toString())) {
    throw new Error('API tests require a separate database whose name ends with _test');
  }
  return test.toString();
};
