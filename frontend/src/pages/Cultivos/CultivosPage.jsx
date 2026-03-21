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
  Filter,
  TrendingUp,
  Clock,
  Leaf,
  Search,
  X,
  ChevronLeft
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
  const [selectedUbicacion, setSelectedUbicacion] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadCultivos = async () => {
      setLoading(true);
      try {
        const data = await getCultivos();
        setCultivos(Array.isArray(data) ? data : []);
      } catch {
        setCultivos([]);
      } finally {
        setLoading(false);
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

  const surcosFiltrados = useMemo(() => {
    let filtered = surcos;
    
    if (selectedUbicacion !== "todas") {
      filtered = filtered.filter(surco => surco.nombre === selectedUbicacion);
    }
    
    if (searchTerm) {
      filtered = filtered.map(surco => ({
        ...surco,
        cultivos: surco.cultivos.filter(cultivo => 
          cultivo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cultivo.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(surco => surco.cultivos.length > 0);
    }
    
    return filtered;
  }, [surcos, selectedUbicacion, searchTerm]);

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
  const totalCosechados = cultivos.filter(c => c.estado?.toLowerCase() === "cosechado").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-[#8B6F47] rounded-full animate-spin"></div>
          <Sprout size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B6F47] animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 animate-pulse">Cargando cultivos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-lg shadow-[#8B6F47]/20">
            <Sprout size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Mis Cultivos
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-1">
              <Grid size={14} />
              Gestiona tus cultivos y su información
            </p>
          </div>
        </div>
        
        <button
          className="bg-gradient-to-r from-[#8B6F47] to-[#6b5436] hover:from-[#7a5f3c] hover:to-[#5a4530] text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group transform hover:scale-105"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Nuevo cultivo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-slideUp">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total cultivos</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{cultivos.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#8B6F47]/10 to-[#8B6F47]/5 rounded-xl group-hover:scale-110 transition-all duration-300">
              <Sprout size={20} className="text-[#8B6F47]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <TrendingUp size={10} />
            Registrados en el sistema
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-slideUp" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Ubicaciones</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{surcos.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl group-hover:scale-110 transition-all duration-300">
              <MapPin size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Layers size={10} />
            Zonas de cultivo activas
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-slideUp" style={{ animationDelay: "200ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-600">{totalActivos}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl group-hover:scale-110 transition-all duration-300">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Leaf size={10} />
            Cultivos en buen estado
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-slideUp" style={{ animationDelay: "300ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Alertas</p>
              <p className={`text-3xl font-bold ${totalAlertas > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {totalAlertas}
              </p>
            </div>
            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${totalAlertas > 0 ? 'bg-gradient-to-br from-red-50 to-red-100/30' : 'bg-gray-50'}`}>
              <AlertCircle size={20} className={totalAlertas > 0 ? 'text-red-600' : 'text-gray-400'} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Clock size={10} />
            Requieren atención inmediata
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#8B6F47]" />
            <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
          </div>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={12} />
              Limpiar búsqueda
            </button>
          )}
        </div>

        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo de cultivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedUbicacion("todas")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedUbicacion === "todas"
                ? "bg-gradient-to-r from-[#8B6F47] to-[#6b5436] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todas las ubicaciones
          </button>
          {surcos.map(surco => (
            <button
              key={surco.id}
              onClick={() => setSelectedUbicacion(surco.nombre)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedUbicacion === surco.nombre
                  ? "bg-gradient-to-r from-[#8B6F47] to-[#6b5436] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {surco.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {surcosFiltrados.map(({ id, nombre, cultivos }, index) => (
          <section 
            key={id} 
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 animate-slideUp overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-gradient-to-r from-[#fffaf8] via-[#fbefe1] to-transparent px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-md">
                  <MapPin size={18} className="text-[#8B6F47]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{nombre}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Layers size={12} className="inline" />
                    {cultivos.length} cultivo{cultivos.length !== 1 ? 's' : ''} en esta zona
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 rounded-full text-emerald-700 font-medium shadow-sm">
                    {cultivos.filter(c => c.estado?.toLowerCase() === "activo" || c.estado?.toLowerCase() === "saludable").length} activos
                  </span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cultivos.map((cultivo, idx) => (
                  <div
                    key={cultivo.id || idx}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden hover:border-[#8B6F47]/40 hover:-translate-y-2 cursor-pointer animate-fadeIn"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => setSelectedCultivo(cultivo)}
                  >
                    <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      {cultivo.imagen ? (
                        <>
                          <img
                            src={cultivo.imagen}
                            alt={cultivo.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </>
                      ) : (
                        <div className="relative">
                          <Sprout size={56} className="text-[#8B6F47]/30 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      
                      <div className={`absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-medium border shadow-lg backdrop-blur-sm bg-opacity-95 ${getEstadoColor(cultivo.estado)} flex items-center gap-1.5`}>
                        {getEstadoIcon(cultivo.estado)}
                        <span className="capitalize">{cultivo.estado}</span>
                      </div>

                      {cultivo.fechaSiembra && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs text-white flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(cultivo.fechaSiembra).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-[#8B6F47] transition-colors duration-300 text-base">
                          {cultivo.nombre}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            <Droplets size={12} className="text-blue-500" />
                            <span>{cultivo.humedad || '—%'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            <Thermometer size={12} className="text-orange-500" />
                            <span>{cultivo.temperatura || '—°C'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#8B6F47] hover:to-[#7a5f3c] text-gray-600 hover:text-white py-2.5 rounded-lg text-xs font-medium transition-all duration-300 border border-gray-200 hover:border-transparent flex items-center justify-center gap-2 group/btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCultivo(cultivo);
                        }}
                      >
                        <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Ver bitácora
                        <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {!surcosFiltrados.length && surcos.length > 0 && (
          <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 animate-fadeIn">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No se encontraron cultivos</h2>
            <p className="text-gray-400 text-base">
              {searchTerm ? `No hay cultivos que coincidan con "${searchTerm}"` : "No hay cultivos en esta ubicación"}
            </p>
            {(searchTerm || selectedUbicacion !== "todas") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedUbicacion("todas");
                }}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#8B6F47] text-white rounded-xl hover:bg-[#7a5f3c] transition-all shadow-md hover:shadow-lg"
              >
                <ChevronLeft size={16} />
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {!surcos.length && (
          <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 animate-fadeIn">
            <div className="w-28 h-28 bg-gradient-to-br from-[#8B6F47]/20 to-[#8B6F47]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sprout size={56} className="text-[#8B6F47]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">¡Bienvenido a tu huerto digital!</h2>
            <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
              Comienza añadiendo tu primer cultivo al sistema y lleva el control de todo tu huerto
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B6F47] to-[#6b5436] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-base font-medium group transform hover:scale-105"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Añadir mi primer cultivo
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
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}