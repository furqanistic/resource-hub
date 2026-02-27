import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import xlsx from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const extractValue = (row, keys) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && `${row[key]}`.trim() !== '') {
      return `${row[key]}`.trim()
    }
  }
  return ''
}

const normalizeRow = (row) => {
  const providerName = extractValue(row, ['Provider Name', 'Provider', 'Agency', 'Name'])

  if (!providerName) return null

  return {
    providerName,
    serviceCategory: extractValue(row, ['Service Category', 'Category', 'Service Type Category']),
    serviceTypes: extractValue(row, ['Service Type(s)', 'Service Types', 'Service Type', 'Type of Help']),
    websiteUrl: extractValue(row, ['Website Url', 'Website URL', 'Website', 'URL']),
    phone: extractValue(row, ['Phone', 'Phone Number', 'Contact Phone']),
    serviceTimes: extractValue(row, ['Service Times', 'Hours', 'Operating Hours']),
    accessibility: extractValue(row, ['Accessibility', 'Access']),
    cost: extractValue(row, ['Cost', 'Cost/Fees', 'Fees']),
    countiesServed: extractValue(row, ['Counties Served', 'County', 'Counties']),
    source: 'upload',
    raw: row,
  }
}

export const parseDirectoryUpload = (req, res, next) => {
  try {
    const filePath = req.file?.path
    if (!filePath) {
      return next()
    }

    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows = xlsx.utils.sheet_to_json(worksheet, { defval: '' })

    const services = rows
      .map((row) => normalizeRow(row))
      .filter(Boolean)

    req.fileParsed = {
      services,
      rawCount: rows.length,
    }

    fs.unlink(filePath, () => {})
    next()
  } catch (error) {
    next(error)
  }
}

export const uploadDirectoryFileConfig = {
  storage: {
    destination: (req, file, cb) => {
      const uploadsDir = path.join(__dirname, '..', 'uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now()
      const safeName = file.originalname.replace(/\s+/g, '-')
      cb(null, `${timestamp}-${safeName}`)
    },
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]

    if (allowed.includes(file.mimetype)) {
      cb(null, true)
      return
    }

    cb(new Error('Only .xlsx, .xls, or .csv files are allowed'))
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}
