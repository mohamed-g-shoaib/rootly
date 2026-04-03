type PerfMetaValue = string | number | boolean | null | undefined
type PerfMeta = Record<string, PerfMetaValue>

async function measurePerf<T>(
  _label: string,
  fn: () => T | PromiseLike<T>,
  _getMeta?: (result: T) => PerfMeta | undefined
) {
  const result = await fn()
  return result
}

function finishPerf(_meta?: PerfMeta) {
  return
}

export function createDashboardRoutePerf(_route: string) {
  function createScope(prefix: string) {
    return {
      async measure<T>(
        label: string,
        fn: () => T | PromiseLike<T>,
        getMeta?: (result: T) => PerfMeta | undefined
      ) {
        return measurePerf(`${prefix}:${label}`, fn, getMeta)
      },
    }
  }

  return {
    createScope,
    measure: measurePerf,
    finish: finishPerf,
  }
}
