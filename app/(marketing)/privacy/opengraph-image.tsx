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
    eyebrow: "Privacy Policy",
    title: "How Rootly handles your data.",
    description:
      "Read how account data, product content, and your basic information choices are handled in Rootly.",
    url: "rootly.vercel.app/privacy",
  })
}
