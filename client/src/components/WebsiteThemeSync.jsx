import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import axiosInstance from '@/lib/axiosInstance'
import { resolvePublicPageScopeKey } from '@/constants/siteThemeScopes'
import {
  setWebsiteThemeSettings,
  setWebsiteThemeLoaded,
} from '@/redux/slices/siteThemeSlice'

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/
const FETCH_RETRY_DELAYS_MS = [0, 1500, 4000]

const toAlphaHex = (hexColor, alphaHex) => {
  if (!HEX_COLOR_PATTERN.test(hexColor || '')) {
    return `#03385e${alphaHex}`
  }

  return `${hexColor}${alphaHex}`
}

const WebsiteThemeSync = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const { websiteTheme, pageOverrides, isLoaded } = useSelector(
    (state) => state.siteTheme
  )
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (isLoaded) return

    let isMounted = true
    let retryTimeoutId

    const wait = (ms) =>
      new Promise((resolve) => {
        retryTimeoutId = window.setTimeout(resolve, ms)
      })

    const fetchThemeSettings = async () => {
      for (let attempt = 0; attempt < FETCH_RETRY_DELAYS_MS.length; attempt += 1) {
        if (!isMounted) return

        const delay = FETCH_RETRY_DELAYS_MS[attempt]
        if (delay > 0) {
          await wait(delay)
          if (!isMounted) return
        }

        try {
          const { data } = await axiosInstance.get('/site-theme')
          const themeSettings = data?.data
          const theme = themeSettings?.theme

          if (isMounted && theme) {
            dispatch(setWebsiteThemeSettings(themeSettings))
            return
          }

          // API responded but payload is missing: keep defaults and stop retrying.
          if (isMounted) {
            dispatch(setWebsiteThemeLoaded())
          }
          return
        } catch {
          // Keep defaults when API is unavailable. Retry a few times.
        }
      }
    }

    fetchThemeSettings()

    return () => {
      isMounted = false
      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId)
      }
    }
  }, [dispatch, isLoaded, refreshKey])

  useEffect(() => {
    if (isLoaded) return

    const triggerRefetch = () => setRefreshKey((current) => current + 1)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerRefetch()
      }
    }

    window.addEventListener('focus', triggerRefetch)
    window.addEventListener('online', triggerRefetch)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', triggerRefetch)
      window.removeEventListener('online', triggerRefetch)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isLoaded])

  useEffect(() => {
    const pageScopeKey = resolvePublicPageScopeKey(pathname)
    const pageOverride = pageScopeKey ? pageOverrides?.[pageScopeKey] || {} : {}
    const activeTheme = {
      ...websiteTheme,
      ...pageOverride,
    }

    const root = window.document.documentElement

    root.style.setProperty('--site-background', activeTheme.backgroundColor)
    root.style.setProperty('--site-text', activeTheme.textColor)
    root.style.setProperty('--site-primary', activeTheme.primaryColor)
    root.style.setProperty('--site-font-family', activeTheme.fontFamily)
    root.style.setProperty('--font-sans', activeTheme.fontFamily)
    root.style.setProperty(
      '--site-heading-scale',
      String(activeTheme.headingScale)
    )
    root.style.setProperty('--site-body-size', `${activeTheme.bodySize}px`)
    root.style.setProperty('--site-line-height', String(activeTheme.lineHeight))
    root.style.setProperty(
      '--site-primary-soft',
      toAlphaHex(activeTheme.primaryColor, '1f')
    )
    root.style.setProperty(
      '--site-text-soft',
      toAlphaHex(activeTheme.textColor, 'b3')
    )
  }, [pathname, pageOverrides, websiteTheme])

  useEffect(() => {
    const root = window.document.documentElement
    const isPublicRoute =
      !pathname.startsWith('/dashboard') && !pathname.startsWith('/admin')
    const pageScopeKey = resolvePublicPageScopeKey(pathname)
    const pageOverride = pageScopeKey ? pageOverrides?.[pageScopeKey] || {} : {}
    const activeTheme = {
      ...websiteTheme,
      ...pageOverride,
    }

    if (isPublicRoute) {
      root.style.setProperty('font-size', `${activeTheme.bodySize}px`)
      window.document.body.classList.add('site-theme-public')
    } else {
      root.style.removeProperty('font-size')
      window.document.body.classList.remove('site-theme-public')
    }
  }, [pathname, pageOverrides, websiteTheme])

  return null
}

export default WebsiteThemeSync
