// src/api/notifications.js
export async function fetchUpcomingDue() {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('/api/contas-pagar/vencimentos-proximos/', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!res.ok) {
    throw new Error(`Erro ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

  