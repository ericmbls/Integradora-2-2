import { useState, useEffect } from "react";
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
import { authFetch } from "../../services/authFetch";

export default function ReportesPage() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const API = "/api/reportes";

  useEffect(() => {
    const fetchReportes = async () => {
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
    } catch (error) {
      console.error("Error descargando reporte", error);
    }
  };

  const toggleFilter = (type) => {
    setSelectedFilters((prev) => {
      if (type === "todos") return [];
      return prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  const filteredReportes =
    selectedFilters.length === 0
      ? reportes
      : reportes.filter((rep) =>
          selectedFilters.includes(rep.type?.toLowerCase())
        );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);

  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  const uniqueTypes = [
    ...new Set(
      reportes.map((r) => r.type?.toLowerCase()).filter(Boolean)
    )
  ];

  const getTypeColor = (type) => {
    const colors = {
      riego: "bg-blue-50 text-blue-600 border-blue-200",
      fertilizacion: "bg-green-50 text-green-600 border-green-200",
      plaga: "bg-red-50 text-red-600 border-red-200",
      cosecha: "bg-amber-50 text-amber-600 border-amber-200",
      observacion: "bg-purple-50 text-purple-600 border-purple-200"
    };
    return colors[type?.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-200";
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reportes del Sistema
            </h1>
            <p className="text-gray-400 mt-1">
              Consulta y descarga reportes generados
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Total reportes</p>
          <p className="text-2xl font-bold text-gray-800">
            {reportes.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">
            Reportes filtrados
          </p>
          <p className="text-2xl font-bold text-[#8B6F47]">
            {filteredReportes.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Este mes</p>
          <p className="text-2xl font-bold text-gray-800">
            {
              filteredReportes.filter((r) => {
                const fecha = new Date(r.date);
                const hoy = new Date();
                return (
                  fecha.getMonth() === hoy.getMonth() &&
                  fecha.getFullYear() === hoy.getFullYear()
                );
              }).length
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-[#8B6F47]" />
          <h3 className="text-sm font-semibold text-gray-700">
            Filtros
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedFilters.length === 0
                ? "bg-[#8B6F47] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={clearFilters}
          >
            Todos ({reportes.length})
          </button>

          {uniqueTypes.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedFilters.includes(type)
                  ? "bg-[#8B6F47] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => toggleFilter(type)}
            >
              {type} (
              {
                reportes.filter(
                  (r) => r.type?.toLowerCase() === type
                ).length
              }
              )
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((rep) => (
          <div key={rep.id} className="bg-white rounded-xl border p-5">
            <div className="flex justify-between mb-2">
              <span className={`px-3 py-1 text-xs rounded-full border ${getTypeColor(rep.type)}`}>
                {rep.type}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} />
                {rep.date}
              </span>
            </div>

            <h3 className="font-semibold text-gray-800">
              {rep.title}
            </h3>

            {rep.cultivo && (
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Tag size={12} />
                {rep.cultivo}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <User size={12} />
                {rep.autor}
              </span>

              <button onClick={() => descargarReporte(rep.id)}>
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}