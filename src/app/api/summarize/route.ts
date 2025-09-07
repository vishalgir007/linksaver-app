import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { normalizeUrl, validateUrl, checkUrlReachability } from '@/lib/url-utils'

const JINA_API_KEY = 'jina_83f1bad38b854ee2bc7dceb5d88f6a81RjDEW_01De3vrUfJFp01NQq94ncf'
const JINA_READER_BASE_URL = 'https://r.jina.ai'
const MAX_CONTENT_LENGTH = 10000 // Reasonable limit for AI processing

interface JinaResponse {
  code: number
  status: number
  data: {
    title?: string
    description?: string
    content?: string
    url: string
  }
}

interface BookmarkData {
  url: string
  title?: string
  summary?: string
  favicon?: string | null
}

/**
 * Extract favicon URL from a website
 */
async function extractFavicon(url: string): Promise<string | null> {
  try {
    // Try common favicon locations
    const domain = new URL(url).origin
    const faviconPaths = [
      '/favicon.ico',
      '/favicon.png',
      '/apple-touch-icon.png',
      '/apple-touch-icon-152x152.png'
    ]
    
    for (const path of faviconPaths) {
      try {
        const faviconUrl = `${domain}${path}`
        const response = await fetch(faviconUrl, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok && response.headers.get('content-type')?.includes('image')) {
          return faviconUrl
        }
      } catch {
        // Continue to next favicon path
        continue
      }
    }
    
    // Fallback to Google's favicon service
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
  } catch {
    return null
  }
}

/**
 * Fetch content and metadata using Jina Reader API
 */
async function fetchWithJina(url: string): Promise<BookmarkData> {
  try {
    const jinaUrl = `${JINA_READER_BASE_URL}/${encodeURIComponent(url)}`
    
    const response = await fetch(jinaUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      throw new Error(`Jina API error: ${response.status}`)
    }

    const data: JinaResponse = await response.json()
    
    // Extract title and content
    const title = data.data.title || data.data.description || 'Untitled'
    let content = data.data.content || data.data.description || ''
    
    // Truncate content if too long
    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.substring(0, MAX_CONTENT_LENGTH) + '...'
    }
    
    // Get favicon
    const favicon = await extractFavicon(url)
    
    return {
      url,
      title: title.trim(),
      summary: content.trim(),
      favicon
    }
  } catch (error) {
    console.error('Jina API error:', error)
    
    // Fallback: try to extract basic info without Jina
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
        headers: {
          'User-Agent': 'LinkSaver/1.0 (Bookmark Bot)'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Extract title from HTML
        const titleRegex = /<title[^>]*>([^<]+)<\/title>/i
        const titleMatch = html.match(titleRegex)
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled'
        
        // Extract meta description
        const descRegex = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
        const descMatch = html.match(descRegex)
        const description = descMatch ? descMatch[1].trim() : 'No description available'
        
        const favicon = await extractFavicon(url)
        
        return {
          url,
          title,
          summary: description,
          favicon
        }
      }
    } catch {
      // Final fallback
    }
    
    return {
      url,
      title: 'Unable to fetch title',
      summary: 'Unable to fetch content summary',
      favicon: null
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, userId } = await request.json()
    
    if (!url || !userId) {
      return NextResponse.json(
        { error: 'URL and user ID are required' },
        { status: 400 }
      )
    }
    
    // Validate URL format
    const validation = validateUrl(url)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    // Normalize URL
    const normalizedUrl = normalizeUrl(url)
    
    // Check if URL is reachable
    const reachability = await checkUrlReachability(normalizedUrl)
    if (!reachability.isReachable) {
      return NextResponse.json(
        { error: reachability.error },
        { status: 400 }
      )
    }
    
    // Check for existing bookmark
    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('url', normalizedUrl)
      .is('deleted_at', null)
      .single()
    
    if (existingBookmark) {
      return NextResponse.json(
        { error: 'This URL is already bookmarked' },
        { status: 409 }
      )
    }
    
    // Fetch content with Jina
    const bookmarkData = await fetchWithJina(normalizedUrl)
    
    return NextResponse.json({
      success: true,
      data: bookmarkData
    })
    
  } catch (error) {
    console.error('Summarize API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
