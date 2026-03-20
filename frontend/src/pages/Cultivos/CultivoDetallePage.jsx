import { useState, useEffect } from "react";
import { getReportesByCultivo, createReporte } from "../../services/reportes.service";
import AddReporteModal from "../../components/cultivo/AddReporteModal";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Droplets, 
  FileText,
  Clock,
  Image as ImageIcon,
  Sprout,
  Plus
} from "lucide-react";

export default function CultivoDetallePage({ cultivo, onBack }) {
  const [reportes, setReportes] = useState([]);
  const [isReporteOpen, setIsReporteOpen] = useState(false);

  if (!cultivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-20 h-20 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mb-4">
          <ImageIcon size={32} className="text-[#8B6F47]" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No hay cultivo seleccionado</h2>
        <p className="text-gray-500 mb-4">Selecciona un cultivo para ver su información.</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#8B6F47] text-white rounded-lg hover:bg-[#7a5f3c] transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>
    );
  }

  useEffect(() => {
    const loadReportes = async () => {
      try {
        const data = await getReportesByCultivo(cultivo.id);
        setReportes(data);
      } catch (error) {
        console.error("Error cargando reportes", error);
      }
    };
    loadReportes();
  }, [cultivo]);

  const handleCreateReporte = async (formData) => {
    try {
      const nuevo = await createReporte(formData);
      setReportes(prev => [nuevo, ...prev]);
    } catch (error) {
      console.error("Error creando reporte", error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getEstadoStyles = (estado) => {
    const styles = {
      activo: "bg-emerald-50 text-emerald-600 border-emerald-200",
      inactivo: "bg-gray-50 text-gray-600 border-gray-200",
      cosechado: "bg-amber-50 text-amber-600 border-amber-200",
      perdido: "bg-red-50 text-red-600 border-red-200",
    };
    return styles[estado] || styles.activo;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Botón de regreso mejorado */}
      <button
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-gray-600 hover:text-[#8B6F47] transition-colors"
      >
        <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-[#8B6F47]/10 transition-colors">
          <ArrowLeft size={18} className="group-hover:text-[#8B6F47]" />
        </div>
        <span className="text-sm font-medium">Regresar</span>
      </button>

      {/* Header con título y estado - MEJORADO */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
              <Sprout size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">{cultivo.nombre}</h1>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Clock size={14} />
                Creado el {formatDate(cultivo.createdAt || new Date())}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border shadow-sm self-start sm:self-auto ${getEstadoStyles(cultivo.estado)}`}>
            {cultivo.estado}
          </span>
        </div>
      </div>

      {/* Grid de información - MEJORADO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Columna de imagen */}
        <div className="lg:col-span-1">
          {cultivo.imagen ? (
            <div className="relative group rounded-xl overflow-hidden shadow-md">
              <img
                src={cultivo.imagen}
                alt={cultivo.nombre}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">Sin imagen</p>
            </div>
          )}
        </div>

        {/* Columna de información */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#8B6F47] rounded-full"></span>
              Información del cultivo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ubicación */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#8B6F47]/5 transition-colors">
                <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
                  <MapPin size={16} className="text-[#8B6F47]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Ubicación</p>
                  <p className="font-medium text-gray-800">{cultivo.ubicacion}</p>
                </div>
              </div>

              {/* Fecha de siembra */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#8B6F47]/5 transition-colors">
                <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
                  <Calendar size={16} className="text-[#8B6F47]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Fecha de siembra</p>
                  <p className="font-medium text-gray-800">{formatDate(cultivo.fechaSiembra)}</p>
                </div>
              </div>

              {/* Frecuencia de riego */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#8B6F47]/5 transition-colors">
                <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
                  <Droplets size={16} className="text-[#8B6F47]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Frecuencia de riego</p>
                  <p className="font-medium text-gray-800">{cultivo.frecuenciaRiego} días</p>
                </div>
              </div>

              {/* Días desde siembra */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#8B6F47]/5 transition-colors">
                <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
                  <Clock size={16} className="text-[#8B6F47]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Días desde siembra</p>
                  <p className="font-medium text-gray-800">
                    {Math.floor((new Date() - new Date(cultivo.fechaSiembra)) / (1000 * 60 * 60 * 24))} días
                  </p>
                </div>
              </div>

              {/* Descripción */}
              {cultivo.descripcion && (
                <div className="md:col-span-2 flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-[#8B6F47]/5 transition-colors">
                  <div className="p-2 bg-[#8B6F47]/10 rounded-lg">
                    <FileText size={16} className="text-[#8B6F47]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Descripción</p>
                    <p className="text-gray-700">{cultivo.descripcion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mini estadísticas - NUEVO */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold text-[#8B6F47]">{reportes.length}</p>
              <p className="text-xs text-gray-400">Reportes</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold text-[#8B6F47]">
                {reportes.filter(r => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-xs text-gray-400">Última semana</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold text-[#8B6F47]">
                {Math.floor((new Date() - new Date(cultivo.fechaSiembra)) / (1000 * 60 * 60 * 24))} días
              </p>
              <p className="text-xs text-gray-400">Edad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bitácora - MEJORADA */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-7 bg-[#8B6F47] rounded-full"></span>
              Bitácora del cultivo
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {reportes.length} reporte{reportes.length !== 1 ? 's' : ''} registrado{reportes.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2 self-start"
            onClick={() => setIsReporteOpen(true)}
          >
            <Plus size={18} />
            Registrar reporte
          </button>
        </div>

        {reportes.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-[#8B6F47]" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No hay reportes registrados aún</p>
            <p className="text-gray-400 text-sm">Comienza agregando el primer reporte de tu cultivo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportes.map((reporte, index) => (
              <div
                key={reporte.id}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-[#8B6F47]/20"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8B6F47]/10 rounded-lg flex items-center justify-center text-[#8B6F47] font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(reporte.createdAt)}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mb-2 pl-11">
                  {reporte.titulo}
                </h4>
                
                <p className="text-gray-600 leading-relaxed pl-11">
                  {reporte.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddReporteModal
        isOpen={isReporteOpen}
        onClose={() => setIsReporteOpen(false)}
        cultivoId={cultivo.id}
        onSave={handleCreateReporte}
      />
    </div>
  );
}