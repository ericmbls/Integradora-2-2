import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText, Calendar, Filter, Download, Share2,
  Droplets, DollarSign, TrendingUp
} from 'lucide-react';
import './ReportesPage.css';

export default function ReportesPage() {
  const [kpis, setKpis] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, chartRes, repRes] = await Promise.all([
          axios.get('http://localhost:3000/api/reportes/kpis'),
          axios.get('http://localhost:3000/api/reportes/chart'),
          axios.get('http://localhost:3000/api/reportes/list'),
        ]);
        setKpis(kpiRes.data);
        setChartData(chartRes.data);
        setReportes(repRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generarReporte = async () => {
    await axios.post('http://localhost:3000/api/reportes/generar');
  };

  const descargarReporte = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/reportes/${id}/descargar`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

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

        <div className="chart-legend">
          <LegendItem color="#F472B6" label="Fresa" />
          <LegendItem color="#4ADE80" label="Lechuga" />
          <LegendItem color="#FCD34D" label="Pimiento" />
          <LegendItem color="#EF4444" label="Tomate" />
        </div>

        <div className="bar-chart-container">
          {chartData.map((data, i) => (
            <div key={i} className="chart-group">
              {data.fresa > 0 ? (
                <div className="bars-wrapper">
                  <div className="bar" style={{ height: `${data.fresa}%`, background: '#F472B6' }} />
                  <div className="bar" style={{ height: `${data.lechuga}%`, background: '#4ADE80' }} />
                  <div className="bar" style={{ height: `${data.pimiento}%`, background: '#FCD34D' }} />
                  <div className="bar" style={{ height: `${data.tomate}%`, background: '#EF4444' }} />
                </div>
              ) : (
                <div className="bars-empty" />
              )}
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
                {rep.status === 'processing' ? (
                  <button className="btn-processing">Procesando...</button>
                ) : (
                  <>
                    <button className="btn-action-text">
                      <Share2 size={16} /> Compartir
                    </button>
                    <button className="btn-action-text" onClick={() => descargarReporte(rep.id)}>
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

function LegendItem({ color, label }) {
  return (
    <div className="legend-item">
      <span className="dot" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

function SproutIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#65A30D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 4.5-5.9 3.2-8 5.6-2.5-3 .9-6 4-9z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-2.2 1.3-5-2-6-1.5-.7-3.4.4-1.2 3.4z" />
    </svg>
  );
}