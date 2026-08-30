export function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function pathIdAfter(pathname: string, prefix: string): string {
  if (!pathname.startsWith(prefix)) {
    return "";
  }
  return decodeRouteSegment(pathname.slice(prefix.length));
}

export function appPathname(path: string): { pathname: string } {
  return { pathname: path };
}

export function appLocation(href: string): { pathname: string; search?: string } {
  const query = href.indexOf("?");
  if (query === -1) {
    return { pathname: href };
  }
  return { pathname: href.slice(0, query), search: href.slice(query) };
}
