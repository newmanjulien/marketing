type SearchParamUpdates = Readonly<Record<string, string | null>>;

const getPageSearchParams = (url: URL, updates: SearchParamUpdates = {}) => {
  const searchParams = new URLSearchParams();

  // SvelteKit encodes named form actions as a "?/name" query key; drop any existing one.
  for (const [key, value] of url.searchParams) {
    if (!key.startsWith('/')) {
      searchParams.append(key, value);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  }

  return searchParams;
};

export const getNamedFormAction = (
  url: URL,
  actionName: string,
  updates?: SearchParamUpdates
) => {
  const query = getPageSearchParams(url, updates).toString();

  return `?${query ? `${query}&` : ''}/${actionName}`;
};

export const getFormActionRedirectPath = (url: URL, updates?: SearchParamUpdates) => {
  const query = getPageSearchParams(url, updates).toString();

  return `${url.pathname}${query ? `?${query}` : ''}`;
};
