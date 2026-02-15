import { UnsupportedLocale } from "@/i18n/errors";
import { type GetLocaleOptions, getRelativeLocaleUrl } from "astro:i18n";
import {
  type LocaleKey,
  type LocaleProfile,
  DEFAULT_LOCALE,
  localeToProfile,
  SUPPORTED_LOCALES,
} from "@/i18n/config";
import type { I18nKeys, I18nStrings } from "@/i18n/types";

const routeSegmentMap: Record<string, Partial<Record<LocaleKey, string>>> = {
  about: { pl: "o-nas" },
  posts: { pl: "posty" },
  tags: { pl: "tagi" },
};

export function translateFor(
  locale: string | undefined,
  _isLocaleKey: (
    locale: string | undefined
  ) => locale is LocaleKey = isLocaleKey,
  _getLocaleMsgs: (locale: LocaleKey) => I18nStrings = getLocaleMsgs
) {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale);
  const msgs = _getLocaleMsgs(locale);

  return (key: I18nKeys, substitutions?: Record<string, string | number>) => {
    let translation = msgs[key];

    for (const key in substitutions) {
      const value = substitutions[key];
      translation = translation.replace(`{${key}}`, String(value));
    }

    return translation;
  };
}

export function getLocaleMsgs(
  locale: LocaleKey,
  getLocaleConfig: (locale: LocaleKey) => LocaleProfile = getLocaleInfo
): I18nStrings {
  return getLocaleConfig(locale).messages;
}

export function isLocaleKey(
  locale: string | undefined,
  supportedLocales: LocaleKey[] = SUPPORTED_LOCALES
): locale is LocaleKey {
  if (typeof locale !== "string") return false;
  return supportedLocales.includes(locale as LocaleKey);
}

export function getLocaleInfo(
  locale?: string,
  _isLocaleKey: (locale?: string) => locale is LocaleKey = isLocaleKey
): LocaleProfile {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale);

  return localeToProfile[locale];
}

export function getRelativeLocalePath(
  locale: string | undefined,
  path: string = "/",
  {
    _isLocaleKey = isLocaleKey,
    ...options
  }: GetLocaleOptions & {
    _isLocaleKey?: (locale?: string) => locale is LocaleKey;
  } = {}
): string {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale);

  const localizedRoutePath = localizeRoutePath(locale, path, _isLocaleKey);

  const localizedPath = getRelativeLocaleUrl(
    locale,
    localizedRoutePath,
    options
  );

  const hasTrailingSlash =
    localizedRoutePath.endsWith("/") || localizedPath === "/";

  if (hasTrailingSlash) return localizedPath;

  return localizedPath.replace(/\/+$/, "");
}

export function getLocalizedRouteSegment(
  locale: LocaleKey,
  segment: string
): string {
  const localizedSegment =
    routeSegmentMap[segment as keyof typeof routeSegmentMap]?.[locale];

  return localizedSegment ?? segment;
}

export function getCanonicalRouteSegment(
  locale: LocaleKey,
  segment: string
): string {
  for (const [canonicalSegment, localizedByLocale] of Object.entries(
    routeSegmentMap
  )) {
    if (localizedByLocale[locale] === segment) {
      return canonicalSegment;
    }
  }

  return segment;
}

export function localizeRoutePath(
  locale: string | undefined,
  path: string = "/",
  _isLocaleKey: (locale?: string) => locale is LocaleKey = isLocaleKey
): string {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale);

  const normalizedPath = path || "/";
  const url = new URL(normalizedPath, "http://foo.com");
  const pathSegments = url.pathname.split("/");

  if (pathSegments[1]) {
    pathSegments[1] = getLocalizedRouteSegment(locale, pathSegments[1]);
  }

  return `${pathSegments.join("/")}${url.search}${url.hash}`;
}

export function stripBaseAndLocale(
  locale: string | undefined,
  path: string,
  _isLocaleKey: (locale?: string) => locale is LocaleKey = isLocaleKey,
  _buildPrefix: (locale: LocaleKey) => string = buildPrefix
): string {
  if (!_isLocaleKey(locale)) throw new UnsupportedLocale(locale);

  const prefix = _buildPrefix(locale);
  const strippedPath = new URL(path.slice(prefix.length), "http://foo.com")
    .pathname;
  const pathSegments = strippedPath.split("/");

  if (pathSegments[1]) {
    pathSegments[1] = getCanonicalRouteSegment(locale, pathSegments[1]);
  }

  return pathSegments.join("/");
}

export function buildPrefix(
  locale: LocaleKey,
  defaultLocale: LocaleKey = DEFAULT_LOCALE,
  baseUrl: string = import.meta.env.BASE_URL
): string {
  const isDefaultLocale = locale === defaultLocale;
  const baseWithLocale =
    baseUrl.replace(/\/+$/, "") + (isDefaultLocale ? "" : `/${locale}`);

  return new URL(baseWithLocale, "http://foo.com").pathname;
}

export function getSlugWithoutLocale(slug: string) {
  const slugParts = slug.split("/");
  if (
    slugParts.length > 1 &&
    SUPPORTED_LOCALES.includes(slugParts[0] as LocaleKey)
  ) {
    return slugParts.slice(1).join("/");
  }
  return slug;
}
