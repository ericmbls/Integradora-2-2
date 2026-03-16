import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Calendar,
  Filter,
  Download,
  Share2
} from "lucide-react";
import "./ReportesPage.css";

export default function ReportesPage() {
  const [kpis, setKpis] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api/reportes";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, chartRes, repRes] = await Promise.all([
          axios.get(`${API}/kpis`),
          axios.get(`${API}/chart`),
          axios.get(`${API}/list`)
        ]);

        setKpis(kpiRes.data || []);
        setChartData(chartRes.data || []);
        setReportes(repRes.data || []);
      } catch (err) {
        console.error("Error cargando datos de reportes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generarReporte = async () => {
    try {
      await axios.post(`${API}/generar`);
      alert("Reporte generado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error generando reporte");
    }
  };

  const descargarReporte = async (id) => {
    try {
      const res = await axios.get(`${API}/${id}/descargar`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
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

  if (loading) {
    return <div className="loading-page">Cargando reportes...</div>;
  }

  return (
    <div className="dashboard-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Reportes y Análisis</h1>
          <p className="page-subtitle">Genera y consulta reportes del sistema</p>
        </div>

        <button className="btn-primary" onClick={generarReporte}>
          <FileText size={18} style={{ marginRight: 8 }} />
          Generar Reporte
        </button>
      </div>

      <div className="kpi-row">
        {kpis.map((kpi, index) => (
          <div key={index} className="kpi-card-report">
            <div className="kpi-top">
              <div className="kpi-icon-wrapper">{kpi.icon}</div>
              <span className="kpi-badge">{kpi.badge}</span>
            </div>

            <div className="kpi-content">
              <span className="kpi-label">{kpi.title}</span>
              <h3 className="kpi-number">{kpi.value}</h3>
              <span className="kpi-sub-text">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card-section">
        <div className="chart-controls">
          <div className="chart-tabs">
            <button className="chart-tab active">Producción</button>
            <button className="chart-tab">Consumo de Agua</button>
            <button className="chart-tab">Financiero</button>
          </div>

          <div className="chart-actions">
            <button className="btn-secondary">
              <Calendar size={14} /> Rango
            </button>
            <button className="btn-secondary">
              <Filter size={14} /> Filtros
            </button>
            <button className="btn-secondary">
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>

        <h3 className="chart-title">Producción por Cultivo</h3>

        <div className="bar-chart-container">
          {chartData.map((data, i) => (
            <div key={i} className="chart-group">
              <div className="bars-wrapper">
                <div
                  className="bar"
                  style={{ height: `${data.fresa || 0}%`, background: "#F472B6" }}
                />
                <div
                  className="bar"
                  style={{ height: `${data.lechuga || 0}%`, background: "#4ADE80" }}
                />
                <div
                  className="bar"
                  style={{ height: `${data.pimiento || 0}%`, background: "#FCD34D" }}
                />
                <div
                  className="bar"
                  style={{ height: `${data.tomate || 0}%`, background: "#EF4444" }}
                />
              </div>
              <span className="chart-label">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reportes-list-section">
        <h3>Reportes Generados</h3>

        <div className="reportes-stack">
          {reportes.map((rep) => (
            <div key={rep.id} className="reporte-item">
              <div className="reporte-left">
                <div className="file-icon-wrapper">
                  <FileText size={24} color="#8B6F47" />
                </div>
                <div className="reporte-details">
                  <h4>{rep.title}</h4>
                  <p>{rep.date} · {rep.type} · {rep.size}</p>
                </div>
              </div>

              <div className="reporte-actions">
                {rep.status === "processing" ? (
                  <button className="btn-processing">Procesando...</button>
                ) : (
                  <>
                    <button className="btn-action-text">
                      <Share2 size={16} /> Compartir
                    </button>
                    <button
                      className="btn-action-text"
                      onClick={() => descargarReporte(rep.id)}
                    >
                      <Download size={16} /> Descargar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}