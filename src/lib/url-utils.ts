/**
 * URL utility functions for bookmark management
 */

/**
 * Normalizes a URL by removing tracking parameters and standardizing format
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    
    // Remove common tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'ref', 'source', 'campaign',
      '_ga', '_gl', 'mc_cid', 'mc_eid'
    ]
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param)
    })
    
    // Remove www. subdomain for consistency
    if (urlObj.hostname.startsWith('www.')) {
      urlObj.hostname = urlObj.hostname.substring(4)
    }
    
    // Remove trailing slash for consistency
    if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
      urlObj.pathname = urlObj.pathname.slice(0, -1)
    }
    
    return urlObj.toString()
  } catch {
    throw new Error('Invalid URL format')
  }
}

/**
 * Validates if a URL is valid and follows our requirements
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  try {
    const urlObj = new URL(url)
    
    // Must be HTTPS
    if (urlObj.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use HTTPS protocol' }
    }
    
    // Must have a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return { isValid: false, error: 'Invalid hostname' }
    }
    
    // Block localhost and private IPs for security
    if (
      urlObj.hostname === 'localhost' ||
      urlObj.hostname.startsWith('127.') ||
      urlObj.hostname.startsWith('192.168.') ||
      urlObj.hostname.startsWith('10.') ||
      urlObj.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return { isValid: false, error: 'Private or local URLs are not allowed' }
    }
    
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Checks if a URL is reachable
 */
export async function checkUrlReachability(url: string): Promise<{ isReachable: boolean; error?: string }> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'User-Agent': 'LinkSaver/1.0 (Bookmark Bot)'
      }
    })
    
    if (response.ok) {
      return { isReachable: true }
    } else if (response.status === 403) {
      return { isReachable: false, error: 'Access forbidden - URL requires authentication' }
    } else if (response.status === 404) {
      return { isReachable: false, error: 'URL not found (404)' }
    } else {
      return { isReachable: false, error: `Server returned ${response.status} status` }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return { isReachable: false, error: 'URL timeout - server not responding' }
      }
      return { isReachable: false, error: 'URL is unreachable or blocked' }
    }
    return { isReachable: false, error: 'Unknown error checking URL' }
  }
}

/**
 * Extracts domain from URL for display
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return 'Invalid URL'
  }
}

/**
 * Predefined categories for bookmarks
 */
export const BOOKMARK_CATEGORIES = [
  'Work',
  'Personal',
  'Learning',
  'Entertainment',
  'News',
  'Shopping',
  'Travel',
  'Health',
  'Technology',
  'Finance',
  'Other'
] as const

export type BookmarkCategory = typeof BOOKMARK_CATEGORIES[number]
