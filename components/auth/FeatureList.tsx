import { Typography } from "@/components/ui/Typography";

interface Feature {
  icon: string;
  description: string;
  colorClasses: {
    bg: string;
    text: string;
  };
}

const features: Feature[] = [
  {
    icon: "📊",
    description: "Analise XP/hora, lucro e eficiência das suas hunts",
    colorClasses: {
      bg: "bg-blue-100 dark:bg-blue-900/50",
      text: "text-blue-600 dark:text-blue-400",
    },
  },
  {
    icon: "⚔️",
    description: "Compare performance de diferentes armas",
    colorClasses: {
      bg: "bg-green-100 dark:bg-green-900/50",
      text: "text-green-600 dark:text-green-400",
    },
  },
  {
    icon: "📈",
    description: "Visualize dados com gráficos interativos",
    colorClasses: {
      bg: "bg-purple-100 dark:bg-purple-900/50",
      text: "text-purple-600 dark:text-purple-400",
    },
  },
  {
    icon: "🌐",
    description: "Compartilhe suas melhores sessões",
    colorClasses: {
      bg: "bg-orange-100 dark:bg-orange-900/50",
      text: "text-orange-600 dark:text-orange-400",
    },
  },
];

interface FeatureItemProps {
  feature: Feature;
}

function FeatureItem({ feature }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 ${feature.colorClasses.bg} rounded-full flex items-center justify-center`}>
        <span className={feature.colorClasses.text}>{feature.icon}</span>
      </div>
      <Typography variant="small">{feature.description}</Typography>
    </div>
  );
}

export function FeatureList() {
  return (
    <div className="mt-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-gray-700/20">
      <Typography variant="h3" className="mb-4 text-center">
        ✨ O que você pode fazer:
      </Typography>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} />
        ))}
      </div>
    </div>
  );
}