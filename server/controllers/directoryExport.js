import DirectoryService from '../models/DirectoryService.js'

export const exportDirectoryCsv = async (req, res, next) => {
  try {
    const services = await DirectoryService.find().sort({ providerName: 1 })

    const header = [
      'Provider Name',
      'Service Category',
      'Service Type(s)',
      'Website Url',
      'Phone',
      'Service Times',
      'Accessibility',
      'Cost',
      'Counties Served',
    ]

    const rows = services.map((service) => [
      service.providerName,
      service.serviceCategory,
      service.serviceTypes,
      service.websiteUrl,
      service.phone,
      service.serviceTimes,
      service.accessibility,
      service.cost,
      service.countiesServed,
    ])

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const safe = `${value || ''}`.replace(/"/g, '""')
            return `"${safe}"`
          })
          .join(',')
      )
      .join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="directory-services.csv"')
    res.status(200).send(csv)
  } catch (error) {
    next(error)
  }
}
