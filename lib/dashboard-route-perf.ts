type PerfMetaValue = string | number | boolean | null | undefined
type PerfMeta = Record<string, PerfMetaValue>
export function createDashboardRoutePerf(_route: string) {
  async function measure<T>(
    _label: string,
    fn: () => T | PromiseLike<T>,
    _getMeta?: (result: T) => PerfMeta | undefined
  ) {
    const result = await fn()
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

  function finish(_meta?: PerfMeta) {
    return
  }

  return {
    createScope,
    measure,
    finish,
  }
}
