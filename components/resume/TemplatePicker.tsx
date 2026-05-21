import React from 'react';
import { TEMPLATES, type TemplateId } from '@/types/template';
import { useTemplateStore } from '@/store/useTemplateStore';

export const TemplatePicker = React.memo(() => {
  const { templateId, setTemplateId } = useTemplateStore();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">Resume Template</h2>
      <p className="text-xs text-gray-500 mb-4">Choose a layout. All are top-1% FAANG-standard.</p>
      <div className="flex flex-col gap-3">
        {TEMPLATES.map((tpl) => {
          const isActive = templateId === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setTemplateId(tpl.id as TemplateId)}
              className={`
                relative flex items-start gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200
                ${isActive
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
              `}
            >
              {/* Mini Preview */}
              <div
                className="mt-0.5 flex-shrink-0 w-10 h-12 rounded border overflow-hidden flex flex-col gap-0.5 p-1"
                style={{ background: tpl.preview.bg, borderColor: tpl.preview.bar + '44' }}
              >
                {/* Name bar */}
                <div className="h-1.5 rounded-sm w-full" style={{ background: tpl.preview.text, opacity: 0.85 }} />
                {/* Sub bar */}
                <div className="h-0.5 rounded-sm w-3/4 self-center" style={{ background: tpl.preview.bar, opacity: 0.6 }} />
                {/* Section divider */}
                <div className="mt-1 h-0.5 w-full" style={{ background: tpl.preview.bar }} />
                {/* Content lines */}
                {[1, 0.7, 0.7, 0.7].map((op, i) => (
                  <div key={i} className="h-0.5 rounded-sm" style={{ background: tpl.preview.text, opacity: op * 0.4, width: i % 2 === 0 ? '90%' : '75%' }} />
                ))}
                {/* Second section */}
                <div className="mt-0.5 h-0.5 w-full" style={{ background: tpl.preview.bar }} />
                {[1, 0.7, 0.7].map((op, i) => (
                  <div key={i} className="h-0.5 rounded-sm" style={{ background: tpl.preview.text, opacity: op * 0.4, width: i % 2 === 0 ? '85%' : '70%' }} />
                ))}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                    {tpl.name}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      background: tpl.accent + '18',
                      color: tpl.accent,
                    }}
                  >
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">{tpl.description}</p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

TemplatePicker.displayName = 'TemplatePicker';
