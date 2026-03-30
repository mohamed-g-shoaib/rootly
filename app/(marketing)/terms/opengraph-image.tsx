import {
  createRootlySocialImage,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@/lib/og-image"

export const alt = socialImageAlt
export const size = socialImageSize
export const contentType = socialImageContentType

export default function OpenGraphImage() {
  return createRootlySocialImage({
    eyebrow: "Terms of Service",
    title: "The rules for using Rootly.",
    description:
      "Read the terms that govern use of Rootly and the basic expectations around the service.",
    url: "rootly.vercel.app/terms",
  })
}
