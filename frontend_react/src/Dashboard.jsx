import React, { useState, useEffect } from 'react';
import { Users, Briefcase, UserCheck, TrendingUp, Calendar, Award, BookOpen, Target } from 'lucide-react';

const ETUDIANT_API = "http://192.168.107.13:9000/api/etudiants";
const GROUPE_API = "http://192.168.107.13:9000/api/groupes/list";
const TRAVAIL_API = "http://192.168.107.13:9000/api/travail";

const Dashboard = () => {
  const [stats, setStats] = useState({
    etudiants: 0,
    groupes: 0,
    travaux: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [etudiantsRes, groupesRes, travauxRes] = await Promise.all([
          fetch(ETUDIANT_API).catch(() => ({ ok: false })),
          fetch(GROUPE_API).catch(() => ({ ok: false })),
          fetch(TRAVAIL_API).catch(() => ({ ok: false }))
        ]);

        let etudiantsCount = 0;
        let groupesCount = 0;
        let travauxCount = 0;

        if (etudiantsRes.ok) {
          const etudiantsData = await etudiantsRes.json();
          etudiantsCount = Array.isArray(etudiantsData) ? etudiantsData.length : 0;
        }

        if (groupesRes.ok) {
          const groupesData = await groupesRes.json();
          groupesCount = Array.isArray(groupesData) ? groupesData.length : 0;
        }

        if (travauxRes.ok) {
          const travauxData = await travauxRes.json();
          travauxCount = Array.isArray(travauxData) ? travauxData.length : 0;
        }

        setStats({
          etudiants: etudiantsCount,
          groupes: groupesCount,
          travaux: travauxCount
        });

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, isDark = false, loading }) => (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-3xl font-extrabold">
            {loading ? (
              <div className={`animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'} h-8 w-16 rounded`}></div>
            ) : (
              value
            )}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
            {loading ? "Chargement..." : `${title.toLowerCase()} total${title === 'Étudiants' ? 's' : title === 'Groupes' ? 's' : 'x'}`}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-50'}`}>
          <Icon className={`h-8 w-8 ${isDark ? 'text-white' : 'text-blue-600'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600 text-lg">Vue d'ensemble de votre système de gestion</p>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <StatCard
            icon={Users}
            title="Étudiants"
            value={stats.etudiants}
            loading={loading}
          />
          
          <StatCard
            icon={UserCheck}
            title="Groupes"
            value={stats.groupes}
            loading={loading}
          />
          
          <StatCard
            icon={Briefcase}
            title="Travaux"
            value={stats.travaux}
            loading={loading}
          />
        </div>

        {/* Section inférieure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activités récentes */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Activités Récentes</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { text: "Nouvel étudiant inscrit", time: "Il y a 5 min", icon: Users },
                { text: "Groupe mis à jour", time: "Il y a 15 min", icon: UserCheck },
                { text: "Nouveau travail assigné", time: "Il y a 1 heure", icon: Briefcase },
                { text: "Évaluation terminée", time: "Il y a 2 heures", icon: Award }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200">
                  <div className="h-3 w-3 bg-blue-600 rounded-full mr-4"></div>
                  <activity.icon className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">{activity.text}</span>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gray-50 rounded-lg mr-3">
                <Target className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Actions Rapides</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Ajouter Étudiant" },
                { icon: UserCheck, label: "Créer Groupe" },
                { icon: Briefcase, label: "Nouveau Travail" },
                { icon: BookOpen, label: "Voir Rapports" }
              ].map((action, index) => (
                <button
                  key={index}
                  className="bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center space-y-2 border-2 border-blue-500"
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;