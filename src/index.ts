// import type { StorageOptions } from '@google-cloud/storage'
import type {
  Adapter,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Plugin, UploadCollectionSlug } from 'payload'
// cloud-storage
import { ConfigOptions, UploadApiOptions, v2 as cloudinary } from 'cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
// handler
import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getHandler } from './staticHandler'
import { CloudinaryService } from 'payload-cloudinary-plugin/dist/services/cloudinaryService'
import { DEFAULT_REQUIRED_FIELDS, GROUP_NAME, mapRequiredFields } from './utilities'

export interface CloudiaryStorageOptions {
  acl?: 'Private' | 'Public'

  /**
   * Collection options to apply the S3 adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>
  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean
  /**
   * Whether or not to disable local storage
   *
   * @default true
   */
  disableLocalStorage?: boolean

  configs: ConfigOptions

  options: UploadApiOptions
}

type CloudiaryStoragePlugin = (cloudiaryStorageArgs: CloudiaryStorageOptions) => Plugin

export const cloudiaryStorage: CloudiaryStoragePlugin =
  (cloudiaryStorageOptions: CloudiaryStorageOptions) =>
  (incomingConfig: Config): Config => {
    if (cloudiaryStorageOptions.enabled === false) {
      return incomingConfig
    }

    const adapter = cloudiaryStorageInternal(cloudiaryStorageOptions)

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      cloudiaryStorageOptions.collections,
    ).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
          adapter,
        },
      }),
      {} as Record<string, CollectionOptions>,
    )

    // Set disableLocalStorage: true for collections specified in the plugin options
    const config = {
      ...incomingConfig,
      collections: (incomingConfig.collections || []).map((collection) => {
        if (!collectionsWithAdapter[collection.slug]) {
          return collection
        }

        return {
          ...collection,
          upload: {
            ...(typeof collection.upload === 'object' ? collection.upload : {}),
            disableLocalStorage: true,
          },
        }
      }),
    }

    return cloudStoragePlugin({
      collections: collectionsWithAdapter,
    })(config)
  }

function cloudiaryStorageInternal({ acl, configs, options }: CloudiaryStorageOptions): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => {
    let storageService: null | CloudinaryService = null

    const getStorageClient = (): typeof cloudinary => {
      cloudinary.config(configs)

      return cloudinary
    }

    const getStorageService = (): CloudinaryService => {
      if (storageService) {
        return storageService
      }

      storageService = new CloudinaryService(configs, options)
      return storageService
    }

    return {
      name: 'cloudiary',
      fields: [
        {
          name: GROUP_NAME,
          type: 'group',
          fields: [...mapRequiredFields()],
          admin: { readOnly: true },
        },
      ],
      generateURL: getGenerateURL({ getStorageClient, cloud_name: configs.cloud_name, options }),
      handleDelete: getHandleDelete({ getStorageService, cloud_name: configs.cloud_name, options }),
      handleUpload: getHandleUpload({
        acl,
        collection,
        getStorageService,
        cloud_name: configs.cloud_name,
        options,
      }),
      staticHandler: getHandler({
        collection,
        getStorageClient,
        cloud_name: configs.cloud_name,
        options,
      }),
    }
  }
}
