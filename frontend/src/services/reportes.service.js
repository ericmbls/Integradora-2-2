import { authFetch } from "./authFetch";

export async function getReportesByCultivo(cultivoId) {

  const res = await authFetch(`/api/reportes/cultivo/${cultivoId}`);

  return res.json();

}

export async function createReporte(data) {

  const res = await authFetch("/api/reportes", {
    method: "POST",
    body: data
  });

  return res.json();

}