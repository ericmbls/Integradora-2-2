import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, FileText, Info, Calendar, Droplets, Bug, Sprout, Eye } from "lucide-react";

export default function AddReporteModal({ isOpen, onClose, cultivoId, onSave }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "OBSERVACION",
    file: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.titulo.trim()) return;
      if (!formData.descripcion.trim()) return;

      setLoading(true);

      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion);
      data.append("tipo", formData.tipo);
      data.append("cultivoId", String(cultivoId));

      if (formData.file) {
        data.append("imagen", formData.file);
      }

      await onSave(data);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setFormData({
        titulo: "",
        descripcion: "",
        tipo: "OBSERVACION",
        file: null
      });

      setPreview(null);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      RIEGO: <Droplets size={16} className="text-blue-500" />,
      FERTILIZACION: <Sprout size={16} className="text-green-500" />,
      PLAGA: <Bug size={16} className="text-red-500" />,
      COSECHA: <Sprout size={16} className="text-amber-500" />,
      OBSERVACION: <Eye size={16} className="text-purple-500" />
    };
    return icons[tipo] || <FileText size={16} className="text-gray-500" />;
  };

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFormData(prev => ({ ...prev, file: null }));
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative animate-in fade-in duration-200 max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="clear-both"></div>

        <div className="px-6 pt-2 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Nuevo reporte</h2>
              <p className="text-xs text-gray-400 mt-0.5">Registra una nueva entrada en la bitácora</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FileText size={12} />
                Título del reporte
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] outline-none transition-colors bg-transparent"
                placeholder="Ej: Aplicación de fertilizante"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar size={12} />
                Tipo de reporte
              </label>
              <div className="relative">
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
                >
                  <option value="RIEGO">Riego</option>
                  <option value="FERTILIZACION">Fertilización</option>
                  <option value="PLAGA">Plaga</option>
                  <option value="COSECHA">Cosecha</option>
                  <option value="OBSERVACION">Observación</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  {getTipoIcon(formData.tipo)}
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FileText size={12} />
                Descripción
              </label>
              <textarea
                name="descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all resize-none"
                placeholder="Describe los detalles del reporte..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Upload size={12} />
                Imagen (opcional)
              </label>
              <div className={`
                relative border-2 border-dashed rounded-xl p-6 
                flex flex-col items-center justify-center gap-2 
                min-h-[180px] transition-all cursor-pointer
                ${preview 
                  ? 'border-[#8B6F47] bg-[#8B6F47]/5' 
                  : 'border-gray-200 bg-gray-50 hover:border-[#8B6F47] hover:bg-[#8B6F47]/5'
                }
              `}>
                {preview ? (
                  <div className="relative w-full">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-[#8B6F47]/10 rounded-full flex items-center justify-center">
                      <Upload size={24} className="text-[#8B6F47]" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Subir imagen</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Info size={10} />
                      PNG, JPG hasta 5MB
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Info size={10} />
                La imagen aparecerá en el reporte
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileText size={16} />
            {loading ? "Guardando..." : "Registrar reporte"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}