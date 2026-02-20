import React from 'react';

const riskData = [
  { id: 1, risk: 'high', location: 'AV. MAR SUR ESTE CON CENTRAL --> AV. CENTRAL CON AMPLIACIÓN ESTE', codes: ['1481', '1059'] },
  { id: 2, risk: 'medium', location: 'AV. CENTRAL CON AV. BAYOVAR', codes: ['1481', '1037B', '1473', '1059'] },
  { id: 3, risk: 'high', location: 'AV. CIRCUNVALACIÓN (FRAGATAS)', codes: ['1481', '1059'] },
  { id: 4, risk: 'medium', location: 'PARADERO MERCADO UNIÓN', codes: ['1481', '1059'] },
  { id: 5, risk: 'high', location: 'PARADERO 12 DE BAYOVAR', codes: ['1481', '1059', '3807'] },
  { id: 6, risk: 'medium', location: 'PARADERO SANTA ROSA', codes: ['1481', '1057', '3807'] },
  { id: 7, risk: 'medium', location: 'PARADERO 06 DE CANTO GRANDE', codes: ['1481', '1059', '3807'] },
  { id: 8, risk: 'high', location: 'PARADERO 02 DE CANTO GRANDE', codes: ['1481', '1059', '3807', '9306'] },
  { id: 9, risk: 'low', location: 'AV. SANTA ROSA CON AV. SAN MARTIN', codes: ['1481', '1097', '1493', '1037B', '1473', '1059'] },
  { id: 10, risk: 'medium', location: 'AV. EL SOL CON AV. SANTA ROSA', codes: ['1481', '1097', '1493', '1037B', '1473', '1059'] },
  { id: 11, risk: 'low', location: 'AV. SANTA ROSA CON AV. LOS POSTES', codes: ['1481', '1097', '1493', '1037B', '1473'] },
  { id: 12, risk: 'medium', location: 'CELIMA - AV. SANTA ROSA - AV. TUSILAGOS', codes: ['1481', '1097', '1493', '1037B', '1473'] },
  { id: 13, risk: 'high', location: 'AV. LIMA - AV. 13 DE ENERO - AV. LURIGANCHO', codes: ['1481', '1097', '1493', '1037B', '1473', '1059'] },
  { id: 14, risk: 'high', location: 'PIRAMIDE DEL SOL - AV. PROCERES - CHACARILLA - CAJA DE AGUA', codes: ['1481', '1097', '1493', '1037B'] },
];

const RiskLegend = ({ onRiskClick, onToggleRisk, visibleRisks }) => {
  const [isMinimized, setIsMinimized] = React.useState(window.innerWidth < 768);
  const [isHidden, setIsHidden] = React.useState(false);

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const toggleHide = (e) => {
    e.stopPropagation();
    setIsHidden(!isHidden);
  };

  return (
    <>
      {/* Botón para reabrir leyenda */}
      <button 
        className={`fixed bottom-5 right-5 z-[999] bg-gradient-to-br from-[#ffde59] to-[#ffbd59] text-gray-800 font-bold py-3 px-5 rounded-full shadow-lg flex items-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl ${isHidden ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-50 pointer-events-none'}`} 
        onClick={toggleHide}
      >
        <span className="text-xl mr-2">🗺️</span> Ver Leyenda
      </button>

      {/* Contenedor de la leyenda */}
      <div className={`fixed bottom-5 right-5 w-[450px] max-w-[90vw] max-h-[50vh] md:max-h-[60vh] bg-white/85 backdrop-blur-md border border-white/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] z-[1000] flex flex-col overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.27)] origin-bottom-right ${!isHidden ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-75 translate-y-5 pointer-events-none'} ${isMinimized ? 'h-[52px]' : 'h-auto'}`}>
        
        {/* Encabezado */}
        <div 
          className="bg-gradient-to-br from-[#90a4ae] to-[#78909c] text-white font-bold p-3 text-lg tracking-wide border-b border-white/20 flex justify-between items-center cursor-pointer shadow-sm h-[52px] shrink-0"
          onClick={toggleMinimize}
        >
          <span className="text-sm md:text-base select-none">MAPA DE CALOR DE RIESGO</span>
          <div className="flex items-center gap-2">
            <span className={`transition-transform duration-300 md:hidden ${isMinimized ? 'rotate-180' : ''}`}>▼</span>
            <button 
              className="text-white hover:text-black text-2xl leading-none px-1 transition-colors" 
              onClick={toggleHide}
            >×</button>
          </div>
        </div>

        {/* Lista de riesgos */}
        <div className={`flex-1 overflow-y-auto p-2.5 bg-[#fdfdfd] transition-all duration-300 ${isMinimized ? 'opacity-0 invisible !h-0 !p-0 overflow-hidden' : 'opacity-100 visible'}`}>
          {riskData.map((item) => (
            <div 
              key={item.id} 
              className="flex items-start mb-2 p-2 border-b border-black/5 rounded-md transition-all duration-200 hover:bg-white/60 hover:translate-x-1 hover:shadow-sm cursor-pointer last:border-b-0" 
              onClick={() => onRiskClick && onRiskClick(item.id)}
            >
              <div className="mr-2.5 flex items-center justify-center shrink-0">
                <div className="w-8 h-9 bg-[#ffde59] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] flex items-center justify-center font-bold text-sm text-black">
                  {item.id.toString().padStart(2, '0')}
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full mr-2.5 mt-1.5 border border-black/10 shrink-0 ${
                item.risk === 'high' ? 'bg-[#ff3131] shadow-[0_0_8px_rgba(255,49,49,0.6)] animate-pulse' :
                item.risk === 'medium' ? 'bg-[#f39c12] shadow-[0_0_4px_#ffe082]' :
                'bg-[#f1c40f]'
              }`}></div>
              <div className="flex-1">
                <div className="font-bold text-[0.85rem] text-gray-800 mb-1 leading-tight">{item.location}</div>
                <div className="flex flex-wrap gap-1">
                  {item.codes.map((code, index) => (
                    <span key={index} className="bg-white border border-gray-800 px-1 py-0.5 text-[0.7rem] font-bold text-gray-800 rounded-sm leading-none">{code}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda footer */}
        <div className={`bg-[#f5f5f5] p-2 px-4 border-t border-gray-200 flex items-center gap-4 text-[0.7rem] font-bold text-gray-600 transition-all duration-300 ${isMinimized ? 'opacity-0 invisible !h-0 !py-0 overflow-hidden border-none' : 'opacity-100 visible'}`}>
          <span className="underline mr-1 whitespace-nowrap">LEYENDA</span>
          <div 
            className={`flex items-center gap-1.5 transition-all duration-200 hover:scale-105 cursor-pointer ${!visibleRisks.includes('high') ? 'opacity-30 grayscale line-through' : 'opacity-100'}`}
            onClick={() => onToggleRisk('high')}
          >
            <div className="w-3 h-3 rounded-full bg-[#ff3131]"></div> <span className="whitespace-nowrap">RIESGO ALTO</span>
          </div>
          <div 
            className={`flex items-center gap-1.5 transition-all duration-200 hover:scale-105 cursor-pointer ${!visibleRisks.includes('medium') ? 'opacity-30 grayscale line-through' : 'opacity-100'}`}
            onClick={() => onToggleRisk('medium')}
          >
            <div className="w-3 h-3 rounded-full bg-[#f39c12]"></div> <span className="whitespace-nowrap">RIESGO MEDIO</span>
          </div>
          <div 
            className={`flex items-center gap-1.5 transition-all duration-200 hover:scale-105 cursor-pointer ${!visibleRisks.includes('low') ? 'opacity-30 grayscale line-through' : 'opacity-100'}`}
            onClick={() => onToggleRisk('low')}
          >
            <div className="w-3 h-3 rounded-full bg-[#f1c40f]"></div> <span className="whitespace-nowrap">RIESGO BAJO</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RiskLegend;

