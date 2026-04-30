import MarketingLayout from "./(marketing)/layout"
import MarketingPage, { metadata } from "./(marketing)/page"
import MarketingTemplate from "./(marketing)/template"

export { metadata }

export default function Homepage() {
  return (
    <MarketingLayout>
      <MarketingTemplate>
        <MarketingPage />
      </MarketingTemplate>
    </MarketingLayout>
  )
}
