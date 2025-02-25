import { Field, FieldBase } from 'payload'

/**
 * Extract '_key' value from the doc safely
 */
export const getKeyFromFilename = (doc: unknown, filename: string) => {
  if (
    doc &&
    typeof doc === 'object' &&
    'filename' in doc &&
    doc.filename === filename &&
    '_key' in doc
  ) {
    return doc._key as string
  }
  if (doc && typeof doc === 'object' && 'sizes' in doc) {
    const sizes = doc.sizes
    if (typeof sizes === 'object' && sizes !== null) {
      for (const size of Object.values(sizes)) {
        if (size?.filename === filename && '_key' in size) {
          return size._key as string
        }
      }
    }
  }
}

export const GROUP_NAME = 'cloudinary'

export const DEFAULT_REQUIRED_FIELDS = [
  { name: 'public_id', label: 'Public ID' },
  { name: 'original_filename', label: 'Original filename' },
  { name: 'format', label: 'Format' },
  { name: 'secure_url', label: 'URL' },
  { name: 'resource_type', label: 'Resource Type' },
  { name: 'folder', label: 'Folder' },
]

const setCloudinaryField = (inputField: Partial<Field> | string): Field => {
  const numberField = ['height', 'width', 'size']
  const booleanField = ['isPrivateFile']

  const field: Partial<Field> = getPartialField(inputField)
  const name = (field as FieldBase).name
  if (numberField.includes(name)) {
    field.type = 'number'
  } else if (booleanField.includes(name)) {
    field.type = 'checkbox'
  } else {
    field.type = 'text'
  }

  return field as Field
}

export const getPartialField = (field: string | Partial<Field>) => {
  return typeof field === 'string'
    ? {
        name: field,
      }
    : field
}
export const mapRequiredFields = (additionalFields?: Array<Partial<Field> | string>): Field[] => {
  const merge = (additionalFields || []).concat(DEFAULT_REQUIRED_FIELDS)
  return merge
    .filter(
      (item, idx, arr) =>
        arr.findIndex((itemToFind) => {
          const partialItem = getPartialField(item) as FieldBase
          const partialItemToFind = getPartialField(itemToFind) as FieldBase
          return partialItem.name === partialItemToFind.name
        }) === idx,
    )
    .map((name) => setCloudinaryField(name))
}
