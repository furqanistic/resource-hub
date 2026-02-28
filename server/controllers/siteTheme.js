// File: server/controllers/siteTheme.js
import { createError } from '../error.js'
import SiteThemeSettings from '../models/SiteThemeSettings.js'

const defaultTheme = {
  backgroundColor: '#fcfdfe',
  textColor: '#03385e',
  primaryColor: '#03385e',
  fontFamily: "'Poppins', 'Inter', sans-serif",
  headingScale: 1,
  bodySize: 16,
  lineHeight: 1.6,
}

const hexColorPattern = /^#[0-9a-fA-F]{6}$/
const colorKeys = ['backgroundColor', 'textColor', 'primaryColor']
const allowedFontFamilies = [
  "'Poppins', 'Inter', sans-serif",
  "'Inter', sans-serif",
  "'Lora', serif",
  "'IBM Plex Mono', monospace",
]
const numericLimits = {
  headingScale: { min: 0.8, max: 1.4 },
  bodySize: { min: 14, max: 20, integer: true },
  lineHeight: { min: 1.2, max: 2 },
}

const serializeTheme = (theme) => ({
  backgroundColor: theme.backgroundColor || defaultTheme.backgroundColor,
  textColor: theme.textColor || defaultTheme.textColor,
  primaryColor: theme.primaryColor || defaultTheme.primaryColor,
  fontFamily: theme.fontFamily || defaultTheme.fontFamily,
  headingScale: Number.isFinite(theme.headingScale)
    ? theme.headingScale
    : defaultTheme.headingScale,
  bodySize: Number.isFinite(theme.bodySize)
    ? theme.bodySize
    : defaultTheme.bodySize,
  lineHeight: Number.isFinite(theme.lineHeight)
    ? theme.lineHeight
    : defaultTheme.lineHeight,
  updatedAt: theme.updatedAt,
})

const normalizeThemeInput = (payload = {}) => {
  const result = {}

  for (const key of Object.keys(defaultTheme)) {
    const rawValue = payload[key]
    if (rawValue === undefined) continue

    if (colorKeys.includes(key)) {
      if (typeof rawValue !== 'string') {
        return { error: `${key} must be a valid hex color (#RRGGBB)` }
      }

      const trimmed = rawValue.trim()
      if (!hexColorPattern.test(trimmed)) {
        return { error: `${key} must be a valid hex color (#RRGGBB)` }
      }

      result[key] = trimmed.toLowerCase()
      continue
    }

    if (key === 'fontFamily') {
      if (typeof rawValue !== 'string') {
        return { error: 'fontFamily must be a supported font option' }
      }

      const trimmed = rawValue.trim()
      if (!allowedFontFamilies.includes(trimmed)) {
        return { error: 'fontFamily must be a supported font option' }
      }

      result.fontFamily = trimmed
      continue
    }

    const limits = numericLimits[key]
    if (!limits) continue

    const numericValue =
      typeof rawValue === 'number' ? rawValue : Number.parseFloat(rawValue)

    if (!Number.isFinite(numericValue)) {
      return { error: `${key} must be a valid number` }
    }

    if (limits.integer && !Number.isInteger(numericValue)) {
      return { error: `${key} must be a whole number` }
    }

    if (numericValue < limits.min || numericValue > limits.max) {
      return { error: `${key} must be between ${limits.min} and ${limits.max}` }
    }

    result[key] = numericValue
  }

  return { value: result }
}

export const getSiteThemeSettings = async (req, res, next) => {
  try {
    const theme = await SiteThemeSettings.findOne().sort({ updatedAt: -1 })

    res.status(200).json({
      status: 'success',
      data: {
        theme: theme ? serializeTheme(theme) : defaultTheme,
      },
    })
  } catch (error) {
    console.error('Error in getSiteThemeSettings:', error)
    next(createError(500, 'Failed to load site theme settings'))
  }
}

export const updateSiteThemeSettings = async (req, res, next) => {
  try {
    const normalized = normalizeThemeInput(req.body)

    if (normalized.error) {
      return next(createError(400, normalized.error))
    }

    const nextValues = normalized.value || {}
    if (!Object.keys(nextValues).length) {
      return next(createError(400, 'Please provide at least one theme value'))
    }

    const updatedTheme = await SiteThemeSettings.findOneAndUpdate(
      {},
      nextValues,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    res.status(200).json({
      status: 'success',
      data: {
        theme: serializeTheme(updatedTheme),
      },
    })
  } catch (error) {
    console.error('Error in updateSiteThemeSettings:', error)
    next(createError(500, 'Failed to update site theme settings'))
  }
}
