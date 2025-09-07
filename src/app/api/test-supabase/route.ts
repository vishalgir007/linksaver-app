import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection to Supabase
    const { error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Failed to connect to Supabase database'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Server-side Supabase test failed'
    }, { status: 500 })
  }
}
