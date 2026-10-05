import React, { useState } from 'react';
import { Shield, ClipboardList, AlertCircle, ToggleLeft, UserCheck, ShieldAlert } from 'lucide-react';
import { UserRole, AuditLogEntry, Language } from '../types';
import { TRANSLATIONS } from '../data';

interface AuditLogsSectionProps {
  currentLanguage: Language;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  logs: AuditLogEntry[];
  onClearLogs: () => void;
}

export default function AuditLogsSection({
  currentLanguage,
  currentRole,
  onRoleChange,
  logs,
  onClearLogs
}: AuditLogsSectionProps) {
  const t = TRANSLATIONS[currentLanguage];
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterSeverity === 'all') return true;
    return log.severity === filterSeverity;
  });

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-8 hover:shadow-lg transition-all duration-300">
      {/* Role Switcher (Role-Based Access Control Simulation) */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-50 rounded-[1.25rem] border border-indigo-100 text-indigo-600">
            <UserCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900 font-display">{t.userManagement}</h4>
            <p className="text-xs text-slate-500 font-medium">Tiered access permissions & granular operational role simulation</p>
          </div>
        </div>

        <div className="bg-[#fafaf9] p-4.5 rounded-[1.75rem] border border-slate-150 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Farmer Card */}
          <button
            onClick={() => onRoleChange('farmer')}
            className={`p-4 rounded-[1.25rem] border text-left transition duration-200 cursor-pointer flex flex-col gap-1.5 ${
              currentRole === 'farmer'
                ? 'bg-white border-emerald-500 shadow-md ring-4 ring-emerald-500/10 font-bold'
                : 'bg-white/60 border-slate-150 hover:bg-white hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-800 font-display">{t.roleFarmer}</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2 py-0.5 rounded-full font-mono">
                TIER 1
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-normal font-medium">
              View farm status, soil metrics, AI advice, watering schedules, and chat with Siri-Mitra.
            </p>
          </button>

          {/* Field Officer Card */}
          <button
            onClick={() => onRoleChange('field_officer')}
            className={`p-4 rounded-[1.25rem] border text-left transition duration-200 cursor-pointer flex flex-col gap-1.5 ${
              currentRole === 'field_officer'
                ? 'bg-white border-blue-500 shadow-md ring-4 ring-blue-500/10 font-bold'
                : 'bg-white/60 border-slate-150 hover:bg-white hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-800 font-display">{t.roleOfficer}</span>
              <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-black px-2 py-0.5 rounded-full font-mono">
                TIER 2
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-normal font-medium">
              Regionally inspect crops, connect physical sensors, edit parameters, and trigger water audits.
            </p>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => onRoleChange('admin')}
            className={`p-4 rounded-[1.25rem] border text-left transition duration-200 cursor-pointer flex flex-col gap-1.5 ${
              currentRole === 'admin'
                ? 'bg-white border-indigo-500 shadow-md ring-4 ring-indigo-500/10 font-bold'
                : 'bg-white/60 border-slate-150 hover:bg-white hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-800 font-display">{t.roleAdmin}</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 font-black px-2 py-0.5 rounded-full font-mono">
                TIER 3
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-normal font-medium">
              Full administrator override. Oversee all village operations, inspect complete audit trails, and manage alerts.
            </p>
          </button>
        </div>
      </div>

      {/* Audit Log Panel */}
      {currentRole !== 'farmer' ? (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-bold text-slate-900 font-display">{t.auditLogs}</h4>
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-[#fafaf9] border border-slate-150 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition font-sans"
              >
                <option value="all">All Severities</option>
                <option value="info">Info Only</option>
                <option value="warning">Warnings Only</option>
                <option value="critical">Critical Only</option>
              </select>

              <button
                onClick={onClearLogs}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-black px-3.5 py-1.5 rounded-xl border border-red-100 hover:border-red-200 transition cursor-pointer font-sans"
              >
                Clear Logs
              </button>
            </div>
          </div>

          <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-inner max-h-[300px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#fafaf9] sticky top-0 border-b border-slate-150">
                <tr>
                  <th className="p-3.5 text-slate-400 font-black text-[10px] uppercase tracking-widest font-mono">Timestamp</th>
                  <th className="p-3.5 text-slate-400 font-black text-[10px] uppercase tracking-widest font-mono">User (Role)</th>
                  <th className="p-3.5 text-slate-400 font-black text-[10px] uppercase tracking-widest font-mono">Action</th>
                  <th className="p-3.5 text-slate-400 font-black text-[10px] uppercase tracking-widest font-mono">Details</th>
                  <th className="p-3.5 text-slate-400 font-black text-[10px] uppercase tracking-widest font-mono">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const badgeClass =
                      log.severity === 'critical'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : log.severity === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800';

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-3.5 text-xs text-slate-400 whitespace-nowrap font-mono">{log.timestamp}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-extrabold font-display">{log.userName}</span>{' '}
                          <span className="text-[11px] text-slate-400 font-mono capitalize">({log.role})</span>
                        </td>
                        <td className="p-3.5 font-bold text-indigo-700 whitespace-nowrap">{log.action}</td>
                        <td className="p-3.5 text-slate-500 text-xs min-w-[200px] font-sans">{log.details}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase font-mono ${badgeClass}`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-mono text-xs">
                      No logs registered matching the filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-[#fafaf9] rounded-[1.75rem] border border-slate-150 flex flex-col items-center justify-center text-center gap-3">
          <ShieldAlert className="w-10 h-10 text-slate-400 animate-bounce" />
          <div>
            <h5 className="font-extrabold text-slate-800 font-display">Operational Log Access Restricted</h5>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed font-medium">
              As a Farmer (Tier 1 role), you do not have permission to inspect system audit trails or manage village credentials. Upgrade your active simulated role above to investigate further.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
