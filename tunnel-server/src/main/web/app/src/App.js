import React from 'react';
import 'antd/dist/antd.css';


import 'xterm/dist/xterm.css'
import {HashRouter} from "react-router-dom";
import {Layout} from "antd";
import Home from "./components/home";

const {Content, Footer } = Layout;
function App() {
  return (
      <HashRouter  >
          <Layout className="layout">
              <Content style={{ padding: '20px' }}>
                  <div style={{ background: '#fff', padding: 24, minHeight: 600 }}>
                    <Home/>

                  </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Ant Design © 基础架构部</Footer>
          </Layout>

      </HashRouter>
  );
}

export default App;
