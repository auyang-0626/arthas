import React from 'react';
import {Button, Form, Input, Modal, Radio} from "antd";
import connectService from "../service/connectService";


class PidSelect extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            pidModelVisible:false,
            pidSelectedLoading:false
        }
        this.props.onRef(this)
    }

    showModel = () =>{
        this.setState({
          pidModelVisible: true,
        });
    };
    handlePidOk  = e => {
        let that = this;
        this.formRef.current.validateFields()
            .then(values => {
                that.setState({pidSelectedLoading:true})
                values.ip = this.props.ip;
                connectService.attach(values,function(agentId){
                    that.props.onPidSelected(values.pid,agentId);
                    that.setState({
                        pidModelVisible: false,
                        pidSelectedLoading:false,
                    });
                })
            });

    };
    handlePidCancel  = e => {
        this.setState({
            pidModelVisible: false,
        });
    };

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return(
            <Modal
                title="进程选择"
                visible={this.state.pidModelVisible}
                onOk={this.handlePidOk}
                onCancel={this.handlePidCancel}

                footer={[
                    <Button key="back" onClick={this.handlePidCancel.bind(this)}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={this.state.pidSelectedLoading} onClick={this.handlePidOk.bind(this)}>
                        确定
                    </Button>,
                ]}
            >
                <Form
                    name="pidSelectedForm"
                    ref={this.formRef}
                    initialValues={
                        {
                            javaHome:"/opt/souche/java"
                        }
                    }
                >
                    <Form.Item
                        name="pid"
                        rules={[{ required: true, message: '请选择pid' }]}
                    >
                        <Radio.Group >
                            {Object.keys(this.props.pidMap).map(pid=>
                                <Radio style={radioStyle} value={pid} key={pid}>
                                    {"   " + pid  + "   " + this.props.pidMap[pid]}
                                </Radio>
                            )}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Java路径"
                        name="javaHome"
                        rules={[{ required: true, message: '请确认Java路径是否正确!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default PidSelect;
