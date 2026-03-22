import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Upload,
  MapPin,
  Calendar,
  Droplets,
  Activity,
  Sprout,
  Info,
  ChevronDown,
  FileText
} from "lucide-react";

export default function EditCultivoModal({
  isOpen,
  onClose,
  cultivo,
  onSave,
  onDelete,
  userRole
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    fechaSiembra: "",
    frecuenciaRiego: "",
    estado: "",
    ubicacion: "",
    descripcion: "",
    file: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (cultivo) {
      setFormData({
        nombre: cultivo.nombre || "",
        fechaSiembra: cultivo.fechaSiembra ? cultivo.fechaSiembra.split("T")[0] : "",
        frecuenciaRiego: cultivo.frecuenciaRiego || "",
        estado: cultivo.estado || "",
        ubicacion: cultivo.ubicacion || "",
        descripcion: cultivo.descripcion || "",
        file: null,
      });

      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      if (cultivo.imagen) {
        setPreviewUrl(`http://localhost:3000${cultivo.imagen}`);
      } else {
        setPreviewUrl("");
      }
    }

    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [cultivo]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.fechaSiembra) {
      alert("Completa los campos obligatorios");
      return;
    }

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("fechaSiembra", new Date(formData.fechaSiembra).toISOString());
    data.append("frecuenciaRiego", formData.frecuenciaRiego);
    data.append("estado", formData.estado);
    data.append("ubicacion", formData.ubicacion);
    data.append("descripcion", formData.descripcion);

    if (formData.file) {
      data.append("imagen", formData.file);
    }

    await onSave(cultivo.id, data);

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    onClose();
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    await onDelete(cultivo.id);

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setShowConfirmDelete(false);
    onClose();
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    setFormData(prev => ({ ...prev, file: null }));
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-3xl shadow-xl relative animate-in fade-in duration-200 max-h-[95vh] overflow-y-auto"
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
                <Sprout size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Editar cultivo</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Modifica la información del cultivo
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 min-h-[200px] transition-all cursor-pointer ${
                    previewUrl
                      ? "border-[#8B6F47] bg-[#8B6F47]/5"
                      : "border-gray-200 bg-gray-50 hover:border-[#8B6F47] hover:bg-[#8B6F47]/5"
                  }`}
                >
                  {previewUrl ? (
                    <div className="relative w-full">
                      <img
                        src={previewUrl}
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
                      <span className="text-sm font-medium text-gray-600">
                        Subir imagen
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Info size={10} />
                        PNG, JPG hasta 5MB
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">
                  Imagen opcional del cultivo
                </p>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Sprout size={12} /> Nombre del cultivo
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => handleChange("nombre", e.target.value)}
                    className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] outline-none transition-colors bg-transparent"
                    placeholder="Ej: Tomates cherry"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <MapPin size={12} /> Ubicación
                  </label>
                  <div className="relative">
                    <select
                      value={formData.ubicacion}
                      onChange={e => handleChange("ubicacion", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
                    >
                      <option value="">Seleccionar ubicación</option>
                      <option value="Invernadero A">Invernadero A</option>
                      <option value="Invernadero B">Invernadero B</option>
                      <option value="Campo Abierto">Campo Abierto</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Calendar size={12} /> Fecha de siembra
                    </label>
                    <input
                      type="date"
                      value={formData.fechaSiembra}
                      onChange={e => handleChange("fechaSiembra", e.target.value)}
                      className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Droplets size={12} /> Riego (días)
                    </label>
                    <input
                      type="number"
                      value={formData.frecuenciaRiego}
                      onChange={e => handleChange("frecuenciaRiego", e.target.value)}
                      className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] outline-none transition-colors bg-transparent"
                      placeholder="Ej: 2"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Activity size={12} /> Estado
                  </label>
                  <div className="relative">
                    <select
                      value={formData.estado}
                      onChange={e => handleChange("estado", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="cosechado">Cosechado</option>
                      <option value="perdido">Perdido</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FileText size={12} /> Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={e => handleChange("descripcion", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all resize-none"
                    placeholder="Notas adicionales sobre el cultivo..."
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Info size={10} />
                    Información adicional opcional
                  </div>
                </div>
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
              onClick={handleSave}
              className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Sprout size={16} />
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      {showConfirmDelete && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowConfirmDelete(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl relative animate-in fade-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Confirmar eliminación
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                ¿Seguro que deseas eliminar este cultivo? Esta acción no se puede deshacer.
              </p>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center text-white font-semibold text-base shadow-md">
                    {cultivo?.nombre?.[0]?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {cultivo?.nombre || "Sin nombre"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={10} />
                      {cultivo?.ubicacion || "Sin ubicación"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <X size={16} />
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>,
    document.body
  );
}