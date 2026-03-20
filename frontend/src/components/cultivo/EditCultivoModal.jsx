import { useState, useEffect } from 'react';
import { X, Upload, MapPin, Calendar, Droplets, Activity, Sprout, Info, ChevronDown, FileText } from 'lucide-react';

export default function EditCultivoModal({
  isOpen,
  onClose,
  cultivo,
  onSave,
  onDelete,
  userRole
}) {

  const [formData, setFormData] = useState({
    nombre: '',
    fechaSiembra: '',
    frecuenciaRiego: '',
    estado: '',
    ubicacion: '',
    descripcion: '',
    file: null,
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {

    if (cultivo) {

      setFormData({
        nombre: cultivo.nombre || '',
        fechaSiembra: cultivo.fechaSiembra
          ? cultivo.fechaSiembra.split('T')[0]
          : '',
        frecuenciaRiego: cultivo.frecuenciaRiego || '',
        estado: cultivo.estado || '',
        ubicacion: cultivo.ubicacion || '',
        descripcion: cultivo.descripcion || '',
        file: null,
      });

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      if (cultivo.imagen) {
        setPreviewUrl(`http://localhost:3000${cultivo.imagen}`);
      } else {
        setPreviewUrl('');
      }

    }

    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };

  }, [cultivo]);

  if (!isOpen) return null;

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    setFormData(prev => ({
      ...prev,
      file
    }));

  };

  const handleSave = async () => {

    if (!formData.nombre || !formData.fechaSiembra) {
      alert("Completa los campos obligatorios");
      return;
    }

    const data = new FormData();

    data.append('nombre', formData.nombre);
    data.append('fechaSiembra', new Date(formData.fechaSiembra).toISOString());
    data.append('frecuenciaRiego', formData.frecuenciaRiego);
    data.append('estado', formData.estado);
    data.append('ubicacion', formData.ubicacion);
    data.append('descripcion', formData.descripcion);

    if (formData.file) {
      data.append('imagen', formData.file);
    }

    await onSave(cultivo.id, data);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    onClose();

  };

  const handleDelete = async () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {

    await onDelete(cultivo.id);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setShowConfirmDelete(false);
    onClose();

  };

  return (

    <>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >

        <div 
          className="bg-white rounded-2xl w-full max-w-3xl shadow-xl relative animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >

          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-lg flex items-center justify-center shadow-md">
                <Sprout size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Editar cultivo</h2>
                <p className="text-xs text-gray-400 mt-0.5">Modifica la información del cultivo</p>
              </div>
            </div>
          </div>

          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-1">

                <div className={`
                  relative border-2 border-dashed rounded-xl p-6 
                  flex flex-col items-center justify-center gap-2 
                  min-h-[220px] transition-all cursor-pointer
                  ${previewUrl 
                    ? 'border-[#8B6F47] bg-[#8B6F47]/5' 
                    : 'border-gray-200 bg-gray-50 hover:border-[#8B6F47] hover:bg-[#8B6F47]/5'
                  }
                `}>

                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-[#8B6F47]/10 rounded-full flex items-center justify-center">
                        <Upload size={24} className="text-[#8B6F47]" strokeWidth={1.5} />
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
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  * Imagen opcional del cultivo
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Sprout size={12} />
                    Nombre del cultivo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] focus:ring-0 outline-none transition-colors bg-transparent"
                    placeholder="Nombre del cultivo"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <MapPin size={12} />
                    Ubicación
                  </label>

                  <div className="relative">
                    <select
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
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

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Calendar size={12} />
                      Fecha siembra
                    </label>

                    <input
                      type="date"
                      name="fechaSiembra"
                      value={formData.fechaSiembra}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] focus:ring-0 outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Droplets size={12} />
                      Riego (días)
                    </label>

                    <input
                      type="number"
                      name="frecuenciaRiego"
                      value={formData.frecuenciaRiego}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] focus:ring-0 outline-none transition-colors bg-transparent"
                      placeholder="Ej: 2"
                    />
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Activity size={12} />
                    Estado
                  </label>

                  <div className="relative">
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="cosechado">Cosechado</option>
                      <option value="perdido">Perdido</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FileText size={12} />
                    Descripción
                  </label>

                  <textarea
                    name="descripcion"
                    rows={3}
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all resize-none"
                    placeholder="Notas adicionales sobre el cultivo..."
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Info size={10} />
                    Información adicional opcional
                  </div>
                </div>

                <div className="flex gap-3 pt-4">

                  <button
                    className="flex-1 bg-[#8B6F47] hover:bg-[#7a5f3c] text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                    onClick={handleSave}
                  >
                    Guardar cambios
                  </button>

                  {userRole === "admin" && (
                    <button
                      className="px-6 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                      onClick={handleDelete}
                    >
                      Borrar cultivo
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirmar eliminación
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              ¿Seguro que deseas eliminar este cultivo? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}