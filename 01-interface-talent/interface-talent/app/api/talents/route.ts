import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isExport = searchParams.get('export') === 'csv';
  const params = new URLSearchParams();

  // Copy all search params except export
  for (const [key, value] of searchParams) {
    if (key !== 'export') {
      params.append(key, value);
    }
  }

  // For export, remove pagination to get all data
  if (isExport) {
    params.delete('limit');
    params.delete('page');
  }

  // Default sort if not provided
  if (!params.has('sort')) params.set('sort', '-date_updated');

  try {
    // Use our custom Directus extension endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/talents-api/talents?${params}`, {
      headers: {
        // Add auth if needed - for now using public access
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Directus extension: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (isExport) {
      // Generate CSV
      const headers = [
        'Email',
        'Telefone',
        'Departamento',
        'Status',
        'PDI Pronto',
        'Estado do Orchestrator',
        'Líder',
        'Cargo Alvo',
        'Data de Início',
        'Data de Fim',
        'Última Atualização'
      ];

      const csvContent = [
        headers.join(','),
        ...data.data.map((talent: any) => [
          talent.user_email,
          talent.phone_number,
          talent.department,
          talent.current_status,
          talent.pdi_plan_ready ? 'Sim' : 'Não',
          talent.orchestrator_state || 'N/A',
          talent.leader_email,
          talent.target_role_name,
          new Date(talent.start_date).toLocaleDateString('pt-BR'),
          new Date(talent.end_date).toLocaleDateString('pt-BR'),
          new Date(talent.date_updated).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="talentos_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching talents:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}