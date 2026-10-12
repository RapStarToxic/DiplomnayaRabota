import {Row, Col, Card, Statistic, Progress, Table, Tag, Typography, Space} from 'antd'
import {ArrowUpOutlined, ArrowDownOutlined, WarningOutlined, InboxOutlined, ExportOutlined, AppstoreOutlined} from '@ant-design/icons'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area} from 'recharts'
import './Dashboard.css'

const {Title, Text} = Typography

const activityData = [
    {name: 'Пн', Приемка: 40, Отгрузка: 24},
    {name: 'Вт', Приемка: 30, Отгрузка: 13},
    {name: 'Ср', Приемка: 20, Отгрузка: 38},
    {name: 'Чт', Приемка: 27, Отгрузка: 34},
    {name: 'Пт', Приемка: 50, Отгрузка: 48},
    {name: 'Сб', Приемка: 23, Отгрузка: 38},
    {name: 'Вс', Приемка: 11, Отгрузка: 15},
]

const occupancyHistory = [
    {date: '01.10', v: 65},
    {date: '02.10', v: 68},
    {date: '03.10', v: 72},
    {date: '04.10', v: 78},
    {date: '05.10', v: 82},
    {date: '06.10', v: 84},
    {date: '07.10', v: 85},
]

const recentTransactions = [
    { key: '1', id: 'TX-9402', type: 'Приемка', zone: 'Зона А', status: 'В процессе', items: 14},
    { key: '2', id: 'TX-9401', type: 'Отгрузка', zone: 'Зона B', status: 'Завершено', items: 5},
]

const columns = [
    {title: 'ID Документа', dataIndex: 'id', key: 'id', render: text => <a>{text}</a>},
    {title: 'Тип операции', dataIndex: 'type', key: 'type', render: type => {
        const colors = { 'Приемка': 'green', 'Отгрузка': 'blue', 'Перемещение': 'purple'}
        return <Tag color={colors[type]}>{type}</Tag>
    }},
    {title: 'Локация/Зона', dataIndex: 'zone', key: 'zone'},
    {title: 'Кол-во SKU', dataIndex: 'items', key: 'items', align: 'center'},
    {title: 'Статус', dataIndex: 'status', key: 'status', render: status => {
        let color = 'blue'
        if (status === 'Завершено') color = 'success'
        if (status === 'Ошибка сверки') color = 'error'
        if (status === 'В процессе') color = 'processing'
        return <Tag color={color}>{status}</Tag>
    }},
]

export default function Dashboard() {
    return(
        <div className='top'>
            <Space direction='vertical' size="large" style={{width: '100%'}}>
                <div>
                    <Title level={2} style={{margin: 0}}>Панель управления складом</Title>
                    <Text type='secondary'>Оперативные показатели на сегодня</Text>
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} hoverable>
                            <Statistic title="Принято сегодня" value={142} valueStyle={{color: '#3f8600'}} prefix={<InboxOutlined></InboxOutlined>} suffix={<span className='prin'><ArrowUpOutlined></ArrowUpOutlined> +12%</span>}></Statistic>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} hoverable>
                            <Statistic title="Отгружено сегодня" value={98} valueStyle={{color: '#1677ff'}} prefix={<ExportOutlined></ExportOutlined>} suffix={<span className='otgr'><ArrowUpOutlined></ArrowUpOutlined> -4%</span>}></Statistic>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} hoverable>
                            <Statistic title="Критические остатки" value={14} valueStyle={{color: '#cf1322'}} prefix={<WarningOutlined></WarningOutlined>} suffix={<Text type='danger' style={{ fontSize: '12px'}}>Требует закупки</Text>}></Statistic>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} hoverable id='occupancy-card'>
                            <div className='zapol'>
                                <Statistic title="Заполненность склада" value="85%" prefix={<AppstoreOutlined></AppstoreOutlined>}></Statistic>
                                <Progress type='circle' percent={85} width={50} status="exception" strokeColor="#faad14"></Progress>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <Card title="Объем складских операций" bordered={false}>
                            <div className='operac'>
                                <ResponsiveContainer>
                                    <BarChart data={activityData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="Приемка" fill='#52c41a' radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Отгрузка" fill='#1677ff' radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="Динамика заполнения склада" bordered={false}>
                            <div className='dinam'>
                                <ResponsiveContainer>
                                    <AreaChart data={occupancyHistory} margin={{top: 10, right: 10, left: -30, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis domain={[50, 100]}/>
                                        <Tooltip/>
                                        <Area type="monotone" dataKey="v" name="Занято %" stroke="#faad14" fill="#fffbe6" strokeWidth={2}/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card title="Последняя активность / Мониторинг задач" bordered={false}>
                            <Table dataSource={recentTransactions} columns={columns} pagination={false} size="middle"></Table>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    )
}
