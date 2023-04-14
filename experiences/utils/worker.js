/**
 * Run a worker without callbacks
 * <pre>
 *   const workResult = await runWorker(new UnionizedWorker(), args)
 * </pre>
 */
export function runWorker(worker, args) {
  worker.postMessage(args)
  return new Promise((resolve, reject) => {
    worker.addEventListener('message', (message) => {
      resolve(message.data)
    })
    worker.addEventListener('error', (error) => {
      console.error('worker error', error)
      reject(error)
    })
    worker.addEventListener('messageerror', (error) => {
      console.error('worker error', error)
      reject(error)
    })
  })
}
