import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    nav: {
      home: 'Home',
      directory: 'Directory',
      resources: 'Resources',
      about: 'About',
      partners: 'Partners',
      language: 'Language',
      switchToSpanish: 'Switch to Spanish',
      switchToEnglish: 'Switch to English',
    },
    home: {
      heroTitleLine1: 'Find a Ride in',
      heroTitleLine2: 'Your County',
      heroSubtitle: 'Free or low-cost rides to the doctor, the store, and more.',
      heroCta: 'Start My Search',
      heroImageAlt: 'Supportive driver providing transportation',
      partnerLogoAlt: 'Partner',
      regionalTitleLine1: 'CHOICE Regional',
      regionalTitleLine2: 'Partners',
      regionalP1:
        'We believe that healthy communities are built on strong relationships, where people and community members are connected with one another and to essential services.',
      regionalP2:
        'We are dedicated to working together on community-driven solutions to solve some our most complex challenges in the central western Washington state region.',
      regionalP3:
        'This is a CHOICE regional transportation resource hub. CHOICE is working with local partners to help you get where you need to go.',
      regionalMapAlt: 'Washington State Map showing CHOICE Regional Partners',
      categories: {
        doctor: 'Rides to See a Doctor',
        groceries: 'Rides for Food & Groceries',
        work: 'Rides for Housing & Work',
        transit: 'Buses & Public Transit',
      },
      needHelpTitle: 'Need Extra Help?',
      needHelpCta: 'Start My Search',
      contactTitle: 'Do you have a suggested resource that we should know about? Let us know!',
      contactFirstName: 'First name',
      contactLastName: 'Last name',
      contactEmail: 'Email',
      contactFeedback: 'Feedback',
      contactSubmit: 'Submit',
      contactSubmitting: 'Submitting...',
      contactSuccessTitle: 'Thank You!',
      contactSuccessBody: "Your message has been sent successfully. We'll get back to you soon.",
      contactSendAnother: 'Send another message',
      validation: {
        firstNameMin: 'First name must be at least 2 characters.',
        lastNameMin: 'Last name must be at least 2 characters.',
        emailInvalid: 'Please enter a valid email address.',
        feedbackMin: 'Feedback must be at least 10 characters.',
      },
    },
    directory: {
      title: 'Find Transportation Services',
      filterTitle: 'Filter Services',
      searchByName: 'Search by name',
      allCounties: 'All Counties',
      searchCounties: 'Search counties',
      allServices: 'All Services',
      searchServices: 'Search services',
      allAccessibility: 'All Accessibility',
      searchAccessibility: 'Search accessibility',
      startSearch: 'Start My Search',
      clearAll: 'Clear All',
      noServicesTitle: 'No Services Found',
      noServicesBody: "We couldn't find any services matching your current filters. Try adjusting your search criteria.",
      clearFilters: 'Clear all filters',
      detail: {
        phone: 'Phone',
        hours: 'Hours',
        access: 'Access',
        cost: 'Cost',
        county: 'County',
      },
    },
    partners: {
      searchPlaceholder: 'Search partners...',
      showLess: 'Show less',
      readMore: 'Read more',
      website: 'Website',
      noResults: 'No results found',
    },
    about: {
      title: 'About & Partners',
      p1: "This initiative was born out of a coalition of partners under the Great Rivers BH-ASO Transportation Collaborative. They were seeking solutions for people in the region who struggled to find transportation for their physical and mental health needs. Through multiple community surveys, the group discovered a major gap: people didn't know which resources existed or how to access them.",
      p2: 'CHOICE Regional Health Network, as a regional leader in Social Determinants of Health (SDOH), took the lead on hosting this hub. UnitedHealthcare (UHC) helped develop the resource framework based directly on community input.',
    },
    resources: {
      title: 'Regional Transportation Resources',
      subtitle: 'Key tools and partners helping people access care, food, and essential services.',
      cwcogTitle: 'CWCOG Mobility Management',
      cwcogDesc: 'Mobility management tools, travel training, and regional coordination to connect people with transportation options.',
      cwcogCta: 'Visit CWCOG Mobility Management',
      grTitle: 'Great Rivers BH-ASO Transportation Efforts',
      grDesc: 'Regional coordination focused on improving access to transportation for behavioral health and other essential services.',
      grCta: 'Learn more about Great Rivers BH-ASO',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      directory: 'Directorio',
      resources: 'Recursos',
      about: 'Acerca de',
      partners: 'Socios',
      language: 'Idioma',
      switchToSpanish: 'Cambiar a español',
      switchToEnglish: 'Cambiar a inglés',
    },
    home: {
      heroTitleLine1: 'Encuentra transporte en',
      heroTitleLine2: 'tu condado',
      heroSubtitle: 'Viajes gratuitos o de bajo costo al médico, la tienda y más.',
      heroCta: 'Iniciar mi búsqueda',
      heroImageAlt: 'Conductor solidario brindando transporte',
      partnerLogoAlt: 'Socio',
      regionalTitleLine1: 'Socios regionales',
      regionalTitleLine2: 'CHOICE',
      regionalP1:
        'Creemos que las comunidades saludables se construyen sobre relaciones sólidas, donde las personas y los miembros de la comunidad están conectados entre sí y con servicios esenciales.',
      regionalP2:
        'Estamos dedicados a trabajar juntos en soluciones impulsadas por la comunidad para resolver algunos de nuestros desafíos más complejos en la región del centro-oeste del estado de Washington.',
      regionalP3:
        'Este es un centro de recursos de transporte regional de CHOICE. CHOICE trabaja con socios locales para ayudarte a llegar a donde necesitas ir.',
      regionalMapAlt: 'Mapa del estado de Washington que muestra a los socios regionales de CHOICE',
      categories: {
        doctor: 'Viajes para ver a un médico',
        groceries: 'Viajes para comida y compras',
        work: 'Viajes para vivienda y trabajo',
        transit: 'Autobuses y transporte público',
      },
      needHelpTitle: '¿Necesitas ayuda extra?',
      needHelpCta: 'Iniciar mi búsqueda',
      contactTitle: '¿Tienes un recurso sugerido que debamos conocer? ¡Cuéntanos!',
      contactFirstName: 'Nombre',
      contactLastName: 'Apellido',
      contactEmail: 'Correo electrónico',
      contactFeedback: 'Comentarios',
      contactSubmit: 'Enviar',
      contactSubmitting: 'Enviando...',
      contactSuccessTitle: '¡Gracias!',
      contactSuccessBody: 'Tu mensaje se ha enviado correctamente. Nos pondremos en contacto pronto.',
      contactSendAnother: 'Enviar otro mensaje',
      validation: {
        firstNameMin: 'El nombre debe tener al menos 2 caracteres.',
        lastNameMin: 'El apellido debe tener al menos 2 caracteres.',
        emailInvalid: 'Por favor ingresa un correo electrónico válido.',
        feedbackMin: 'Los comentarios deben tener al menos 10 caracteres.',
      },
    },
    directory: {
      title: 'Encuentra Servicios de Transporte',
      filterTitle: 'Filtrar Servicios',
      searchByName: 'Buscar por nombre',
      allCounties: 'Todos los condados',
      searchCounties: 'Buscar condados',
      allServices: 'Todos los servicios',
      searchServices: 'Buscar servicios',
      allAccessibility: 'Toda la accesibilidad',
      searchAccessibility: 'Buscar accesibilidad',
      startSearch: 'Iniciar mi búsqueda',
      clearAll: 'Limpiar todo',
      noServicesTitle: 'No se encontraron servicios',
      noServicesBody: 'No pudimos encontrar servicios que coincidan con tus filtros actuales. Intenta ajustar tus criterios de búsqueda.',
      clearFilters: 'Limpiar todos los filtros',
      detail: {
        phone: 'Teléfono',
        hours: 'Horario',
        access: 'Acceso',
        cost: 'Costo',
        county: 'Condado',
      },
    },
    partners: {
      searchPlaceholder: 'Buscar socios...',
      showLess: 'Mostrar menos',
      readMore: 'Leer más',
      website: 'Sitio web',
      noResults: 'No se encontraron resultados',
    },
    about: {
      title: 'Acerca de y socios',
      p1: 'Esta iniciativa nació de una coalición de socios bajo la Colaborativa de Transporte Great Rivers BH-ASO. Buscaban soluciones para personas en la región que tenían dificultades para encontrar transporte para sus necesidades de salud física y mental. A través de múltiples encuestas comunitarias, el grupo descubrió una gran brecha: las personas no sabían qué recursos existían ni cómo acceder a ellos.',
      p2: 'CHOICE Regional Health Network, como líder regional en Determinantes Sociales de la Salud (SDOH), asumió el liderazgo para alojar este centro. UnitedHealthcare (UHC) ayudó a desarrollar el marco de recursos basado directamente en aportes de la comunidad.',
    },
    resources: {
      title: 'Recursos regionales de transporte',
      subtitle: 'Herramientas y socios clave que ayudan a las personas a acceder a atención médica, alimentos y servicios esenciales.',
      cwcogTitle: 'Gestión de movilidad de CWCOG',
      cwcogDesc: 'Herramientas de gestión de movilidad, capacitación para viajar y coordinación regional para conectar a las personas con opciones de transporte.',
      cwcogCta: 'Visitar Gestión de Movilidad de CWCOG',
      grTitle: 'Esfuerzos de transporte de Great Rivers BH-ASO',
      grDesc: 'Coordinación regional enfocada en mejorar el acceso al transporte para salud conductual y otros servicios esenciales.',
      grCta: 'Conocer más sobre Great Rivers BH-ASO',
    },
  },
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return window.localStorage.getItem('choice-language') || 'en';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('choice-language', language);
  }, [language]);

  const t = useMemo(() => {
    return (key) => {
      const dictionary = translations[language] || translations.en;
      return getNestedValue(dictionary, key) ?? getNestedValue(translations.en, key) ?? key;
    };
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
