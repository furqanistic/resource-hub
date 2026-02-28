import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import axiosInstance from '@/lib/axiosInstance'
import {
  setWebsiteTheme,
  setWebsiteThemeLoaded,
} from '@/redux/slices/siteThemeSlice'

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

const toAlphaHex = (hexColor, alphaHex) => {
  if (!HEX_COLOR_PATTERN.test(hexColor || '')) {
    return `#03385e${alphaHex}`
  }

  return `${hexColor}${alphaHex}`
}

const WebsiteThemeSync = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const { websiteTheme, isLoaded } = useSelector((state) => state.siteTheme)

  useEffect(() => {
    if (isLoaded) return

    let isMounted = true

    const fetchThemeSettings = async () => {
      try {
        const { data } = await axiosInstance.get('/site-theme')
        const theme = data?.data?.theme

        if (isMounted && theme) {
          dispatch(setWebsiteTheme(theme))
          return
        }
      } catch {
        // Keep defaults when API is unavailable.
      }

      if (isMounted) {
        dispatch(setWebsiteThemeLoaded())
      }
    }

    fetchThemeSettings()

    return () => {
      isMounted = false
    }
  }, [dispatch, isLoaded])

  useEffect(() => {
    const root = window.document.documentElement

    root.style.setProperty('--site-background', websiteTheme.backgroundColor)
    root.style.setProperty('--site-text', websiteTheme.textColor)
    root.style.setProperty('--site-primary', websiteTheme.primaryColor)
    root.style.setProperty('--site-font-family', websiteTheme.fontFamily)
    root.style.setProperty('--font-sans', websiteTheme.fontFamily)
    root.style.setProperty(
      '--site-heading-scale',
      String(websiteTheme.headingScale)
    )
    root.style.setProperty('--site-body-size', `${websiteTheme.bodySize}px`)
    root.style.setProperty('--site-line-height', String(websiteTheme.lineHeight))
    root.style.setProperty(
      '--site-primary-soft',
      toAlphaHex(websiteTheme.primaryColor, '1f')
    )
    root.style.setProperty(
      '--site-text-soft',
      toAlphaHex(websiteTheme.textColor, 'b3')
    )
  }, [websiteTheme])

  useEffect(() => {
    const root = window.document.documentElement
    const isPublicRoute =
      !pathname.startsWith('/dashboard') && !pathname.startsWith('/admin')

    if (isPublicRoute) {
      root.style.setProperty('font-size', `${websiteTheme.bodySize}px`)
      window.document.body.classList.add('site-theme-public')
    } else {
      root.style.removeProperty('font-size')
      window.document.body.classList.remove('site-theme-public')
    }
  }, [pathname, websiteTheme.bodySize])

  return null
}

export default WebsiteThemeSync
