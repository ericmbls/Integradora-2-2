import { useState, useEffect, useMemo } from 'react';
import { Trash2, Search, Plus, Edit3, Users, Mail, Shield } from 'lucide-react';

import {
  getUsuarios,
  deleteUsuario,
  createUsuarioAdmin,
  updateUsuario
} from "../../services/usuarios.service";

import AddUsuarioModal from "../../components/usuarios/AddUsuarioModal";
import EditUsuarioModal from "../../components/usuarios/EditUsuarioModal";

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsuarios();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteUsuario(userToDelete);
      setUsers(prev => prev.filter(u => u.id !== userToDelete));
      setUserToDelete(null);
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

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center shadow-md">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
              <p className="text-gray-400 mt-1">Administra usuarios y roles</p>
            </div>
          </div>

          <button 
            className="bg-[#8B6F47] hover:bg-[#7a5f3c] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={18} />
            Nuevo Usuario
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-400 mb-1">Total usuarios</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-400 mb-1">Administradores</p>
            <p className="text-2xl font-bold text-gray-800">
              {users.filter(u => u.role?.toLowerCase() === 'admin').length}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] transition-all bg-white"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Usuario</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Rol</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6b5436] rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                        {getInitials(user?.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">
                          {user?.name || "Sin nombre"}
                        </span>
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
                        className="p-2 text-gray-400 hover:text-[#8B6F47] hover:bg-[#8B6F47]/10 rounded-lg transition-all"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-[#8B6F47]/10 rounded-full flex items-center justify-center mb-4">
                <Users size={24} className="text-[#8B6F47]" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No se encontraron usuarios</p>
              <p className="text-gray-400 text-sm">Intenta con otros términos de búsqueda</p>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirmar eliminación
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              ¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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