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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addSku, setAddSku] = useState('');
    const [addName, setAddName] = useState('');
    const [addCategory, setAddCategory] = useState('Категория 1');
    const [addZone, setAddZone] = useState('');
    const [addPrice, setAddPrice] = useState('');
    const [addQuantity, setAddQuantity] = useState('');
    const [addMinStock, setAddMinStock] = useState('5');

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
                                  product.sku.toLowerCase().includes(search.toLowerCase()) ||
                                  product.zone.toLowerCase().includes(search.toLowerCase());

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

    const handleAddItemClick = () => {
        const realCategories = categories.filter(cat => cat !== 'Все');
        if (realCategories.length > 0) {
            setAddCategory(realCategories[0]);
        }
        setIsModalOpen(true);
    };

    const handleAddProduct = (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now().toString(),
            sku: addSku,
            name: addName,
            category: addCategory,
            zone: addZone,
            price: Number(addPrice) || 0,
            quantity: Number(addQuantity) || 0,
            minStock: Number(addMinStock) || 5
        };

        setProducts(prev => [newProduct, ...prev]);

        setAddSku('');
        setAddName('');
        setAddZone('');
        setAddPrice('');
        setAddQuantity('');
        setAddMinStock('5');
        setIsModalOpen(false);
    };

    return (
        <div className="all">
        <div className="head">
            <div>
                <h1 className="head">Управление запасами</h1>
                <p className="head">Контроль остатков, адресного хранения и экспресс-инвентаризация</p>
            </div>
            <button className="head" onClick={handleAddItemClick}>
                <Plus className="head" /> Добавить товар
            </button>
        </div>

            <div className="vidpan">
                <div className="card">
                    <div>
                        <p className="card">Всего наименований</p>
                        <h3 className="card">{metrics.totalPositions}</h3>
                    </div>
                    <div className="lay"><Layers className="lay" /></div>
                </div>

                <div className="card2">
                    <div>
                        <p className="card2">Общий остаток шт.</p>
                        <h3 className="card2">{metrics.totalItems}</h3>
                    </div>
                    <div className="pac"><Package className="pac" /></div>
                </div>

                <div className="card3">
                    <div>
                        <p className="card3">Критические остатки</p>
                        <h3 className="card3">{metrics.lowStockItems}</h3>
                    </div>
                    <div className="alrt"><AlertTriangle className="alrt" /></div>
                </div>

                <div className="card4">
                    <div>
                        <p className="card4">Оценка склада</p>
                        <h3 className="card4">{metrics.totalValue.toLocaleString('ru-RU')} Р</h3>
                    </div>
                    <div className="cc"><CheckCircle className="cc" /></div>
                </div>
            </div>

            <div className="fp">
                <div className="poisk">
                    <Search className="sr" />
                    <input 
                        type="text" 
                        placeholder="Поиск по наименованию, артикулу или ячейке..." 
                        className="sr-input" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>

                <div className="fil">
                    <select className="fil" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <div className="fil2">
                        <button 
                            onClick={() => setStockStatusFilter(prev => prev === 'low' ? 'all' : 'low')} 
                            className={`fil2-btn ${stockStatusFilter === 'low' ? 'active' : ''}`}
                        >
                            Дефицит {metrics.lowStockItems > 0 && <span className="fil2-badge">{metrics.lowStockItems}</span>}
                        </button>
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
                        <tbody className="tab">
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td className="tab-empty" colSpan={8}>Товары, соответствующие критериям поиска отсутствуют</td>
                            </tr>
                        ) : (
                            filteredProducts.map(product => {
                                const isLow = product.quantity <= product.minStock;
                                return (
                                    <tr key={product.id} className="tab2">
                                        <td className="artkl">{product.sku}</td>
                                        <td className="naim" title={product.name}>{product.name}</td>
                                        <td className="katg">{product.category}</td>
                                        <td className="adrs"><span className="adrs">{product.zone}</span></td>
                                        <td className="price">{product.price.toLocaleString('ru-RU')} Р</td>
                                        <td className="kol"><span className="kol">{product.quantity}</span></td>
                                        <td className="stasus">
                                            <span className={`status ${isLow ? 'low' : 'normal'}`}>
                                                {isLow ? <TrendingDown className="status" /> : <TrendingUp className="status" />}
                                                {isLow ? 'Дефицит' : 'Норма'}
                                            </span>
                                        </td>
                                        <td className="knop">
                                            <button onClick={() => openEditModal(product)} className="knop" title="Корректировка остатка">
                                                <Edit2 className="knop" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Всплывающее модальное окно корректировки остатка */}
            {editingProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Корректировка остатка</h3>
                        <p>Товар: <strong>{editingProduct.name}</strong> ({editingProduct.sku})</p>
                        
                        <div className="modal-field">
                            <label>Новое количество (шт.):</label>
                            <input 
                                type="number" 
                                min="0"
                                value={newQuantity} 
                                onChange={(e) => setNewQuantity(e.target.value)} 
                            />
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setEditingProduct(null)} className="btn-cancel">Отмена</button>
                            <button onClick={handleSaveQuantity} className="btn-save">Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Всплывающее модальное окно добавления товара */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Добавление нового товара</h3>
                        <form onSubmit={handleAddProduct}>
                            <div className="modal-field">
                                <label>Артикул:</label>
                                <input type="text" required value={addSku} onChange={(e) => setAddSku(e.target.value)} />
                            </div>
                            
                            <div className="modal-field">
                                <label>Наименование:</label>
                                <input type="text" required value={addName} onChange={(e) => setAddName(e.target.value)} />
                            </div>

                            <div className="modal-field">
                                <label>Категория:</label>
                                <select value={addCategory} onChange={(e) => setAddCategory(e.target.value)}>
                                    {categories.filter(cat => cat !== 'Все').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-field">
                                <label>Ячейка (Адрес):</label>
                                <input type="text" required value={addZone} onChange={(e) => setAddZone(e.target.value)} />
                            </div>

                            <div className="modal-field">
                                <label>Цена за шт. (Р):</label>
                                <input type="number" min="0" required value={addPrice} onChange={(e) => setAddPrice(e.target.value)} />
                            </div>

                            <div className="modal-field">
                                <label>Начальный остаток (шт.):</label>
                                <input type="number" min="0" required value={addQuantity} onChange={(e) => setAddQuantity(e.target.value)} />
                            </div>

                            <div className="modal-field">
                                <label>Порог дефицита (мин. остаток):</label>
                                <input type="number" min="0" required value={addMinStock} onChange={(e) => setAddMinStock(e.target.value)} />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Отмена</button>
                                <button type="submit" className="btn-save">Добавить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
