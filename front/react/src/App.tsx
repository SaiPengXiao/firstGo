import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AuthBootstrap from './components/AuthBootstrap'
import AppRouter from './routes/AppRouter'
import './App.css'

const appTheme = {
  token: {
    colorPrimary: '#e11d48',
    colorSuccess: '#059669',
    colorWarning: '#f59e0b',
    colorError: '#dc2626',
    colorInfo: '#4f46e5',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorBorder: '#e2e8f0',
    borderRadius: 10,
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, system-ui, sans-serif",
  },
  algorithm: theme.defaultAlgorithm,
}

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={appTheme}>
      <AuthBootstrap>
        <AppRouter />
      </AuthBootstrap>
    </ConfigProvider>
  )
}

export default App
