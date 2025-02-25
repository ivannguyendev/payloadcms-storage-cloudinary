import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import { CloudinaryService } from 'payload-cloudinary-plugin/dist/services/cloudinaryService'
import { UploadApiOptions } from 'cloudinary'

interface Args {
  getStorageService: () => CloudinaryService
  cloud_name?: string
  options?: UploadApiOptions
}

export const getHandleDelete = ({ getStorageService }: Args): HandleDelete => {
  return async ({ doc, filename }) => {
    const mimeType = doc.mimeType.split('/').shift()
    const resource_type = mimeType !== 'video' && mimeType !== 'image' ? 'raw' : mimeType
    const filenameSlugs = filename.split('-_')
    const original_filename = filenameSlugs.pop()
    const public_id = filenameSlugs.join('/')

    return getStorageService().delete(public_id, {
      resource_type,
    })
  }
}
