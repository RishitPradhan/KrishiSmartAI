import { Leaf, Sprout } from 'lucide-react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
          <Leaf className="w-6 h-6 text-primary-foreground" />
        </div>
        <Sprout className="w-4 h-4 text-accent absolute -bottom-1 -right-1" />
      </div>
      <div>
        <h1 className="font-heading font-bold text-xl leading-tight text-foreground">
          KrishiSmart
        </h1>
        <span className="text-xs font-medium text-primary">AI</span>
      </div>
    </div>
  );
}
