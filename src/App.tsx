import { useEffect, useRef, useState } from 'react'
import './App.css'
import { getData, updateDebt, postDebt } from './asynk'
interface Debt {
  id: string
  title: string
  type: 'owe' | 'own'
  amount: number
  paidAmount: number
  updatedAt: string
}
function App() {
  const [data, setData] = useState<Debt[]>([])
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [payValue, setPayValue] = useState<number>(0)

  // для добавления
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'owe' | 'own'>('owe')
  const [amount, setAmount] = useState<number>(0)

  const payDialogRef = useRef<HTMLDialogElement>(null)
  const addDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    getData().then(setData)
  }, [])

  const openPayDialog = (debt: Debt) => {
    setSelectedDebt(debt)
    setPayValue(0)
    payDialogRef.current?.showModal()
  }

  const closePayDialog = () => {
    payDialogRef.current?.close()
    setSelectedDebt(null)
  }

  const handlePay = async () => {
    if (!selectedDebt || payValue <= 0) return
    const newPaid = selectedDebt.paidAmount + payValue
    if (newPaid > selectedDebt.amount) {
      alert("Сумма погашения превышает остаток!")
      return
    }
    const updated = await updateDebt(selectedDebt.id, {
      ...selectedDebt,
      paidAmount: newPaid,
      updatedAt: new Date().toISOString(),
    })
    setData(prev => prev.map(d => d.id === updated.id ? updated : d))
    closePayDialog()
  }

  const handleAdd = async () => {
    if (!title || amount <= 0) return
    const created = await postDebt({
      title,
      type,
      amount,
      paidAmount: 0,
      updatedAt: new Date().toISOString(),
    })
    setData(prev => [...prev, created])
    addDialogRef.current?.close()
    setTitle('')
    setType('owe')
    setAmount(0)
  }

  return (
    <>
    <div className='div-Table'>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Тип</th>
            <th>Сумма</th>
            <th>Погашено</th>
            <th>Остаток</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td className={item.type === 'owe' ? 'red-text' : 'green-text'}>
    {item.type === 'owe' ? 'Я должен' : 'Мне должны'}</td>
              <td>{item.amount}</td>
              <td>{item.paidAmount}</td>
              <td>{item.amount - item.paidAmount}</td>
              <td>
                <button
                  disabled={item.type !== 'owe'}
                  onClick={() => openPayDialog(item)}
                className={item.type === 'owe' ? 'red-button' : 'green-button'}
                >
                  {item.type === 'owe' ? 'Погасить' : 'Погашен'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
      {/* Диалог погашения */}
      <dialog ref={payDialogRef} className='put'>
        <h3>Погашение долга</h3>
        {selectedDebt && (
          <>
            <p><strong>{selectedDebt.title}</strong></p>
            
            <p>Остаток: {selectedDebt.amount - selectedDebt.paidAmount}</p>
            <input
              type="number"
              placeholder="Сумма погашения"
              value={payValue}
              onChange={e => setPayValue(Number(e.target.value))}
            />
            <br /><br />
            <button onClick={handlePay}>Подтвердить</button>
            <button onClick={closePayDialog}>Отмена</button>
          </>
        )}
      </dialog>

      {/* Диалог добавления */}
      <dialog ref={addDialogRef} className='post'>
        <h3>Добавить долг</h3>
        <input
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <br /><br />
        <select value={type} onChange={e => setType(e.target.value as 'owe' | 'own')}>
          <option value="owe">Я должен</option>
          <option value="own">Мне должны</option>
        </select>
        <br /><br />
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
        <br /><br />
        <button onClick={handleAdd}>Добавить</button>
        <button onClick={() => addDialogRef.current?.close()}>Отмена</button>
      </dialog>

      <div className="stepik">
        <button onClick={() => addDialogRef.current?.showModal()}>Добавить долг</button>
      </div>
    </>
  )
}

export default App
