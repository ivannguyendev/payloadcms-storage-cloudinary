import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary'

interface Args {
  collection: CollectionConfig
  getStorageClient: () => typeof cloudinary
  cloud_name?: string
  options?: UploadApiOptions
}

export const getHandler = ({ cloud_name, getStorageClient }: Args): StaticHandler => {
  return async (req, { doc, params }) => {
    try {
      const client = getStorageClient()
      const filenameSlugs = params.filename.split('-_')
      const original_filename = filenameSlugs.pop()
      const public_id = filenameSlugs.join('/')
      const response = await fetch(client.url(public_id, { cloud_name }))

      if (!response.ok) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      const blob = await response.blob()

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const objectEtag = response.headers.get('etag') as string

      if (etagFromHeaders && etagFromHeaders === objectEtag) {
        return new Response(null, {
          headers: new Headers({
            'Content-Length': String(blob.size),
            'Content-Type': blob.type,
            ETag: objectEtag,
          }),
          status: 304,
        })
      }

      return new Response(blob, {
        headers: new Headers({
          'Content-Length': String(blob.size),
          'Content-Type': blob.type,
          ETag: objectEtag,
        }),
        status: 200,
      })
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Unexpected error in staticHandler' })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
