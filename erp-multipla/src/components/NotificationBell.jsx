// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../hooks/useNotifications';
import styles from './NotificationBell.module.css';

export default function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);

  // Fecha o tray ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.lida) {
      await markAsRead(notification.id);
    }
    // Opcional: navegar para tela relevante
    // navigate(`/contratos/${notification.contrato_info?.numero}`);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'vencimento_hoje':
        return '🔴';
      case 'vencimento_2_dias':
        return '🟡';
      case 'vencimento_atrasado':
        return '⚠️';
      default:
        return '📋';
    }
  };

  return (
    <div className={styles['notification-bell-wrapper']} ref={bellRef}>
      <div 
        className={`${styles['notification-bell-icon']} ${loading ? styles['loading'] : ''}`} 
        onClick={() => setOpen(o => !o)}
      >
        <FaBell size={20} className={styles['bell-icon']} />
        {unreadCount > 0 && (
          <span className={styles['notification-badge']}>{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className={styles['notification-tray']}>
          {/* Header do tray */}
          <div className={styles['notification-header']}>
            <h4>Notificações ({unreadCount} não lidas)</h4>
            {unreadCount > 0 && (
              <button 
                className={styles['mark-all-read']}
                onClick={handleMarkAllRead}
                title="Marcar todas como lidas"
              >
                ✓ Todas
              </button>
            )}
          </div>

          {/* Lista de notificações */}
          <div className={styles['notification-list']}>
            {notifications.length === 0 ? (
              <div className={styles['notification-empty']}>
                {loading ? 'Carregando...' : 'Sem notificações'}
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`${styles['notification-item']} ${
                    notification.lida ? styles['read'] : styles['unread']
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles['notification-icon']}>
                    {getNotificationIcon(notification.tipo)}
                  </div>
                  
                  <div className={styles['notification-content']}>
                    <div className={styles['notification-title']}>
                      {notification.titulo}
                    </div>
                    
                    {notification.contrato_info && (
                      <div className={styles['notification-details']}>
                        <div>
                          <strong>Contrato:</strong> {notification.contrato_info.numero}
                        </div>
                        <div>
                          <strong>Vencimento:</strong> {formatarData(notification.contrato_info.data_vencimento)}
                        </div>
                        <div>
                          <strong>Valor:</strong> R$ {Number(notification.contrato_info.valor_parcela).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={styles['notification-time']}>
                      {notification.tempo_relativo}
                    </div>
                  </div>
                  
                  {!notification.lida && (
                    <div className={styles['notification-unread-dot']}></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer com link para ver todas */}
          {notifications.length > 10 && (
            <div className={styles['notification-footer']}>
              <button 
                className={styles['view-all']}
                onClick={() => {
                  setOpen(false);
                  // navigate('/notifications'); // Se tiver página dedicada
                }}
              >
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}