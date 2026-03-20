import { useState, useEffect } from 'react';
import { Globe, Sliders, Shield, Bell, Lock, Cpu, Eye, Save, MapPin, Building2 } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'seguridad', label: 'Seguridad', icon: Lock },
  { id: 'dispositivos', label: 'Dispositivos', icon: Cpu },
  { id: 'avanzado', label: 'Avanzado', icon: Sliders },
];

const VISUAL_PREFERENCES = [
  { key: 'compactView', title: 'Vista Compacta', desc: 'Mostrar información en formato más compacto', icon: Eye },
];

export default function AjustesPage({ token }) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    farmName: 'Tetlalli Farms S.A de C.V.',
    location: 'Jalisco, México',
    compactView: false,
  });

  useEffect(() => {
    if (!token) return;
    const fetchPreferences = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error('Error HTTP al cargar preferencias:', res.status, res.statusText);
          return;
        }

        const data = await res.json().catch(() => null);
        if (!data) return;

        if (data.farmName) setSettings(prev => ({ ...prev, farmName: data.farmName }));
        if (data.location) setSettings(prev => ({ ...prev, location: data.location }));
        if (data.compactView !== undefined) setSettings(prev => ({ ...prev, compactView: data.compactView }));
      } catch (err) {
        console.error('Error cargando preferencias:', err);
      }
    };
    fetchPreferences();
  }, [token]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleCompactView = async () => {
    const newValue = !settings.compactView;
    setSettings(prev => ({ ...prev, compactView: newValue }));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ compactView: newValue }),
      });

      if (!res.ok) {
        console.error('Error HTTP al guardar preferencia:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error guardando preferencia:', err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        console.error('Error HTTP al guardar configuración:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error guardando configuración:', err);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Información de la granja */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
            <Building2 size={18} className="text-[#8B6F47]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Información de la Granja</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-500 flex items-center gap-1">
              <Building2 size={14} className="text-gray-400" />
              Nombre de la Granja
            </label>
            <input
              type="text"
              value={settings.farmName}
              onChange={(e) => handleChange('farmName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all"
              placeholder="Ej: Tetlalli Farms"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              Ubicación
            </label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all"
              placeholder="Ej: Jalisco, México"
            />
          </div>
        </div>
      </div>

      {/* Preferencias de Visualización */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
            <Eye size={18} className="text-[#8B6F47]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Preferencias de Visualización</h3>
        </div>
        
        <div className="space-y-4">
          {VISUAL_PREFERENCES.map(({ key, title, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Icon size={18} className="text-[#8B6F47]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{title}</h4>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.compactView}
                  onChange={handleToggleCompactView}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B6F47]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
            <Sliders size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Configuración del Sistema</h1>
            <p className="text-gray-400 mt-1">Ajustes de preferencias y parámetros de Tetlalli</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2 self-start"
        >
          <Save size={18} />
          Guardar cambios
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
              ${activeTab === id 
                ? 'bg-[#8B6F47] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#8B6F47]'
              }
            `}
          >
            <Icon size={18} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      {activeTab === 'general' ? (
        renderGeneralTab()
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-[#8B6F47]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sección en construcción</h3>
          <p className="text-gray-400 mb-6">Esta configuración estará disponible pronto.</p>
          <button
            onClick={() => setActiveTab('general')}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-[#8B6F47]/30 transition-all"
          >
            Volver a General
          </button>
        </div>
      )}
    </div>
  );
}