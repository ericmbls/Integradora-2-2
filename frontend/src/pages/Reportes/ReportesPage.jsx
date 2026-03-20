import { useState, useEffect } from "react";
import axios from "axios";
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
  BarChart3
} from "lucide-react";

export default function ReportesPage() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const API = "http://localhost:3000/api/reportes";

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const repRes = await axios.get(`${API}/list`);
        setReportes(repRes.data || []);
      } catch (err) {
        console.error("Error cargando reportes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  const descargarReporte = async (id) => {
    try {
      const res = await axios.get(`${API}/${id}/descargar`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte-${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error descargando reporte", error);
    }
  };

  const toggleFilter = (type) => {
    setSelectedFilters(prev => {
      if (type === "todos") {
        return [];
      }
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  const removeFilter = (type) => {
    setSelectedFilters(prev => prev.filter(t => t !== type));
    setCurrentPage(1);
  };

  const filteredReportes = selectedFilters.length === 0
    ? reportes
    : reportes.filter((rep) => selectedFilters.includes(rep.type?.toLowerCase()));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  const uniqueTypes = [...new Set(reportes.map(r => r.type?.toLowerCase()).filter(Boolean))];

  const getTypeColor = (type) => {
    const colors = {
      riego: "bg-blue-50 text-blue-600 border-blue-200",
      fertilizacion: "bg-green-50 text-green-600 border-green-200",
      plaga: "bg-red-50 text-red-600 border-red-200",
      cosecha: "bg-amber-50 text-amber-600 border-amber-200",
      observacion: "bg-purple-50 text-purple-600 border-purple-200"
    };
    return (
      colors[type?.toLowerCase()] ||
      "bg-gray-50 text-gray-600 border-gray-200"
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#8B6F47] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reportes del Sistema</h1>
            <p className="text-gray-400 mt-1">Consulta y descarga reportes generados</p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Total reportes</p>
          <p className="text-2xl font-bold text-gray-800">{reportes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Reportes filtrados</p>
          <p className="text-2xl font-bold text-[#8B6F47]">{filteredReportes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Este mes</p>
          <p className="text-2xl font-bold text-gray-800">
            {filteredReportes.filter(r => {
              const fecha = new Date(r.date);
              const hoy = new Date();
              return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-[#8B6F47]" />
          <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedFilters.length === 0 
                  ? "bg-[#8B6F47] text-white shadow-sm" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              onClick={() => clearFilters()}
            >
              Todos
              <span className="ml-2 text-xs opacity-75">
                ({reportes.length})
              </span>
            </button>
            
            {uniqueTypes.map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedFilters.includes(type) 
                    ? "bg-[#8B6F47] text-white shadow-sm" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                onClick={() => toggleFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                <span className="ml-2 text-xs opacity-75">
                  ({reportes.filter(r => r.type?.toLowerCase() === type).length})
                </span>
              </button>
            ))}
          </div>

          {/* Filtros activos */}
          {selectedFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Filtros activos:</span>
              {selectedFilters.map(type => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(type)}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  <button
                    onClick={() => removeFilter(type)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-[#8B6F47] underline ml-2"
              >
                Limpiar todos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReportes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-[#8B6F47]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay reportes</h3>
            <p className="text-gray-400 mb-4">No se encontraron reportes con los filtros seleccionados</p>
            {selectedFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-[#8B6F47] text-white rounded-lg hover:bg-[#7a5f3c] transition-colors text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          currentItems.map((rep) => (
            <div key={rep.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden hover:border-[#8B6F47]/20">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(rep.type)}`}>
                    {rep.type}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {rep.date}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#8B6F47] transition-colors">
                  {rep.title}
                </h3>

                {rep.cultivo && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                    <Tag size={12} className="text-[#8B6F47]" />
                    <span className="text-xs">{rep.cultivo}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User size={12} />
                    <span>{rep.autor || "Sin autor"}</span>
                  </div>

                  <button
                    className="p-2 text-gray-400 hover:text-[#8B6F47] hover:bg-[#8B6F47]/10 rounded-lg transition-all"
                    onClick={() => descargarReporte(rep.id)}
                    title="Descargar"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {rep.status === "processing" && (
                <div className="flex items-center gap-2 px-5 py-2 bg-amber-50 border-t border-amber-100">
                  <div className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                  <span className="text-xs text-amber-600">Procesando...</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {filteredReportes.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-400 order-2 sm:order-1">
            Mostrando <span className="font-medium text-gray-700">{indexOfFirstItem + 1}</span> -{' '}
            <span className="font-medium text-gray-700">{Math.min(indexOfLastItem, filteredReportes.length)}</span> de{' '}
            <span className="font-medium text-gray-700">{filteredReportes.length}</span> reportes
          </div>
          
          <div className="flex items-center justify-center gap-1 order-1 sm:order-2">
            <button
              onClick={firstPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#8B6F47]"
              }`}
              title="Primera página"
            >
              <ChevronsLeft size={18} />
            </button>
            
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#8B6F47]"
              }`}
              title="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
              if (
                number === 1 ||
                number === totalPages ||
                (number >= currentPage - 1 && number <= currentPage + 1)
              ) {
                return (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === number
                        ? "bg-[#8B6F47] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#8B6F47]"
                    }`}
                  >
                    {number}
                  </button>
                );
              }
              
              if (
                (number === currentPage - 2 && number > 1) ||
                (number === currentPage + 2 && number < totalPages)
              ) {
                return (
                  <span key={number} className="w-10 text-center text-gray-400">
                    ...
                  </span>
                );
              }
              
              return null;
            })}
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#8B6F47]"
              }`}
              title="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={lastPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#8B6F47]"
              }`}
              title="Última página"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}