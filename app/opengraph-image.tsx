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
    eyebrow: "Developer learning notebook",
    title: "Your tutorial tabs are not a learning system.",
    description:
      "Capture notes, track progress, and review what you learn in one deliberate system built for self-taught developers.",
  })
}
