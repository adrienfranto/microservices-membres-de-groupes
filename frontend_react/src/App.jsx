import React, { useState } from 'react';
import { Users, Briefcase, UserCheck, Menu, X, Home, Settings, Bell, User } from 'lucide-react';
import Etudiant from './Etudiant';
import Groupe from './Groupe';
import Travail from './Travail';
import Dashboard from './Dashboard';






const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [etudiants, setEtudiants] = useState([]);

  // Fetch les étudiants pour l'affichage dans la navbar
  const fetchEtudiantsForNavbar = async () => {
    try {
      const response = await fetch("http://192.168.88.50:9000/api/etudiants");
      const data = await response.json();
      setEtudiants(data);
    } catch (error) {
      console.error("Erreur récupération étudiants pour navbar:", error);
    }
  };

  React.useEffect(() => {
    fetchEtudiantsForNavbar();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home, component: Dashboard },
    { id: 'etudiants', label: 'Étudiants', icon: Users, component: Etudiant },
    { id: 'groupes', label: 'Groupes', icon: UserCheck, component: Groupe },
    { id: 'travaux', label: 'Travaux', icon: Briefcase, component: Travail },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || Dashboard;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <Briefcase className="h-6 w-6" />
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">GestPro</h1>
                <p className="text-sm text-gray-500">Gestion Académique</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className={`w-full flex items-center px-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ${!sidebarOpen && 'justify-center'}`}>
            <Settings className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Paramètres</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <h2 className="ml-4 text-lg font-semibold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                {etudiants.length > 0 && etudiants[0].image ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={`http://192.168.88.50:9000${etudiants[0].image}`}
                    alt={etudiants[0].prenoms}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    A
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {etudiants.length > 0 ? etudiants[0].prenoms : 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default App;