import { useState, useEffect } from "react";
import { X, Mail, Shield, Info, User } from "lucide-react";

export default function EditUsuarioModal({ isOpen, onClose, onSave, user }) {
  const [form, setForm] = useState({
    email: "",
    role: "USER"
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || "",
        role: user.role || "USER"
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl relative animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
        <button 
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10" 
          onClick={onClose} 
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">Editar usuario</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna izquierda - Avatar estático */}
              <div className="md:col-span-1">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 min-h-[200px] bg-gray-50">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-full flex items-center justify-center text-white shadow-md">
                    <User size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Foto de perfil</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Info size={10} />
                    Sin cambios
                  </span>
                </div>
              </div>

              {/* Columna derecha - Formulario */}
              <div className="md:col-span-2 space-y-6">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Mail size={12} />
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2.5 border-0 border-b-2 border-gray-200 focus:border-[#8B6F47] focus:ring-0 outline-none transition-colors bg-transparent"
                    placeholder="usuario@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Info size={10} />
                    Email del usuario
                  </div>
                </div>

                {/* Rol */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Shield size={12} />
                    Rol del usuario
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all appearance-none bg-white"
                    >
                      <option value="USER">Usuario</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Info size={10} />
                    Define los permisos del usuario
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-100">
            <button 
              type="submit" 
              className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}