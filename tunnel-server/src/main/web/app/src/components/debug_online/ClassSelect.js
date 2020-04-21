import React, {useState} from 'react';
import {AutoComplete, Input} from 'antd';


const ClassSelect = ({classSearch,classJad}) => {
    const [options, setOptions] = useState([]);
   // const [selectClass, setSelectClass] = useState("");

    const onSearch = searchText => {
        if (searchText.length < 5) {
            return;
        }
        classSearch(searchText,function (res) {
            let classArr = res.split("\n");

            let ignoreLine = "Affect(" ;  // ["Affect(row-cnt:0) cost in 19 ms.
            let options = classArr
                .filter(c => c.substr(0, ignoreLine.length) !== ignoreLine)
                .filter(c => c.trim().length > 0)
                .map(c => {
                    return {"value": c.trim()};
                });
            if (options.length > 0){
                setOptions(options)
            }

        });
    };

    const onSelect = data => {
     //   setSelectClass(data);
        classJad(data);
    };


    return (
        <div align={"center"}>
            <AutoComplete
                options={options}
                onSelect={onSelect}
                onSearch={onSearch}
                style={{width:'100%'}}
                placeholder="input here"
            >
                <Input  placeholder="请输入class名称,用'*'做模糊查询" />
            </AutoComplete>
{/*
            <Button type="primary" disabled={selectClass === ""} onClick={()=>classJad(selectClass)}>显示代码</Button>
*/}
        </div>
    );
};

export default ClassSelect;