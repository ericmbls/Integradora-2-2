import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  Eye, 
  Plus, 
  AlertCircle, 
  CheckCircle,
  Droplets,
  Thermometer,
  Grid,
  Layers,
  ChevronRight,
  Filter
} from "lucide-react";
import EditCultivoModal from "../../components/cultivo/EditCultivoModal";
import AddCultivoModal from "../../components/cultivo/AddCultivoModal";
import {
  getCultivos,
  createCultivo,
  updateCultivo,
  deleteCultivo
} from "../../services/cultivos.service";

export default function CultivosPage({ onOpenCultivo }) {
  const { user } = useAuth();
  const userRole = user?.role;

  const [cultivos, setCultivos] = useState([]);
  const [selectedCultivo, setSelectedCultivo] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const loadCultivos = async () => {
      try {
        const data = await getCultivos();
        setCultivos(Array.isArray(data) ? data : []);
      } catch {
        setCultivos([]);
      }
    };
    loadCultivos();
  }, []);

  const surcos = useMemo(() => {
    const grouped = {};
    cultivos.forEach(({ ubicacion = "Sin ubicación", ...cultivo }) => {
      if (!grouped[ubicacion]) grouped[ubicacion] = [];
      grouped[ubicacion].push({ ubicacion, ...cultivo });
    });
    return Object.entries(grouped).map(([ubicacion, lista]) => ({
      id: ubicacion,
      nombre: ubicacion,
      cultivos: lista
    }));
  }, [cultivos]);

  const handleCreateCultivo = async (nuevoCultivo) => {
    try {
      const creado = await createCultivo(nuevoCultivo);
      setCultivos(prev => [...prev, creado]);
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error creando cultivo:", error);
    }
  };

  const handleUpdateCultivo = async (id, updatedData) => {
    try {
      const data = await updateCultivo(id, updatedData);
      setCultivos(prev => prev.map(c => c.id === id ? data : c));
      setSelectedCultivo(null);
    } catch (err) {
      console.error("Error actualizando cultivo:", err);
    }
  };

  const handleDeleteCultivo = async (id) => {
    try {
      await deleteCultivo(id);
      setCultivos(prev => prev.filter(c => c.id !== id));
      setSelectedCultivo(null);
    } catch (err) {
      console.error("Error eliminando cultivo:", err);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      activo: "bg-emerald-100 text-emerald-700 border-emerald-200",
      inactivo: "bg-gray-100 text-gray-600 border-gray-200",
      alerta: "bg-red-100 text-red-700 border-red-200",
      saludable: "bg-green-100 text-green-700 border-green-200",
      cosechado: "bg-amber-100 text-amber-700 border-amber-200",
      perdido: "bg-red-100 text-red-700 border-red-200"
    };
    return colores[estado?.toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getEstadoIcon = (estado) => {
    if (estado?.toLowerCase() === "alerta") return <AlertCircle size={14} className="text-red-600" />;
    if (estado?.toLowerCase() === "saludable" || estado?.toLowerCase() === "activo") return <CheckCircle size={14} className="text-green-600" />;
    return null;
  };

  const totalActivos = cultivos.filter(c => c.estado?.toLowerCase() === "activo" || c.estado?.toLowerCase() === "saludable").length;
  const totalAlertas = cultivos.filter(c => c.estado?.toLowerCase() === "alerta").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header mejorado con más estilo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-lg shadow-[#8B6F47]/20">
            <Sprout size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cultivos</h1>
            <p className="text-gray-400 mt-1 flex items-center gap-1">
              <Grid size={14} />
              Gestiona tus cultivos y su información
            </p>
          </div>
        </div>
        
        <button
          className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Nuevo cultivo
        </button>
      </div>

      {/* Estadísticas mejoradas con más detalle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total cultivos</p>
              <p className="text-3xl font-bold text-gray-800">{cultivos.length}</p>
            </div>
            <div className="p-3 bg-[#8B6F47]/10 rounded-xl group-hover:bg-[#8B6F47]/20 transition-colors">
              <Sprout size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Registrados en el sistema</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Ubicaciones</p>
              <p className="text-3xl font-bold text-gray-800">{surcos.length}</p>
            </div>
            <div className="p-3 bg-[#8B6F47]/10 rounded-xl group-hover:bg-[#8B6F47]/20 transition-colors">
              <MapPin size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Zonas de cultivo activas</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-600">{totalActivos}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cultivos en buen estado</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Alertas</p>
              <p className={`text-3xl font-bold ${totalAlertas > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {totalAlertas}
              </p>
            </div>
            <div className={`p-3 rounded-xl transition-colors ${totalAlertas > 0 ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-50'}`}>
              <AlertCircle size={20} className={totalAlertas > 0 ? 'text-red-600' : 'text-gray-400'} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Requieren atención inmediata</p>
        </div>
      </div>

      {/* Barra de filtros rápida (solo visual) */}
      {surcos.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Filter size={16} className="text-gray-500" />
          </div>
          <button className="px-4 py-2 bg-[#8B6F47] text-white rounded-lg text-sm font-medium whitespace-nowrap">
            Todas las ubicaciones
          </button>
          {surcos.slice(0, 3).map(surco => (
            <button key={surco.id} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
              {surco.nombre}
            </button>
          ))}
          {surcos.length > 3 && (
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
              +{surcos.length - 3} más
            </button>
          )}
        </div>
      )}

      {/* Listado de cultivos por ubicación */}
      <div className="space-y-8">
        {surcos.map(({ id, nombre, cultivos }, index) => (
          <section 
            key={id} 
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header de la ubicación mejorado */}
            <div className="bg-gradient-to-r from-[#fffaf8] to-[#fbefe1] px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MapPin size={18} className="text-[#8B6F47]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{nombre}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <Layers size={12} className="inline mr-1" />
                    {cultivos.length} cultivo{cultivos.length !== 1 ? 's' : ''} en esta zona
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs bg-white px-3 py-1.5 rounded-full text-gray-600 border border-gray-200 shadow-sm">
                    {cultivos.filter(c => c.estado?.toLowerCase() === "activo" || c.estado?.toLowerCase() === "saludable").length} activos
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Grid de cultivos mejorado */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cultivos.map((cultivo, index) => (
                  <div
                    key={cultivo.id || index}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-[#8B6F47]/30 hover:-translate-y-1"
                  >
                    {/* Imagen o placeholder con overlay mejorado */}
                    <div
                      className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden"
                      onClick={() => setSelectedCultivo(cultivo)}
                    >
                      {cultivo.imagen ? (
                        <>
                          <img
                            src={cultivo.imagen}
                            alt={cultivo.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </>
                      ) : (
                        <div className="relative">
                          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                            <Sprout size={52} className="text-[#8B6F47]/20" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100"></div>
                        </div>
                      )}
                      
                      {/* Badge de estado mejorado */}
                      <div className={`absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-medium border shadow-sm ${getEstadoColor(cultivo.estado)} flex items-center gap-1.5 backdrop-blur-sm bg-opacity-90`}>
                        {getEstadoIcon(cultivo.estado)}
                        <span className="capitalize">{cultivo.estado}</span>
                      </div>

                      {/* Badge de fecha (opcional) */}
                      {cultivo.fechaSiembra && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(cultivo.fechaSiembra).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                        </div>
                      )}
                    </div>

                    {/* Información del cultivo mejorada */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-[#8B6F47] transition-colors">
                            {cultivo.nombre}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Droplets size={10} />
                              <span>{cultivo.humedad || '—'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Thermometer size={10} />
                              <span>{cultivo.temperatura || '—'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botón de bitácora mejorado */}
                      <button
                        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#8B6F47] hover:to-[#7a5f3c] text-gray-600 hover:text-white py-2.5 rounded-lg text-xs font-medium transition-all border border-gray-200 hover:border-[#8B6F47] flex items-center justify-center gap-2 group/btn"
                        onClick={() => onOpenCultivo(cultivo)}
                      >
                        <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Ver bitácora
                        <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Estado vacío mejorado */}
        {!surcos.length && (
          <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-24 h-24 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sprout size={48} className="text-[#8B6F47]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No tienes cultivos registrados</h2>
            <p className="text-gray-400 text-base mb-8">Comienza añadiendo tu primer cultivo al sistema</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#8B6F47] text-white rounded-xl hover:bg-[#7a5f3c] transition-all shadow-md hover:shadow-lg text-base font-medium group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Añadir cultivo
            </button>
          </div>
        )}
      </div>

      <EditCultivoModal
        isOpen={!!selectedCultivo}
        onClose={() => setSelectedCultivo(null)}
        cultivo={selectedCultivo}
        onSave={handleUpdateCultivo}
        onDelete={handleDeleteCultivo}
        userRole={userRole}
      />

      <AddCultivoModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleCreateCultivo}
      />
    </div>
  );
}