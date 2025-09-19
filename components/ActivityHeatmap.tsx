"use client";

import { useState } from "react";

// Componente del Heatmap de Actividad estilo calendario
export default function ActivityHeatmap({ data }: { data: { [key: string]: number } }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  // Generar solo los meses que tienen datos de transacciones
  const generateMonthsWithData = () => {
    const months = [];
    const dataDates = Object.keys(data);
    
    if (dataDates.length === 0) {
      // Si no hay datos, mostrar solo el mes actual
      const now = new Date();
      months.push({
        year: now.getFullYear(),
        month: now.getMonth(),
        monthName: now.toLocaleDateString('en-US', { month: 'short' })
      });
      return months;
    }
    
    // Encontrar la fecha más antigua y más reciente en los datos
    const oldestDate = new Date(Math.min(...dataDates.map(date => new Date(date).getTime())));
    const newestDate = new Date(Math.max(...dataDates.map(date => new Date(date).getTime())));
    
    // Generar meses desde la fecha más reciente hasta la más antigua (orden ascendente)
    const startDate = new Date(newestDate.getFullYear(), newestDate.getMonth(), 1);
    const endDate = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1);
    
    // Calcular la diferencia en meses
    const diffInMonths = (startDate.getFullYear() - endDate.getFullYear()) * 12 + 
                        (startDate.getMonth() - endDate.getMonth());
    
    // Limitar a máximo 8 meses para mantener la UI limpia
    const monthsToShow = Math.min(diffInMonths + 1, 8);
    
    // Generar meses desde la fecha más reciente hacia atrás
    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    
    return months;
  };

  // Generar días del mes organizados en semanas
  const generateDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const weeks = [];
    let currentWeek = [];
    
    // Agregar días vacíos al inicio si el mes no empieza en domingo
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Agregar todos los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const count = data[dateKey] || 0;
      
      currentWeek.push({
        day,
        date: dateKey,
        count,
        isToday: date.toDateString() === new Date().toDateString()
      });
      
      // Si la semana está completa (7 días), agregarla y empezar una nueva
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Agregar la última semana si no está completa
    if (currentWeek.length > 0) {
      // Completar con días vacíos
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  // Obtener color basado en la intensidad
  const getActivityColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-gray-800';
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-green-600';
    if (intensity <= 0.5) return 'bg-green-500';
    if (intensity <= 0.75) return 'bg-green-400';
    return 'bg-green-300';
  };

  const months = generateMonthsWithData();
  const maxCount = Math.max(...Object.values(data), 1);

  return (
    <div className="w-full">
      {/* Título dinámico con rango de fechas */}
      <div className="text-center mb-4">
        <h4 className="text-sm font-semibold text-black">
          Activity Heatmap
          {months.length > 0 && (
            <span className="text-xs text-gray-600 ml-2">
              ({months[0].monthName} {months[0].year} - {months[months.length - 1].monthName} {months[months.length - 1].year})
            </span>
          )}
        </h4>
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-black">Less</div>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
        </div>
        <div className="text-xs text-black">More</div>
      </div>

      {/* Calendario organizado por meses */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4 w-full">
        {months.map(({ year, month, monthName }, monthIndex) => {
          const weeks = generateDaysInMonth(year, month);
          
          return (
            <div key={`${year}-${month}`} className="text-center">
              {/* Nombre del mes */}
              <div className="text-sm font-medium text-black mb-2">{monthName} {year}</div>
              
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-xs text-black text-center py-1">{day}</div>
                ))}
              </div>
              
              {/* Cuadritos de días organizados en semanas */}
              <div className="space-y-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {/* Días de la semana */}
                    {week.map((dayData, dayIndex) => {
                      if (!dayData) {
                        return (
                          <div
                            key={dayIndex}
                            className="w-3 h-3 rounded-sm bg-transparent"
                          />
                        );
                      }
                      
                      const dateString = dayData.date;
                      const count = dayData.count;
                      const colorClass = getActivityColor(count, maxCount);
                      const isCurrentMonth = new Date(dateString).getMonth() === month;
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-1 hover:ring-blue-400 cursor-pointer transition-all ${
                            !isCurrentMonth ? 'opacity-30' : ''
                          }`}
                          title={`${new Date(dateString).toLocaleDateString('en-US')}: ${count} transaction${count !== 1 ? 's' : ''}`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10,
                              date: new Date(dateString).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              }),
                              count: count
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50 pointer-events-none"
          style={{
            left: tooltip.x - 50,
            top: tooltip.y - 30,
            transform: 'translateX(-50%)'
          }}
        >
          <div>{tooltip.date}</div>
          <div>{tooltip.count} transactions</div>
        </div>
      )}
    </div>
  );
}