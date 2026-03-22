import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Download,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Filter,
  BarChart3,
  PieChart,
  Search,
  TrendingUp,
  Clock,
  Grid3x3,
  List
} from "lucide-react";
import { authFetch } from "../../services/authFetch";

export default function ReportesPage() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStats, setShowStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const itemsPerPage = 6;
  const API = "/api/reportes";

  useEffect(() => {
    document.body.style.overflow = showStats ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showStats]);

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`${API}/list`);
        if (!res.ok) throw new Error("Error al obtener reportes");
        const data = await res.json();
        setReportes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando reportes", err);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReportes();
  }, []);

  const descargarReporte = async (id) => {
    try {
      const res = await authFetch(`${API}/${id}/descargar`);
      if (!res.ok) throw new Error("Error al descargar");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando reporte", error);
    }
  };

  const toggleFilter = (type) => {
    setSelectedFilters((prev) => {
      if (type === "todos") return [];
      return prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type];
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  const getTypeStats = () => {
    const stats = {};
    reportes.forEach(rep => {
      const type = rep.type?.toLowerCase() || "sin tipo";
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  };

  const getMonthStats = () => {
    const stats = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    reportes.forEach(rep => {
      if (rep.date) {
        const date = new Date(rep.date);
        const monthKey = months[date.getMonth()];
        stats[monthKey] = (stats[monthKey] || 0) + 1;
      }
    });
    
    return stats;
  };

  const filteredReportes = useMemo(() => {
    let filtered = reportes;
    
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((rep) => selectedFilters.includes(rep.type?.toLowerCase()));
    }
    
    if (searchTerm) {
      filtered = filtered.filter((rep) => 
        rep.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.cultivo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [reportes, selectedFilters, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  const uniqueTypes = [...new Set(reportes.map((r) => r.type?.toLowerCase()).filter(Boolean))];

  const getTypeColor = (type) => {
    const colors = {
      riego: "bg-blue-50 text-blue-700 border-blue-200",
      fertilizacion: "bg-green-50 text-green-700 border-green-200",
      plaga: "bg-red-50 text-red-700 border-red-200",
      cosecha: "bg-amber-50 text-amber-700 border-amber-200",
      observacion: "bg-purple-50 text-purple-700 border-purple-200"
    };
    return colors[type?.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-[#8B6F47] rounded-full animate-spin"></div>
          <FileText size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B6F47] animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 animate-pulse">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Reportes del Sistema
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-1">
                <FileText size={14} />
                Consulta y descarga reportes generados
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowStats(true)}
            className="bg-gradient-to-r from-[#8B6F47] to-[#6b5436] hover:from-[#7a5f3c] hover:to-[#5a4530] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
          >
            <PieChart size={18} />
            Estadísticas
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total reportes</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{reportes.length}</p>
              </div>
              <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
                <FileText size={20} className="text-[#8B6F47]" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <TrendingUp size={10} />
              Registrados en el sistema
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Reportes filtrados</p>
                <p className="text-3xl font-bold text-[#8B6F47]">{filteredReportes.length}</p>
              </div>
              <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
                <Filter size={20} className="text-[#8B6F47]" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              {selectedFilters.length} filtros activos
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Este mes</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {filteredReportes.filter((r) => {
                    const fecha = new Date(r.date);
                    const hoy = new Date();
                    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Calendar size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Clock size={10} />
              Últimos 30 días
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Tipos distintos</p>
                <p className="text-3xl font-bold text-amber-600">{uniqueTypes.length}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Tag size={20} className="text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              Categorías disponibles
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-slideUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#8B6F47]" />
              <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#8B6F47]" : "text-gray-400"}`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#8B6F47]" : "text-gray-400"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, autor o cultivo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedFilters.length === 0 
                  ? "bg-gradient-to-r from-[#8B6F47] to-[#6b5436] text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={clearFilters}
            >
              Todos ({reportes.length})
            </button>

            {uniqueTypes.map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                  selectedFilters.includes(type) 
                    ? "bg-gradient-to-r from-[#8B6F47] to-[#6b5436] text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => toggleFilter(type)}
              >
                {type} ({reportes.filter((r) => r.type?.toLowerCase() === type).length})
              </button>
            ))}
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((rep, idx) => (
              <div
                key={rep.id}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden hover:border-[#8B6F47]/30 transform hover:-translate-y-1 animate-slideUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs rounded-full border ${getTypeColor(rep.type)}`}>
                      {rep.type}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                      <Calendar size={10} />
                      {rep.date}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-[#8B6F47] transition-colors">
                    {rep.title}
                  </h3>

                  {rep.cultivo && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1 bg-gray-50 inline-flex px-2 py-1 rounded-full">
                      <Tag size={10} />
                      {rep.cultivo}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <User size={12} />
                      {rep.autor}
                    </span>

                    <button
                      onClick={() => descargarReporte(rep.id)}
                      className="p-2 text-gray-400 hover:text-[#8B6F47] hover:bg-[#8B6F47]/10 rounded-lg transition-all duration-300"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Tipo</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Título</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Cultivo</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Fecha</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Autor</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Acciones</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((rep, idx) => (
                  <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors group animate-slideUp" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full border ${getTypeColor(rep.type)}`}>
                        {rep.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-[#8B6F47] transition-colors">{rep.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      {rep.cultivo ? (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Tag size={10} />
                          {rep.cultivo}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {rep.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <User size={10} />
                        {rep.autor}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => descargarReporte(rep.id)}
                        className="p-2 text-gray-400 hover:text-[#8B6F47] hover:bg-[#8B6F47]/10 rounded-lg transition-all duration-300"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {currentItems.length === 0 && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 animate-fadeIn">
            <div className="w-20 h-20 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-[#8B6F47]" />
            </div>
            <p className="text-gray-500 text-lg mb-2 font-medium">No se encontraron reportes</p>
            <p className="text-gray-400 text-sm">Intenta con otros filtros o términos de búsqueda</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={firstPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={lastPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}
      </div>

      {showStats && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowStats(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-xl relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10"
              onClick={() => setShowStats(false)}
            >
              <X size={20} />
            </button>

            <div className="clear-both"></div>

            <div className="px-6 pt-2 pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
                  <PieChart size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Estadísticas de Reportes</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Resumen de reportes del sistema
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Por tipo de reporte</h4>
                  {Object.entries(getTypeStats()).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center mb-3 group">
                      <span className="text-sm text-gray-600 capitalize">{type}</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#8B6F47] to-[#6b5436] h-2 rounded-full transition-all duration-1000 group-hover:opacity-80"
                            style={{ width: `${(count / reportes.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#8B6F47] min-w-[40px]">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Por mes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(getMonthStats()).map(([month, count]) => (
                      <div key={month} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center hover:shadow-md transition-all">
                        <p className="text-xs text-gray-500">{month}</p>
                        <p className="text-xl font-bold text-[#8B6F47]">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-gray-500">Total de reportes:</span>
                    <span className="font-bold text-gray-800">{reportes.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-gray-500">Tipos distintos:</span>
                    <span className="font-bold text-gray-800">{Object.keys(getTypeStats()).length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2">
                    <span className="text-gray-500">Promedio por tipo:</span>
                    <span className="font-bold text-gray-800">
                      {(reportes.length / Object.keys(getTypeStats()).length || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowStats(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-[#8B6F47] to-[#6b5436] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}