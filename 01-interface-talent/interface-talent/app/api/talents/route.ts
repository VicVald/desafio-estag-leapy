import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();

  // Copy all search params
  for (const [key, value] of searchParams) {
    params.append(key, value);
  }

  // Default sort if not provided
  if (!params.has('sort')) params.set('sort', '-date_updated');

  try {
    // Use our custom Directus extension endpoint
    const response = await fetch(`http://localhost:8055/talents-api/talents?${params}`, {
      headers: {
        // Add auth if needed - for now using public access
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Directus extension: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching talents:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}