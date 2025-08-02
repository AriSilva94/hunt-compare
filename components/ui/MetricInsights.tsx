/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/Card";

interface Record {
  id: string;
  data: any;
}

interface MetricInsightsProps {
  records: Record[];
}

export function MetricInsights({ records }: MetricInsightsProps) {
  // Calcular insights automáticos
  const calculateInsights = () => {
    const insights: string[] = [];
    
    // XP/hora insights
    const xpPerHour = records.map(record => {
      // Usar campo XP/h direto se disponível
      const xpHourField = record.data["XP/h"];
      if (xpHourField) {
        const xpHourStr = String(xpHourField).replace(/[^0-9.]/g, '');
        let value = Number(xpHourStr) || 0;
        if (String(xpHourField).includes('k')) {
          value = value * 1000;
        }
        return value;
      }
      
      // Fallback para cálculo manual
      const rawXP = record.data["XP Gain"] || 0;
      const sessionLength = record.data["Session length"] || "";
      
      const hoursMatch = sessionLength.match(/(\d+)h/);
      const minutesMatch = sessionLength.match(/(\d+)m/);
      let totalHours = 0;
      if (hoursMatch) totalHours += parseInt(hoursMatch[1]);
      if (minutesMatch) totalHours += parseInt(minutesMatch[1]) / 60;
      
      return totalHours > 0 ? rawXP / totalHours : 0;
    });
    
    const maxXP = Math.max(...xpPerHour);
    const minXP = Math.min(...xpPerHour.filter(x => x > 0));
    const avgXP = xpPerHour.reduce((a, b) => a + b, 0) / xpPerHour.length;
    
    if (maxXP > 0) {
      insights.push(`🎯 Melhor XP/hora: ${Math.round(maxXP).toLocaleString()}/h`);
      insights.push(`📊 XP/hora médio: ${Math.round(avgXP).toLocaleString()}/h`);
      if (maxXP > minXP * 1.5) {
        insights.push(`⚡ Diferença significativa entre sessões: ${Math.round((maxXP - minXP) / minXP * 100)}%`);
      }
    }
    
    // Análise de árvores de habilidades
    const weaponBuilds = records
      .filter(r => r.data.weaponDetail?.id && r.data.weaponDetail?.proficiencies)
      .map((r, index) => {
        // Usar XP Gain limpo
        const xpGainValue = r.data["XP Gain"];
        let cleanXpGain = 0;
        if (xpGainValue !== undefined && xpGainValue !== null) {
          if (typeof xpGainValue === 'string') {
            cleanXpGain = Number(xpGainValue.replace(/[^0-9]/g, '')) || 0;
          } else {
            cleanXpGain = Number(xpGainValue) || 0;
          }
        }
        
        // Calcular profit limpo
        const balanceStr = String(r.data["Balance"] || "0");
        const cleanProfit = Number(balanceStr.replace(/[^-0-9]/g, '')) || 0;
        
        return {
          recordIndex: index + 1,
          weaponName: r.data.weaponDetail?.name,
          xpGain: cleanXpGain,
          profit: cleanProfit,
          hasProficiencies: r.data.weaponDetail?.proficiencies && Object.keys(r.data.weaponDetail.proficiencies).length > 0
        };
      })
      .filter(build => build.weaponName && build.hasProficiencies);

    if (weaponBuilds.length > 1) {
      // Encontrar a build com melhor XP
      const bestXpBuild = weaponBuilds.reduce((best, current) => 
        current.xpGain > best.xpGain ? current : best
      );
      
      // Encontrar a build mais lucrativa
      const bestProfitBuild = weaponBuilds.reduce((best, current) => 
        current.profit > best.profit ? current : best
      );
      
      if (bestXpBuild.xpGain > 0) {
        insights.push(`🎯 Melhor árvore para XP: Registro ${bestXpBuild.recordIndex} - ${bestXpBuild.weaponName} (${bestXpBuild.xpGain.toLocaleString()} XP)`);
      }
      
      if (bestProfitBuild.profit > 0) {
        insights.push(`💰 Árvore mais lucrativa: Registro ${bestProfitBuild.recordIndex} - ${bestProfitBuild.weaponName} (+${bestProfitBuild.profit.toLocaleString()} gp)`);
      }
      
      // Verificar se há empate ou diferenças significativas
      const xpDifference = Math.abs(bestXpBuild.xpGain - Math.min(...weaponBuilds.map(b => b.xpGain)));
      if (xpDifference < bestXpBuild.xpGain * 0.1) {
        insights.push(`📊 XP similar entre builds - diferenças nas habilidades têm pouco impacto`);
      }
    } else {
      // Fallback para análise de lucro quando não há builds para comparar
      const profits = records.map(r => {
        const balanceStr = String(r.data["Balance"] || "0");
        return Number(balanceStr.replace(/[^-0-9]/g, '')) || 0;
      });
      const profitableSessions = profits.filter(p => p > 0).length;
      const totalProfit = profits.reduce((a, b) => a + b, 0);
      
      insights.push(`💰 Sessões lucrativas: ${profitableSessions}/${records.length}`);
      if (totalProfit > 0) {
        insights.push(`📈 Lucro total combinado: +${totalProfit.toLocaleString()} gp`);
      } else if (totalProfit < 0) {
        insights.push(`📉 Prejuízo total combinado: ${totalProfit.toLocaleString()} gp`);
      }
    }
    
    // Armas insights
    const weaponSessions = records.filter(r => r.data.weaponDetail?.id).length;
    if (weaponSessions > 0) {
      insights.push(`⚔️ Sessões com arma registrada: ${weaponSessions}/${records.length}`);
      
      const weaponTypes = new Set(
        records
          .filter(r => r.data.weaponDetail?.id)
          .map(r => r.data.weaponDetail?.name)
          .filter(Boolean)
      );
      
      if (weaponTypes.size > 1) {
        insights.push(`🎪 ${weaponTypes.size} tipos diferentes de armas usadas`);
      }
    }
    
    // Eficiência insights
    const durations = records.map(r => r.data["Session length"] || "").filter(Boolean);
    if (durations.length > 1) {
      const shortSessions = durations.filter(d => d.includes("m") && !d.includes("h")).length;
      const longSessions = durations.filter(d => d.includes("h")).length;
      
      if (shortSessions > 0 && longSessions > 0) {
        insights.push(`⏱️ Mix de sessões: ${shortSessions} curtas, ${longSessions} longas`);
      }
    }
    
    return insights;
  };
  
  const insights = calculateInsights();
  
  // Recomendações baseadas nos dados
  const generateRecommendations = () => {
    const recommendations: string[] = [];
    
    // Baseado em XP/hora
    const xpVariance = records.map(r => {
      const rawXP = r.data["XP Gain"] || r.data["Raw XP Gain"] || 0;
      const duration = r.data["Session length"] || "";
      const hoursMatch = duration.match(/(\d+)h/);
      const minutesMatch = duration.match(/(\d+)m/);
      let totalHours = 0;
      if (hoursMatch) totalHours += parseInt(hoursMatch[1]);
      if (minutesMatch) totalHours += parseInt(minutesMatch[1]) / 60;
      return totalHours > 0 ? rawXP / totalHours : 0;
    });
    
    const maxXP = Math.max(...xpVariance);
    const minXP = Math.min(...xpVariance.filter(x => x > 0));
    
    if (maxXP > minXP * 2) {
      recommendations.push("📈 Grande variação no XP/hora - analise o que torna as melhores sessões mais eficientes");
    }
    
    // Baseado em lucro
    const profits = records.map(r => r.data["Balance"] || 0);
    const lossCount = profits.filter(p => p < 0).length;
    
    if (lossCount > records.length / 2) {
      recommendations.push("💸 Muitas sessões com prejuízo - considere spots mais lucrativos ou ajuste supplies");
    }
    
    // Baseado em armas
    const weaponCount = records.filter(r => r.data.weaponDetail?.id).length;
    if (weaponCount < records.length) {
      recommendations.push("⚔️ Registre informações da arma para análises mais precisas");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("✨ Dados consistentes! Continue monitorando para identificar padrões");
    }
    
    return recommendations;
  };
  
  const recommendations = generateRecommendations();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          🧠 Insights Automáticos
        </h3>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-blue-800 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">
          💡 Recomendações
        </h3>
        <div className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-green-800 text-sm">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}