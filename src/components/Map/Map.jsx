import React, { useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RiskLegend from '../RiskLegend/RiskLegend';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapData from '../../data/map-sjl.json';
import routesData from '../../data/map-routes.json';
import zonasData from '../../data/zonas.json';

// Contenido del mapa
const MapContent = ({ selectedRiskId, visibleRisks }) => {
  const map = useMap();
  const geoJsonRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  // Filtrar riesgos
  const filteredRoutesData = useMemo(() => {
    if (!routesData) return null;
    return {
      ...routesData,
      features: routesData.features.filter(f => {
        if (f.properties.type === 'risk_point' || f.properties.type === 'risk_circle') {
          return visibleRisks.includes(f.properties.risk);
        }
        return true; // Mantener rutas
      })
    };
  }, [visibleRisks]);

  // Zoom al seleccionar en leyenda
  useEffect(() => {
    if (selectedRiskId) {
      const group = selectedRiskId.toString().padStart(2, '0'); // Asegurar formato "01", "02", etc.
      let bounds = L.latLngBounds([]);
      let found = false;

      if (routesData && routesData.features) {
        routesData.features.forEach(f => {
           // Comparar grupo
          if (f.properties.group === group) {
            if (f.geometry.type === 'Point') {
               const latlng = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
               bounds.extend(latlng);
               found = true;
            } else if (f.geometry.type === 'LineString') {
               // Opcional: Incluir líneas si es necesario
            }
          }
        });

        if (found && bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [100, 100],
            maxZoom: 18,
            duration: 1.5
          });
        }
      }
    }
  }, [selectedRiskId, map]);

  // Actualizar zoom local
  useEffect(() => {
    const handleZoom = () => setZoomLevel(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map]);

  // Normalizar datos SJL
  const districtData = useMemo(() => mapData ? (mapData.type === 'FeatureCollection' ? mapData : {
    type: 'FeatureCollection',
    features: [mapData]
  }) : null, []);

  // Capa para hexágonos (siempre arriba)
  useLayoutEffect(() => {
    if (!map.getPane('hexagonPane')) {
      map.createPane('hexagonPane');
      map.getPane('hexagonPane').style.zIndex = 650;
    }
  }, [map]);

  // Ajustar inicio a SJL
  useEffect(() => {
    // Solo centrar si no está ya centrado o para forzar inicio en SJL
    map.setView([-11.97, -76.99], 13);
  }, [map]);

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <strong>${feature.properties.name}</strong>
        ${feature.properties.description ? `<br/>${feature.properties.description}` : ''}
      `);
    }

    // Funcionalidad: Clic en hexágono acerca a esa zona
    if (feature.properties.type === 'risk_point') {
      layer.on('click', () => {
        const group = feature.properties.group;
        let bounds = L.latLngBounds([layer.getLatLng()]); // Empieza con el hexágono

        if (group && routesData && routesData.features) {
          // Buscar otros puntos (círculos) del mismo grupo
          routesData.features.forEach(f => {
            if (f.properties.group === group && f.geometry.type === 'Point') {
              // Intercambiar lng, lat a lat, lng para Leaflet
              const latlng = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
              bounds.extend(latlng);
            }
          });
          
          // Ajustar mapa
          map.flyToBounds(bounds, {
            padding: [100, 100],
            maxZoom: 18,
            duration: 1.5
          });
        } else {
             // Fallback
            map.flyTo(layer.getLatLng(), 18, {
              animate: true,
              duration: 1.5
            });
        }
      });
    }
  };

  // Estilo Fondo (Distrito)
  const districtStyle = (feature) => {
    return {
      fillColor: feature.properties.fill || '#ff7800',
      weight: 2,
      opacity: 1,
      color: feature.properties.stroke || '#ff7800',
      fillOpacity: 0.1
    };
  };

  // Estilo Rutas
  const routeStyle = (feature) => {
    return {
      fillColor: feature.properties.fill || '#3388ff',
      weight: 4,
      opacity: 1,
      color: feature.properties.stroke || '#3388ff',
      fillOpacity: 0.3,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  // Estilo Zonas
  const zoneStyle = (feature) => {
    return {
      fillColor: feature.properties.fill || '#FFA500',
      weight: 4,
      opacity: 1,
      color: feature.properties.stroke || '#FFA500',
      fillOpacity: feature.properties['fill-opacity'] || 0.5,
      lineJoin: 'round',
      lineCap: 'round'
    };
  };

  // Resetear vista a SJL
  const handleResetView = () => {
    // Coordenadas centradas en SJL
    map.flyTo([-11.97, -76.99], 13, { duration: 1.5 });
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <>
      <div className="absolute top-2.5 right-2.5 z-[1000] flex flex-col gap-2">
        <button 
          className="w-10 h-10 bg-white border-[4px] border-black/10 rounded-lg flex items-center justify-center text-xl cursor-pointer shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#f8f8f8] hover:border-[#ffde59] text-gray-800" 
          onClick={handleResetView} 
          title="Restablecer Vista"
        >
          🏠
        </button>
        <button 
          className="w-10 h-10 bg-white border-[4px] border-black/10 rounded-lg flex items-center justify-center text-xl cursor-pointer shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:border-red-500 text-red-600" 
          onClick={handleLogout} 
          title="Cerrar Sesión"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      />
      {/* Capa 1: Polígono del Distrito (Fondo) */}
      {districtData && (
        <GeoJSON 
          data={districtData} 
          style={districtStyle}
          ref={geoJsonRef}
        />
      )}

      {/* Capa 2: Rutas (Primer Plano) */}
      {/* Capa 3: Zonas (Halcones y futuras) */}
      {/* Capa 3: Zonas (Halcones y futuras) - Polígonos */}
      {zonasData && (
        <GeoJSON
          data={{
            ...zonasData,
            features: zonasData.features.filter(f => f.properties.type !== 'zone_label')
          }}
          style={zoneStyle}
        />
      )}

      {/* Capa 4: Etiquetas de Zonas (Dinámicas) */}
      {zonasData && zonasData.features
        .filter(f => f.properties.type === 'zone_label')
        .map((feature, index) => {
          const position = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
          const baseSize = parseFloat(feature.properties.fontSize) || 12;
          // Tamaño dinámico etiquetas
          const currentSize = Math.max(baseSize, baseSize * (zoomLevel / 13) * 1.2); 
          
          return (
            <Marker 
              key={`zone-label-${index}`}
              position={position}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="font-weight: bold; font-size: ${currentSize}px; color: ${feature.properties.color || 'black'}; transform: rotate(${feature.properties.rotation || 0}deg); text-align: center; white-space: nowrap; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;">${feature.properties.label}</div>`,
                iconSize: [200, 40],
                iconAnchor: [100, 20]
              })}
            />
          );
        })
      }

      {/* Capa 2: Rutas y Riesgos (Primer Plano) */}
      {filteredRoutesData && (
        <GeoJSON 
          key={JSON.stringify(visibleRisks)} // Forzar re-render al filtrar
          data={filteredRoutesData} 
          onEachFeature={onEachFeature} 
          style={routeStyle}
          pointToLayer={(feature, latlng) => {
            if (feature.properties.type === 'risk_point') {
              return L.marker(latlng, {
                pane: 'hexagonPane',
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="hexagon" style="transform: scale(1.5); transform-origin: center center;"><span>${feature.properties.label}</span></div>`,
                  iconSize: [48, 54],
                  iconAnchor: [24, 27]
                })
              });
            } else if (feature.properties.type === 'risk_circle') {
              return L.marker(latlng, {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="risk-dot ${feature.properties.risk}" style="width: 24px; height: 24px; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })
              });
            }
            return null;
          }}
        />
      )}
    </>
  );
};

const Map = () => {
  const [selectedRiskId, setSelectedRiskId] = useState(null);
  const [visibleRisks, setVisibleRisks] = useState(['high', 'medium', 'low']);

  const handleRiskClick = (id) => {
    setSelectedRiskId(id);
  };

  const handleToggleRisk = (risk) => {
    setVisibleRisks(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk) 
        : [...prev, risk]
    );
  };

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, position: 'relative' }}>
      <MapContainer 
        center={[-11.97, -76.99]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', outline: 'none' }}
      >
        <MapContent 
          selectedRiskId={selectedRiskId} 
          visibleRisks={visibleRisks}
        />
      </MapContainer>
      <RiskLegend 
        onRiskClick={handleRiskClick} 
        onToggleRisk={handleToggleRisk}
        visibleRisks={visibleRisks}
      />
    </div>
  );
};

export default Map;
