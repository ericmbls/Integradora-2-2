import { useState, useEffect } from "react";
import {
  Sprout,
  AlertCircle,
  Droplets,
  CloudSun,
  CloudRain,
  Sun,
  Thermometer,
  TrendingUp,
  Calendar,
  MapPin,
  Leaf,
  BarChart3,
  Activity
} from "lucide-react";

import AddCultivoModal from "../../components/cultivo/AddCultivoModal";

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [zonasCultivo, setZonasCultivo] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [cultivosRecientes, setCultivosRecientes] = useState([]);
  const [cultivosPorTipo, setCultivosPorTipo] = useState([]);

  const pronostico = [
    { day: "Lun", icon: <Sun size={18} className="text-amber-500" />, temp: "24°" },
    { day: "Mar", icon: <CloudSun size={18} className="text-stone-500" />, temp: "22°" },
    { day: "Mié", icon: <CloudRain size={18} className="text-stone-500" />, temp: "20°" },
    { day: "Jue", icon: <Sun size={18} className="text-amber-500" />, temp: "23°" },
    { day: "Vie", icon: <Sun size={18} className="text-amber-500" />, temp: "25°" }
  ];

  useEffect(() => {
    const fetchCultivos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cultivos");
        const data = await res.json();

        const alertas = data.filter(
          c => (c.humedad ?? 0) < 60 || (c.temperatura ?? 0) > 30
        ).length;

        setKpis([
          {
            title: "Total de cultivos",
            value: data.length,
            sub: "Registrados en el sistema",
            icon: <Sprout size={20} />,
            bgColor: "bg-amber-50",
            iconBg: "bg-[#8B6F47]/10",
            iconColor: "text-[#8B6F47]"
          },
          {
            title: "Alertas Activas",
            value: alertas,
            sub: "Requieren atención",
            icon: <AlertCircle size={20} />,
            bgColor: alertas > 0 ? "bg-red-50" : "bg-amber-50",
            iconBg: alertas > 0 ? "bg-red-100" : "bg-[#8B6F47]/10",
            iconColor: alertas > 0 ? "text-red-500" : "text-[#8B6F47]"
          }
        ]);

        const zonas = data.map(c => ({
          id: c.id,
          name: c.nombre,
          lugar: c.ubicacion || "Sin ubicación",
          humedad: c.humedad ? `${c.humedad}%` : "—",
          temp: c.temperatura ? `${c.temperatura}°C` : "—",
          status:
            (c.humedad ?? 0) < 60 || (c.temperatura ?? 0) > 30
              ? "alert"
              : "ok"
        }));

        setZonasCultivo(zonas);

        const recientes = [...data]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setCultivosRecientes(recientes);

        setActividad(
          recientes.map(c => ({
            id: c.id,
            text: `Se registró "${c.nombre}"`,
            date: new Date(c.created_at).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short'
            })
          }))
        );

        const conteoTipos = {};
        data.forEach(c => {
          const tipo = c.tipo || "Sin tipo";
          conteoTipos[tipo] = (conteoTipos[tipo] || 0) + 1;
        });

        setCultivosPorTipo(
          Object.entries(conteoTipos).map(([tipo, total]) => ({
            tipo,
            total
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchCultivos();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header con icono */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inicio</h1>
          <p className="text-gray-400 mt-1">Bienvenido a tu panel de control</p>
        </div>
      </div>

      {/* KPIs Section - Mejorado */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.title}
            className={`${kpi.bgColor} rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-[1.02] duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Activity size={12} className="text-gray-400" />
                  {kpi.sub}
                </p>
              </div>
              <div className={`${kpi.iconBg} p-3 rounded-xl shadow-sm`}>
                <div className={kpi.iconColor}>{kpi.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Mapa y Pronóstico Section - Mejorado */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-1.5 bg-[#8B6F47]/10 rounded-lg">
                <MapPin size={18} className="text-[#8B6F47]" />
              </div>
              Mapa de cultivos
            </h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {zonasCultivo.length} zonas activas
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {zonasCultivo.slice(0, 8).map(zone => (
              <div
                key={zone.id}
                className={`
                  p-3 rounded-xl text-center transition-all duration-300
                  ${zone.status === "alert"
                    ? "bg-red-50 border border-red-200 hover:bg-red-100 hover:shadow-sm"
                    : "bg-gray-50 border border-gray-200 hover:border-[#8B6F47]/30 hover:bg-[#8B6F47]/5 hover:shadow-sm"
                  }
                `}
              >
                <p className="text-xs font-medium text-gray-700 truncate">{zone.name}</p>
                <p className="text-[10px] text-gray-400 mt-1 truncate">{zone.lugar}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#8B6F47]/10 rounded-lg">
              <CloudSun size={18} className="text-[#8B6F47]" />
            </div>
            Pronóstico 5 días
          </h3>
          <div className="space-y-2">
            {pronostico.map(day => (
              <div key={day.day} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-600">{day.day}</span>
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center">{day.icon}</div>
                  <span className="text-sm font-semibold text-gray-700">{day.temp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estado de Cultivos Section - Mejorado */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <div className="p-1.5 bg-[#8B6F47]/10 rounded-lg">
              <Sprout size={18} className="text-[#8B6F47]" />
            </div>
            Estado de cultivos
          </h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            Monitoreo en tiempo real
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zonasCultivo.map((zona, index) => (
            <div
              key={zona.id}
              className={`
                bg-white rounded-xl border p-5 transition-all hover:shadow-lg
                ${zona.status === "alert" 
                  ? "border-red-200 hover:border-red-300" 
                  : "border-gray-100 hover:border-[#8B6F47]/30"
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    zona.status === "alert" 
                      ? "bg-red-100 group-hover:bg-red-200" 
                      : "bg-[#8B6F47]/10 group-hover:bg-[#8B6F47]/20"
                  }`}>
                    <Sprout size={20} className={
                      zona.status === "alert" ? "text-red-500" : "text-[#8B6F47]"
                    } />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{zona.name}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />
                      {zona.lugar}
                    </p>
                  </div>
                </div>
                
                {zona.status === "alert" ? (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                    <AlertCircle size={10} />
                    Alerta
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full">
                    Óptimo
                  </span>
                )}
              </div>

              <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <Droplets size={14} className="text-blue-400" />
                  <span className="text-sm font-medium text-gray-600">{zona.humedad}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <Thermometer size={14} className="text-orange-400" />
                  <span className="text-sm font-medium text-gray-600">{zona.temp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actividad y Estadísticas Section - Mejorado */}
      <section className="grid md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#8B6F47]/10 rounded-lg">
              <Calendar size={16} className="text-[#8B6F47]" />
            </div>
            Recientes
          </h3>
          <div className="space-y-3">
            {cultivosRecientes.map((c, index) => (
              <div key={c.id} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-0 group">
                <div className="w-8 h-8 bg-[#8B6F47]/10 rounded-lg flex items-center justify-center group-hover:bg-[#8B6F47]/20 transition-colors">
                  <Sprout size={14} className="text-[#8B6F47]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{c.nombre}</p>
                  <p className="text-xs text-gray-400">{c.ubicacion || "Sin ubicación"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#8B6F47]/10 rounded-lg">
              <TrendingUp size={16} className="text-[#8B6F47]" />
            </div>
            Actividad
          </h3>
          <div className="space-y-3">
            {actividad.map((a, index) => (
              <div key={a.id} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-0 group">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <TrendingUp size={14} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#8B6F47]/10 rounded-lg">
              <Leaf size={16} className="text-[#8B6F47]" />
            </div>
            Tipos de cultivo
          </h3>
          <div className="space-y-3">
            {cultivosPorTipo.map((t, index) => (
              <div key={t.tipo} className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0 group">
                <span className="text-sm text-gray-600">{t.tipo}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{t.total}</span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8B6F47] rounded-full group-hover:bg-[#7a5f3c] transition-colors"
                      style={{ width: `${(t.total / Math.max(...cultivosPorTipo.map(t => t.total))) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <AddCultivoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}