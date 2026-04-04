import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('coverage_entries')
    .select(`
      *,
      payers (name, type),
      drugs (brand_name, generic_name),
      policy_documents (title, version, effective_date)
    `)
    .eq('drug_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}