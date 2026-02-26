import { createError } from '../error.js'
import AboutPageContent from '../models/AboutPageContent.js'
import HomePageContent from '../models/HomePageContent.js'
import ResourcesPageContent from '../models/ResourcesPageContent.js'

export const getHomeContent = async (req, res, next) => {
  try {
    const content = await HomePageContent.findOne().sort({ updatedAt: -1 })

    if (!content) {
      return res.status(200).json({
        status: 'success',
        data: {
          content: null,
        },
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        content,
      },
    })
  } catch (error) {
    console.error('Error in getHomeContent:', error)
    next(createError(500, 'Failed to load home page content'))
  }
}

export const updateHomeContent = async (req, res, next) => {
  try {
    const {
      heroTitle,
      heroDescription1,
      heroDescription2,
      heroCta,
      heroImageUrl,
      heroImageAlt,
      supportingPartnersLabel,
    } = req.body

    if (!heroTitle || !heroDescription1 || !heroDescription2 || !heroCta) {
      return next(createError(400, 'Please fill out all required fields'))
    }

    const updatedContent = await HomePageContent.findOneAndUpdate(
      {},
      {
        heroTitle: heroTitle.trim(),
        heroDescription1: heroDescription1.trim(),
        heroDescription2: heroDescription2.trim(),
        heroCta: heroCta.trim(),
        heroImageUrl: heroImageUrl?.trim() || '',
        heroImageAlt: heroImageAlt?.trim() || '',
        supportingPartnersLabel: supportingPartnersLabel?.trim() || '',
      },
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
        content: updatedContent,
      },
    })
  } catch (error) {
    console.error('Error in updateHomeContent:', error)
    next(createError(500, 'Failed to update home page content'))
  }
}

export const getResourcesContent = async (req, res, next) => {
  try {
    const content = await ResourcesPageContent.findOne().sort({ updatedAt: -1 })

    if (!content) {
      return res.status(200).json({
        status: 'success',
        data: {
          content: null,
        },
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        content,
      },
    })
  } catch (error) {
    console.error('Error in getResourcesContent:', error)
    next(createError(500, 'Failed to load resources page content'))
  }
}

export const updateResourcesContent = async (req, res, next) => {
  try {
    const { title, subtitle, resources } = req.body

    if (!title || !subtitle) {
      return next(createError(400, 'Please fill out all required fields'))
    }

    if (!Array.isArray(resources) || resources.length === 0) {
      return next(createError(400, 'Please provide at least one resource card'))
    }

    const normalizedResources = resources.map((resource) => ({
      title: resource?.title?.trim(),
      description: resource?.description?.trim(),
      ctaLabel: resource?.ctaLabel?.trim(),
      href: resource?.href?.trim(),
    }))

    const hasInvalidResource = normalizedResources.some(
      (resource) =>
        !resource.title || !resource.description || !resource.ctaLabel || !resource.href
    )

    if (hasInvalidResource) {
      return next(createError(400, 'Please complete all resource fields'))
    }

    const updatedContent = await ResourcesPageContent.findOneAndUpdate(
      {},
      {
        title: title.trim(),
        subtitle: subtitle.trim(),
        resources: normalizedResources,
      },
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
        content: updatedContent,
      },
    })
  } catch (error) {
    console.error('Error in updateResourcesContent:', error)
    next(createError(500, 'Failed to update resources page content'))
  }
}

export const getAboutContent = async (req, res, next) => {
  try {
    const content = await AboutPageContent.findOne().sort({ updatedAt: -1 })

    if (!content) {
      return res.status(200).json({
        status: 'success',
        data: {
          content: null,
        },
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        content,
      },
    })
  } catch (error) {
    console.error('Error in getAboutContent:', error)
    next(createError(500, 'Failed to load about page content'))
  }
}

export const updateAboutContent = async (req, res, next) => {
  try {
    const { title, paragraphs } = req.body

    if (!title || !Array.isArray(paragraphs) || paragraphs.length === 0) {
      return next(createError(400, 'Please provide the title and at least one paragraph'))
    }

    const normalizedParagraphs = paragraphs
      .map((paragraph) => paragraph?.trim())
      .filter((paragraph) => paragraph)

    if (normalizedParagraphs.length === 0) {
      return next(createError(400, 'Please provide valid paragraph content'))
    }

    const updatedContent = await AboutPageContent.findOneAndUpdate(
      {},
      {
        title: title.trim(),
        paragraphs: normalizedParagraphs,
      },
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
        content: updatedContent,
      },
    })
  } catch (error) {
    console.error('Error in updateAboutContent:', error)
    next(createError(500, 'Failed to update about page content'))
  }
}
