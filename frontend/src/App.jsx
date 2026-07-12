import { useEffect, useState } from 'react'

export default function App() {
  const [serviceStatus, setServiceStatus] = useState('Connecting to backend...')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function checkBackend() {
      try {
        const response = await fetch('/api/health', { signal: controller.signal })
        if (!response.ok) throw new Error(`Health request failed: ${response.status}`)

        const health = await response.json()
        setConnected(health.status === 'UP')
        setServiceStatus(
          health.status === 'UP' ? 'Backend connected' : 'Backend reported an issue',
        )
      } catch (error) {
        if (error.name !== 'AbortError') setServiceStatus('Backend unavailable')
      }
    }

    checkBackend()
    return () => controller.abort()
  }, [])

  return (
    <main>
      <section className="card" aria-labelledby="page-title">
        <p className="eyebrow">Technical exercise</p>
        <h1 id="page-title">thortful card catalog</h1>
        <p className="intro">
          The runnable foundation is ready. Catalog functionality arrives in the next milestone.
        </p>
        <p className={`status ${connected ? 'status--connected' : ''}`} role="status">
          <span aria-hidden="true" />
          {serviceStatus}
        </p>
      </section>
    </main>
  )
}
