'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export const DebugSupabase = () => {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testBasicFetch = async () => {
    try {
      addResult('Testing basic fetch to Supabase...')
      const response = await fetch('https://xlhpsqezvnrxlfwnarrm.supabase.co/rest/v1/', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaHBzcWV6dm5yeGxmd25hcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDM0MzAsImV4cCI6MjA3MDA3OTQzMH0.2SAoC5rLo-5EBxFj5G0eTcyDQYihnqe6YsW5F-th-mo'
        }
      })
      addResult(`✅ Basic fetch successful: ${response.status}`)
    } catch (error) {
      addResult(`❌ Basic fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testAuthEndpoint = async () => {
    try {
      addResult('Testing auth endpoint...')
      const response = await fetch('https://xlhpsqezvnrxlfwnarrm.supabase.co/auth/v1/settings', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaHBzcWV6dm5yeGxmd25hcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDM0MzAsImV4cCI6MjA3MDA3OTQzMH0.2SAoC5rLo-5EBxFj5G0eTcyDQYihnqe6YsW5F-th-mo'
        }
      })
      addResult(`✅ Auth endpoint accessible: ${response.status}`)
    } catch (error) {
      addResult(`❌ Auth endpoint failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testLocalAPI = async () => {
    try {
      addResult('Testing local API...')
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      addResult(`✅ Local API: ${data.success ? 'SUCCESS' : 'FAILED'} - ${data.message || data.error}`)
    } catch (error) {
      addResult(`❌ Local API failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>🔍 Supabase Connection Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testBasicFetch} size="sm">Test Basic Fetch</Button>
          <Button onClick={testAuthEndpoint} size="sm">Test Auth Endpoint</Button>
          <Button onClick={testLocalAPI} size="sm">Test Local API</Button>
          <Button onClick={clearResults} variant="outline" size="sm">Clear</Button>
        </div>
        
        <div className="bg-black/20 p-4 rounded-lg max-h-64 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-white/50 text-sm">Click a button to run tests...</p>
          ) : (
            results.map((result, index) => (
              <div key={`debug-result-${index}-${result.slice(0, 20)}`} className="text-sm text-white font-mono mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
