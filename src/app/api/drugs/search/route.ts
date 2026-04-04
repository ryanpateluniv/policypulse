import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter q' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('drugs')
    .select('*')
    .or(`brand_name.ilike.%${q}%,generic_name.ilike.%${q}%`)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}