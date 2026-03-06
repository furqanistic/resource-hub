import { createError } from '../error.js'
import AboutPageContent from '../models/AboutPageContent.js'
import HomePageContent from '../models/HomePageContent.js'
import PartnersPageContent from '../models/PartnersPageContent.js'
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
      heroTitleEs,
      heroDescription1Es,
      heroDescription2Es,
      heroCtaEs,
      heroImageUrl,
      heroImageAlt,
      heroImageAltEs,
      supportingPartnersLabel,
      supportingPartnersLabelEs,
    } = req.body

    if (!heroTitle || !heroDescription1 || !heroDescription2 || !heroCta) {
      return next(createError(400, 'Please fill out all required fields'))
    }

    const updatedContent = await HomePageContent.findOneAndUpdate(
      {},
      {
        heroTitle: heroTitle.trim(),
        heroTitleEs: heroTitleEs?.trim() || '',
        heroDescription1: heroDescription1.trim(),
        heroDescription1Es: heroDescription1Es?.trim() || '',
        heroDescription2: heroDescription2.trim(),
        heroDescription2Es: heroDescription2Es?.trim() || '',
        heroCta: heroCta.trim(),
        heroCtaEs: heroCtaEs?.trim() || '',
        heroImageUrl: heroImageUrl?.trim() || '',
        heroImageAlt: heroImageAlt?.trim() || '',
        heroImageAltEs: heroImageAltEs?.trim() || '',
        supportingPartnersLabel: supportingPartnersLabel?.trim() || '',
        supportingPartnersLabelEs: supportingPartnersLabelEs?.trim() || '',
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
    const { title, titleEs, subtitle, subtitleEs, resources } = req.body

    if (!title || !subtitle) {
      return next(createError(400, 'Please fill out all required fields'))
    }

    if (!Array.isArray(resources) || resources.length === 0) {
      return next(createError(400, 'Please provide at least one resource card'))
    }

    const normalizedResources = resources.map((resource) => ({
      title: resource?.title?.trim(),
      titleEs: resource?.titleEs?.trim() || '',
      description: resource?.description?.trim(),
      descriptionEs: resource?.descriptionEs?.trim() || '',
      ctaLabel: resource?.ctaLabel?.trim(),
      ctaLabelEs: resource?.ctaLabelEs?.trim() || '',
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
        titleEs: titleEs?.trim() || '',
        subtitle: subtitle.trim(),
        subtitleEs: subtitleEs?.trim() || '',
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
    const { title, titleEs, paragraphs, paragraphsEs } = req.body

    if (!title || !Array.isArray(paragraphs) || paragraphs.length === 0) {
      return next(createError(400, 'Please provide the title and at least one paragraph'))
    }

    const normalizedParagraphs = paragraphs
      .map((paragraph) => paragraph?.trim())
      .filter((paragraph) => paragraph)

    const normalizedParagraphsEs = Array.isArray(paragraphsEs)
      ? paragraphsEs.map((paragraph) => paragraph?.trim()).filter((paragraph) => paragraph)
      : []

    if (normalizedParagraphs.length === 0) {
      return next(createError(400, 'Please provide valid paragraph content'))
    }

    const updatedContent = await AboutPageContent.findOneAndUpdate(
      {},
      {
        title: title.trim(),
        titleEs: titleEs?.trim() || '',
        paragraphs: normalizedParagraphs,
        paragraphsEs: normalizedParagraphsEs,
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

export const getPartnersContent = async (req, res, next) => {
  try {
    const content = await PartnersPageContent.findOne().sort({ updatedAt: -1 })

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
    console.error('Error in getPartnersContent:', error)
    next(createError(500, 'Failed to load partners page content'))
  }
}

export const updatePartnersContent = async (req, res, next) => {
  try {
    const { partners } = req.body

    if (!Array.isArray(partners) || partners.length === 0) {
      return next(createError(400, 'Please provide at least one partner'))
    }

    const normalizedPartners = partners.map((partner) => ({
      name: partner?.name?.trim(),
      url: partner?.url?.trim(),
      description: partner?.description?.trim(),
      descriptionEs: partner?.descriptionEs?.trim() || '',
      logoKey: partner?.logoKey?.trim() || '',
      logoUrl: partner?.logoUrl?.trim() || '',
      logoClass: partner?.logoClass?.trim() || '',
    }))

    const hasInvalidPartner = normalizedPartners.some(
      (partner) => !partner.name || !partner.url || !partner.description
    )

    if (hasInvalidPartner) {
      return next(createError(400, 'Please complete all required partner fields'))
    }

    const updatedContent = await PartnersPageContent.findOneAndUpdate(
      {},
      { partners: normalizedPartners },
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
    console.error('Error in updatePartnersContent:', error)
    next(createError(500, 'Failed to update partners page content'))
  }
}
