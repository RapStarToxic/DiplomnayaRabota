import { useMemo, useState } from "react";
import { Search, Plus, ArrowUpDown, AlertTriangle, Package, Layers, CheckCircle, Edit2, TrendingDown, TrendingUp } from "lucide-react";
import './InventoryManagement.css'

const INITIAL_PRODUCTS = [
    { id: '1', sku: 'PROD-001', name: 'Товар 1', category: 'Категория 1', quantity: 11, minStock: 10, price: 1111, zone: 'Зона 1'},
    { id: '2', sku: 'PROD-002', name: 'Товар 2', category: 'Категория 2', quantity: 21, minStock: 20, price: 2222, zone: 'Зона 2'},
    { id: '3', sku: 'PROD-003', name: 'Товар 3', category: 'Категория 3', quantity: 31, minStock: 30, price: 3333, zone: 'Зона 3'}
]

export default function InventoryManagement() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Все')
    const [stockStatusFilter, setStockStatusFilter] = useState('all')

    const [editingProduct,setEditingProduct] = useState(null)
    const [newQuantity,setNewQuantity] = useState(0)

    const categories = useMemo(() => {
        const list = products.map(p => p.category)
        return ['Все', ...Array.from(new Set(list))]
    }, [products])

    const metrics = useMemo(() => {
        const totalItems = products.reduce((acc, p) => acc + p.quantity, 0)
        const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.price), 0)
        const lowStockItems = products.filter(p => p.quantity <= p.minStock).length

        return {
            totalItems,
            totalValue,
            lowStockItems,
            totalPositions: products.length
        }
    }, [products])

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                                  product.sku.toLowerCase().includes(search.toLowerCase() ||
                                  product.zone.toLowerCase().includes(search.toLowerCase()))

            const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory
            const matchesStatus = stockStatusFilter === 'all' || (stockStatusFilter === 'low' && product.quantity <= product.minStock)

            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [products, search, selectedCategory, stockStatusFilter])

    const openEditModal = (product) => {
        setEditingProduct(product)
        setNewQuantity(product.quantity)
    }

    const handleSaveQuantity = () => {
        if (!editingProduct) return;
        setProducts(prev =>
            prev.map(p => p.id === editingProduct.id ? { ...p, quantity: Number(newQuantity)}: p)
        )
        setEditingProduct(null)
    }

    return (
        <div className="all">
            <div className="head">
                <div>
                    <h1 className="head">Управление запасами</h1>
                    <p className="head">Контроль остатков, адрксного хранения и экспресс-инвентаризация</p>
                </div>
                <button className="head"><Plus className="head">Добавить товар</Plus></button>
            </div>

            <div className="vidpan">
                <div className="card">
                    <div>
                        <p className="card">Всего наименований</p>
                        <h3 className="card">{metrics.totalPositions}</h3>
                    </div>
                    <div className="lay"><Layers className="lay"></Layers></div>
                </div>

                <div className="card2">
                    <div>
                        <p className="card2">Общий остаток шт.</p>
                        <h3 className="card2">{metrics.totalItems}</h3>
                    </div>
                    <div className="pac"><Package className="pac"></Package></div>
                </div>

                <div className="card3">
                    <div>
                        <p className="card3">Критические остатки</p>
                        <h3 className="card3">{metrics.lowStockItems}</h3>
                    </div>
                    <div className="alrt"><AlertTriangle className="alrt"></AlertTriangle></div>
                </div>

                <div className="card4">
                    <div>
                        <p className="card4">Оценка склада</p>
                        <h3 className="card4">{metrics.totalValue.toLocaleString('ru-RU')} Р</h3>
                    </div>
                    <div className="cc"><CheckCircle className="cc"></CheckCircle></div>
                </div>
            </div>

            <div className="fp">
                <div className="poisk">
                    <Search className="sr">
                        <input type="text" placeholder="Поиск по наименованию, артикулу или ячейке..." className="sr" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </Search>
                </div>

                <div className="fil">
                    <select className="fil" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>

                    <div className="fil2">
                        <button onClick={() => setStockStatusFilter('all')} className="fil2">Дефицит {metrics.lowStockItems > 0 && <span className="fil2">{metrics.lowStockItems}</span>}</button>
                    </div>
                </div>
            </div>

            <div className="tabcon">
                <div className="tab">
                    <table className="tab">
                        <thead>
                            <tr className="tab">
                                <th className="tab">Артикул</th>
                                <th className="tab">Наименование</th>
                                <th className="tab">Категория</th>
                                <th className="tab">Ячейка</th>
                                <th className="tab">Цена за шт.</th>
                                <th className="tab">Остаток</th>
                                <th className="tab">Статус</th>
                                <th className="tab">Действие</th>
                            </tr>
                        </thead>
                        <tbody className="tab">{filteredProducts.length === 0 ? (
                            <tr>
                                <td className="tab" colSpan={8}>Товары, соответствующие критериям поиска отсутствуют</td>
                            </tr>
                        ):(
                            filteredProducts.map(product => {
                                const isLow = product.quantity <= product.minStock
                                return (
                                    <tr key={product.id} className="tab2">
                                        <td className="artkl">{product.sku}</td>
                                        <td className="naim" title={product.name}>{product.name}</td>
                                        <td className="katg">{product.category}</td>
                                        <td className="adrs"><span className="adrs">{product.zone}</span></td>
                                        <td className="price">{product.price.toLocaleString('ru-RU')} Р</td>
                                        <td className="kol"><span className="kol">{product.quantity}</span></td>
                                        <td className="stasus"><span className="status">
                                            {isLow ? <TrendingDown className="status"></TrendingDown> : <TrendingUp className="status"></TrendingUp>}
                                            {isLow ? 'Дефицит' : 'Норма'}
                                            </span>
                                        </td>
                                        <td className="knop">
                                            <button onClick={() => openEditModal(product)} className="knop" title="Корректировка остатка"><Edit2 className="knop"></Edit2></button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
