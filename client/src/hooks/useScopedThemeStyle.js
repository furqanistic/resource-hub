import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { resolvePublicPageScopeKey } from '@/constants/siteThemeScopes'

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

const toAlphaHex = (hexColor, alphaHex) => {
  if (!HEX_COLOR_PATTERN.test(hexColor || '')) {
    return `#03385e${alphaHex}`
  }

  return `${hexColor}${alphaHex}`
}

export const useScopedThemeStyle = (sectionScopeKey = null) => {
  const { pathname } = useLocation()
  const { websiteTheme, pageOverrides, sectionOverrides } = useSelector(
    (state) => state.siteTheme
  )

  return useMemo(() => {
    const pageScopeKey = resolvePublicPageScopeKey(pathname)
    const pageOverride = pageScopeKey ? pageOverrides?.[pageScopeKey] || {} : {}
    const sectionOverride = sectionScopeKey
      ? sectionOverrides?.[sectionScopeKey] || {}
      : {}

    const effectiveTheme = {
      ...websiteTheme,
      ...pageOverride,
      ...sectionOverride,
    }

    return {
      '--site-background': effectiveTheme.backgroundColor,
      '--site-text': effectiveTheme.textColor,
      '--site-primary': effectiveTheme.primaryColor,
      '--site-font-family': effectiveTheme.fontFamily,
      '--font-sans': effectiveTheme.fontFamily,
      '--site-heading-scale': String(effectiveTheme.headingScale),
      '--site-body-size': `${effectiveTheme.bodySize}px`,
      '--site-line-height': String(effectiveTheme.lineHeight),
      '--site-primary-soft': toAlphaHex(effectiveTheme.primaryColor, '1f'),
      '--site-text-soft': toAlphaHex(effectiveTheme.textColor, 'b3'),
      fontFamily: effectiveTheme.fontFamily,
      fontSize: `${effectiveTheme.bodySize}px`,
      lineHeight: effectiveTheme.lineHeight,
    }
  }, [pathname, pageOverrides, sectionOverrides, sectionScopeKey, websiteTheme])
}
