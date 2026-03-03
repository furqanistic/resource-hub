import React from 'react'
import { useScopedThemeStyle } from '@/hooks/useScopedThemeStyle'

const SectionThemeScope = ({ scopeKey, children }) => {
  const scopedThemeStyle = useScopedThemeStyle(scopeKey)

  return <div style={scopedThemeStyle}>{children}</div>
}

export default SectionThemeScope
