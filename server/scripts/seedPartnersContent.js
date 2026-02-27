import dotenv from 'dotenv'
import mongoose from 'mongoose'
import PartnersPageContent from '../models/PartnersPageContent.js'

dotenv.config({ quiet: true })

const seedPartnersContent = async () => {
  try {
    const mongoUri = process.env.MONGO
    if (!mongoUri) {
      throw new Error('MONGO is not defined in the environment variables')
    }

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const existingContent = await PartnersPageContent.findOne()
    if (existingContent) {
      console.log('ℹ️  Partners page content already exists')
      return
    }

    await PartnersPageContent.create({
      partners: [
        {
          name: 'RiverCities Transit',
          logoKey: 'rct',
          url: 'https://www.rctransit.org',
          description: 'RiverCities Transit – We are here, to get you there.',
          descriptionEs: 'RiverCities Transit – Estamos aquí para llevarte allí.',
        },
        {
          name: 'Washington State Health Care Authority (HCA)',
          logoKey: 'hca',
          url: 'https://www.hca.wa.gov',
          description: 'Home | Washington State Health Care Authority',
          descriptionEs: 'Inicio | Autoridad de Atención Médica del Estado de Washington',
        },
        {
          name: 'Greater Columbia River Behavioral Health Administrative Services Organization (GCRBHASO)',
          logoKey: 'gcr',
          url: 'https://www.grbhaso.org',
          description:
            'Great Rivers Behavioral Health Administrative Services Organization\nGreat Rivers Behavioral Health Administrative Services Organization, Great Rivers BHASO, Great Rivers BH, Great Rivers BH-ASO. Great Rivers ASO, Lewis County Crisis, Wahkiakum County Crisis, Cowlitz County Crisis, Pacific County Crisis, Grays Harbor County Crisis\nGreat Rivers Behavioral Health Administrative Services Organization',
          descriptionEs:
            'Organización Administrativa de Servicios de Salud Conductual Great Rivers\nGreat Rivers Behavioral Health Administrative Services Organization, Great Rivers BHASO, Great Rivers BH, Great Rivers BH-ASO. Great Rivers ASO, Lewis County Crisis, Wahkiakum County Crisis, Cowlitz County Crisis, Pacific County Crisis, Grays Harbor County Crisis\nOrganización Administrativa de Servicios de Salud Conductual Great Rivers',
        },
        {
          name: 'Community Health Plan of Washington (CHPW)',
          logoKey: 'chpw',
          url: 'https://www.chpw.org',
          description:
            'Home\nLooking for Washington State Apple Health (Medicaid) information? Community Health Plan of WA can help! Learn more about eligibility and more.\nWashington State Local Health Insurance',
          descriptionEs:
            'Inicio\n¿Buscas información sobre Apple Health (Medicaid) del estado de Washington? Community Health Plan of WA puede ayudar. Aprende más sobre elegibilidad y más.\nSeguro médico local del Estado de Washington',
        },
        {
          name: 'Behavioral Health Resources (BHR)',
          logoKey: 'bhr',
          url: 'https://www.bhr.org',
          description:
            'Home - Behavioral Health Resources\nBHR is a multi-county non profit provider for behavioral health and substance use disorder treatment.\nBehavioral Health Resources - Helping People Live Healthy Lives',
          descriptionEs:
            'Inicio - Behavioral Health Resources\nBHR es un proveedor sin fines de lucro que atiende a varios condados para tratamiento de salud conductual y trastornos por uso de sustancias.\nBehavioral Health Resources - Ayudando a las personas a vivir vidas saludables',
        },
        {
          name: 'Paratransit Services',
          logoKey: 'para',
          url: 'https://www.paratransit.net',
          description: 'Paratransit Services\nParatransit Services',
          descriptionEs: 'Paratransit Services\nParatransit Services',
        },
        {
          name: 'Wahkiakum County',
          logoKey: 'wah',
          url: 'https://www.co.wahkiakum.wa.us',
          description: 'Wahkiakum County, WA | Official Website',
          descriptionEs: 'Condado de Wahkiakum, WA | Sitio web oficial',
        },
        {
          name: 'Washington State Department of Health (DOH)',
          logoKey: 'doh',
          url: 'https://doh.wa.gov',
          description: 'Washington State Department of Health',
          descriptionEs: 'Departamento de Salud del Estado de Washington',
        },
        {
          name: 'Grays Harbor Transit',
          logoKey: 'ght',
          url: 'https://www.ghtransit.com',
          description: 'Grays Harbor Transit\nGrays Harbor Transit Home Page',
          descriptionEs: 'Grays Harbor Transit\nPágina de inicio de Grays Harbor Transit',
        },
        {
          name: 'Destination Hope & Recovery',
          logoKey: 'dhr',
          url: 'https://www.destinationhopeandrecovery.com',
          description:
            'Case Management Specialists | Destination Hope & Recovery | Washington\nAt Destination Hope & Recovery, We offer specialized case management on a personal level to our most at risk individuals in our community. Ranging from Employment and Housing, to Behavioral Health and Judicial Services, or goal is to connect those most in vulnerable to the resources they need to not only survive, but succeed.\nDHR',
          descriptionEs:
            'Especialistas en gestión de casos | Destination Hope & Recovery | Washington\nEn Destination Hope & Recovery ofrecemos gestión de casos especializada a nivel personal para las personas más vulnerables de nuestra comunidad. Desde empleo y vivienda hasta servicios de salud conductual y judiciales, nuestro objetivo es conectar a quienes más lo necesitan con los recursos para no solo sobrevivir, sino prosperar.\nDHR',
        },
        {
          name: 'Cascade Regional Health Network (CRHN)',
          logoKey: 'crhn',
          url: 'https://www.crhn.org',
          description:
            'CHOICE Regional Health Network | health equity | 724 Columbia Street Northwest, Olympia, WA, USA\nAt CHOICE Regional Health Network our mission is to improve community health in Central Western Washington through the collective planning and action of health care leaders. Our vision: better health for everyone at less cost.\nCHOICE Regional\nHome',
          descriptionEs:
            'CHOICE Regional Health Network | equidad en salud | 724 Columbia Street Northwest, Olympia, WA, USA\nEn CHOICE Regional Health Network nuestra misión es mejorar la salud comunitaria en el centro-oeste de Washington mediante la planificación y acción colectiva de líderes de salud. Nuestra visión: mejor salud para todos a menor costo.\nCHOICE Regional\nInicio',
        },
        {
          name: 'Arbor Health',
          logoKey: 'arbor',
          logoClass: 'invert',
          url: 'https://www.myarborhealth.org',
          description:
            'Arbor Health is your community healthcare provider, offering a wide range of medical services to support your health and well-being.',
          descriptionEs:
            'Arbor Health es su proveedor de atención médica comunitaria y ofrece una amplia gama de servicios médicos para apoyar su salud y bienestar.',
        },
        {
          name: 'Disability Rights Washington (Disability Mobility Initiative)',
          logoKey: 'dhrw',
          url: 'https://www.dr-wa.org',
          description:
            'Advocating for the rights of people with disabilities and improving transportation accessibility across Washington state.',
          descriptionEs:
            'Defendiendo los derechos de las personas con discapacidades y mejorando la accesibilidad del transporte en todo el estado de Washington.',
        },
        {
          name: 'Community Transportation Association of the Northwest (CTANW)',
          logoKey: 'ctanw',
          url: 'https://www.ctanw.org',
          description:
            'Community Transportation Association of the Northwest\nCTANW provides our members, partners and communities with tools, resources and information, and advocates for favorable policies and practices so they can provide equal opportunities and mobility and transportation options for all people, particularly those with specialized transportation needs.',
          descriptionEs:
            'Community Transportation Association of the Northwest\nCTANW brinda a nuestros miembros, socios y comunidades herramientas, recursos e información, y aboga por políticas y prácticas favorables para que puedan ofrecer igualdad de oportunidades y opciones de movilidad y transporte para todas las personas, en especial aquellas con necesidades de transporte especializado.',
        },
        {
          name: 'Community in Motion',
          logoKey: 'cim',
          url: 'https://www.communityinmotion.org',
          description: 'Welcome | Community in Motion: The means to stay mobile',
          descriptionEs: 'Bienvenido | Community in Motion: Los medios para mantenerse en movimiento',
        },
        {
          name: 'Coastal Community Action Program (Coastal CAP)',
          logoKey: 'coastalcap',
          url: 'https://www.coastalcap.org',
          description:
            'Coastal Community Action Program | Part of the Community Action Network fighting to eliminate Poverty',
          descriptionEs:
            'Coastal Community Action Program | Parte de la Community Action Network que lucha para eliminar la pobreza',
        },
        {
          name: 'Olympic Ambulance',
          logoKey: 'oa',
          url: 'https://www.olympicambulance.com',
          description:
            'Providing professional medical transportation services with a focus on patient care and safety.',
          descriptionEs:
            'Ofrece servicios profesionales de transporte médico con enfoque en la atención del paciente y la seguridad.',
        },
        {
          name: 'Coastal Washington Council of Governments (CWCOG)',
          logoKey: 'cwcog',
          url: 'https://www.cwcog.org',
          description:
            'Cowlitz-Wahkiakum Council of Governments • CWCOG • Home\nCWCOG is a regional planning organization serving Cowlitz and Wahkiakum counties with programs in economic development, transportation, and community planning.\nCowlitz-Wahkiakum Council of Governments',
          descriptionEs:
            'Cowlitz-Wahkiakum Council of Governments • CWCOG • Inicio\nCWCOG es una organización regional de planificación que sirve a los condados de Cowlitz y Wahkiakum con programas de desarrollo económico, transporte y planificación comunitaria.\nCowlitz-Wahkiakum Council of Governments',
        },
      ],
    })

    console.log('✅ Partners page content seeded')
  } catch (error) {
    console.error('❌ Failed to seed partners page content:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedPartnersContent()
