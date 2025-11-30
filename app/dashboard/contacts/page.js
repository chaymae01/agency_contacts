'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userData, setUserData] = useState(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [expandedContact, setExpandedContact] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchContacts();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        if (data.dailyViews >= 50) {
          setDailyLimitReached(true);
        }
      }
    } catch (error) {
      console.error('Erreur fetch user:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else if (response.status === 429) {
        setDailyLimitReached(true);
        setContacts([]);
      } else {
        console.error('Erreur lors du chargement des contacts');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contact) => {
    if (dailyLimitReached) return;

    const isClosing = expandedContact === contact.id;
    setExpandedContact(isClosing ? null : contact.id);

    if (!isClosing) {
      try {
        const response = await fetch('/api/contacts/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contactId: contact.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          
          if (data.user.dailyViews >= 50) {
            setDailyLimitReached(true);
          }
        } else if (response.status === 429) {
          setDailyLimitReached(true);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  // Filtrer les contacts
  const filteredContacts = contacts.filter(contact =>
    `${contact.first_name || ''} ${contact.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.title && contact.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.agency && contact.agency.name && contact.agency.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const resetDailyLimit = async () => {
    try {
      const response = await fetch('/api/reset-limit', {
        method: 'POST',
      });
      if (response.ok) {
        setDailyLimitReached(false);
        fetchUserData();
        fetchContacts();
      }
    } catch (error) {
      console.error('Erreur reset limit:', error);
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (value instanceof Date) return value.toLocaleDateString('fr-FR');
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading contacts...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Moderne */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Contacts List
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {userData && (
                <div className="text-right">
                  <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${dailyLimitReached ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {userData.dailyViews}/50 consultations
                      </div>
                      {dailyLimitReached && (
                        <div className="text-xs text-red-600 font-medium">
                         Limit reached
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Bannière limite atteinte - Design Moderne */}
        {dailyLimitReached && (
          <div className="mb-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-2xl shadow-red-500/25">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Daily limit reached!</h3>
                </div>
                <p className="text-red-100 mb-4 text-lg">
                 You have viewed 50 contacts today. Upgrade to Premium for unlimited access.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={resetDailyLimit}
                    className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                   Upgrade to Premium
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/agencies')}
                    className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-all duration-300"
                  >
                   View Agencies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar Moderne */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search a contact by name, email, title or agency..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-4 pl-12 pr-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-300 text-lg disabled:opacity-50"
              disabled={dailyLimitReached}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards Moderne */}
        {!dailyLimitReached && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total contacts</p>
                  <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Viewed Today</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {userData?.dailyViews || 0}/50
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining Today</p>
                  <p className={`text-3xl font-bold ${
                    (50 - (userData?.dailyViews || 0)) <= 10 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {50 - (userData?.dailyViews || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Table Moderne */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentContacts.length > 0 ? (
                  currentContacts.map((contact) => (
                    <>
                      <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                              {contact.first_name?.charAt(0)}{contact.last_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {contact.first_name} {contact.last_name}
                              </div>
                             
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{contact.title || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.agency?.name || 'N/A'}</div>
                          {contact.agency?.state && (
                            <div className="text-xs text-gray-500">{contact.agency.state}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewContact(contact)}
                            disabled={dailyLimitReached}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                              dailyLimitReached
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : expandedContact === contact.id
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg transform scale-105'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            {dailyLimitReached 
                              ? 'Limit reached' 
                              : expandedContact === contact.id 
                              ? 'Hide Details' 
                              : 'View Details'
                            }
                          </button>
                        </td>
                      </tr>
                      {expandedContact === contact.id && (
                        <tr className="bg-blue-50">
                          <td colSpan={4} className="px-6 py-6">
                            <div className="mb-4">
                              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Full Contact Details</span>
                              </h4>
                              
                              {/* Tableau de tous les champs */}
                              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Field
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {/* Informations de base */}
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        ID
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                                        {contact.id}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        First Name
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.first_name)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        Last Name
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.last_name)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        Email
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.email)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        Phone
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.phone)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        Title
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.title)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        Email Type
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.email_type)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                      Contact Form URL
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {contact.contact_form_url ? (
                                          <a 
                                            href={contact.contact_form_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline break-all transition-colors"
                                          >
                                            {contact.contact_form_url}
                                          </a>
                                        ) : 'N/A'}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gray-50">
                                        Department
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.department)}
                                      </td>
                                    </tr>
                                    
                                    {/* Informations de l'agence */}
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-green-700 bg-green-50">
Agency Name                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.agency?.name)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-green-700 bg-green-50">
                                       Agency State
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.agency?.state)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-green-700 bg-green-50">
                                      Agency Phone
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {formatValue(contact.agency?.phone)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-green-700 bg-green-50">
                                        Agency Website
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {contact.agency?.website ? (
                                          <a 
                                            href={contact.agency.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline break-all transition-colors"
                                          >
                                            {contact.agency.website}
                                          </a>
                                        ) : 'N/A'}
                                      </td>
                                    </tr>
                                    
                                    {/* Dates */}
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-blue-700 bg-blue-50">
                                       Created At
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {contact.created_at ? new Date(contact.created_at).toLocaleString('fr-FR') : 'N/A'}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 text-sm font-semibold text-blue-700 bg-blue-50">
                                       Updated At
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {contact.updated_at ? new Date(contact.updated_at).toLocaleString('fr-FR') : 'N/A'}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            {userData && (
                              <div className="flex items-center space-x-2 p-3 bg-green-100 border border-green-200 rounded-lg text-green-800 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span><strong>View counted</strong> - You have viewed {userData.dailyViews}/50 contacts today.</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {dailyLimitReached 
                            ? 'Daily limit reached' 
                            : searchTerm 
                            ? 'No contact found '
                            : 'No contact available'
                          }
                        </p>
                        <p className="text-gray-600">
                          {dailyLimitReached 
                            ? 'Upgrade to Premium to view more contacts.' 
                            : searchTerm 
                            ? 'Try changing your search criteria.' 
                            : 'Contacts will appear here once available.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Moderne */}
          {totalPages > 1 && !dailyLimitReached && (
            <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-700">
                  Page <span className="font-semibold">{currentPage}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Upgrade Moderne */}
        {!dailyLimitReached && userData && userData.dailyViews >= 40 && (
          <div className="mt-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-2xl shadow-orange-500/25">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Almost out of views!</h3>
                <p className="mb-4">
                 You have viewed {userData.dailyViews} contacts today. You have {50 - userData.dailyViews} views remaining. Upgrade to Premium for unlimited access.

                </p>
                <button
                  onClick={resetDailyLimit}
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                 Discover Premium
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}