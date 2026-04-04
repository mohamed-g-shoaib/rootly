import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-background py-6 sm:py-8">
      <PageContainer className="max-w-3xl">
        <Card className="w-full">
          <CardHeader className="items-center text-center">
            <p className="text-7xl leading-none font-semibold tracking-tight sm:text-8xl">
              404
            </p>
            <CardTitle className="text-2xl text-balance sm:text-3xl">
              Page not found
            </CardTitle>
            <CardDescription className="mx-auto w-full max-w-xl text-center text-sm text-pretty sm:text-base">
              The page you are looking for does not exist or may have been
              moved.
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button render={<Link href="/" />}>Go home</Button>

              <Button variant="outline" render={<Link href="/overview" />}>
                Go to dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </main>
  )
}
