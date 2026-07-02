import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AuthBootstrap from './components/AuthBootstrap'
import AppRouter from './routes/AppRouter'
import './App.css'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthBootstrap>
        <AppRouter />
      </AuthBootstrap>
    </ConfigProvider>
  )
}

export default App