import { useState, useEffect } from 'react';
import { Globe, Sliders, Save, Eye, MapPin, Building2, Bell, Sun, Moon, Thermometer, Calendar, Download, Upload, Check, AlertCircle, TrendingUp } from 'lucide-react';

export default function AjustesPage({ token }) {
  const [settings, setSettings] = useState({
    farmName: 'Tetlalli Farms S.A de C.V.',
    location: 'Jalisco, México',
    emailAlerts: true,
    pushNotifications: true,
    temperatureUnit: 'celsius',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    autoBackup: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchPreferences = async () => {
      setLoading(true);
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

        setSettings(prev => ({
          ...prev,
          ...data,
          farmName: data.farmName || prev.farmName,
          location: data.location || prev.location,
          emailAlerts: data.emailAlerts !== undefined ? data.emailAlerts : prev.emailAlerts,
          pushNotifications: data.pushNotifications !== undefined ? data.pushNotifications : prev.pushNotifications,
          temperatureUnit: data.temperatureUnit || prev.temperatureUnit,
          dateFormat: data.dateFormat || prev.dateFormat,
          theme: data.theme || prev.theme,
          autoBackup: data.autoBackup !== undefined ? data.autoBackup : prev.autoBackup,
        }));
      } catch (err) {
        console.error('Error cargando preferencias:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [token]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    await savePreference(key, newValue);
  };

  const savePreference = async (key, value) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (!res.ok) {
        console.error('Error HTTP al guardar preferencia:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Error guardando preferencia:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
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
      } else {
        setSuccessMessage('Configuración guardada correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error guardando configuración:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `tetlalli_backup_${new Date().toISOString().slice(0,19)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setSettings(prev => ({ ...prev, ...importedSettings }));
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/preferences`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(importedSettings),
        });
        
        if (res.ok) {
          setSuccessMessage('Configuración importada correctamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (err) {
        console.error('Error importando configuración:', err);
        alert('Error al importar el archivo');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-[#8B6F47] rounded-full animate-spin"></div>
          <Sliders size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B6F47] animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 animate-pulse">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-lg">
            <Sliders size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Configuración del Sistema
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-1">
              <Globe size={14} />
              Ajustes de preferencias y parámetros de Tetlalli
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {successMessage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm animate-slideInRight">
              <Check size={16} />
              {successMessage}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#8B6F47] to-[#6b5436] hover:from-[#7a5f3c] hover:to-[#5a4530] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Granja</p>
              <p className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{settings.farmName}</p>
            </div>
            <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
              <Building2 size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <MapPin size={10} />
            {settings.location}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Notificaciones</p>
              <p className="text-sm font-semibold text-gray-800">
                {settings.emailAlerts || settings.pushNotifications ? 'Activas' : 'Desactivadas'}
              </p>
            </div>
            <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
              <Bell size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            {settings.emailAlerts && settings.pushNotifications ? 'Email y push' : settings.emailAlerts ? 'Solo email' : settings.pushNotifications ? 'Solo push' : 'Sin alertas'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Unidades</p>
              <p className="text-sm font-semibold text-gray-800">
                {settings.temperatureUnit === 'celsius' ? '°C' : '°F'}
              </p>
            </div>
            <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
              <Thermometer size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Calendar size={10} />
            {settings.dateFormat}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "300ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Respaldo</p>
              <p className="text-sm font-semibold text-gray-800">
                {settings.autoBackup ? 'Automático' : 'Manual'}
              </p>
            </div>
            <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
              <Download size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <TrendingUp size={10} />
            Exportar/Importar config
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 animate-slideUp">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-gradient-to-br from-[#8B6F47]/20 to-[#8B6F47]/10 rounded-lg">
              <Building2 size={18} className="text-[#8B6F47]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Información de la Granja</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Building2 size={12} />
                Nombre de la Granja
              </label>
              <input
                type="text"
                value={settings.farmName}
                onChange={(e) => handleChange('farmName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all duration-300 bg-white"
                placeholder="Ej: Tetlalli Farms"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin size={12} />
                Ubicación
              </label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all duration-300 bg-white"
                placeholder="Ej: Jalisco, México"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 animate-slideUp" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-gradient-to-br from-[#8B6F47]/20 to-[#8B6F47]/10 rounded-lg">
              <Bell size={18} className="text-[#8B6F47]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#8B6F47]/5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-[#8B6F47]/10 transition-colors">
                  <Bell size={14} className="text-gray-500 group-hover:text-[#8B6F47]" />
                </div>
                <span className="text-gray-700">Alertas por correo electrónico</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={() => handleToggle('emailAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B6F47] relative"></div>
              </div>
            </label>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#8B6F47]/5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-[#8B6F47]/10 transition-colors">
                  <Bell size={14} className="text-gray-500 group-hover:text-[#8B6F47]" />
                </div>
                <span className="text-gray-700">Notificaciones push</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B6F47] relative"></div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-gradient-to-br from-[#8B6F47]/20 to-[#8B6F47]/10 rounded-lg">
              <Globe size={18} className="text-[#8B6F47]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Unidades y Formato</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Thermometer size={12} />
                Unidad de temperatura
              </label>
              <select
                value={settings.temperatureUnit}
                onChange={(e) => handleChange('temperatureUnit', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all duration-300 bg-white"
              >
                <option value="celsius">°C (Celsius)</option>
                <option value="fahrenheit">°F (Fahrenheit)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} />
                Formato de fecha
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all duration-300 bg-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (día/mes/año)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (mes/día/año)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                {settings.theme === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                Tema
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all duration-300 bg-white"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 animate-slideUp" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-gradient-to-br from-[#8B6F47]/20 to-[#8B6F47]/10 rounded-lg">
              <Download size={18} className="text-[#8B6F47]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Datos y Respaldo</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#8B6F47]/5 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-[#8B6F47]/10 transition-colors">
                  <Download size={14} className="text-gray-500 group-hover:text-[#8B6F47]" />
                </div>
                <span className="text-gray-700">Respaldo automático</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={() => handleToggle('autoBackup')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B6F47] relative"></div>
              </div>
            </label>
            
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-[#8B6F47] hover:text-white hover:border-[#8B6F47] transition-all duration-300 group"
              >
                <Download size={16} className="group-hover:scale-110 transition-transform" />
                Exportar configuración
              </button>
              
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-[#8B6F47] hover:text-white hover:border-[#8B6F47] transition-all duration-300 group">
                  <Upload size={16} className="group-hover:scale-110 transition-transform" />
                  Importar configuración
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}