# payloadcms-storage-cloudinary

This plugin integrates Cloudinary with PayloadCMS v3, enabling seamless media uploads to the Cloudinary service.

## Current status

[![codeql](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/codeql.yml/badge.svg)](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/codeql.yml)

[![test](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/test.yml/badge.svg)](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/test.yml)

[![publish](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/publish.yml/badge.svg)](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/publish.yml)

[![GitHub Super-Linter](https://github.com/ivanistao/payloadcms-storage-cloudinary/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/ivanistao/payloadcms-storage-cloudinary/actions/workflows/linter.yml)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/320b671855ce462d9c21b3769486c256)](https://app.codacy.com/gh/ivanistao/payloadcms-storage-cloudinary/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)


## Installation

To install the plugin, add it to your project:

```bash
pnpm i @ivanistao/payloadcms-storage-cloudinary
```

## Usage

To use the plugin, add it to your PayloadCMS configuration:

```typescript
import { cloudinaryStorage } from '@ivanistao/payloadcms-storage-cloudinary';
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
      },
      configs: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      }
    }),
  ],
});
```

## Configuration Options

- **collections**: Specify which collections Media, MediaWithPrefix
- **configs**: Set your Cloudinary environment variables:
  - `cloud_name`: Your Cloudinary cloud name.
  - `api_key`: Your Cloudinary API key.
  - `api_secret`: Your Cloudinary API secret.
- **options**: Additional options for the plugin, such as specifying a folder in Cloudinary.

## Acknowledgments

Thanks to the author [finkinfridom](https://github.com/finkinfridom) for the original repository [payload-cloudinary-plugin](https://github.com/finkinfridom/payload-cloudinary-plugin).