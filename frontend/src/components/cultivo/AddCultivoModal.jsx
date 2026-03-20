import { useState } from "react";
import {
  Upload,
  X,
  ChevronDown,
  MapPin,
  Calendar,
  FileText,
  Info,
  Sprout
} from "lucide-react";

export default function AddCultivoModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    fechaSiembra: "",
    descripcion: "",
    imagen: null,
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const { nombre, fechaSiembra, ubicacion, descripcion, imagen } = formData;

    if (!nombre || !fechaSiembra) {
      alert("Nombre y fecha son obligatorios");
      return;
    }

    const data = new FormData();

    data.append("nombre", nombre);
    data.append("descripcion", descripcion);
    data.append("ubicacion", ubicacion || "Sin ubicación");
    data.append("fechaSiembra", new Date(fechaSiembra).toISOString());
    data.append("frecuenciaRiego", "2");
    data.append("estado", "activo");

    if (imagen) {
      data.append("imagen", imagen);
    }

    onSave(data);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl shadow-xl relative animate-in fade-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-lg flex items-center justify-center shadow-md">
              <Sprout size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Nuevo cultivo</h2>
              <p className="text-xs text-gray-400 mt-0.5">Registra un nuevo cultivo en el sistema</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 📸 COLUMNA IZQUIERDA - Imagen */}
            <div className="md:col-span-1">
              <div className={`
                relative border-2 border-dashed rounded-xl p-6 
                flex flex-col items-center justify-center gap-2 
                min-h-[220px] transition-all cursor-pointer
                ${formData.imagen 
                  ? 'border-[#8B6F47] bg-[#8B6F47]/5' 
                  : 'border-gray-200 bg-gray-50 hover:border-[#8B6F47] hover:bg-[#8B6F47]/5'
                }
              `}>
                {formData.imagen ? (
                  <img
                    src={URL.createObjectURL(formData.imagen)}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
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
                  onChange={e => handleChange("imagen", e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                * Imagen opcional del cultivo
              </p>
            </div>

            {/* 📋 COLUMNA DERECHA - Formulario */}
            <div className="md:col-span-2 space-y-4">

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FileText size={12} /> Nombre del cultivo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => handleChange("nombre", e.target.value)}
                  className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] focus:ring-0 outline-none transition-colors bg-transparent"
                  placeholder="Ej: Tomates cherry"
                  required
                />
              </div>

              {/* Ubicación */}
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
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Fecha siembra */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Calendar size={12} /> Fecha de siembra
                </label>
                <input
                  type="date"
                  value={formData.fechaSiembra}
                  onChange={e => handleChange("fechaSiembra", e.target.value)}
                  className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] focus:ring-0 outline-none transition-colors bg-transparent"
                  required
                />
              </div>

              {/* Descripción */}
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
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
            onClick={handleSave}
          >
            <Sprout size={16} />
            Guardar cultivo
          </button>
        </div>
      </div>
    </div>
  );
}