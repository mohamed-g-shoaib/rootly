type PerfMetaValue = string | number | boolean | null | undefined
type PerfMeta = Record<string, PerfMetaValue>
type PerfStep = { label: string; ms: number; meta?: PerfMeta }

function roundMs(value: number) {
  return Math.round(value * 10) / 10
}

function nowMs() {
  return performance.now()
}

export function createDashboardRoutePerf(route: string) {
  const enabled = process.env.ROOTLY_DASHBOARD_PERF === "1"
  const routeStart = nowMs()
  const steps: PerfStep[] = []

  function pushStep(label: string, ms: number, meta?: PerfMeta) {
    if (!enabled) return
    steps.push({
      label,
      ms: roundMs(ms),
      meta,
    })
  }

  async function measure<T>(
    label: string,
    fn: () => T | PromiseLike<T>,
    getMeta?: (result: T) => PerfMeta | undefined
  ) {
    const stepStart = nowMs()
    const result = await fn()
    pushStep(label, nowMs() - stepStart, getMeta?.(result))

    return result
  }

  function createScope(prefix: string) {
    return {
      async measure<T>(
        label: string,
        fn: () => T | PromiseLike<T>,
        getMeta?: (result: T) => PerfMeta | undefined
      ) {
        return measure(`${prefix}:${label}`, fn, getMeta)
      },
    }
  }

  function finish(meta?: PerfMeta) {
    if (!enabled) return

    console.info(
      "[dashboard-perf]",
      JSON.stringify({
        route,
        totalMs: roundMs(nowMs() - routeStart),
        steps,
        meta,
      })
    )
  }

  return {
    createScope,
    measure,
    finish,
  }
}
