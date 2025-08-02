// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../CompanyContext';

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { selectedCompanyId } = useCompany();

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Company-Id': selectedCompanyId // Crucial para multi-tenant
        };
    }, [selectedCompanyId]);

    const fetchNotifications = useCallback(async () => {
        if (!selectedCompanyId) return;
        
        try {
            setLoading(true);
            
            // Busca notificações
            const response = await fetch('/api/notifications/', {
                headers: getHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.results || data);
            }
            
            // Busca resumo (inclui contagem)
            const resumoResponse = await fetch('/api/notifications/resumo/', {
                headers: getHeaders()
            });
            
            if (resumoResponse.ok) {
                const resumo = await resumoResponse.json();
                setUnreadCount(resumo.nao_lidas);
            }
            
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCompanyId, getHeaders]);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/marcar_lida/`, {
                method: 'POST',
                headers: getHeaders()
            });
            
            if (response.ok) {
                setNotifications(prev => 
                    prev.map(n => 
                        n.id === notificationId ? {...n, lida: true} : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    }, [getHeaders]);

    const markAllAsRead = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications/marcar_todas_lidas/', {
                method: 'POST',
                headers: getHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(prev => 
                    prev.map(n => ({...n, lida: true}))
                );
                setUnreadCount(0);
                return data.marcadas;
            }
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
        }
    }, [getHeaders]);

    // Recarrega notificações quando muda empresa
    useEffect(() => {
        if (selectedCompanyId) {
            fetchNotifications();
            // Polling a cada 2 minutos
            const interval = setInterval(fetchNotifications, 120000);
            return () => clearInterval(interval);
        }
    }, [selectedCompanyId, fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications
    };
}