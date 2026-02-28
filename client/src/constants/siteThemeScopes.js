export const PAGE_THEME_SCOPES = [
  { key: 'home', labelKey: 'dashboard.websiteTheme.scopePageHome' },
  { key: 'directory', labelKey: 'dashboard.websiteTheme.scopePageDirectory' },
  { key: 'resources', labelKey: 'dashboard.websiteTheme.scopePageResources' },
  { key: 'about', labelKey: 'dashboard.websiteTheme.scopePageAbout' },
  { key: 'partners', labelKey: 'dashboard.websiteTheme.scopePagePartners' },
]

export const SECTION_THEME_SCOPES = [
  { key: 'home-hero', labelKey: 'dashboard.websiteTheme.scopeSectionHomeHero' },
  { key: 'home-regional', labelKey: 'dashboard.websiteTheme.scopeSectionHomeRegional' },
  { key: 'home-services', labelKey: 'dashboard.websiteTheme.scopeSectionHomeServices' },
  { key: 'home-need-help', labelKey: 'dashboard.websiteTheme.scopeSectionHomeNeedHelp' },
  { key: 'home-contact', labelKey: 'dashboard.websiteTheme.scopeSectionHomeContact' },
  { key: 'directory-main', labelKey: 'dashboard.websiteTheme.scopeSectionDirectoryMain' },
  { key: 'resources-main', labelKey: 'dashboard.websiteTheme.scopeSectionResourcesMain' },
  { key: 'about-main', labelKey: 'dashboard.websiteTheme.scopeSectionAboutMain' },
  { key: 'partners-main', labelKey: 'dashboard.websiteTheme.scopeSectionPartnersMain' },
]

export const resolvePublicPageScopeKey = (pathname = '') => {
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  if (pathname.startsWith('/directory')) return 'directory'
  if (pathname.startsWith('/resources')) return 'resources'
  if (pathname.startsWith('/about')) return 'about'
  if (pathname.startsWith('/partners')) return 'partners'
  if (pathname === '/' || pathname.startsWith('/?')) return 'home'

  return null
}
