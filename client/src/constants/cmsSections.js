export const CMS_SECTION_DEFINITIONS = {
  'home.hero': {
    label: 'Home Hero',
    description: 'Configure the main visual identity of your landing page.',
    fields: [
      {
        id: 'hero-title',
        label: 'Primary Heading',
        type: 'text',
        defaultValue: 'CHOICE Regional Transportation Hub',
      },
      {
        id: 'hero-description1',
        label: 'Introductory Text',
        type: 'textarea',
        defaultValue:
          'This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region.',
      },
      {
        id: 'hero-description2',
        label: 'Supplementary Text',
        type: 'textarea',
        defaultValue:
          'This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services.',
      },
      {
        id: 'hero-cta',
        label: 'Action Button Label',
        type: 'text',
        defaultValue: 'Start My Search',
      },
      {
        id: 'hero-link',
        label: 'Action Destination',
        type: 'text',
        defaultValue: '/directory',
      },
      {
        id: 'hero-image',
        label: 'Hero Banner Media',
        type: 'image',
        defaultValue: '',
      },
    ],
  },
  'home.regional': {
    label: 'Home Regional',
    description: 'Manage regional partnership details and geographic focus.',
    fields: [
      {
        id: 'regional-title-1',
        label: 'Section Header 1',
        type: 'text',
        defaultValue: 'Regional Partners',
      },
      {
        id: 'regional-title-2',
        label: 'Section Header 2',
        type: 'text',
        defaultValue: 'Collaborating for Care',
      },
      {
        id: 'regional-p1',
        label: 'First Paragraph',
        type: 'textarea',
        defaultValue:
          'Our regional partners work together to ensure that every community member has access to the transportation they need.',
      },
      {
        id: 'regional-p2',
        label: 'Second Paragraph',
        type: 'textarea',
        defaultValue:
          'By coordinating resources and sharing information, we can better serve our region and improve health outcomes.',
      },
      {
        id: 'regional-image',
        label: 'Regional Impact Map',
        type: 'image',
        defaultValue: '',
      },
    ],
  },
  'about.page': {
    label: 'About Page',
    description: 'Edit the organizational narrative and background information.',
    fields: [
      {
        id: 'about-title',
        label: 'Main Exhibit Title',
        type: 'text',
        defaultValue: 'About Our Hub',
      },
      {
        id: 'about-p1',
        label: 'Narrative Block 1',
        type: 'textarea',
        defaultValue:
          'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 1)',
      },
      {
        id: 'about-p2',
        label: 'Narrative Block 2',
        type: 'textarea',
        defaultValue:
          'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 2)',
      },
      {
        id: 'about-p3',
        label: 'Narrative Block 3',
        type: 'textarea',
        defaultValue:
          'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 3)',
      },
      {
        id: 'about-p4',
        label: 'Narrative Block 4',
        type: 'textarea',
        defaultValue:
          'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. (Block 4)',
      },
    ],
  },
  'resources.page': {
    label: 'Resources Page',
    description: 'Curate the list of essential service providers and tools.',
    fields: [
      {
        id: 'resources-title',
        label: 'Module Title',
        type: 'text',
        defaultValue: 'Regional Transportation Resources',
      },
      {
        id: 'resources-subtitle',
        label: 'Tagline',
        type: 'text',
        defaultValue: 'Key tools and partners helping people access care.',
      },
      {
        id: 'res-cwcog-title',
        label: 'Entry Name',
        type: 'text',
        defaultValue: 'CWCOG Mobility Management',
      },
      {
        id: 'res-cwcog-desc',
        label: 'Entry Description',
        type: 'textarea',
        defaultValue: 'Mobility management tools and coordination...',
      },
    ],
  },
  'partners.page': {
    label: 'Partners Page',
    description: 'Manage key strategic partners and their external connections.',
    fields: [
      {
        id: 'partner-name-0',
        label: 'Partner Name 1',
        type: 'text',
        defaultValue: 'RiverCities Transit',
      },
      {
        id: 'partner-url-0',
        label: 'Website URL 1',
        type: 'text',
        defaultValue: 'https://www.rctransit.org',
      },
      {
        id: 'partner-name-1',
        label: 'Partner Name 2',
        type: 'text',
        defaultValue: 'Washington State Health Care Authority (HCA)',
      },
      {
        id: 'partner-url-1',
        label: 'Website URL 2',
        type: 'text',
        defaultValue: 'https://www.hca.wa.gov',
      },
    ],
  },
}

export const CMS_SECTION_ORDER = Object.keys(CMS_SECTION_DEFINITIONS)

export const getDefaultFieldsForSection = (sectionId) => {
  const section = CMS_SECTION_DEFINITIONS[sectionId]
  if (!section) return {}

  return section.fields.reduce((acc, field) => {
    acc[field.id] = field.defaultValue ?? ''
    return acc
  }, {})
}

export const mergeSectionFields = (sectionId, fields) => ({
  ...getDefaultFieldsForSection(sectionId),
  ...(fields || {}),
})
