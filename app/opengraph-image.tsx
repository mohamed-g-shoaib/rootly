import { createRootlySocialImage, socialImageAlt, socialImageContentType, socialImageSize } from "@/lib/og-image"

export const alt = socialImageAlt
export const size = socialImageSize
export const contentType = socialImageContentType

export default function OpenGraphImage() {
  return createRootlySocialImage()
}
