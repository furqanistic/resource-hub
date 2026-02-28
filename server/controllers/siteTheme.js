// File: server/controllers/siteTheme.js
import { createError } from '../error.js'
import SiteThemeSettings from '../models/SiteThemeSettings.js'

const defaultTheme = {
  backgroundColor: '#fcfdfe',
  textColor: '#03385e',
  primaryColor: '#03385e',
}

const hexColorPattern = /^#[0-9a-fA-F]{6}$/

const normalizeThemeInput = (payload = {}) => {
  const result = {}

  for (const key of Object.keys(defaultTheme)) {
    const rawValue = payload[key]
    if (typeof rawValue !== 'string') continue

    const trimmed = rawValue.trim()
    if (!hexColorPattern.test(trimmed)) {
      return { error: `${key} must be a valid hex color (#RRGGBB)` }
    }

    result[key] = trimmed.toLowerCase()
  }

  return { value: result }
}

export const getSiteThemeSettings = async (req, res, next) => {
  try {
    const theme = await SiteThemeSettings.findOne().sort({ updatedAt: -1 })

    res.status(200).json({
      status: 'success',
      data: {
        theme: theme
          ? {
              backgroundColor: theme.backgroundColor,
              textColor: theme.textColor,
              primaryColor: theme.primaryColor,
              updatedAt: theme.updatedAt,
            }
          : defaultTheme,
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
        theme: {
          backgroundColor: updatedTheme.backgroundColor,
          textColor: updatedTheme.textColor,
          primaryColor: updatedTheme.primaryColor,
          updatedAt: updatedTheme.updatedAt,
        },
      },
    })
  } catch (error) {
    console.error('Error in updateSiteThemeSettings:', error)
    next(createError(500, 'Failed to update site theme settings'))
  }
}

