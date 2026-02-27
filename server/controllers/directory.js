import { createError } from '../error.js'
import DirectoryService from '../models/DirectoryService.js'

export const getDirectoryServices = async (req, res, next) => {
  try {
    const services = await DirectoryService.find().sort({ providerName: 1 })

    res.status(200).json({
      status: 'success',
      results: services.length,
      data: {
        services,
      },
    })
  } catch (error) {
    console.error('Error in getDirectoryServices:', error)
    next(createError(500, 'Failed to load directory services'))
  }
}

export const replaceDirectoryServices = async (req, res, next) => {
  try {
    const { services } = req.body

    if (!Array.isArray(services) || services.length === 0) {
      return next(createError(400, 'Please provide at least one service'))
    }

    const normalized = services.map((service) => ({
      providerName: service?.providerName?.trim(),
      serviceCategory: service?.serviceCategory?.trim() || '',
      serviceTypes: service?.serviceTypes?.trim() || '',
      websiteUrl: service?.websiteUrl?.trim() || '',
      phone: service?.phone?.trim() || '',
      serviceTimes: service?.serviceTimes?.trim() || '',
      accessibility: service?.accessibility?.trim() || '',
      cost: service?.cost?.trim() || '',
      countiesServed: service?.countiesServed?.trim() || '',
      source: service?.source?.trim() || 'manual',
      raw: service?.raw || undefined,
    }))

    const hasInvalid = normalized.some((service) => !service.providerName)
    if (hasInvalid) {
      return next(createError(400, 'Each service must have a provider name'))
    }

    await DirectoryService.deleteMany({})
    const inserted = await DirectoryService.insertMany(normalized)

    res.status(200).json({
      status: 'success',
      results: inserted.length,
      data: {
        services: inserted,
      },
    })
  } catch (error) {
    console.error('Error in replaceDirectoryServices:', error)
    next(createError(500, 'Failed to update directory services'))
  }
}

export const uploadDirectoryFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, 'Please upload a file'))
    }

    const { services, rawCount } = req.fileParsed

    if (!services.length) {
      return next(createError(400, 'No valid services found in the file'))
    }

    await DirectoryService.deleteMany({})
    const inserted = await DirectoryService.insertMany(services)

    res.status(200).json({
      status: 'success',
      message: 'Directory services updated from file',
      results: inserted.length,
      data: {
        imported: inserted.length,
        rawRows: rawCount,
      },
    })
  } catch (error) {
    console.error('Error in uploadDirectoryFile:', error)
    next(createError(500, 'Failed to import directory file'))
  }
}
