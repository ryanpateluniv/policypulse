import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  let query = supabase.from('drugs').select('*')
  
  if (q) {
    query = query.or(`brand_name.ilike.%${q}%,generic_name.ilike.%${q}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}