const api = "https://66e8219fb17821a9d9db812e.mockapi.io/TableofUser"

export interface Debt {
  id: string
  title: string
  type: 'owe' | 'own'
  amount: number
  paidAmount: number
  updatedAt: string
}

export async function getData(): Promise<Debt[]> {
  const response = await fetch(api)
  return response.json()
}

export async function updateDebt(id: string, updated: Partial<Debt>): Promise<Debt> {
  const response = await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  })
  if (!response.ok) throw new Error(`Ошибка PUT: ${response.status}`)
  return response.json()
}

export async function postDebt(newDebt: Omit<Debt, 'id'>): Promise<Debt> {
  const response = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDebt),
  })
  if (!response.ok) throw new Error(`Ошибка POST: ${response.status}`)
  return response.json()
}
