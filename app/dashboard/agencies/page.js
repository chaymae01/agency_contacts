'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agencies');
      
      if (response.ok) {
        const data = await response.json();
        setAgencies(data.agencies || []);
      } else {
        console.error('Erreur lors du chargement des agences');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les agences basé sur la recherche
  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agency.state && agency.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (agency.county && agency.county.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (agency.type && agency.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgencies = filteredAgencies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);

  const handleViewContacts = (agencyId) => {
    router.push(`/dashboard/agencies/${agencyId}/contacts`);
  };

  const handleViewDetails = (agency) => {
    setSelectedAgency(agency);
    setShowModal(true);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  };

  const getAgencyInitials = (name) => {
    return name
      ? name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)
      : 'AG';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading agencies...
...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header Moderne */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
                Agencies Lis
              </h1>
            </div>
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/60">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-700">
                {filteredAgencies.length} agenc(y/ies) found
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards Ultra Modernes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">Total agencies</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{agencies.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">States represented</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {new Set(agencies.map(a => a.state).filter(Boolean)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">Unique types</p>
                <p className="text-3xl font-bold text-violet-600 mt-2">
                  {new Set(agencies.map(a => a.type).filter(Boolean)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">With website</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {agencies.filter(a => a.website).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Ultra Moderne */}
        <div className="mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search an agency by name, state, type, or county..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-4 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-slate-300/60 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-lg transition-all duration-500 text-lg placeholder-slate-500 focus:shadow-2xl focus:scale-105"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Agencies Table Ultra Moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden hover:shadow-3xl transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/60">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                   Agency Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    State / Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Population
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Schools / Students
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                   County / Locale
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200/60">
                {currentAgencies.length > 0 ? (
                  currentAgencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {getAgencyInitials(agency.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                              {agency.name}
                            </div>
                            {agency.website && (
                              <div className="text-sm text-cyan-600 truncate max-w-xs hover:text-cyan-700 transition-colors">
                                <a href={agency.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {agency.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {formatValue(agency.state)}
                        </div>
                        <div className="text-sm text-slate-500">
                          {formatValue(agency.state_code)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatValue(agency.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {formatValue(agency.population)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <div>Schools:<span className="font-semibold text-slate-900">{formatValue(agency.total_schools)}</span></div>
                        <div>Students: <span className="font-semibold text-slate-900">{formatValue(agency.total_students)}</span></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div>{formatValue(agency.county)}</div>
                        <div>{formatValue(agency.locale)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                        <button
                          onClick={() => handleViewDetails(agency)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                         View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">
                          {searchTerm ? 'No agencies found' : 'Aucune agence disponible'}
                        </p>
                        <p className="text-slate-600 max-w-md mx-auto">
                          {searchTerm 
                            ? 'Essayez de modifier vos critères de recherche pour trouver des agences correspondantes.' 
                            : 'Les agences apparaîtront ici une fois disponibles dans le système.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Ultra Moderne */}
          {totalPages > 1 && (
            <div className="bg-white/60 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-t border-slate-200/60">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-slate-700 font-medium">
                  Page <span className="font-bold text-slate-900">{currentPage}</span> sur{' '}
                  <span className="font-bold text-slate-900">{totalPages}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-300/60 rounded-xl text-sm font-semibold text-slate-700 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-300/60 rounded-xl text-sm font-semibold text-slate-700 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Détails Agence Ultra Moderne */}
      {showModal && selectedAgency && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-scaleIn">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-cyan-50/50 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {getAgencyInitials(selectedAgency.name)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedAgency.name}</h3>
                    <p className="text-slate-600 mt-1">{selectedAgency.type} • {selectedAgency.state}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* Main Information */}
    <div className="space-y-6">
      <h4 className="font-bold text-slate-900 text-lg border-b border-slate-200/60 pb-3">
        Main Information
      </h4>
      <DetailRow label="Name" value={selectedAgency.name} />
      <DetailRow label="Type" value={selectedAgency.type} />
      <DetailRow label="State" value={selectedAgency.state} />
      <DetailRow label="State Code" value={selectedAgency.state_code} />
      <DetailRow label="County" value={selectedAgency.county} />
      <DetailRow label="Locale" value={selectedAgency.locale} />
      <DetailRow label="Status" value={selectedAgency.status} />
    </div>

    {/* Demographics */}
    <div className="space-y-6">
      <h4 className="font-bold text-slate-900 text-lg border-b border-slate-200/60 pb-3">
        Demographics
      </h4>
      <DetailRow label="Population" value={selectedAgency.population} type="number" />
      <DetailRow label="Number of Schools" value={selectedAgency.total_schools} type="number" />
      <DetailRow label="Number of Students" value={selectedAgency.total_students} type="number" />
      <DetailRow label="Student/Teacher Ratio" value={selectedAgency.student_teacher_ratio} />
      <DetailRow label="Grade Span" value={selectedAgency.grade_span} />
    </div>

    {/* Contact */}
    <div className="space-y-6">
      <h4 className="font-bold text-slate-900 text-lg border-b border-slate-200/60 pb-3">
        Contact
      </h4>
      <DetailRow label="Phone" value={selectedAgency.phone} />
      <DetailRow label="Website" value={selectedAgency.website} type="url" />
      <DetailRow label="Email Domain" value={selectedAgency.domain_name} />
      <DetailRow label="Mailing Address" value={selectedAgency.mailing_address} />
      <DetailRow label="Physical Address" value={selectedAgency.physical_address} />
    </div>

    {/* Other Information */}
    <div className="space-y-6">
      <h4 className="font-bold text-slate-900 text-lg border-b border-slate-200/60 pb-3">
        Other Information
      </h4>
      <DetailRow label="CSA/CBSA" value={selectedAgency.csa_cbsa} />
      <DetailRow label="Supervisory Union" value={selectedAgency.supervisory_union} />
      <DetailRow label="Contact Form URL" value={selectedAgency.contact_form_url} type="url" />
      <DetailRow
        label="Created At"
        value={selectedAgency.created_at ? new Date(selectedAgency.created_at).toLocaleDateString('en-US') : 'N/A'}
      />
      <DetailRow
        label="Updated At"
        value={selectedAgency.updated_at ? new Date(selectedAgency.updated_at).toLocaleDateString('en-US') : 'N/A'}
      />
    </div>

  </div>
</div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-200/60 bg-slate-50/50 rounded-b-3xl flex justify-end space-x-4">
             
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// Composant pour afficher une ligne de détail
function DetailRow({ label, value, type = 'text' }) {
  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return 'N/A';
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  };

  const renderValue = () => {
    const formattedValue = formatValue(value);
    
    if (type === 'url' && formattedValue !== 'N/A') {
      return (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-600 hover:text-cyan-700 break-all transition-colors duration-300 hover:underline"
        >
          {formattedValue}
        </a>
      );
    }
    
    return <span className="break-all text-slate-900 font-medium">{formattedValue}</span>;
  };

  return (
    <div className="flex justify-between items-start group">
      <span className="text-sm font-semibold text-slate-700 min-w-32 group-hover:text-slate-900 transition-colors">{label}:</span>
      <span className="text-sm text-right flex-1 ml-6">
        {renderValue()}
      </span>
    </div>
  );
}