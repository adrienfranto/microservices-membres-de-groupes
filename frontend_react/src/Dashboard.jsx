import React, { useState } from 'react';
import { Users, Briefcase, UserCheck, Menu, X, Home, Settings, Bell, User } from 'lucide-react';
import Etudiant from './Etudiant';
import Groupe from './Groupe';
import Travail from './Travail';

// Vos composants existants






const Dashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Tableau de Bord</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Étudiants</h3>
            <p className="text-gray-600">125 étudiants</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Groupes</h3>
            <p className="text-gray-600">8 groupes actifs</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Travaux</h3>
            <p className="text-gray-600">15 travaux disponibles</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activités Récentes</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
            <span className="text-sm">Nouvel étudiant ajouté</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
            <span className="text-sm">Groupe modifié</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <div className="h-2 w-2 bg-purple-400 rounded-full mr-3"></div>
            <span className="text-sm">Nouveau travail créé</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Taux de participation</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Travaux complétés</span>
              <span>70%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard