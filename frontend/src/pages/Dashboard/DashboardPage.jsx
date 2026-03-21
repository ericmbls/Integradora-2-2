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

// 🔐 Helper con token
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error("Error en la petición");
  }

  return res.json();
};

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
        const data = await fetchWithAuth("http://localhost:3000/api/cultivos");

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
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setCultivosRecientes(recientes);

        setActividad(
          recientes.map(c => ({
            id: c.id,
            text: `Se registró "${c.nombre}"`,
            date: new Date(c.createdAt).toLocaleDateString('es-MX', {
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

        const tiposArray = Object.entries(conteoTipos).map(([tipo, total]) => ({
          tipo,
          total
        }));

        setCultivosPorTipo(tiposArray);

      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };

    fetchCultivos();
  }, []);

  const maxTipo = cultivosPorTipo.length
    ? Math.max(...cultivosPorTipo.map(t => t.total))
    : 1;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inicio</h1>
          <p className="text-gray-400 mt-1">Bienvenido a tu panel de control</p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi, index) => (
          <div key={kpi.title} className={`${kpi.bgColor} rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-[1.02] duration-300`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Activity size={12} />
                  {kpi.sub}
                </p>
              </div>
              <div className={`${kpi.iconBg} p-3 rounded-xl`}>
                <div className={kpi.iconColor}>{kpi.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <MapPin size={18} /> Mapa de cultivos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {zonasCultivo.slice(0, 8).map(zone => (
              <div key={zone.id} className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-xs font-medium">{zone.name}</p>
                <p className="text-[10px] text-gray-400">{zone.lugar}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CloudSun size={18} /> Pronóstico
          </h3>
          {pronostico.map(day => (
            <div key={day.day} className="flex justify-between py-2">
              <span>{day.day}</span>
              <div className="flex gap-2 items-center">{day.icon} {day.temp}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Recientes</h3>
          {cultivosRecientes.map(c => (
            <p key={c.id}>{c.nombre}</p>
          ))}
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Actividad</h3>
          {actividad.map(a => (
            <p key={a.id}>{a.text}</p>
          ))}
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Tipos</h3>
          {cultivosPorTipo.map(t => (
            <div key={t.tipo} className="flex justify-between">
              <span>{t.tipo}</span>
              <span>{t.total}</span>
              <div className="w-16 bg-gray-200 h-1">
                <div style={{ width: `${(t.total / maxTipo) * 100}%` }} className="bg-[#8B6F47] h-1"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AddCultivoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={() => window.location.reload()}
      />
    </div>
  );
}