import dotenv from 'dotenv'
import mongoose from 'mongoose'
import dns from 'dns'
import Section from '../models/Section.js'

dotenv.config({ quiet: true })
dns.setServers(['8.8.8.8', '1.1.1.1'])

const mapToObject = (value) => {
  if (!value) return {}
  if (value instanceof Map) return Object.fromEntries(value)
  if (typeof value === 'object' && !Array.isArray(value)) return value
  return {}
}

const partnerSeed = [
  {
    name: 'RiverCities Transit',
    url: 'https://www.rctransit.org',
    description: 'RiverCities Transit – We are here, to get you there.',
    descriptionEs: 'RiverCities Transit – Estamos aquí para llevarte allí.',
  },
  {
    name: 'Washington State Health Care Authority (HCA)',
    url: 'https://www.hca.wa.gov',
    description: 'Home | Washington State Health Care Authority',
    descriptionEs: 'Inicio | Autoridad de Atención Médica del Estado de Washington',
  },
  {
    name: 'Greater Columbia River Behavioral Health Administrative Services Organization (GCRBHASO)',
    url: 'https://www.grbhaso.org',
    description:
      'Great Rivers Behavioral Health Administrative Services Organization\nGreat Rivers Behavioral Health Administrative Services Organization, Great Rivers BHASO, Great Rivers BH, Great Rivers BH-ASO. Great Rivers ASO, Lewis County Crisis, Wahkiakum County Crisis, Cowlitz County Crisis, Pacific County Crisis, Grays Harbor County Crisis\nGreat Rivers Behavioral Health Administrative Services Organization',
    descriptionEs:
      'Organización Administrativa de Servicios de Salud Conductual Great Rivers\nGreat Rivers Behavioral Health Administrative Services Organization, Great Rivers BHASO, Great Rivers BH, Great Rivers BH-ASO. Great Rivers ASO, Lewis County Crisis, Wahkiakum County Crisis, Cowlitz County Crisis, Pacific County Crisis, Grays Harbor County Crisis\nOrganización Administrativa de Servicios de Salud Conductual Great Rivers',
  },
  {
    name: 'Community Health Plan of Washington (CHPW)',
    url: 'https://www.chpw.org',
    description:
      'Home\nLooking for Washington State Apple Health (Medicaid) information? Community Health Plan of WA can help! Learn more about eligibility and more.\nWashington State Local Health Insurance',
    descriptionEs:
      'Inicio\n¿Buscas información sobre Apple Health (Medicaid) del estado de Washington? Community Health Plan of WA puede ayudar. Aprende más sobre elegibilidad y más.\nSeguro médico local del Estado de Washington',
  },
  {
    name: 'Behavioral Health Resources (BHR)',
    url: 'https://www.bhr.org',
    description:
      'Home - Behavioral Health Resources\nBHR is a multi-county non profit provider for behavioral health and substance use disorder treatment.\nBehavioral Health Resources - Helping People Live Healthy Lives',
    descriptionEs:
      'Inicio - Behavioral Health Resources\nBHR es un proveedor sin fines de lucro que atiende a varios condados para tratamiento de salud conductual y trastornos por uso de sustancias.\nBehavioral Health Resources - Ayudando a las personas a vivir vidas saludables',
  },
  {
    name: 'Paratransit Services',
    url: 'https://www.paratransit.net',
    description: 'Paratransit Services\nParatransit Services',
    descriptionEs: 'Paratransit Services\nParatransit Services',
  },
  {
    name: 'Wahkiakum County',
    url: 'https://www.co.wahkiakum.wa.us',
    description: 'Wahkiakum County, WA | Official Website',
    descriptionEs: 'Condado de Wahkiakum, WA | Sitio web oficial',
  },
  {
    name: 'Washington State Department of Health (DOH)',
    url: 'https://doh.wa.gov',
    description: 'Washington State Department of Health',
    descriptionEs: 'Departamento de Salud del Estado de Washington',
  },
  {
    name: 'Grays Harbor Transit',
    url: 'https://www.ghtransit.com',
    description: 'Grays Harbor Transit\nGrays Harbor Transit Home Page',
    descriptionEs: 'Grays Harbor Transit\nPágina de inicio de Grays Harbor Transit',
  },
  {
    name: 'Destination Hope & Recovery',
    url: 'https://www.destinationhopeandrecovery.com',
    description:
      'Case Management Specialists | Destination Hope & Recovery | Washington\nAt Destination Hope & Recovery, We offer specialized case management on a personal level to our most at risk individuals in our community. Ranging from Employment and Housing, to Behavioral Health and Judicial Services, or goal is to connect those most in vulnerable to the resources they need to not only survive, but succeed.\nDHR',
    descriptionEs:
      'Especialistas en gestión de casos | Destination Hope & Recovery | Washington\nEn Destination Hope & Recovery ofrecemos gestión de casos especializada a nivel personal para las personas más vulnerables de nuestra comunidad. Desde empleo y vivienda hasta servicios de salud conductual y judiciales, nuestro objetivo es conectar a quienes más lo necesitan con los recursos para no solo sobrevivir, sino prosperar.\nDHR',
  },
  {
    name: 'Cascade Regional Health Network (CRHN)',
    url: 'https://www.crhn.org',
    description:
      'CHOICE Regional Health Network | health equity | 724 Columbia Street Northwest, Olympia, WA, USA\nAt CHOICE Regional Health Network our mission is to improve community health in Central Western Washington through the collective planning and action of health care leaders. Our vision: better health for everyone at less cost.\nCHOICE Regional\nHome',
    descriptionEs:
      'CHOICE Regional Health Network | equidad en salud | 724 Columbia Street Northwest, Olympia, WA, USA\nEn CHOICE Regional Health Network nuestra misión es mejorar la salud comunitaria en el centro-oeste de Washington mediante la planificación y acción colectiva de líderes de salud. Nuestra visión: mejor salud para todos a menor costo.\nCHOICE Regional\nInicio',
  },
  {
    name: 'Arbor Health',
    url: 'https://www.myarborhealth.org',
    description:
      'Arbor Health is your community healthcare provider, offering a wide range of medical services to support your health and well-being.',
    descriptionEs:
      'Arbor Health es su proveedor de atención médica comunitaria y ofrece una amplia gama de servicios médicos para apoyar su salud y bienestar.',
  },
  {
    name: 'Disability Rights Washington (Disability Mobility Initiative)',
    url: 'https://www.dr-wa.org',
    description:
      'Advocating for the rights of people with disabilities and improving transportation accessibility across Washington state.',
    descriptionEs:
      'Defendiendo los derechos de las personas con discapacidades y mejorando la accesibilidad del transporte en todo el estado de Washington.',
  },
  {
    name: 'Community Transportation Association of the Northwest (CTANW)',
    url: 'https://www.ctanw.org',
    description:
      'Community Transportation Association of the Northwest\nCTANW provides our members, partners and communities with tools, resources and information, and advocates for favorable policies and practices so they can provide equal opportunities and mobility and transportation options for all people, particularly those with specialized transportation needs.',
    descriptionEs:
      'Community Transportation Association of the Northwest\nCTANW brinda a nuestros miembros, socios y comunidades herramientas, recursos e información, y aboga por políticas y prácticas favorables para que puedan ofrecer igualdad de oportunidades y opciones de movilidad y transporte para todas las personas, en especial aquellas con necesidades de transporte especializado.',
  },
  {
    name: 'Community in Motion',
    url: 'https://www.communityinmotion.org',
    description: 'Welcome | Community in Motion: The means to stay mobile',
    descriptionEs: 'Bienvenido | Community in Motion: Los medios para mantenerse en movimiento',
  },
  {
    name: 'Coastal Community Action Program (Coastal CAP)',
    url: 'https://www.coastalcap.org',
    description:
      'Coastal Community Action Program | Part of the Community Action Network fighting to eliminate Poverty',
    descriptionEs:
      'Coastal Community Action Program | Parte de la Community Action Network que lucha para eliminar la pobreza',
  },
  {
    name: 'Olympic Ambulance',
    url: 'https://www.olympicambulance.com',
    description:
      'Providing professional medical transportation services with a focus on patient care and safety.',
    descriptionEs:
      'Ofrece servicios profesionales de transporte médico con enfoque en la atención del paciente y la seguridad.',
  },
  {
    name: 'Coastal Washington Council of Governments (CWCOG)',
    url: 'https://www.cwcog.org',
    description:
      'Cowlitz-Wahkiakum Council of Governments • CWCOG • Home\nCWCOG is a regional planning organization serving Cowlitz and Wahkiakum counties with programs in economic development, transportation, and community planning.\nCowlitz-Wahkiakum Council of Governments',
    descriptionEs:
      'Cowlitz-Wahkiakum Council of Governments • CWCOG • Inicio\nCWCOG es una organización regional de planificación que sirve a los condados de Cowlitz y Wahkiakum con programas de desarrollo económico, transporte y planificación comunitaria.\nCowlitz-Wahkiakum Council of Governments',
  },
]

const partnerFields = partnerSeed.reduce((acc, partner, index) => {
  acc[`partner-name-${index}`] = partner.name
  acc[`partner-url-${index}`] = partner.url
  acc[`partner-description-${index}`] = partner.description
  acc[`partner-description-es-${index}`] = partner.descriptionEs
  return acc
}, {})

const STATIC_SECTIONS = [
  {
    sectionId: 'home.hero',
    label: 'Home Hero',
    fields: {
      'hero-title': 'CHOICE Regional Transportation Hub',
      'hero-description1':
        'This is the CHOICE Regional Transportation Hub created to help connect community members and providers with transportation resources across the region.',
      'hero-description2':
        'This hub was developed in response to regional needs identified through community input and collaboration to improve access to essential care services.',
      'hero-cta': 'Start My Search',
      'hero-image': '',
    },
  },
  {
    sectionId: 'home.regional',
    label: 'Home Regional',
    fields: {
      'regional-title-1': 'CHOICE Regional',
      'regional-title-2': 'Partners',
      'regional-p1':
        'We believe that healthy communities are built on strong relationships, where people and community members are connected with one another and to essential services.',
      'regional-p2':
        'We are dedicated to working together on community-driven solutions to solve some our most complex challenges in the central western Washington state region.',
      'regional-p3':
        'This is a CHOICE regional transportation resource hub. CHOICE is working with local partners to help you get where you need to go.',
      'regional-image': '',
    },
  },
  {
    sectionId: 'about.page',
    label: 'About Page',
    fields: {
      'about-title': 'About & Partners',
      'about-p1':
        'The CHOICE Regional Transportation Hub was developed and is maintained by CHOICE Regional Health Network to improve access to transportation for community members across the region. CHOICE created this hub to make it easier for individuals, providers, and care coordinators to find and use transportation services that support access to medical care and essential needs.',
      'about-p2':
        'This work builds on regional collaboration through the Great Rivers BH-ASO Transportation Collaborative, where partners identified transportation as a major barrier to accessing care. Community surveys and partner feedback showed that many people were unaware of available transportation resources or unsure how to access them.',
      'about-p3':
        "In response, CHOICE Regional Health Network took the lead in creating this centralized hub to bring transportation information together in one place. This hub reflects CHOICE's ongoing commitment to improving access to care and strengthening connections between community members and essential services.",
      'about-p4':
        'Supporting partners in this effort include Great Rivers BH-ASO, UnitedHealthcare and the Cowlitz-Wahkiakum Council of Governments Mobility Management program, whose collaboration and input helped inform the development of this resource.',
    },
  },
  {
    sectionId: 'resources.page',
    label: 'Resources Page',
    fields: {
      'resources-title': 'Regional Transportation Resources',
      'resources-subtitle':
        'Key tools and partners helping people access care, food, and essential services.',
      'res-cwcog-title': 'CWCOG Mobility Management',
      'res-cwcog-desc':
        'Mobility management tools, travel training, and regional coordination to connect people with transportation options.',
      'res-cwcog-cta': 'Visit CWCOG Mobility Management',
      'res-cwcog-link': 'https://www.cwcog.org/mobility-management/',
      'res-gr-title': 'Great Rivers BH-ASO Transportation Efforts',
      'res-gr-desc':
        'Regional coordination focused on improving access to transportation for behavioral health and other essential services.',
      'res-gr-cta': 'Learn more about Great Rivers BH-ASO',
      'res-gr-link': 'https://www.grbhaso.org',
    },
  },
  {
    sectionId: 'partners.page',
    label: 'Partners Page',
    fields: partnerFields,
  },
]

const hasChanges = (a, b) => JSON.stringify(a) !== JSON.stringify(b)

const seed = async () => {
  const overwrite = process.argv.includes('--overwrite')

  try {
    await mongoose.connect(process.env.MONGO)
    console.log('Connected to MongoDB')

    let created = 0
    let updated = 0
    let unchanged = 0

    for (const payload of STATIC_SECTIONS) {
      const existing = await Section.findOne({ sectionId: payload.sectionId })

      if (!existing) {
        const now = new Date()
        await Section.create({
          sectionId: payload.sectionId,
          label: payload.label,
          fields: payload.fields,
          draftFields: payload.fields,
          publishedFields: payload.fields,
          isDraft: false,
          publishedAt: now,
          history: [{ fields: payload.fields, savedAt: now, savedBy: null }],
        })
        created += 1
        console.log(`Created '${payload.sectionId}'`)
        continue
      }

      const currentDraft = mapToObject(existing.draftFields)
      const currentPublished = mapToObject(existing.publishedFields)
      const currentFields = mapToObject(existing.fields)

      if (overwrite) {
        const now = new Date()
        existing.label = payload.label
        existing.draftFields = payload.fields
        existing.publishedFields = payload.fields
        existing.fields = payload.fields
        existing.isDraft = false
        existing.publishedAt = now
        existing.history.push({ fields: payload.fields, savedAt: now, savedBy: null })
        await existing.save()
        updated += 1
        console.log(`Overwrote '${payload.sectionId}'`)
        continue
      }

      const nextDraft = { ...payload.fields, ...currentDraft }
      const nextPublished = { ...payload.fields, ...(Object.keys(currentPublished).length ? currentPublished : currentFields) }
      const nextFields = existing.isDraft ? nextDraft : nextPublished
      const label = existing.label || payload.label

      if (
        label === existing.label &&
        !hasChanges(nextDraft, currentDraft) &&
        !hasChanges(nextPublished, currentPublished) &&
        !hasChanges(nextFields, currentFields)
      ) {
        unchanged += 1
        continue
      }

      existing.label = label
      existing.draftFields = nextDraft
      existing.publishedFields = nextPublished
      existing.fields = nextFields
      await existing.save()
      updated += 1
      console.log(`Updated '${payload.sectionId}'`)
    }

    console.log(`Done. Created: ${created}, Updated: ${updated}, Unchanged: ${unchanged}`)
    if (!overwrite) {
      console.log('Tip: run with --overwrite to replace existing CMS values with static defaults.')
    }
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seed()
