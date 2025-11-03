'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Talent {
  id: string;
  user_id: string;
  phone_number: string;
  start_date: string;
  end_date: string;
  department: string;
  current_status: string;
  orchestrator_state?: string;
  pdi_plan_ready: boolean;
  leader_id: number;
  target_role_id: number;
  date_updated: string;
  user_email: string;
  leader_user_id: string;
  leader_email: string;
  target_role_name: string;
}

interface ApiResponse {
  data: Talent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [pdiReady, setPdiReady] = useState('');
  const [orchestratorState, setOrchestratorState] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sort, setSort] = useState('email');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Debounce search for API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Initialize state from URL parameters only once
  useEffect(() => {
    if (initialized) return;

    const urlSearch = searchParams.get('search') || '';
    const urlDepartment = searchParams.get('department') || '';
    const urlStatus = searchParams.get('status') || '';
    const urlPdiReady = searchParams.get('pdiReady') || '';
    const urlOrchestratorState = searchParams.get('orchestratorState') || '';
    const urlStartDate = searchParams.get('startDate') || '';
    const urlEndDate = searchParams.get('endDate') || '';
    const urlLeaderId = searchParams.get('leaderId') || '';
    const urlRoleId = searchParams.get('roleId') || '';
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlViewMode = (searchParams.get('viewMode') as 'cards' | 'table') || 'cards';
    const urlSort = searchParams.get('sort') || '';

    setSearch(urlSearch);
    setDepartment(urlDepartment);
    setStatus(urlStatus);
    setPdiReady(urlPdiReady);
    setOrchestratorState(urlOrchestratorState);
    setStartDate(urlStartDate);
    setEndDate(urlEndDate);
    setLeaderId(urlLeaderId);
    setRoleId(urlRoleId);
    setPage(urlPage);
    setViewMode(urlViewMode);
    setSort(urlSort);
    setInitialized(true);
  }, [searchParams, initialized]);

  // Update URL when filters change (debounced)
  useEffect(() => {
    if (!initialized) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();

      if (search) params.set('search', search);
      if (department) params.set('department', department);
      if (status) params.set('status', status);
      if (pdiReady) params.set('pdiReady', pdiReady);
      if (orchestratorState) params.set('orchestratorState', orchestratorState);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (leaderId) params.set('leaderId', leaderId);
      if (roleId) params.set('roleId', roleId);
      if (page > 1) params.set('page', page.toString());
      if (viewMode !== 'cards') params.set('viewMode', viewMode);
      if (sort && sort !== 'email') params.set('sort', sort);

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : '';

      router.replace(newUrl, { scroll: false });
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [search, department, status, pdiReady, orchestratorState, startDate, endDate, leaderId, roleId, page, viewMode, sort, router, initialized]);

  // Reset page to 1 when filters change (except page itself)
  useEffect(() => {
    setPage(1);
  }, [search, department, status, pdiReady, orchestratorState, startDate, endDate, leaderId, roleId]);

  const fetchTalents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: '10',
        page: page.toString(),
      });

      if (sort && sort !== 'email') params.append('sort', sort);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (department) params.append('department', department);
      if (status) params.append('current_status', status);
      if (pdiReady) params.append('pdi_plan_ready', pdiReady);
      if (orchestratorState) params.append('orchestrator_state', orchestratorState);
      if (startDate) params.append('start_date_gte', startDate);
      if (endDate) params.append('end_date_lte', endDate);
      if (leaderId) params.append('leader_id', leaderId);
      if (roleId) params.append('target_role_id', roleId);

      const response = await fetch(`/api/talents?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: ApiResponse = await response.json();
      setTalents(data.data);
      setTotal(data.pagination.total);
      setHasNext(data.pagination.hasNext);
      setHasPrev(data.pagination.hasPrev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, [page, debouncedSearch, department, status, pdiReady, orchestratorState, startDate, endDate, leaderId, roleId, sort]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Lista de Talentos</h1>
            {/* <p className="py-6">
              Gerencie e visualize todos os talentos da plataforma com filtros avançados e paginação.
            </p> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Filtros */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Filtros</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Buscar por email</span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Departamento</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">Todos os Departamentos</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">Todos os Status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING_FIRST_ACCESS">PENDING_FIRST_ACCESS</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ONBOARDING">ONBOARDING</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">PDI Pronto</span>
                </label>
                <select
                  value={pdiReady}
                  onChange={(e) => setPdiReady(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">Todos</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Estado do Orchestrator</span>
                </label>
                <select
                  value={orchestratorState}
                  onChange={(e) => setOrchestratorState(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">Todos</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ONBOARDING">ONBOARDING</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Data de Início (de)</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Data de Fim (até)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">ID do Líder</span>
                </label>
                <input
                  type="number"
                  placeholder="Digite o ID..."
                  value={leaderId}
                  onChange={(e) => setLeaderId(e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">ID do Cargo</span>
                </label>
                <input
                  type="number"
                  placeholder="Digite o ID..."
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            </div>

                          <button
                onClick={() => {
                  setSearch('');
                  setDepartment('');
                  setStatus('');
                  setPdiReady('');
                  setOrchestratorState('');
                  setStartDate('');
                  setEndDate('');
                  setLeaderId('');
                  setRoleId('');
                  setSort('');
                  router.push('/');
                }}
                className="btn btn-outline btn-error"
              >
                🗑️ Limpar Filtros
              </button>
          </div>
        </div>

        {/* Ordenar por */}
        <div className="flex justify-start mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ordenar por</span>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-bordered"
            >
              <option value="-date_updated">Última atualização (mais recente)</option>
              <option value="date_updated">Última atualização (mais antiga)</option>
              <option value="old_start_date">Data de início (antiga primeiro)</option>
              <option value="new_start_date">Data de início (nova primeiro)</option>
              <option value="end_date">Data de fim (ascendente)</option>
            </select>
          </div>
        </div>

        {/* Stats - Discreto */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-base-content/70 text-sm">
            Total de Talentos: <span className="font-semibold text-base-content">{total}</span>
            {total > 0 && <span className="ml-2">• Página {page}</span>}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
            >
              📄 Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
            >
              📋 Tabela
            </button>
          </div>
        </div>

        {/* Estado de Carregamento e Erro */}
        {loading && (
          <div className="flex justify-center my-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Erro: {error}</span>
            </div>
          </div>
        )}

        {/* Lista de Talentos */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.map((talent) => (
              <div key={talent.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="card-title text-lg">{talent.user_email}</h2>
                      <div className="badge badge-primary">{talent.current_status}</div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Telefone:</span>
                      <span className="text-sm">{talent.phone_number}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Departamento:</span>
                      <span className="text-sm">{talent.department}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">PDI Pronto:</span>
                      <div className={`badge ${talent.pdi_plan_ready ? 'badge-success' : 'badge-warning'}`}>
                        {talent.pdi_plan_ready ? 'Sim' : 'Não'}
                      </div>
                    </div>

                    {talent.orchestrator_state && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Orchestrator:</span>
                        <div className="badge badge-info">{talent.orchestrator_state}</div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Líder:</span>
                      <span className="text-sm">{talent.leader_email}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cargo Alvo:</span>
                      <span className="text-sm">{talent.target_role_name}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="text-xs text-base-content/70">
                      <div>Início: {new Date(talent.start_date).toLocaleDateString('pt-BR')}</div>
                      <div>Fim: {new Date(talent.end_date).toLocaleDateString('pt-BR')}</div>
                      <div>Atualizado: {new Date(talent.date_updated).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra table-compact">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Departamento</th>
                  <th>Status</th>
                  <th>PDI Pronto</th>
                  <th>Orchestrator</th>
                  <th>Líder</th>
                  <th>Cargo Alvo</th>
                  <th>Data Início</th>
                  <th>Data Fim</th>
                  <th>Última Atualização</th>
                </tr>
              </thead>
              <tbody>
                {talents.map((talent) => (
                  <tr key={talent.id}>
                    <td>
                      <div className="font-bold text-sm">{talent.user_email}</div>
                    </td>
                    <td className="text-sm">{talent.phone_number}</td>
                    <td className="text-sm">{talent.department}</td>
                    <td>
                      <div className="badge badge-primary badge-sm">{talent.current_status}</div>
                    </td>
                    <td>
                      <div className={`badge ${talent.pdi_plan_ready ? 'badge-success' : 'badge-warning'} badge-sm`}>
                        {talent.pdi_plan_ready ? 'Sim' : 'Não'}
                      </div>
                    </td>
                    <td>
                      {talent.orchestrator_state && (
                        <div className="badge badge-info badge-sm">{talent.orchestrator_state}</div>
                      )}
                    </td>
                    <td className="text-sm">{talent.leader_email}</td>
                    <td className="text-sm">{talent.target_role_name}</td>
                    <td className="text-sm">{new Date(talent.start_date).toLocaleDateString('pt-BR')}</td>
                    <td className="text-sm">{new Date(talent.end_date).toLocaleDateString('pt-BR')}</td>
                    <td className="text-xs text-base-content/70">
                      {new Date(talent.date_updated).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {talents.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!hasPrev}
                className="join-item btn"
              >
                « Anterior
              </button>
              <button className="join-item btn btn-active">
                Página {page}
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
                className="join-item btn"
              >
                Próximo »
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && talents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">Nenhum talento encontrado</h3>
            <p className="text-base-content/70">Tente ajustar os filtros para encontrar mais resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
