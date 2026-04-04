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
    eyebrow: "Learning tracker and study notebook",
    title: "Turn scattered learning into organized progress.",
    description:
      "Capture notes, track study time, and review what you learn across any subject.",
  })
}
