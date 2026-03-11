import { Github01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import RootlyLogo from "@/components/rootly-logo"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { Separator } from "@/components/ui/separator"

export default function HomepageFooter() {
  return (
    <footer className="pt-14">
      <PageContainer>
        <Separator />
        <div className="flex flex-col gap-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <RootlyLogo className="size-5" />
            <div>Built with ♥ for self-taught developers.</div>
          </div>

          <div className="text-center">© 2026 Rootly</div>

          <div className="flex items-center justify-center sm:justify-end">
            <Button
              variant="ghost"
              render={
                <a
                  href="https://github.com/mohamed-g-shoaib/rootly"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                />
              }
              className="gap-2"
            >
              <HugeiconsIcon icon={Github01Icon} size={18} />
              GitHub
            </Button>
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}
