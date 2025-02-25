import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary'

interface Args {
  getStorageClient: () => typeof cloudinary
  cloud_name?: string
  options?: UploadApiOptions
}

export const getGenerateURL =
  ({ getStorageClient, cloud_name }: Args): GenerateURL =>
  ({ data, filename }) => {
    const client = getStorageClient() 
    const filenameSlugs = filename.split('-_')
    const original_filename = filenameSlugs.pop()
    const public_id = filenameSlugs.join('/')
    return client.url(public_id, { cloud_name })
  }
