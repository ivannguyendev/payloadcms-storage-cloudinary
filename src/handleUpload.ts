import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import { APIError, type CollectionConfig } from 'payload'
import { CloudinaryService } from 'payload-cloudinary-plugin/dist/services/cloudinaryService'
import { GROUP_NAME } from './utilities'
import { UploadApiOptions } from 'cloudinary'

interface Args {
  acl?: 'Private' | 'Public'
  collection: CollectionConfig
  getStorageService: () => CloudinaryService
  cloud_name?: string
  options?: UploadApiOptions
}

export const getHandleUpload = ({ acl, getStorageService }: Args): HandleUpload => {
  return async ({ data, file, collection, req }) => {
    if (!(file && data?.filename)) {
      return
    }
    try {
      req.payload.config.paths ??= { config: '', configDir: '', rawConfig: '' }
      const uploadResponse = await getStorageService().upload(
        file.filename,
        file.buffer,
        req.payload as any,
        collection as any,
      )

      if (data.filename === file.filename) {
        data.filename = `${uploadResponse?.public_id}/${data.filename}`.replaceAll('/', '-_')
        data.url = uploadResponse?.url
        data.folder = uploadResponse?.folder
        data[GROUP_NAME] = uploadResponse
      }

      for (const key of Object.keys(data.sizes)) {
        const f = data.sizes[key]
        if (f.filename === file.filename) {
          f.filename = `${uploadResponse?.public_id}/${f.filename}`.replaceAll('/', '-_')
          f.url = uploadResponse?.url
          f.folder = uploadResponse?.folder
          f[GROUP_NAME] = uploadResponse
        }
      }

      if (data.sizes.thumbnail?.url) {
        data.thumbnailURL = data.sizes.thumbnail?.url
      }

      return data
    } catch (e) {
      console.error(e)
      throw new APIError(`Cloudinary: ${JSON.stringify(e)}`)
    }
  }
}
