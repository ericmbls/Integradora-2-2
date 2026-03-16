import { useState } from "react";
import { createReporte } from "../../services/reportes.service";

export default function AddReporteModal({ cultivoId, onClose, onCreated }) {

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "OBSERVACION"
  });

  const handleSubmit = async () => {

    await createReporte({
      ...form,
      cultivoId
    });

    onCreated();
    onClose();
  };

  return (
    <div className="modal">

      <h2>Nuevo reporte</h2>

      <input
        placeholder="Título"
        value={form.titulo}
        onChange={(e)=>setForm({...form, titulo:e.target.value})}
      />

      <textarea
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e)=>setForm({...form, descripcion:e.target.value})}
      />

      <select
        value={form.tipo}
        onChange={(e)=>setForm({...form, tipo:e.target.value})}
      >
        <option value="RIEGO">Riego</option>
        <option value="FERTILIZACION">Fertilización</option>
        <option value="PLAGA">Plaga</option>
        <option value="COSECHA">Cosecha</option>
        <option value="OBSERVACION">Observación</option>
      </select>

      <button onClick={handleSubmit}>Guardar</button>

      <button onClick={onClose}>Cancelar</button>

    </div>
  );
}