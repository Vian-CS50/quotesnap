"use client";

import { MaterialIcon } from "./MaterialIcon";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = "request_quote", title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-surface-container-lowest border border-surface-subtle p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-surface-base flex items-center justify-center mb-6">
        <MaterialIcon name={icon} className="text-growth-green scale-150" size={32} />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-growth-green mb-2">{title}</h3>
      <p className="text-body-sm text-on-surface-variant max-w-xs mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-growth-green text-white font-button-text text-button-text h-12 px-6 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <MaterialIcon name="add" size={20} />
          {action.label}
        </button>
      )}
    </div>
  );
}
