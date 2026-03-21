import { useState, useEffect, useMemo } from 'react';
import { Trash2, Search, Plus, Edit3, Users, Mail, Shield, Download, AlertCircle, TrendingUp, Clock, X } from 'lucide-react';

import {
  getUsuarios,
  deleteUsuario,
  createUsuarioAdmin,
  updateUsuario
} from "../../services/usuarios.service";

import AddUsuarioModal from "../../components/usuarios/AddUsuarioModal";
import EditUsuarioModal from "../../components/usuarios/EditUsuarioModal";

export default function UsuariosPage({ currentUserId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUserId) {
      alert("No puedes eliminar tu propio usuario");
      return;
    }
    const user = users.find(u => u.id === id);
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    try {
      await deleteUsuario(userToDelete.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      
      const newTotalPages = Math.ceil((users.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  const handleCreateUsuario = async (nuevoUsuario) => {
    try {
      const creado = await createUsuarioAdmin(nuevoUsuario);
      setUsers(prev => [...prev, creado]);
    } catch (err) {
      console.error("Error creando usuario:", err);
    }
  };

  const handleUpdateUsuario = async (data) => {
    try {
      const actualizado = await updateUsuario(editingUser.id, data);
      setUsers(prev => prev.map(u => (u.id === actualizado.id ? actualizado : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user?.name?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";
      const role = user?.role?.toLowerCase() || "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        role.includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, users]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalAdmins = users.filter(u => u.role?.toLowerCase() === 'admin').length;

  const handleExportUsers = () => {
    const exportData = filteredUsers.map(user => ({
      nombre: user.name,
      email: user.email,
      rol: user.role,
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `usuarios_${new Date().toISOString().slice(0,10)}.json`);
    linkElement.click();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role) => {
    if (role?.toLowerCase() === 'admin') {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-[#8B6F47] rounded-full animate-spin"></div>
          <Users size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B6F47] animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 animate-pulse">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-lg">
              <Users size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-1">
                <Shield size={14} />
                Administra usuarios y roles del sistema
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleExportUsers}
              className="border border-gray-200 hover:border-[#8B6F47] text-gray-600 hover:text-[#8B6F47] px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-md"
            >
              <Download size={18} />
              Exportar
            </button>
            
            <button 
              className="bg-gradient-to-r from-[#8B6F47] to-[#6b5436] hover:from-[#7a5f3c] hover:to-[#5a4530] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus size={18} />
              Nuevo Usuario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total usuarios</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{users.length}</p>
              </div>
              <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
                <Users size={20} className="text-[#8B6F47]" />
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
                <p className="text-sm text-gray-400 mb-1">Administradores</p>
                <p className="text-3xl font-bold text-purple-600">{totalAdmins}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Shield size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Shield size={10} />
              Con permisos de administrador
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Usuarios estándar</p>
                <p className="text-3xl font-bold text-blue-600">{users.length - totalAdmins}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <Clock size={10} />
              Con acceso limitado
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Filtrados</p>
                <p className="text-3xl font-bold text-[#8B6F47]">{filteredUsers.length}</p>
              </div>
              <div className="p-3 bg-[#8B6F47]/10 rounded-xl">
                <Search size={20} className="text-[#8B6F47]" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              {searchTerm ? `Coinciden con "${searchTerm}"` : "Todos los usuarios"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-slideUp">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slideUp">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Usuario</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Rol</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Acciones</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers?.map((user, idx) => {
                const isCurrentUser = user.id === currentUserId;
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-all duration-300 ${
                          isCurrentUser 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                            : 'bg-gradient-to-br from-[#8B6F47] to-[#6b5436]'
                        }`}>
                          {getInitials(user?.name)}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">
                              {user?.name || "Sin nombre"}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Tú
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {user?.email || "Sin email"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role)} flex items-center gap-1 w-fit`}>
                        <Shield size={12} />
                        {user?.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-[#8B6F47] hover:bg-[#8B6F47]/10 rounded-lg transition-all duration-300"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            isCurrentUser
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                          onClick={() => handleDelete(user.id)}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? "No puedes eliminar tu propio usuario" : "Eliminar usuario"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-[#8B6F47]" />
              </div>
              <p className="text-gray-500 text-lg mb-2 font-medium">No se encontraron usuarios</p>
              <p className="text-gray-400 text-sm">
                {searchTerm ? `No hay usuarios que coincidan con "${searchTerm}"` : "No hay usuarios registrados"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 bg-[#8B6F47] text-white rounded-lg hover:bg-[#7a5f3c] transition-all"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}

          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <p className="text-sm text-gray-500">
                Mostrando <span className="font-semibold text-gray-700">{paginatedUsers.length}</span> de <span className="font-semibold text-gray-700">{filteredUsers.length}</span> usuarios
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-300"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-300"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        <AddUsuarioModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={handleCreateUsuario}
        />

        <EditUsuarioModal
          isOpen={!!editingUser}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUsuario}
        />
      </div>

      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Confirmar eliminación
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              ¿Seguro que deseas eliminar el siguiente usuario?
            </p>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center text-white font-semibold text-base shadow-md">
                  {getInitials(userToDelete?.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {userToDelete?.name || "Sin nombre"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail size={10} />
                    {userToDelete?.email || "Sin email"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <Shield size={12} className="text-gray-400" />
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(userToDelete?.role)}`}>
                  {userToDelete?.role || "user"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg mb-6">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-xs text-red-600">
                Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all duration-300"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Trash2 size={16} />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}