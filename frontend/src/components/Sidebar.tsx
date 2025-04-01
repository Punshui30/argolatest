import {
  Settings, RefreshCcw, Send, Database, ChevronRight, ChevronLeft, Package,
  Terminal, GitBranch, Box, Code, FileJson, ScrollText, Sparkles,
  AlertTriangle, Users, Bot, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { cn } from '../lib/utils';
import { useWorkspaceStore } from '../lib/store';
import { useToast } from './ui/toast';
import { apiClient } from '../lib/api';
import { useWindowStore } from '../lib/windowStore';
import { useScoutStore } from '../lib/scoutStore';
import { useSystemWatcher } from '../lib/systemWatcherStore';
import { systemWatcher } from '../lib/systemWatcher';
import { useAutopilotStore } from '../lib/autopilotStore';
import { InstalledApps } from './InstalledApps';

export interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, hasPermission } = useWorkspaceStore();
  const { addToast } = useToast();
  const { addWindow } = useWindowStore();
  const { alerts } = useSystemWatcher();
  const { drafts } = useAutopilotStore();
  const { suggestions } = useScoutStore();
  const pendingAlerts = alerts.filter(a => a.status === 'pending').length;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const pendingDrafts = drafts.filter(d => d.status === 'draft').length;

  useEffect(() => {
    systemWatcher.start();
    return () => systemWatcher.stop();
  }, []);

  const handleReloadAdapters = async () => {
    try {
      setIsLoading(true);
      await apiClient.reloadAdapters();
      addToast("Adapters Reloaded - Successfully refreshed adapter registry", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reload adapters';
      addToast("Reload Failed - " + message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFlow = () => {
    addWindow({ 
      id: `flow-${Date.now()}`, 
      type: 'flow', 
      title: 'Visual Flow', 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      position: { x: 200, y: 100 }, 
      size: { width: 800, height: 600 } 
    });
  };

  const handleOpenFlow3D = () => {
    addWindow({ 
      id: `flow3d-${Date.now()}`, 
      type: 'flow3D', 
      title: '3D Flow Visualization', 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      position: { x: 250, y: 150 }, 
      size: { width: 800, height: 600 } 
    });
  };

  const handleOpenGatePlayground = () => {
    addWindow({ 
      id: `gate-${Date.now()}`, 
      type: 'gateIn', 
      title: 'Gate In', 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      position: { x: 300, y: 200 }, 
      size: { width: 600, height: 300 } 
    });
  };

  const handleOpenDSLEditor = () => {
    addWindow({ 
      id: `dsl-${Date.now()}`, 
      type: 'dslEditor', 
      title: 'DSL Editor', 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      position: { x: 350, y: 150 }, 
      size: { width: 800, height: 600 } 
    });
  };

  const handleOpenAdaptersManager = () => {
    addWindow({ 
      id: `adapters-manager-${Date.now()}`, 
      type: 'adapters', 
      title: 'Adapters Manager', 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      position: { x: 200, y: 150 }, 
      size: { width: 800, height: 600 } 
    });
  };

  const handleOpenGateLogs = () => {
    addWindow({ 
      id: `gate-logs-${Date.now()}`, 
      type: 'gateLogs', 
      title: 'Gate Logs', 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      position: { x: 400, y: 150 }, 
      size: { width: 900, height: 600 } 
    });
  };

  const handleOpenTerminal = () => {
    addWindow({
      id: `terminal-${Date.now()}`,
      type: 'terminal',
      title: 'Terminal',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 600, height: 400 }
    });
  };

  const handleToggleCopilot = () => {
    addWindow({
      id: 'copilot',
      type: 'copilot',
      title: 'AI Copilot',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 400, height: 600 }
    });
  };

  const handleToggleAutopilot = () => {
    addWindow({
      id: 'autopilot',
      type: 'autopilot',
      title: 'Autopilot',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 400, height: 600 }
    });
  };

  const handleToggleScout = () => {
    addWindow({
      id: 'scout',
      type: 'scout',
      title: 'Scout',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 400, height: 600 }
    });
  };

  const handleToggleTeams = () => {
    addWindow({
      id: 'teams',
      type: 'teams',
      title: 'Agent Teams',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 800, height: 600 }
    });
  };

  const handleToggleSecurity = () => {
    addWindow({
      id: 'security',
      type: 'security',
      title: 'Security Dashboard',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 800, height: 600 }
    });
  };

  const handleToggleSystemAlerts = () => {
    addWindow({
      id: 'alerts',
      type: 'alerts',
      title: 'System Alerts',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 400, y: 200 },
      size: { width: 400, height: 600 }
    });
  };

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 60 : 240 }}
      className={cn(
        "bg-card/90 border-r border-border flex flex-col backdrop-blur-lg h-screen overflow-hidden",
        "transition-colors hover:bg-card/95",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-4 flex justify-center shrink-0"
      >
        <img
          src="https://i.imgur.com/CtupzkO.png"
          alt="ARGOS Logo"
          className="h-[90px] w-auto object-scale-down mix-blend-screen"
        />
      </motion.div>

      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wide text-white">ARGOS</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="shrink-0 transition-transform hover:scale-105 active:scale-95">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-2 shrink-0">
          <WorkspaceSwitcher />
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-2 space-y-1">
          {/* Installed Apps Section */}
          <InstalledApps isCollapsed={isCollapsed} />

          <div className="h-px bg-border/50 my-4" />

          {hasPermission('edit') && (
            <Button variant="ghost" className={cn("w-full justify-start gap-3 font-medium", "transition-colors hover:bg-accent/50 active:scale-[0.98]")} onClick={handleOpenGatePlayground}>
              <Send size={16} className="text-primary" />
              {!isCollapsed && (
                <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                  Send Request
                </motion.span>
              )}
            </Button>
          )}
          {hasPermission('edit') && (
            <Button variant="ghost" className={cn("w-full justify-start gap-3 font-medium", "transition-colors hover:bg-accent/50 active:scale-[0.98]", isLoading && "opacity-50 cursor-not-allowed")} onClick={handleReloadAdapters} disabled={isLoading}>
              <RefreshCcw size={16} className={cn("text-primary", isLoading && "animate-spin")} />
              {!isCollapsed && (
                <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                  Reload Adapters
                </motion.span>
              )}
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenAdaptersManager}>
            <Database size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Adapters Manager
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenFlow}>
            <GitBranch size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Visual Flow
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenFlow3D}>
            <Box size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                3D Flow View
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenGatePlayground}>
            <Code size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Gate In
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenDSLEditor}>
            <FileJson size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                DSL Editor
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenGateLogs}>
            <ScrollText size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Gate Logs
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleOpenTerminal}>
            <Terminal size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Terminal
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleToggleCopilot}>
            <Sparkles size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                AI Copilot
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleToggleAutopilot}>
            <Bot className="w-4 h-4 text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Autopilot
                {pendingDrafts > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {pendingDrafts}
                  </span>
                )}
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleToggleScout}>
            <Sparkles className="w-4 h-4 text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Scout
                {pendingSuggestions > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {pendingSuggestions}
                  </span>
                )}
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleToggleTeams}>
            <Users size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Agent Teams
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleToggleSecurity}>
            <Shield size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                Security
              </motion.span>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium" onClick={handleToggleSystemAlerts}>
            <AlertTriangle size={16} className="text-primary" />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                System Alerts
                {pendingAlerts > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {pendingAlerts}
                  </span>
                )}
              </motion.span>
            )}
          </Button>
        </div>
      </div>

      {currentUser && !isCollapsed && (
        <div className="p-4 border-t border-border bg-accent/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full ring-2 ring-border" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium tracking-tight truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        className={cn(
          "m-2 justify-start gap-3 font-medium shrink-0",
          "transition-colors hover:bg-accent/50 active:scale-[0.98]"
        )}
      >
        <Settings size={16} className="text-primary" />
        {!isCollapsed && (
          <motion.span initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
            Settings
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
}