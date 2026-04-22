const normalizeBaseUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/\/+$/, '');
};

type LocationLike = {
  hostname: string;
  protocol: string;
};

export const inferApiBaseUrlFromLocation = (locationLike?: LocationLike | null) => {
  const hostname = locationLike?.hostname?.trim().toLowerCase();
  const protocol = locationLike?.protocol?.trim() || 'https:';
  if (!hostname) return undefined;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return undefined;
  }

  const labels = hostname.split('.');
  if (labels.length < 2) return undefined;

  if (labels[0] === 'stage' && labels.length >= 3) {
    return `${protocol}//stage-api.${labels.slice(1).join('.')}`;
  }

  if (labels[0] === 'soar' && labels.length >= 2) {
    return `${protocol}//api.${labels.slice(1).join('.')}`;
  }

  return undefined;
};

export const resolvePublicApiBaseUrl = () => {
  const envBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  if (envBase) return envBase;

  if (typeof window === 'undefined') {
    return undefined;
  }

  return inferApiBaseUrlFromLocation(window.location);
};

