import React, { useState, useRef, useEffect } from 'react';
import { Tag, Input, Tooltip, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SystemService from "services/SystemService";
import Swal from 'sweetalert2';

const UIKeywords = () => {
  const [tags, setTags] = useState();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);


  const fetchData = () => {
    setTimeout(() => {
      SystemService.getKeyword()
      .then(({ data }) => {
        // setTags(data.value);
        const tagsArray = JSON.parse(data.value.replace(/'/g, '"'));
        setTags(tagsArray);
      })
      .catch(() => {
      });
      setIsLoading(false); 
    }, 1000); 
  };

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    if (editInputValue.trim() === '') {
      const newTags = tags.filter((tag, index) => index !== editInputIndex);
      setTags(newTags);
    } else {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;
      setTags(newTags);
    }
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const handleSave = () => {
    const valueString = '[' + tags.map(tag => `'${tag}'`).join(',') + ']';
    const data = {
      key: 'keyword',
      value: valueString,
    };
    SystemService.patchKeyword(data)
      .then(() => {
        Swal.fire("Success", "บันทึกข้อมูลสำเร็จ", "success");
      })
      .catch(() => {
        Swal.fire("Error", "บันทึกข้อมูลไม่สำเร็จ", "error");
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "18px" }}>Keywords Management</h1>
      </div>
      {!isLoading && (      <Card className="card-dashboard" style={{ marginTop: "20px" }}>
      {Array.isArray(tags) && tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              style={{width:"160px",height:"32px",marginRight:"8px"}}
              ref={editInputRef}
              key={tag}
              size="small"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable
            onClose={() => handleClose(tag)}
            className='tag-l'
          >
            <span
              onDoubleClick={(e) => {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          style={{width:"160px",height:"32px"}}
          ref={inputRef}
          type="text"
          size="small"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag className='tag-l' color='blue' icon={<PlusOutlined />} onClick={showInput} style={{cursor:"pointer"}}>
          Add Keyword
        </Tag>
      )}
      <br/>
      <Button
          type="primary"
          onClick={handleSave}
          style={{ width: "100%", maxWidth: "120px",marginTop:"20px",float:"right" }}
        >
          Save
        </Button>
      </Card>)}



    </div>


  );
};

export default UIKeywords;
