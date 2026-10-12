import { useState } from 'react'
import {useRef} from 'react'
import { Table, Input, Button, Tag, Space, Card, Typography} from 'antd'
import { BarcodeOutlined, CheckCircleOutlined} from '@ant-design/icons'
import './App.css'
import { useEffect } from 'react'
import Dashboard from './Dashboard'
import InventoryManagement from './InventoryManagement'

const {Title, Text} = Typography

const initialStock = [
  { id:1, sku: 'PROD-001', name: 'Товар 1', expected: 15, actual: 0},
  { id:2, sku: 'PROD-002', name: 'Товар 2', expected: 5, actual: 0}
]


export default function WarehouseInventory() {
  const [items, setItems] = useState(initialStock)
  const [barcodeInput, setBarcodeInput] = useState('')
  const barcodeRef = useRef(null)

  useEffect (()=> {
    barcodeRef.current?.focus()
  }, [items])

  const handleScan = (e) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return;

    const updatedItems = items.map(item =>{
      if (item.sku === barcodeInput.trim()) {
        return { ...item, actual: item.actual + 1}
      }
      return item
    })

    const found = items.some(item => item.sku === barcodeInput.trim())
    if (found) {
      setItems(updatedItems)
      message.success(`Отсканированно: ${barcodeInput}`)
    } else {
      message.error(`Товар с SKU ${barcodeInput} не числится в этой ячейке.`)
    }

    setBarcodeInput('')
  }

  const columns = [
    {title: 'SKU/Штрихкод', dataIndex: 'sku', key: 'sku'},
    {title: 'Наименование', dataIndex: 'name', key: 'name'},
    {title: 'Учет (Ожидание)', dataIndex: 'expected', key: 'expected', align: 'center'},
    {
      title: 'Факт (Посчитано)',
      dataIndex: 'actual',
      key: 'actual',
      align: 'center',
      render: (actual, record) => (
        <strong className='actual' style={{color: actual === record.expected ? '#52c41a' : '#1677ff'}}>{actual}</strong>
      )
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => {
        const diff = record.actual - record.expected
        if(record.actual === 0) return <Tag color="default">Не проверено</Tag>;
        if(diff === 0) return <Tag color="success">Сходится</Tag>;
        return <Tag color="error">Расхождение ({diff > 0 ? `+${diff}` : diff})</Tag>;
      },
    },
  ]

  return (
    <>
      <Card className='card'>
        <Space direction="vertical" size="large" style={{width: '100%'}}>

          <div>
            <Title level={3}>Инвентаризация ячейки: <Text type="danger">A-101</Text></Title>
            <Text type="secondary">Зона: Основной склад (Сухая зона)</Text>
          </div>

          <form onSubmit={handleScan}>
            <Input ref={barcodeRef} size="large" placeholder="Сканируйте штрихкод или введите SKU (например, PROD-001)" prefix={<BarcodeOutlined></BarcodeOutlined>} value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} className="input">
            </Input>
          </form>

          <Table dataSourse ={items} columns={columns} rowKey="id" pagination={false} bordered></Table>
          <div className='complete'>
            <Button type="primary" size="large" icon={<CheckCircleOutlined></CheckCircleOutlined>} onClick={() => message.success('Данные инвентаризации отправлены в БД')}>Завершить инвентаризацию ячейки</Button>
          </div>
        </Space>
      </Card>

      <Dashboard></Dashboard>
      <InventoryManagement></InventoryManagement>
    </>
  )
}
